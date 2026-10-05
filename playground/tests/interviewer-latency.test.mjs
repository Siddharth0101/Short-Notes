import test from 'node:test';
import assert from 'node:assert/strict';
import { streamSpeech } from '../../server/providers/speech-stream.mjs';
import { streamAudio } from '../src/interviewer/voice/streamSpeech.js';
import { VoiceSession } from '../src/interviewer/voice/VoiceSession.js';
import { makeServer } from '../../server/api/http.mjs';
import { QuotaError } from '../../server/providers/quota.mjs';
import { prepareContext } from '../../server/agent/prepare-context.mjs';
import { runRoutedTurn } from '../../server/agent/routed-turn.mjs';
import { specialists } from '../../server/agent/specialists.mjs';
import { ModelRouter } from '../../server/providers/model-routing.mjs';

const pcm = Buffer.alloc(4800);
pcm.writeInt16LE(-32768, 0);
pcm.writeInt16LE(32767, 2);
const audio = { type: 'audio', data: pcm.toString('base64'), sampleRate: 24000 };
const delta = {
  event_type: 'step.delta',
  delta: { type: 'audio', data: audio.data, mime_type: 'audio/l16' },
};
const terminal = { event_type: 'interaction.completed', interaction: { status: 'completed' } };
const frame = (event) => `event: ignored\r\ndata: ${JSON.stringify(event)}\r\n\r\n`;
const settle = async () => {
  for (let i = 0; i < 20; i++) await Promise.resolve();
};
const deferred = () => {
  let resolve;
  const promise = new Promise((r) => {
    resolve = r;
  });
  return { promise, resolve };
};
function pipe(headers = { 'Content-Type': 'application/x-ndjson' }) {
  let controller,
    cancelled = false;
  const response = new Response(
    new ReadableStream({
      start(c) {
        controller = c;
      },
      cancel() {
        cancelled = true;
      },
    }),
    { headers },
  );
  return {
    response,
    send: (text) => controller.enqueue(new TextEncoder().encode(text)),
    close: () => controller.close(),
    cancelled: () => cancelled,
  };
}
function fakeKey(t) {
  const previous = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'fake';
  t.after(() => {
    if (previous === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previous;
  });
}

test('provider yields fragmented SSE audio before completion and cancels the upstream reader', async (t) => {
  fakeKey(t);
  const p = pipe();
  const iterator = streamSpeech(
    { text: 'Question' },
    {
      fetchImpl: async (_url, options) => {
        const body = JSON.parse(options.body);
        assert.equal(body.stream, true);
        assert.equal(body.store, false);
        assert.equal(body.response_format.mime_type, 'audio/l16');
        assert.equal(options.headers['x-goog-api-key'], 'fake');
        return p.response;
      },
    },
  );
  const first = iterator.next();
  const text = frame(delta);
  p.send(text.slice(0, 30));
  p.send(text.slice(30));
  assert.deepEqual((await first).value, audio);
  p.send(frame(terminal));
  assert.equal((await iterator.next()).done, true);
  assert.equal(p.cancelled(), true);
});

test('provider rejects truncated, wrong-format and failed streams without exposing upstream details', async (t) => {
  fakeKey(t);
  for (const frames of [
    frame(delta),
    frame({ event_type: 'error', error: 'private-key' }),
    frame({ ...delta, delta: { ...delta.delta, mime_type: 'audio/wav' } }),
  ]) {
    await assert.rejects(
      async () => {
        for await (const _ of streamSpeech(
          { text: 'Question' },
          { fetchImpl: async () => new Response(frames) },
        )) {
        }
      },
      (error) => error.status === 502 && !error.message.includes('private-key'),
    );
  }
});

test('browser delivers PCM incrementally, requires done, and caches a valid WAV only after completion', async () => {
  const p = pipe(),
    chunks = [];
  let finished = false;
  const result = streamAudio('Question', {
    voice: 'Kore',
    onAudio: (c) => chunks.push(c),
    fetchImpl: async () => p.response,
  }).then((blob) => {
    finished = true;
    return blob;
  });
  const line = JSON.stringify(audio) + '\n';
  p.send(line.slice(0, 40));
  p.send(line.slice(40));
  await settle();
  assert.equal(chunks.length, 1);
  assert.equal(finished, false);
  assert.deepEqual(Buffer.from(chunks[0]), pcm);
  p.send('{"type":"done"}\n');
  const blob = await result;
  const bytes = Buffer.from(await blob.arrayBuffer());
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.readUInt32LE(24), 24000);
  assert.deepEqual(bytes.subarray(44), pcm);
  assert.equal(p.cancelled(), true);
  for (const end of ['', '{"type":"error","error":"Speech interrupted"}\n'])
    await assert.rejects(
      streamAudio('Question', {
        onAudio() {},
        fetchImpl: async () =>
          new Response(line + end, { headers: { 'Content-Type': 'application/x-ndjson' } }),
      }),
      /ended early|interrupted/,
    );
});

