import test from 'node:test';
import assert from 'node:assert/strict';
import { VoiceSession } from '../src/interviewer/voice/VoiceSession.js';
import { speechText } from '../src/interviewer/voice/speech.js';

const settle = async () => {
  for (let i = 0; i < 8; i++) await Promise.resolve();
};
function fixture(synthesize = async () => new Blob(['wav test bytes'])) {
  const players = [],
    revoked = [],
    requests = [];
  let now = 0,
    id = 0;
  const jobs = new Map();
  const timers = {
    setTimeout(fn, ms) {
      jobs.set(++id, { fn, at: now + ms });
      return id;
    },
    clearTimeout(id) {
      jobs.delete(id);
    },
    tick(ms) {
      const end = now + ms;
      while (true) {
        const next = [...jobs].filter(([, j]) => j.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        jobs.delete(next[0]);
        now = next[1].at;
        next[1].fn();
      }
      now = end;
    },
  };
  const browser = {
    URL: {
      createObjectURL: () => `blob:${players.length}`,
      revokeObjectURL: (url) => revoked.push(url),
    },
    Audio: class {
      duration = 1;
      constructor(src) {
        this.src = src;
        players.push(this);
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
    },
    get SpeechRecognition() {
      throw new Error('Browser recognition must never be accessed');
    },
    get speechSynthesis() {
      throw new Error('Browser synthesis must never be accessed');
    },
  };
  const engine = new VoiceSession({
    browser,
    timers,
    synthesize: (...args) => {
      requests.push(args);
      return synthesize(...args);
    },
  });
  return { engine, players, revoked, requests, timers };
}

test('spoken replies use the server tool and Replay reuses bounded cached audio', async () => {
  const f = fixture();
  f.engine.configure({ rate: 1.15, voiceName: 'Puck' });
  f.engine.speak('Explain **closures**.');
  assert.equal(f.engine.state.phase, 'generating');
  await settle();
  assert.equal(f.engine.state.phase, 'speaking');
  assert.equal(f.requests[0][0], 'Explain closures.');
  assert.equal(f.requests[0][1].voice, 'Puck');
  assert.equal(f.players[0].playbackRate, 1.15);
  f.players[0].onended();
  f.engine.speak('Explain **closures**.');
  assert.equal(f.players.length, 2);
  assert.equal(f.requests.length, 1);
  f.engine.dispose();
  assert.equal(f.engine.audioCache.size, 0);
  assert.equal(f.revoked.length, 2);
});

test('cancelling an in-flight speech tool ignores its late result and aborts its request', async () => {
  let resolve;
  const f = fixture(
    () =>
      new Promise((r) => {
        resolve = r;
      }),
  );
  f.engine.speak('Old question');
  await settle();
  f.engine.stop();
  assert.equal(f.requests[0][1].signal.aborted, true);
  resolve(new Blob(['old wav']));
  await settle();
  assert.equal(f.players.length, 0);
  assert.equal(f.engine.state.phase, 'idle');
});

test('interruption releases audio and stale end events cannot open the microphone', async () => {
  const f = fixture();
  let handoffs = 0;
  f.engine.speak('Question?', () => handoffs++);
  await settle();
  const oldEnd = f.players[0].onended;
  f.engine.stop();
  oldEnd();
  f.timers.tick(1000);
  assert.equal(handoffs, 0);
  assert.equal(f.players[0].paused, true);
  assert.equal(f.revoked.length, 1);
});

test('normal audio completion leaves an echo gap and cancellation during it blocks capture', async () => {
  const f = fixture();
  let handoffs = 0;
  f.engine.speak('Question?', () => handoffs++);
  await settle();
  f.players[0].onended();
  f.timers.tick(249);
  assert.equal(handoffs, 0);
  f.engine.stop();
  f.timers.tick(1);
  assert.equal(handoffs, 0);
  f.engine.speak('Question?', () => handoffs++);
  f.players.at(-1).onended();
  f.timers.tick(250);
  assert.equal(handoffs, 1);
});

test('autoplay refusal preserves generated audio for an explicit Replay gesture', async () => {
  const f = fixture();
  f.engine.browser.Audio.prototype.play = function () {
    return Promise.reject(Object.assign(new Error('blocked'), { name: 'NotAllowedError' }));
  };
  f.engine.speak('Ready question');
  await settle();
  assert.match(f.engine.state.error, /Tap Replay/);
  f.engine.browser.Audio.prototype.play = function () {
    this.onplaying?.();
    return Promise.resolve();
  };
  f.engine.speak('Ready question');
  assert.equal(f.requests.length, 1);
  assert.equal(f.engine.state.phase, 'speaking');
});

test('generation timeout and playback stalls cannot leave voice stuck or trigger hands-free', async () => {
  const f = fixture(() => new Promise(() => {}));
  let handoffs = 0;
  f.engine.speak('Question', () => handoffs++);
  await settle();
  f.timers.tick(50000);
  assert.match(f.engine.state.error, /timed out/);
  assert.equal(f.requests[0][1].signal.aborted, true);
  const g = fixture();
  g.engine.speak('Question', () => handoffs++);
  await settle();
  g.timers.tick(20000);
  assert.match(g.engine.state.error, /stalled/);
  assert.equal(handoffs, 0);
});

test('only readable bounded text goes to the speech tool', () => {
  const text = speechText(
    'Read **closures**. [Notes](https://example.com)\n```js\nsecretCode()\n``` ' + 'x'.repeat(6000),
  );
  assert.ok(text.length <= 5000);
  assert.doesNotMatch(text, /secretCode|https|\*\*/);
  assert.match(text, /Code example is in the transcript/);
});
