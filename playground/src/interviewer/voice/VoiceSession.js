import { RecordedInput, canRecord } from './RecordedInput.js';
import { speechText } from './speech.js';
import { PcmPlayer } from './PcmPlayer.js';
const CAP = 10000;
const join = (...parts) => parts.filter(Boolean).join(' ').trim();

// Coordinates capture -> server ASR -> draft and server TTS -> audio playback.
// Browser APIs are used only for device capture/playback, never speech recognition/synthesis.
export class VoiceSession {
  constructor({
    browser,
    onDraft,
    onSubmit,
    onActivity,
    transcribe,
    synthesize,
    streamSpeech,
    liveInput,
    timers = globalThis,
  }) {
    Object.assign(this, { browser, timers, transcribe, synthesize, streamSpeech, liveInput });
    this.callbacks = { onDraft, onSubmit, onActivity };
    this.run = 0;
    this.pending = new Map();
    this.audioCache = new Map();
    this.options = {
      language: 'english',
      silenceMs: 3500,
      rate: 1,
      voiceName: 'Kore',
      inputLocale: 'auto',
    };
    this.state = {
      phase: 'idle',
      error: '',
      notice: '',
      caption: '',
      waiting: false,
      canRetryRecording: false,
      live: false,
    };
  }
  configure(options) {
    this.options = { ...this.options, ...options };
  }
  subscribe(listener) {
    this.listener = listener;
    return () => {
      this.listener = null;
    };
  }
  publish(patch) {
    this.state = { ...this.state, ...patch };
    this.listener?.(this.state);
  }
  clear(name) {
    this.timers.clearTimeout(this.pending.get(name));
    this.pending.delete(name);
  }
  later(name, delay, fn) {
    this.clear(name);
    const token = this.run;
    this.pending.set(
      name,
      this.timers.setTimeout(() => {
        this.pending.delete(name);
        if (token === this.run) fn();
      }, delay),
    );
  }
  releaseAudio() {
    this.pcmPlayer?.cancel();
    this.pcmPlayer = null;
    if (this.audioSource) {
      this.audioSource.onended = null;
      this.audioSource.stop();
      this.audioSource.disconnect();
      this.audioSource = null;
    }
    if (this.audio) {
      this.audio.onended = this.audio.onerror = this.audio.onplaying = null;
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
      this.audio = null;
    }
    if (this.audioURL) this.browser.URL.revokeObjectURL(this.audioURL);
    this.audioURL = null;
  }
  stop() {
    this.run++;
    for (const name of this.pending.keys()) this.clear(name);
    this.recording?.cancel();
    this.recording = null;
    this.request?.abort();
    this.request = null;
    this.releaseAudio();
    this.publish({
      phase: 'idle',
      notice: '',
      caption: '',
      waiting: false,
      canRetryRecording: false,
      live: false,
    });
  }
  dispose() {
    this.stop();
    this.audioCache.clear();
    this.outputContext?.close().catch(() => {});
    this.outputContext = null;
  }
  async prepare(microphone = false) {
    // Called directly from Start/Resume, before fetching an interview, to unlock device audio.
    const token = this.run;
    const Context = this.browser.AudioContext || this.browser.webkitAudioContext;
    try {
      if (Context) {
        this.outputContext ||= new Context();
        void this.outputContext.resume().catch(() => {});
      }
      if (microphone) {
        let timeout;
        const permission = this.browser.navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => stream.getTracks().forEach((track) => track.stop()));
        try {
          await Promise.race([
            permission,
            new Promise((_, reject) => {
              timeout = this.timers.setTimeout(
                () => reject(new Error('Microphone permission timed out')),
                15000,
              );
            }),
          ]);
        } finally {
          this.timers.clearTimeout(timeout);
        }
      }
      return token === this.run;
    } catch {
      this.publish({
        error:
          'Microphone access is blocked. Allow it in site settings, then resume voice. You can type for now.',
      });
      return false;
    }
  }
  fail(message) {
    this.stop();
    this.publish({ error: message });
  }
  listen(draft = '', autoSend = false, live = autoSend) {
    this.stop();
    this.publish({ error: '' });
    const Input = live && this.liveInput ? this.liveInput : RecordedInput;
    if (Input === RecordedInput && (!this.transcribe || !canRecord(this.browser)))
      return this.fail(
        'Microphone capture is unavailable. Open the app on localhost or HTTPS and allow microphone access, or type your answer.',
      );
    const token = this.run;
    this.recording = new Input({
      browser: this.browser,
      timers: this.timers,
      transcribe: this.transcribe,
      language: this.options.language,
      locale: this.options.inputLocale,
      silenceMs: this.options.silenceMs,
      autoSend,
      onPreview: (transcript) => {
        if (token === this.run)
          this.callbacks.onDraft?.(join(draft.trim(), transcript.trim()).slice(0, CAP));
      },
      onState: (patch) => {
        if (token === this.run) this.publish(patch);
      },
      onActivity: () => {
        if (token === this.run) this.callbacks.onActivity?.();
      },
      onText: (transcript, submit) => {
        if (token !== this.run) return;
        const text = join(draft.trim(), transcript.trim());
        this.stop();
        if (!transcript.trim())
          return this.publish({
            error:
              'No clear speech detected. Tap Speak and try again; your draft is unchanged.',
          });
        this.callbacks.onDraft?.(text.slice(0, CAP));
        if (text.length > CAP)
          return this.publish({
            error: 'Transcript reached the answer limit. Review the draft before sending.',
          });
        if (submit) this.callbacks.onSubmit?.(text);
      },
      onError: (message, retryable) => {
        if (token !== this.run) return;
        if (retryable)
          this.publish({
            phase: 'idle',
            error: message,
            notice: '',
            waiting: false,
            canRetryRecording: true,
          });
        else this.fail(message);
      },
    });
    void this.recording.start();
  }
  finish(submit = false) {
    if (this.state.phase === 'starting') return this.stop();
    this.recording?.finish(submit);
  }
  retryRecording() {
    if (this.state.canRetryRecording) void this.recording?.upload();
  }
  speak(text, after) {
    this.stop();
    this.publish({ error: '' });
    const clean = speechText(text);
    if (!clean) return;
    if (!this.synthesize || !this.browser.Audio || !this.browser.URL?.createObjectURL)
      return this.fail('Audio playback is unavailable. Read the transcript below.');
    const token = this.run;
    const key = `${this.options.voiceName}\n${clean}`;
    const cached = this.audioCache.get(key);
    // Replay cached audio immediately within the button gesture (important for autoplay policy).
    if (cached) return this.play(cached, clean, after, token);
    this.publish({
      phase: 'generating',
      caption: clean,
      notice: 'Preparing the interviewer’s voice…',
    });
    this.request = new AbortController();
    this.later('generation', 50000, () =>
      this.fail('Speech generation timed out. Tap Replay to retry.'),
    );
    if (this.streamSpeech && this.outputContext?.createBuffer) {
      void this.playStream(clean, key, after, token);
      return;
    }
    Promise.resolve()
      .then(() => {
        if (token !== this.run) return null;
        return this.synthesize(clean, {
          voice: this.options.voiceName,
          signal: this.request.signal,
        });
      })
      .then((blob) => {
        if (token !== this.run || !blob) return;
        this.clear('generation');
        this.request = null;
        this.audioCache.set(key, blob);
        while (this.audioCache.size > 2)
          this.audioCache.delete(this.audioCache.keys().next().value);
        this.play(blob, clean, after, token);
      })
      .catch((error) => {
        if (token === this.run)
          this.fail(error.message || 'Speech generation failed. Tap Replay to retry.');
      });
  }
  async playStream(caption, key, after, token) {
    try {
      const context = this.outputContext;
      await context.resume();
      if (token !== this.run) return;
      if (context.state !== 'running')
        throw new Error('Audio is ready. Tap Replay to allow playback.');
      const player = new PcmPlayer(context, this.options.rate);
      this.pcmPlayer = player;
      const watchdog = () =>
        this.later(
          'playback',
          Math.max(15000, (player.nextTime - context.currentTime) * 1000 + 10000),
          () => this.fail('Audio playback stalled. Tap Replay to continue.'),
        );
      const blob = await this.streamSpeech(caption, {
        voice: this.options.voiceName,
        signal: this.request.signal,
        onAudio: (bytes) => {
          if (token !== this.run) return;
          player.push(bytes);
          this.clear('generation');
          this.publish({ phase: 'speaking', caption, notice: '' });
          this.later('stream', 15000, () =>
            this.fail('Speech stream stalled. Tap Replay to retry.'),
          );
          watchdog();
        },
      });
      if (token !== this.run) return;
      this.clear('generation');
      this.clear('stream');
      this.request = null;
      this.audioCache.set(key, blob);
      while (this.audioCache.size > 2)
        this.audioCache.delete(this.audioCache.keys().next().value);
      const playback = player.finish();
      watchdog();
      await playback;
      if (token !== this.run) return;
      this.clear('playback');
      this.pcmPlayer = null;
      this.publish({ phase: 'idle', caption: '' });
      if (after) this.later('handoff', 250, after);
    } catch (error) {
      if (token === this.run)
        this.fail(error.message || 'Speech playback failed. Tap Replay to retry.');
    }
  }
  play(blob, caption, after, token) {
    if (token !== this.run) return;
    if (this.outputContext?.decodeAudioData) {
      void this.playDecoded(blob, caption, after, token);
      return;
    }
    try {
      this.audioURL = this.browser.URL.createObjectURL(blob);
      const audio = new this.browser.Audio(this.audioURL);
      this.audio = audio;
      audio.playbackRate = this.options.rate;
      audio.preservesPitch = true;
      const valid = () => token === this.run && this.audio === audio;
      this.publish({ phase: 'speaking', caption, notice: '' });
      this.later('playback', 15000, () =>
        this.fail('Audio did not start. Tap Replay to try again.'),
      );
      audio.onplaying = () => {
        if (!valid()) return;
        // WAV output is mono 24 kHz / 16-bit; allow playback duration plus a bounded stall margin.
        const duration = Number.isFinite(audio.duration) ? audio.duration : blob.size / 48000;
        this.later(
          'playback',
          Math.min(240000, Math.max(15000, (duration * 1000) / audio.playbackRate + 10000)),
          () => this.fail('Audio playback stalled. Tap Replay to continue.'),
        );
      };
      audio.onended = () => {
        if (!valid()) return;
        this.clear('playback');
        this.releaseAudio();
        this.publish({ phase: 'idle', caption: '' });
        if (after) this.later('handoff', 250, after);
      };
      audio.onerror = () => {
        if (valid()) this.fail('Audio playback failed. Tap Replay to retry.');
      };
      Promise.resolve(audio.play()).catch((error) => {
        if (valid())
          this.fail(
            error.name === 'NotAllowedError'
              ? 'Audio is ready. Tap Replay to allow playback.'
              : 'Audio playback failed. Tap Replay to retry.',
          );
      });
    } catch {
      this.fail('Audio playback could not start. Tap Replay to retry.');
    }
  }
  async playDecoded(blob, caption, after, token) {
    try {
      this.later('playback', 15000, () =>
        this.fail('Audio is ready. Tap Replay to allow playback.'),
      );
      const context = this.outputContext;
      const buffer = await context.decodeAudioData(await blob.arrayBuffer());
      if (token !== this.run) return;
      await context.resume();
      if (token !== this.run) return;
      if (context.state !== 'running')
        return this.fail('Audio is ready. Tap Replay to allow playback.');
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = this.options.rate;
      source.connect(context.destination);
      this.audioSource = source;
      this.publish({ phase: 'speaking', caption, notice: '' });
      source.onended = () => {
        if (token !== this.run || this.audioSource !== source) return;
        this.clear('playback');
        source.disconnect();
        this.audioSource = null;
        this.publish({ phase: 'idle', caption: '' });
        if (after) this.later('handoff', 250, after);
      };
      this.later(
        'playback',
        Math.min(240000, (buffer.duration * 1000) / this.options.rate + 10000),
        () => this.fail('Audio playback stalled. Tap Replay to continue.'),
      );
      source.start();
    } catch {
      if (token === this.run) this.fail('Audio playback could not start. Tap Replay to retry.');
    }
  }
}
