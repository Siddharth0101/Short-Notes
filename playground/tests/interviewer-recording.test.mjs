import test from 'node:test';
import assert from 'node:assert/strict';
import { VoiceSession } from '../src/interviewer/voice/VoiceSession.js';

function fixture({
  transcribe = async () => 'Closures retain lexical scope.',
  brave = true,
  getUserMedia,
} = {}) {
  const recordings = [],
    drafts = [],
    submissions = [],
    uploads = [],
    tracks = [];
  let clock = 0,
    id = 0;
  const jobs = new Map();
  const timers = {
    setTimeout(fn, ms) {
      jobs.set(++id, { fn, at: clock + ms });
      return id;
    },
    clearTimeout(id) {
      jobs.delete(id);
    },
    tick(ms) {
      const end = clock + ms;
      while (true) {
        const next = [...jobs].filter(([, j]) => j.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        jobs.delete(next[0]);
        clock = next[1].at;
        next[1].fn();
      }
      clock = end;
    },
  };
  const newStream = () => {
    const track = {
      stopped: false,
      stop() {
        this.stopped = true;
      },
    };
    tracks.push(track);
    return { getTracks: () => [track] };
  };
  const browser = {
    Blob,
    navigator: {
      ...(brave ? { brave: { isBrave: async () => true } } : {}),
      mediaDevices: { getUserMedia: getUserMedia || (async () => newStream()) },
    },
    MediaRecorder: class {
      static isTypeSupported(type) {
        return type === 'audio/webm;codecs=opus';
      }
      constructor(stream, { mimeType }) {
        this.mimeType = mimeType;
        this.state = 'inactive';
        recordings.push(this);
      }
      start() {
        this.state = 'recording';
      }
      stop() {
        this.state = 'inactive';
        this.ondataavailable({
          data: new Blob(['test audio'], { type: this.mimeType }),
        });
        this.onstop();
      }
    },
  };
  const engine = new VoiceSession({
    browser,
    timers,
    transcribe: async (...args) => {
      uploads.push(args);
      return transcribe(...args);
    },
    onDraft: (t) => drafts.push(t),
    onSubmit: (t) => submissions.push(t),
    onActivity() {},
  });
  return {
    engine,
    browser,
    recordings,
    drafts,
    submissions,
    uploads,
    tracks,
    timers,
    newStream,
  };
}
const settle = async () => {
  for (let i = 0; i < 8; i++) await Promise.resolve();
};

test('Speak in Brave records even when the broken browser speech API exists', async () => {
  const f = fixture();
  f.browser.SpeechRecognition = class {
    constructor() {
      throw new Error('Must not use Brave speech service');
    }
  };
  f.engine.listen('My answer:', false);
  await settle();
  assert.equal(f.engine.state.phase, 'recording');
  assert.match(f.engine.state.notice, /Stop mic/);
  f.engine.finish(false);
  await settle();
  assert.deepEqual(f.drafts, ['My answer: Closures retain lexical scope.']);
  assert.deepEqual(f.submissions, []);
  assert.equal(f.uploads.length, 1);
  assert.equal(f.tracks[0].stopped, true);
  assert.equal(f.engine.state.phase, 'idle');
});

test('recording works without any browser speech API', async () => {
  const f = fixture({ brave: false });
  f.engine.listen('Existing answer', false);
  await settle();
  assert.equal(f.engine.state.phase, 'recording');
  f.engine.finish(true);
  await settle();
  assert.deepEqual(f.submissions, ['Existing answer Closures retain lexical scope.']);
});

test('Stop and unmount discard cancelled audio without uploading or leaking a late microphone', async () => {
  let grant;
  const f = fixture({
    getUserMedia: () =>
      new Promise((resolve) => {
        grant = resolve;
      }),
  });
  f.engine.listen('', false);
  f.engine.stop();
  grant(f.newStream());
  await settle();
  assert.equal(f.tracks[0].stopped, true);
  assert.equal(f.recordings.length, 0);
  assert.equal(f.uploads.length, 0);
});

test('permission refusal is visible and never uploads or submits', async () => {
  const f = fixture({
    getUserMedia: async () => {
      throw Object.assign(new Error('denied'), { name: 'NotAllowedError' });
    },
  });
  f.engine.listen('Keep this', true);
  await settle();
  assert.match(f.engine.state.error, /permission is blocked/);
  assert.equal(f.engine.state.phase, 'idle');
  assert.equal(f.uploads.length, 0);
  assert.deepEqual(f.drafts, []);
});

test('late transcription cannot overwrite a new answer after cancellation', async () => {
  let resolve;
  const f = fixture({
    transcribe: () =>
      new Promise((r) => {
        resolve = r;
      }),
  });
  f.engine.listen('', false);
  await settle();
  f.engine.finish(true);
  assert.equal(f.engine.state.phase, 'transcribing');
  f.engine.stop();
  assert.equal(f.uploads[0][1].signal.aborted, true);
  resolve('stale answer');
  await settle();
  assert.deepEqual(f.drafts, []);
  assert.deepEqual(f.submissions, []);
});

test('failed transcription can retry the same audio but never automatically sends the retry', async () => {
  let calls = 0;
  const f = fixture({
    transcribe: async () => {
      if (++calls === 1) throw new Error('quota');
      return 'Recovered answer';
    },
  });
  f.engine.listen('Typed start', true);
  await settle();
  f.engine.finish(true);
  await settle();
  assert.equal(f.engine.state.canRetryRecording, true);
  assert.equal(f.tracks[0].stopped, true);
  f.engine.retryRecording();
  await settle();
  assert.equal(f.uploads[0][0], f.uploads[1][0]);
  assert.deepEqual(f.drafts, ['Typed start Recovered answer']);
  assert.deepEqual(f.submissions, []);
});

test('two minute cap transcribes for review and empty speech never submits', async () => {
  const f = fixture({ transcribe: async () => '' });
  f.engine.listen('Existing draft', true);
  await settle();
  f.timers.tick(120000);
  await settle();
  assert.equal(f.tracks[0].stopped, true);
  assert.match(f.engine.state.error, /No clear speech/);
  assert.deepEqual(f.drafts, []);
  assert.deepEqual(f.submissions, []);
});

test('hands-free recording waits for speech then silence, not just a quiet microphone', async () => {
  const f = fixture();
  let amplitude = 0;
  f.browser.AudioContext = class {
    state = 'running';
    resume() {
      return Promise.resolve();
    }
    close() {
      return Promise.resolve();
    }
    createMediaStreamSource() {
      return { connect() {}, disconnect() {} };
    }
    createAnalyser() {
      return {
        fftSize: 1024,
        getFloatTimeDomainData(data) {
          data.fill(amplitude);
        },
      };
    }
  };
  f.engine.listen('', true);
  await settle();
  f.timers.tick(5000);
  assert.equal(f.uploads.length, 0);
  amplitude = 0.1;
  f.timers.tick(400);
  amplitude = 0;
  f.timers.tick(3400);
  assert.equal(f.uploads.length, 0);
  f.timers.tick(100);
  await settle();
  assert.deepEqual(f.submissions, ['Closures retain lexical scope.']);
});
