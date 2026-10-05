import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { timing } from '../src/interviewer/session.js';
import { KEY, saveDraft, readDraft } from '../src/interviewer/storage.js';

const dom = new JSDOM('<!doctype html><div id="root"></div>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});
for (const key of ['window', 'document', 'HTMLElement', 'localStorage'])
  globalThis[key] = dom.window[key];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const server = await createServer({
  configFile: false,
  plugins: [react()],
  resolve: { dedupe: ['react', 'react-dom', 'react-router-dom'] },
  server: { middlewareMode: true, watch: null, hmr: false, ws: false },
  appType: 'custom',
  logLevel: 'error',
});
const React = await import('react');
const { createRoot } = await import('react-dom/client');
const { MemoryRouter } = await import('react-router-dom');
const { ProgressContext } = await server.ssrLoadModule('/src/lib/progressContext.js');
const { useInterviewController } = await server.ssrLoadModule(
  '/src/interviewer/useInterviewController.js',
);
const { useVoice } = await server.ssrLoadModule('/src/interviewer/useVoice.js');
let controller, voice, root;
const requests = [];
const session = (patch = {}) => ({
  id: 'test-session',
  subject: 'javascript',
  language: 'english',
  status: 'active',
  phase: 'intro',
  durationMinutes: 60,
  elapsedMs: 0,
  runningSince: Date.now(),
  messages: [
    { id: 'greeting', role: 'assistant', text: 'Tell me about yourself.', phase: 'intro' },
  ],
  assessments: [],
  hintsUsed: 0,
  ...patch,
});
let responseSession;
let transcript = 'Closures retain lexical scope.';
let transcribePending = null;
const recordings = [],
  audioPlayers = [],
  micTracks = [];
const OriginalAudio = window.Audio;
window.Blob = globalThis.Blob;
window.URL.createObjectURL = () => 'blob:test-audio';
window.URL.revokeObjectURL = () => {};
window.Audio = class {
  duration = 1;
  constructor(src) {
    this.src = src;
    audioPlayers.push(this);
  }
  play() {
    this.onplaying?.();
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
  }
  removeAttribute() {}
  load() {}
};
window.MediaRecorder = class {
  static isTypeSupported(type) {
    return type === 'audio/webm;codecs=opus';
  }
  state = 'inactive';
  constructor(stream, { mimeType }) {
    this.mimeType = mimeType;
    recordings.push(this);
  }
  start() {
    this.state = 'recording';
  }
  stop() {
    this.state = 'inactive';
    this.ondataavailable?.({
      data: new Blob(['fake recorded words'], { type: this.mimeType }),
    });
    this.onstop?.();
  }
};
Object.defineProperty(window.navigator, 'mediaDevices', {
  configurable: true,
  value: {
    async getUserMedia() {
      const track = {
        stop() {
          this.stopped = true;
        },
      };
      micTracks.push(track);
      return { getTracks: () => [track] };
    },
  },
});
let failTurn = false;
let rejectedTurn = null;
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  const payload = options?.body ? JSON.parse(options.body) : null;
  requests.push({ url, payload });
  if (url.endsWith('/speech/stream'))
    return new Response(
      JSON.stringify({
        type: 'audio',
        sampleRate: 24000,
        data: Buffer.alloc(4800).toString('base64'),
      }) + '\n{"type":"done"}\n',
      { headers: { 'Content-Type': 'application/x-ndjson' } },
    );
  if (url.endsWith('/speech'))
    return {
      ok: true,
      headers: new Headers({ 'Content-Type': 'audio/wav' }),
      blob: async () => new Blob(['fake speech'], { type: 'audio/wav' }),
    };
  if (url.endsWith('/transcribe')) {
    if (transcribePending) return transcribePending;
    return { ok: true, json: async () => ({ text: transcript }) };
  }
  if (url.endsWith('/health')) return { ok: true, json: async () => ({ configured: true }) };
  if (url.endsWith('/turn') && failTurn) throw new Error('offline');
  if (url.endsWith('/turn') && rejectedTurn)
    return {
      ok: false,
      status: rejectedTurn.status,
      json: async () => ({ error: rejectedTurn.error }),
    };
  return { ok: true, json: async () => responseSession };
};
function Probe() {
  controller = useInterviewController();
  return null;
}
async function mount(Component = Probe) {
  if (root) await React.act(() => root.unmount());
  root = createRoot(document.getElementById('root'));
  await React.act(async () =>
    root.render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(
          ProgressContext.Provider,
          { value: { progress: {} } },
          React.createElement(Component),
        ),
      ),
    ),
  );
}
async function reset() {
  if (root) {
    await React.act(() => root.unmount());
    root = null;
  }
  localStorage.clear();
  requests.length = 0;
  failTurn = false;
  rejectedTurn = null;
  responseSession = session();
  transcript = 'Closures retain lexical scope.';
  transcribePending = null;
  recordings.length = audioPlayers.length = micTracks.length = 0;
}
after(async () => {
  if (root) await React.act(() => root.unmount());
  await server.close();
  globalThis.fetch = originalFetch;
  window.Audio = OriginalAudio;
  dom.window.close();
});

