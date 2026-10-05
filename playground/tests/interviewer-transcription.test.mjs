import test from 'node:test';
import assert from 'node:assert/strict';
import { synthesizeSpeech, validateSpeech } from '../../server/providers/synthesis.mjs';
import { makeServer } from '../../server/api/http.mjs';
import {
  transcribeRecording,
  validateRecording,
  MAX_AUDIO_BYTES,
} from '../../server/providers/transcription.mjs';

const input = () => ({
  audio: Buffer.from('synthetic audio').toString('base64'),
  mimeType: 'audio/webm',
  language: 'hinglish',
  locale: 'auto',
});
test('audio adapter sends bounded audio without tools or storage and returns just the transcript', async (t) => {
  const previous = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'test-only';
  t.after(() => {
    if (previous === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previous;
  });
  const result = await transcribeRecording(input(), {
    fetchImpl: async (url, options) => {
      const body = JSON.parse(options.body);
      assert.equal(body.store, false);
      assert.equal(body.tools, undefined);
      assert.equal(body.input[0].type, 'audio');
      assert.equal(body.input[0].data, input().audio);
      assert.equal(body.model, 'gemini-3.5-transcribe');
      assert.equal(body.system_instruction, undefined);
      assert.deepEqual(body.generation_config.transcription_config, {
        language_codes: [],
        mode: { type: 'verbatim' },
      });
      assert.ok(options.signal);
      return Response.json({
        steps: [{ type: 'model_output', content: [{ type: 'text', text: ' Closure scope. ' }] }],
      });
    },
  });
  assert.deepEqual(result, { text: 'Closure scope.' });
  await assert.rejects(
    transcribeRecording(input(), {
      fetchImpl: async () => ({
        ok: false,
        status: 429,
        json() {
          throw new Error('Must not read upstream body');
        },
      }),
    }),
    { status: 429 },
  );
});

test('recording validation rejects malformed data, unsupported types and oversized audio', () => {
  for (const patch of [
    { audio: 'not base64!' },
    { audio: '' },
    { mimeType: 'text/html' },
    { language: 'untrusted prompt' },
    { locale: 'untrusted locale' },
    { audio: Buffer.alloc(MAX_AUDIO_BYTES + 1).toString('base64') },
  ])
    assert.throws(() => validateRecording({ ...input(), ...patch }));
});

test('transcription route keeps origin protection, validates before model calls and leaves interviews untouched', async (t) => {
  let calls = 0;
  const server = makeServer(
    { content: { subjects: [] } },
    { configured: true, allowedOrigins: new Set(['http://localhost:5173']) },
    async (audio) => {
      calls++;
      assert.deepEqual(audio, input());
      return { text: 'spoken answer' };
    },
  );
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(
    () =>
      new Promise((resolve) => {
        server.close(resolve);
        server.closeAllConnections();
      }),
  );
  const url = `http://127.0.0.1:${server.address().port}/api/interviewer/transcribe`;
  const post = (body, origin = 'http://localhost:5173') =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: origin },
      body: JSON.stringify(body),
    });
  assert.equal((await post(input(), 'https://untrusted.example')).status, 403);
  assert.equal((await post({ ...input(), audio: 'invalid' })).status, 400);
  const response = await post(input());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { text: 'spoken answer' });
  assert.equal(calls, 1);
});

test('only one transcription runs at a time and the slot is released after failure', async (t) => {
  let release,
    started,
    calls = 0;
  const ready = new Promise((r) => {
    started = r;
  });
  const server = makeServer(
    { content: { subjects: [] } },
    { configured: true, allowedOrigins: new Set() },
    async () => {
      if (++calls > 1) return { text: 'recovered' };
      started();
      await new Promise((r) => {
        release = r;
      });
      throw new Error('upstream body must stay private');
    },
  );
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(
    () =>
      new Promise((resolve) => {
        server.close(resolve);
        server.closeAllConnections();
      }),
  );
  const post = () =>
    fetch(`http://127.0.0.1:${server.address().port}/api/interviewer/transcribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input()),
    });
  const first = post();
  await ready;
  assert.equal((await post()).status, 429);
  release();
  const response = await first;
  assert.equal(response.status, 500);
  assert.doesNotMatch(await response.text(), /upstream body/);
  assert.equal((await post()).status, 200);
});

function wavBytes() {
  const wav = Buffer.alloc(48);
  wav.write('RIFF', 0);
  wav.write('WAVE', 8);
  return wav;
}

test('speech generation uses a dedicated TTS model and returns a WAV, never browser voices', async (t) => {
  const before = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'test-only';
  t.after(() => {
    if (before === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = before;
  });
  const bytes = wavBytes();
  const result = await synthesizeSpeech(
    { text: 'Explain closures.', voice: 'Kore' },
    {
      fetchImpl: async (url, options) => {
        const body = JSON.parse(options.body);
        assert.equal(body.model, 'gemini-3.8-flash-lite-tts');
        assert.equal(body.store, false);
        assert.equal(body.tools, undefined);
        assert.equal(body.input[0].content[0].text, 'Explain closures.');
        assert.deepEqual(body.generation_config.speech_config, [{ voice: 'Kore' }]);
        return Response.json({
          steps: [
            {
              type: 'model_output',
              content: [{ type: 'audio', data: bytes.toString('base64'), mime_type: 'audio/wav' }],
            },
          ],
        });
      },
    },
  );
  assert.deepEqual(result, bytes);
  await assert.rejects(
    synthesizeSpeech({ text: 'Test' }, { fetchImpl: async () => Response.json({ steps: [] }) }),
    /no playable audio/,
  );
  for (const value of [
    { text: '' },
    { text: 'x'.repeat(5001) },
    { text: 'okay', voice: 'unknown' },
  ])
    assert.throws(() => validateSpeech(value));
});

test('speech endpoint validates requests, rejects foreign origins, and returns non-cacheable WAV', async (t) => {
  let calls = 0;
  const bytes = wavBytes();
  const server = makeServer(
    { content: { subjects: [] } },
    { configured: true, allowedOrigins: new Set(['http://localhost:5173']) },
    undefined,
    async (input) => {
      calls++;
      assert.deepEqual(input, { text: 'Question', voice: 'Kore' });
      return bytes;
    },
  );
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  t.after(
    () =>
      new Promise((r) => {
        server.close(r);
        server.closeAllConnections();
      }),
  );
  const post = (body, origin = 'http://localhost:5173') =>
    fetch(`http://127.0.0.1:${server.address().port}/api/interviewer/speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: origin },
      body: JSON.stringify(body),
    });
  assert.equal((await post({ text: 'Question' }, 'https://foreign.example')).status, 403);
  assert.equal((await post({ text: 'Question', voice: 'unknown' })).status, 400);
  const response = await post({ text: 'Question' });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'audio/wav');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes);
  assert.equal(calls, 1);
});