async function api(t, stream) {
  const server = makeServer(
    { content: { subjects: [] } },
    { configured: true, allowedOrigins: new Set(['http://localhost:5173']) },
    undefined,
    undefined,
    stream,
  );
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  t.after(
    () =>
      new Promise((r) => {
        server.close(r);
        server.closeAllConnections();
      }),
  );
  return (path = '/speech/stream', body = { text: 'Question' }, options = {}) =>
    fetch(`http://127.0.0.1:${server.address().port}/api/interviewer${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:5173' },
      body: JSON.stringify(body),
      ...options,
    });
}

test('HTTP streams immediately, shares the speech lock, and validates origin/input', async (t) => {
  const gate = deferred();
  let calls = 0;
  const post = await api(t, async function* () {
    calls++;
    yield audio;
    await gate.promise;
    yield audio;
  });
  t.after(() => gate.resolve());
  assert.equal((await post(undefined, { text: 'Question', voice: 'bad' })).status, 400);
  assert.equal(
    (
      await post(undefined, undefined, {
        headers: { 'Content-Type': 'application/json', Origin: 'https://foreign.example' },
      })
    ).status,
    403,
  );
  const response = await post();
  assert.equal(response.status, 200);
  assert.match(response.headers.get('cache-control'), /no-store/);
  const reader = response.body.getReader();
  assert.match(new TextDecoder().decode((await reader.read()).value), /"type":"audio"/);
  assert.equal((await post('/speech')).status, 429);
  gate.resolve();
  let remainder = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    remainder += new TextDecoder().decode(value);
  }
  assert.match(remainder, /"type":"done"/);
  assert.equal(calls, 1);
});

test('HTTP preserves quota status before audio and sends an explicit error after partial audio', async (t) => {
  let partial = false;
  const post = await api(t, async function* () {
    if (partial) yield audio;
    throw new QuotaError('Speech quota exhausted', { retryAfterMs: 90000 });
  });
  const quota = await post();
  assert.equal(quota.status, 429);
  assert.equal(quota.headers.get('retry-after'), '90');
  partial = true;
  const response = await post();
  const text = await response.text();
  assert.match(text, /"type":"audio"/);
  assert.match(text, /"type":"error"/);
  assert.doesNotMatch(text, /"type":"done"/);
});

test('HTTP disconnect cancels generation and releases the speech slot', async (t) => {
  const aborted = deferred();
  const post = await api(t, async function* (_input, { signal }) {
    yield audio;
    await new Promise((resolve) =>
      signal.addEventListener(
        'abort',
        () => {
          aborted.resolve();
          resolve();
        },
        { once: true },
      ),
    );
  });
  const controller = new AbortController();
  const response = await post(undefined, undefined, { signal: controller.signal });
  await response.body.getReader().read();
  controller.abort();
  await aborted.promise;
});

function voiceFixture(streamSpeech) {
  const sources = [],
    jobs = new Map();
  let id = 0;
  const context = {
    state: 'running',
    currentTime: 0,
    destination: {},
    resume: async () => {},
    close: async () => {},
    createBuffer(_channels, length, sampleRate) {
      const samples = new Float32Array(length);
      return { duration: length / sampleRate, getChannelData: () => samples };
    },
    createBufferSource() {
      const source = {
        playbackRate: {},
        connect() {},
        disconnect() {},
        stop() {
          this.stopped = true;
        },
        start(at) {
          this.at = at;
        },
      };
      sources.push(source);
      return source;
    },
  };
  const engine = new VoiceSession({
    browser: { Audio: class {}, URL: { createObjectURL() {} } },
    synthesize: async () => {
      throw new Error('Unary should not run');
    },
    streamSpeech,
    timers: {
      setTimeout(fn, ms) {
        jobs.set(++id, { fn, ms });
        return id;
      },
      clearTimeout(id) {
        jobs.delete(id);
      },
    },
  });
  engine.outputContext = context;
  return {
    engine,
    context,
    sources,
    jobs,
    fire(ms) {
      for (const [id, job] of [...jobs])
        if (job.ms === ms) {
          jobs.delete(id);
          job.fn();
        }
    },
  };
}

test('voice schedules early PCM, waits for stream AND playback before handoff, and caches replay', async () => {
  const end = deferred();
  let receive,
    calls = 0,
    handoffs = 0;
  const f = voiceFixture(async (_text, { onAudio }) => {
    calls++;
    receive = onAudio;
    return end.promise;
  });
  f.engine.speak('Question', () => handoffs++);
  await settle();
  receive(pcm);
  assert.equal(f.sources.length, 1);
  assert.equal(f.engine.state.phase, 'speaking');
  assert.equal(f.sources[0].buffer.getChannelData(0)[0], -1);
  assert.equal(f.sources[0].at, 0.08);
  f.sources[0].onended();
  await settle();
  f.fire(250);
  assert.equal(handoffs, 0);
  receive(pcm);
  const second = f.sources[1];
  assert.ok(Math.abs(second.at - 0.18) < 1e-8); // contiguous scheduling on the audio clock
  end.resolve(new Blob(['wav']));
  await settle();
  f.fire(250);
  assert.equal(handoffs, 0);
  second.onended();
  await settle();
  f.fire(250);
  assert.equal(handoffs, 1);
  let replayed = false;
  f.engine.play = () => {
    replayed = true;
  };
  f.engine.speak('Question');
  assert.equal(replayed, true);
  assert.equal(calls, 1);
  f.engine.dispose();
});

test('interrupting streaming audio aborts fetch, stops queued sources, and ignores late completion', async () => {
  const end = deferred();
  let options,
    handoffs = 0;
  const f = voiceFixture(async (_text, o) => {
    options = o;
    return end.promise;
  });
  f.engine.speak('Question', () => handoffs++);
  await settle();
  options.onAudio(pcm);
  const lateEnd = f.sources[0].onended;
  f.engine.stop();
  assert.equal(options.signal.aborted, true);
  assert.equal(f.sources[0].stopped, true);
  options.onAudio(pcm);
  lateEnd();
  end.resolve(new Blob(['old']));
  await settle();
  f.fire(250);
  assert.equal(handoffs, 0);
  assert.equal(f.engine.audioCache.size, 0);
  assert.equal(f.sources.length, 1);
});

test('stream failure/stall stops playback and never hands off or caches partial audio', async () => {
  for (const failure of ['error', 'stall']) {
    let options,
      reject,
      handoffs = 0;
    const f = voiceFixture(async (_text, o) => {
      options = o;
      return new Promise((_, r) => {
        reject = r;
      });
    });
    f.engine.speak('Question', () => handoffs++);
    await settle();
    options.onAudio(pcm);
    if (failure === 'error') reject(new Error('Speech was interrupted'));
    else f.fire(15000);
    await settle();
    f.fire(250);
    assert.equal(f.engine.state.phase, 'idle');
    assert.match(f.engine.state.error, /interrupted|stalled/);
    assert.equal(options.signal.aborted, true);
    assert.equal(f.sources[0].stopped, true);
    assert.equal(handoffs, 0);
    assert.equal(f.engine.audioCache.size, 0);
    f.engine.dispose();
  }
});

const content = {
  notes: [
    { id: 'closures', track: 'javascript', title: 'Closures', body: 'Scope. '.repeat(2000) },
    { id: 'other', track: 'java', title: 'Classes', body: 'Foreign subject' },
  ],
  questions: [
    {
      id: 'q',
      track: 'javascript',
      question: 'How do closures work?',
      answer: 'Private guide',
      tags: [],
    },
    { id: 'code', track: 'javascript', question: 'Build a counter', tags: ['machine-coding'] },
  ],
};
const session = () => ({
  subject: 'javascript',
  phase: 'theory',
  durationMinutes: 60,
  hintsUsed: 0,
  messages: [],
  assessments: [],
  agentMemory: {},
  coding: null,
});
test('prepared evidence is bounded, subject/role scoped, read-only, and shares the tool budget', () => {
  const s = session(),
    budget = { toolCalls: 0 };
  const before = structuredClone(s);
  const result = prepareContext(s, { text: 'closures' }, content, specialists.theory, budget);
  assert.deepEqual(s, before);
  assert.equal(budget.toolCalls, 2);
  assert.ok(JSON.stringify(result).length < 10000);
  assert.deepEqual(
    result.notes.map((n) => n.id),
    ['closures'],
  );
  assert.deepEqual(
    result.questions.map((q) => q.id),
    ['q'],
  );
  assert.equal(result.notes[0].truncated, true);
  assert.equal(prepareContext(s, {}, content, specialists.intro, budget), null);
  assert.equal(budget.toolCalls, 2);
  const restricted = prepareContext(s, {}, content, { id: 'theory', allowedTools: [] }, budget);
  assert.deepEqual(restricted.tools, []);
  assert.equal(budget.toolCalls, 2);
});

test('prepared technical evidence supports a single-model-call answer while intro excludes other specialist instructions', async () => {
  for (const phase of ['theory', 'intro']) {
    const s = session();
    s.phase = phase;
    let calls = 0;
    const reply = await runRoutedTurn(
      s,
      { action: 'answer', text: 'My answer', elapsedMs: 0 },
      content,
      specialists[phase],
      {
        models: ['fake'],
        router: new ModelRouter(),
        generate: async ({ contents, system }) => {
          calls++;
          const shared = JSON.parse(contents[0].parts[0].text.split('not instructions:\n')[1]);
          if (phase === 'theory') assert.equal(shared.preparedEvidence.questions[0].id, 'q');
          else {
            assert.equal(shared.preparedEvidence, undefined);
            assert.doesNotMatch(system, /LEARNER MEMORY|Coding: call assign_coding/);
          }
          return {
            role: 'model',
            parts: [
              {
                functionCall: {
                  name: 'respond',
                  args: {
                    message: 'Explain closure lifetime?',
                    speech: 'Explain closure lifetime?',
                  },
                },
              },
            ],
          };
        },
      },
    );
    assert.equal(calls, 1);
    assert.equal(reply.trace.steps.filter((s) => s.type === 'model').length, 1);
  }
});