test('resume restores draft and implementation before any persistence effect', async () => {
  await reset();
  localStorage.setItem(KEY, 'test-session');
  saveDraft('test-session', {
    draft: 'I built a cache',
    code: 'const cache = new Map();',
    codeLanguage: 'typescript',
  });
  await mount();
  await React.act(() => controller.resumeSaved());
  assert.equal(controller.draft, 'I built a cache');
  assert.equal(controller.code, 'const cache = new Map();');
  assert.equal(controller.codeLanguage, 'typescript');
  assert.equal(readDraft('test-session').draft, 'I built a cache');
});

test('failed answer retries the exact request across refresh without losing its draft', async () => {
  await reset();
  await mount();
  await React.act(() => controller.start());
  await React.act(() => controller.setDraft('Closures retain access to lexical scope.'));
  failTurn = true;
  await React.act(() => controller.send('answer'));
  const failed = requests.at(-1).payload;
  assert.equal(controller.draft, failed.text);
  assert.ok(readDraft('test-session').pending.requestId);
  await React.act(() => controller.send('next'));
  assert.equal(requests.at(-1).payload.requestId, failed.requestId);
  await mount();
  await React.act(() => controller.resumeSaved());
  assert.equal(controller.draft, failed.text);
  failTurn = false;
  await React.act(() => controller.send('', '', true));
  assert.deepEqual(requests.at(-1).payload, failed);
  assert.equal(controller.draft, '');
  assert.equal(readDraft('test-session').pending, null);
});

test('pause preserves drafts, blocks answers and resumes the same session', async () => {
  await reset();
  await mount();
  await React.act(() => controller.start());
  await React.act(() => controller.setDraft('My unfinished thought'));
  responseSession = session({ status: 'paused', elapsedMs: 4500 });
  await React.act(() => controller.send('pause'));
  assert.equal(controller.session.status, 'paused');
  assert.equal(controller.draft, 'My unfinished thought');
  const count = requests.length;
  await React.act(() => controller.send('answer'));
  assert.equal(requests.length, count);
  responseSession = session();
  await React.act(() => controller.send('resume'));
  assert.equal(controller.session.status, 'active');
  assert.equal(controller.draft, 'My unfinished thought');
});

test('expired session automatically ends once even with speech playback active', async () => {
  await reset();
  responseSession = session({ elapsedMs: 3600000 });
  await mount();
  await React.act(() => controller.start());
  assert.equal(requests.filter((r) => r.payload?.action === 'end').length, 1);
});

test('timer freezes when paused and never moves backward through stages', () => {
  const paused = session({ status: 'paused', elapsedMs: 1800000, runningSince: 0 });
  assert.equal(timing(paused, 5000000).remaining, 1800000);
  assert.equal(
    timing(session({ phase: 'coding', elapsedMs: 0 }), Date.now()).scheduled,
    'coding',
  );
  assert.equal(timing(session({ elapsedMs: 4000000 })).remaining, 0);
});

