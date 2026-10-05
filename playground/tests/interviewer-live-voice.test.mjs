import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter, once } from 'node:events';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import WebSocket from '../../server/node_modules/ws/wrapper.mjs';
import { connectLiveTranscription } from '../../server/providers/live-transcription.mjs';
import { attachLiveVoice } from '../../server/api/live-voice.mjs';
import { LiveInput } from '../src/interviewer/voice/LiveInput.js';
import { VoiceSession } from '../src/interviewer/voice/VoiceSession.js';

const settle = async () => {
  for (let i = 0; i < 12; i++) await Promise.resolve();
};
function fixture() {
  const sockets = [],
    nodes = [],
    tracks = [],
    drafts = [],
    submissions = [];
  const jobs = new Map();
  let id = 0;
  const timers = {
    setTimeout(fn, ms) {
      jobs.set(++id, { fn, ms });
      return id;
    },
    clearTimeout(id) {
      jobs.delete(id);
    },
  };
  const browser = {
    location: { protocol: 'http:', host: 'localhost:5173' },
    navigator: {
      mediaDevices: {
        async getUserMedia() {
          const track = {
            stop() {
              this.stopped = true;
            },
          };
          tracks.push(track);
          return { getTracks: () => [track] };
        },
      },
    },
    AudioContext: class {
      sampleRate = 16000;
      state = 'running';
      destination = {};
      audioWorklet = { addModule: async () => {} };
      resume() {
        return Promise.resolve();
      }
      close() {
        this.state = 'closed';
        return Promise.resolve();
      }
      createMediaStreamSource() {
        return { connect() {}, disconnect() {} };
      }
      createGain() {
        return { gain: {}, connect() {}, disconnect() {} };
      }
    },
    AudioWorkletNode: class {
      constructor() {
        nodes.push(this);
        this.port = {
          postMessage: (event) => {
            if (event.type === 'flush') this.port.onmessage({ data: { type: 'flushed' } });
          },
        };
      }
      connect() {}
      disconnect() {
        this.disconnected = true;
      }
    },
    WebSocket: class {
      readyState = 1;
      bufferedAmount = 0;
      sent = [];
      constructor(url) {
        this.url = url;
        sockets.push(this);
      }
      send(message) {
        this.sent.push(message);
      }
      close() {
        this.readyState = 3;
      }
    },
  };
  const engine = new VoiceSession({
    browser,
    timers,
    liveInput: LiveInput,
    onDraft: (t) => drafts.push(t),
    onSubmit: (t) => submissions.push(t),
  });
  const message = (event) => sockets.at(-1).onmessage({ data: JSON.stringify(event) });
  const audio = (rms, ms = 100) =>
    nodes
      .at(-1)
      .port.onmessage({ data: { type: 'audio', buffer: new ArrayBuffer(3200), rms, ms } });
  async function start(auto = true) {
    engine.listen('Existing thought.', auto, true);
    await settle();
    sockets.at(-1).onopen();
    message({ type: 'ready' });
  }
  return {
    engine,
    browser,
    sockets,
    nodes,
    tracks,
    drafts,
    submissions,
    message,
    audio,
    start,
    jobs,
  };
}

test('live captions replace hypotheses; only final text submits once after acknowledged silence', async () => {
  const f = fixture();
  await f.start();
  assert.equal(f.engine.state.phase, 'recording');
  f.message({ type: 'transcript', text: 'Closure', final: false });
  f.message({ type: 'transcript', text: 'Closures retain scope', final: false });
  assert.equal(f.drafts.at(-1), 'Existing thought. Closures retain scope');
  assert.deepEqual(f.submissions, []);
  f.audio(0.08);
  f.audio(0, 3500);
  assert.equal(f.engine.state.phase, 'transcribing');
  assert.equal(f.tracks[0].stopped, true);
  assert.deepEqual(f.submissions, []);
  f.message({ type: 'transcript', text: 'Closures retain lexical scope.', final: true });
  const late = f.sockets[0].onmessage;
  f.message({ type: 'done' });
  assert.deepEqual(f.submissions, ['Existing thought. Closures retain lexical scope.']);
  late({ data: JSON.stringify({ type: 'done' }) });
  assert.equal(f.submissions.length, 1);
  assert.equal(f.sockets[0].readyState, 3);
});