test('server transcription preserves typed text and requires Send after manual Stop mic', async () => {
  await reset();
  const submitted = [],
    drafts = [];
  function VoiceProbe() {
    voice = useVoice({
      language: 'english',
      onDraft: (t) => drafts.push(t),
      onSubmit: (t) => submitted.push(t),
      onActivity() {},
    });
    return null;
  }
  await mount(VoiceProbe);
  await React.act(async () => voice.listen('My answer:', false));
  assert.equal(voice.phase, 'recording');
  await React.act(async () => voice.finish(false));
  assert.deepEqual(drafts, ['My answer: Closures retain lexical scope.']);
  assert.deepEqual(submitted, []);
  assert.equal(micTracks[0].stopped, true);
  assert.equal(requests.at(-1).url, '/api/interviewer/transcribe');
});

test('late server transcription cannot overwrite a draft after Escape', async () => {
  await reset();
  let resolve;
  transcribePending = new Promise((r) => {
    resolve = r;
  });
  const drafts = [];
  function VoiceProbe() {
    voice = useVoice({
      language: 'english',
      onDraft: (t) => drafts.push(t),
      onSubmit() {},
      onActivity() {},
    });
    return null;
  }
  await mount(VoiceProbe);
  await React.act(async () => voice.listen('', false));
  await React.act(async () => voice.finish(false));
  assert.equal(voice.phase, 'transcribing');
  await React.act(() =>
    window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' })),
  );
  await React.act(() => resolve({ ok: true, json: async () => ({ text: 'Stale answer' }) }));
  assert.deepEqual(drafts, []);
  assert.equal(voice.phase, 'idle');
});

test('definite validation failure allows correcting the answer with a new request', async () => {
  await reset();
  await mount();
  await React.act(() => controller.start());
  await React.act(() => controller.setDraft('An answer'));
  rejectedTurn = { status: 400, error: 'Invalid answer' };
  await React.act(() => controller.send('answer'));
  const first = requests.at(-1).payload.requestId;
  assert.equal(controller.pending.current, null);
  rejectedTurn = null;
  await React.act(() => controller.setDraft('A corrected answer'));
  await React.act(() => controller.send('answer'));
  assert.notEqual(requests.at(-1).payload.requestId, first);
  assert.equal(requests.at(-1).payload.text, 'A corrected answer');
});

test('conflict with completed session reconciles state and releases pending retry', async () => {
  await reset();
  await mount();
  await React.act(() => controller.start());
  await React.act(() => controller.setDraft('My last answer'));
  responseSession = session({ status: 'completed' });
  rejectedTurn = { status: 409, error: 'This interview has ended.' };
  await React.act(() => controller.send('answer'));
  assert.equal(controller.session.status, 'completed');
  assert.equal(controller.pending.current, null);
  assert.equal(controller.draft, 'My last answer');
});

for (const status of [429, 502, 503]) {
  test(`definite ${status} failure permits pause and preserves answer and code`, async () => {
    await reset();
    await mount();
    assert.equal(document.title, 'Start an interview · Shortnotes');
    await React.act(() => controller.start());
    assert.equal(document.title, 'JavaScript interview · Shortnotes');
    await React.act(() => {
      controller.setDraft('My retained answer');
      controller.setCode('const answer = 42;');
    });
    rejectedTurn = { status, error: 'Provider unavailable' };
    await React.act(() => controller.send('answer'));
    assert.equal(controller.pending.current, null);
    assert.equal(readDraft('test-session').pending, null);
    assert.equal(controller.draft, 'My retained answer');
    assert.equal(controller.code, 'const answer = 42;');
    rejectedTurn = null;
    responseSession = session({ status: 'paused' });
    await React.act(() => controller.send('pause'));
    assert.equal(requests.at(-1).payload.action, 'pause');
    assert.equal(controller.session.status, 'paused');
    assert.equal(controller.draft, 'My retained answer');
    assert.equal(controller.code, 'const answer = 42;');
  });
}

test('ambiguous 500 retains mandatory retry identity', async () => {
  await reset();
  await mount();
  await React.act(() => controller.start());
  await React.act(() => controller.setDraft('My retained answer'));
  rejectedTurn = { status: 500, error: 'Request failed' };
  await React.act(() => controller.send('answer'));
  const identity = controller.pending.current.requestId;
  const count = requests.length;
  await React.act(() => controller.send('pause'));
  assert.equal(requests.length, count);
  assert.equal(controller.pending.current.requestId, identity);
});