test('silence and background level alone never automatically send an answer', async () => {
  const f = fixture();
  await f.start();
  f.audio(0, 10000);
  f.audio(0.03, 500);
  f.audio(0, 7000);
  assert.equal(f.engine.state.phase, 'recording');
  assert.equal(f.submissions.length, 0);
  f.engine.dispose();
});

test('Stop mic and coding dictation finalize for review without submitting', async () => {
  const f = fixture();
  await f.start(false);
  f.message({ type: 'transcript', text: 'I would use a map', final: false });
  f.audio(0, 7000);
  assert.equal(f.engine.state.phase, 'recording');
  f.engine.finish(false);
  f.message({ type: 'transcript', text: 'I would use a Map.', final: true });
  f.message({ type: 'done' });
  assert.equal(f.drafts.at(-1), 'Existing thought. I would use a Map.');
  assert.deepEqual(f.submissions, []);
});

test('cancellation and disconnect preserve visible words and close every resource', async () => {
  const f = fixture();
  await f.start();
  f.message({ type: 'transcript', text: 'My project', final: false });
  const stale = f.sockets[0].onmessage;
  f.sockets[0].onclose();
  assert.match(f.engine.state.error, /disconnected/);
  assert.equal(f.drafts.at(-1), 'Existing thought. My project');
  assert.equal(f.tracks[0].stopped, true);
  assert.equal(f.nodes[0].disconnected, true);
  assert.equal(f.jobs.size, 0);
  stale({ data: JSON.stringify({ type: 'transcript', text: 'stale words', final: true }) });
  assert.equal(f.drafts.at(-1), 'Existing thought. My project');
  assert.equal(f.submissions.length, 0);
});

test('live backpressure and missing final acknowledgements fail without sending speculative text', async () => {
  const f = fixture();
  await f.start();
  f.sockets[0].bufferedAmount = 65000;
  f.audio(0.1);
  assert.match(f.engine.state.error, /slow/);
  const g = fixture();
  await g.start();
  g.message({ type: 'transcript', text: 'unfinished', final: false });
  g.engine.finish(true);
  [...g.jobs.values()].find((job) => job.ms === 12000).fn();
  assert.match(g.engine.state.error, /timed out/);
  assert.deepEqual(g.submissions, []);
});

test('PCM worklet emits bounded little-endian packets and flushes the last samples', async () => {
  const packets = [];
  let Processor;
  const context = {
    AudioWorkletProcessor: class {
      port = { postMessage: (p) => packets.push(p) };
    },
    registerProcessor: (_, p) => (Processor = p),
  };
  vm.runInNewContext(
    await readFile(
      new URL('../src/interviewer/voice/pcm-capture.worklet.js', import.meta.url),
      'utf8',
    ),
    context,
  );
  const processor = new Processor();
  processor.process([[new Float32Array(1700).fill(0.5)]]);
  assert.equal(packets[0].buffer.byteLength, 3200);
  assert.equal(new DataView(packets[0].buffer).getInt16(0, true), 16384);
  assert.equal(packets[0].ms, 100);
  processor.port.onmessage({ data: { type: 'flush' } });
  assert.equal(packets[1].buffer.byteLength, 200);
  assert.equal(packets[2].type, 'flushed');
  assert.equal(processor.process([]), false);
});