test('hands-free respects current settings when server audio completes', async (t) => {
  await reset();
  t.mock.timers.enable({ apis: ['setTimeout'] });
  await mount();
  await React.act(() => controller.setHandsFree(true));
  await React.act(() => controller.start());
  assert.equal(audioPlayers.length, 1);
  await React.act(() => controller.setHandsFree(false));
  await React.act(() => {
    audioPlayers[0].onended();
    t.mock.timers.tick(250);
  });
  assert.equal(recordings.length, 0);
  t.mock.timers.reset();
});

test('muted replies allow hands-free recording and hidden tabs release the microphone', async (t) => {
  await reset();
  t.after(() => {
    delete document.visibilityState;
  });
  await mount();
  await React.act(() => {
    controller.setVoiceOn(false);
    controller.setHandsFree(true);
  });
  await React.act(() => controller.start());
  assert.equal(recordings.length, 1);
  await React.act(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new window.Event('visibilitychange'));
  });
  assert.equal(micTracks[0].stopped, true);
  assert.equal(controller.voice.listening, false);
  assert.match(controller.voice.error, /hidden/);
  assert.equal(requests.filter((r) => r.url.endsWith('/transcribe')).length, 0);
});

test('voice preferences render labeled controls and survive remount', async () => {
  await reset();
  const { default: VoiceSettings } = await server.ssrLoadModule(
    '/src/interviewer/VoiceSettings.jsx',
  );
  function SettingsProbe() {
    voice = useVoice({ language: 'english', onDraft() {}, onSubmit() {}, onActivity() {} });
    return React.createElement(VoiceSettings, { voice });
  }
  await mount(SettingsProbe);
  assert.equal(document.querySelectorAll('label select').length, 4);
  const select = document.querySelectorAll('select')[1];
  await React.act(() => {
    select.value = '7000';
    select.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
  assert.equal(voice.preferences.silenceMs, 7000);
  await mount(SettingsProbe);
  assert.equal(voice.preferences.silenceMs, 7000);
  assert.equal(document.querySelectorAll('select')[1].value, '7000');
});

test('the actual Speak button records, Stop mic fills the answer, and Replay uses server audio', async () => {
  await reset();
  responseSession = session({
    modelRouting: {
      preferredModel: 'gemini-3.8-flash',
      model: 'gemini-3.7-flash',
      fallback: true,
    },
  });
  const { default: InterviewAgent } = await server.ssrLoadModule(
    '/src/interviewer/InterviewAgent.jsx',
  );
  await mount(InterviewAgent);
  const button = (text) =>
    [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === text);
  await React.act(async () => {
    const automatic = [...document.querySelectorAll('label')]
      .find((label) => label.textContent.includes('Automatic voice'))
      .querySelector('input');
    automatic.click();
  });
  await React.act(async () => button('Start interview').click());
  assert.match(
    document.body.textContent,
    /Using gemini-3.7-flash because gemini-3.8-flash is temporarily unavailable/,
  );
  assert.ok(button('Speak'));
  await React.act(async () => button('Speak').click());
  assert.equal(button('Stop mic').getAttribute('aria-pressed'), 'true');
  assert.match(document.getElementById('interview-mic-status').textContent, /Recording/);
  await React.act(async () => button('Stop mic').click());
  assert.equal(document.getElementById('interview-answer').value, transcript);
  assert.equal(requests.filter((r) => r.payload?.action === 'answer').length, 0);
  await React.act(async () => button('Send answer').click());
  assert.equal(requests.filter((r) => r.payload?.action === 'answer').length, 1);
  await React.act(async () => button('Replay').click());
  assert.ok(audioPlayers.length >= 1);
});

for (const streaming of [false, true])
  test(`Start interview cycles through live captions and replies (streaming speech: ${streaming})`, async (t) => {
    await reset();
    t.mock.timers.enable({ apis: ['setTimeout'] });
    const originals = {
      AudioContext: window.AudioContext,
      AudioWorkletNode: window.AudioWorkletNode,
      WebSocket: window.WebSocket,
    };
    const sources = [],
      nodes = [],
      sockets = [];
    window.AudioContext = class {
      state = 'running';
      currentTime = 0;
      createBuffer = streaming
        ? (_channels, length, sampleRate) => ({
            duration: length / sampleRate,
            getChannelData: () => new Float32Array(length),
          })
        : undefined;
      sampleRate = 16000;
      destination = {};
      audioWorklet = { addModule: async () => {} };
      resume() {
        return Promise.resolve();
      }
      close() {
        return Promise.resolve();
      }
      decodeAudioData() {
        return Promise.resolve({ duration: 1 });
      }
      createBufferSource() {
        const source = {
          playbackRate: {},
          connect() {},
          disconnect() {},
          start() {},
          stop() {},
        };
        sources.push(source);
        return source;
      }
      createMediaStreamSource() {
        return { connect() {}, disconnect() {} };
      }
      createGain() {
        return { gain: {}, connect() {}, disconnect() {} };
      }
    };
    window.AudioWorkletNode = class {
      constructor() {
        nodes.push(this);
        this.port = { postMessage: () => this.port.onmessage({ data: { type: 'flushed' } }) };
      }
      connect() {}
      disconnect() {}
    };
    window.WebSocket = class {
      readyState = 1;
      bufferedAmount = 0;
      constructor() {
        sockets.push(this);
      }
      send() {}
      close() {
        this.readyState = 3;
      }
    };
    t.after(async () => {
      if (root) {
        await React.act(() => root.unmount());
        root = null;
      }
      Object.assign(window, originals);
      t.mock.timers.reset();
    });
    const { default: InterviewAgent } = await server.ssrLoadModule(
      '/src/interviewer/InterviewAgent.jsx',
    );
    await mount(InterviewAgent);
    const button = (text) =>
      [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === text);
    const emit = (event) => sockets.at(-1).onmessage({ data: JSON.stringify(event) });
    assert.equal(
      [...document.querySelectorAll('label')]
        .find((l) => l.textContent.includes('Automatic voice'))
        .querySelector('input').checked,
      true,
    );
    await React.act(async () => button('Start interview').click());
    assert.equal(sources.length, 1);
    await React.act(async () => {
      sources[0].onended();
      for (let i = 0; i < 10; i++) await Promise.resolve();
      t.mock.timers.tick(250);
    });
    assert.equal(sockets.length, 1);
    await React.act(async () => {
      sockets[0].onopen();
      emit({ type: 'ready' });
    });
    await React.act(async () =>
      emit({ type: 'transcript', text: 'I built a cache', final: false }),
    );
    assert.equal(document.getElementById('interview-answer').value, 'I built a cache');
    assert.equal(requests.filter((r) => r.payload?.action === 'answer').length, 0);
    responseSession = session({
      messages: [
        ...session().messages,
        { id: 'answer', role: 'user', text: 'I built a cache.', phase: 'intro' },
        {
          id: 'followup',
          role: 'assistant',
          text: 'How did you invalidate it?',
          phase: 'intro',
        },
      ],
    });
    await React.act(async () => {
      nodes[0].port.onmessage({
        data: { type: 'audio', buffer: new ArrayBuffer(3200), rms: 0, ms: 3500 },
      });
      emit({ type: 'transcript', text: 'I built a cache.', final: true });
      emit({ type: 'done' });
    });
    const answers = requests.filter((r) => r.payload?.action === 'answer');
    assert.equal(answers.length, 1);
    assert.equal(answers[0].payload.text, 'I built a cache.');
    assert.equal(sources.length, 2);
    await React.act(async () => {
      sources[1].onended();
      for (let i = 0; i < 10; i++) await Promise.resolve();
      t.mock.timers.tick(250);
    });
    assert.equal(sockets.length, 2);
    await React.act(async () => {
      sockets[1].onopen();
      emit({ type: 'ready' });
    });
    await React.act(async () => button('Pause voice').click());
    assert.equal(sockets[1].readyState, 3);
    assert.ok(micTracks.every((track) => track.stopped));
    assert.ok(button('Resume voice'));
  });