test('provider is transcription-only, preserves corrections, and requires explicit finalization', () => {
  let socket;
  const transcripts = [],
    completed = [];
  class FakeSocket extends EventEmitter {
    readyState = 1;
    bufferedAmount = 0;
    sent = [];
    constructor(url, options) {
      super();
      socket = this;
      this.url = url;
      this.options = options;
    }
    send(data) {
      this.sent.push(JSON.parse(data));
    }
    close() {}
    terminate() {}
  }
  const provider = connectLiveTranscription(
    {
      language: 'hinglish',
      locale: 'auto',
      onReady() {},
      onTranscript: (...args) => transcripts.push(args),
      onComplete: () => completed.push(true),
      onError: assert.fail,
    },
    { WebSocketImpl: FakeSocket, apiKey: 'test-secret' },
  );
  socket.emit('open');
  assert.doesNotMatch(socket.url, /test-secret/);
  assert.equal(socket.options.headers['x-goog-api-key'], 'test-secret');
  const setup = socket.sent[0].setup;
  assert.equal(setup.inputAudioTranscription.mode, 'VERBATIM');
  assert.equal(setup.tools, undefined);
  assert.equal(setup.systemInstruction, undefined);
  socket.emit('message', Buffer.from(JSON.stringify({ setupComplete: {} })));
  provider.sendPCM(Buffer.from([0, 0]));
  socket.emit(
    'message',
    Buffer.from(JSON.stringify({ serverContent: { generationComplete: true } })),
  );
  assert.equal(completed.length, 0);
  provider.finish();
  assert.deepEqual(socket.sent.at(-1), { realtimeInput: { activityEnd: {} } });
  socket.emit(
    'message',
    Buffer.from(
      JSON.stringify({
        serverContent: {
          inputTranscription: { text: 'No, actually a Map.' },
          generationComplete: true,
        },
      }),
    ),
  );
  assert.deepEqual(transcripts, [['No, actually a Map.', true]]);
  assert.equal(completed.length, 1);
  provider.close();
});

test('WebSocket relay enforces origins, one connection, PCM validation and finalization', async (t) => {
  const server = createServer();
  let callbacks,
    closed = 0,
    pcm;
  attachLiveVoice(
    server,
    { configured: true, allowedOrigins: new Set(['http://localhost:5173']) },
    (c) => {
      callbacks = c;
      queueMicrotask(c.onReady);
      return {
        sendPCM: (b) => (pcm = b),
        finish() {
          c.onTranscript('Final answer.', true);
          c.onComplete();
        },
        close() {
          closed++;
        },
      };
    },
  );
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  t.after(() => new Promise((r) => server.close(r)));
  const url = `ws://127.0.0.1:${server.address().port}/api/interviewer/voice/live`;
  async function rejectOrigin(origin) {
    const ws = new WebSocket(url, { origin });
    const [error] = await once(ws, 'error');
    assert.match(error.message, /403/);
  }
  await rejectOrigin('https://evil.example');
  await rejectOrigin(undefined);
  const ws = new WebSocket(url, { origin: 'http://localhost:5173' });
  await once(ws, 'open');
  const ready = once(ws, 'message');
  ws.send(JSON.stringify({ type: 'start', language: 'english', locale: 'auto' }));
  assert.equal(JSON.parse((await ready)[0]).type, 'ready');
  const duplicate = new WebSocket(url, { origin: 'http://localhost:5173' });
  assert.match((await once(duplicate, 'error'))[0].message, /429/);
  ws.send(Buffer.from([1, 0, 2, 0]));
  const messages = [];
  ws.on('message', (data) => messages.push(JSON.parse(data)));
  ws.send(JSON.stringify({ type: 'finish' }));
  await once(ws, 'close');
  assert.deepEqual([...pcm], [1, 0, 2, 0]);
  assert.deepEqual(
    messages.map((m) => m.type),
    ['transcript', 'done'],
  );
  assert.equal(closed, 1);
  // Capacity is released and a malformed stream is closed before reaching the provider.
  const next = new WebSocket(url, { origin: 'http://localhost:5173' });
  await once(next, 'open');
  const error = once(next, 'message');
  next.send(Buffer.from([1]));
  assert.equal(JSON.parse((await error)[0]).type, 'error');
  await once(next, 'close');
  assert.ok(callbacks);
});
