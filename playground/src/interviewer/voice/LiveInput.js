export function canStream(browser) {
  return Boolean(
    browser.WebSocket &&
    browser.AudioWorkletNode &&
    (browser.AudioContext || browser.webkitAudioContext) &&
    browser.navigator?.mediaDevices?.getUserMedia,
  );
}
const join = (...parts) => parts.filter(Boolean).join(' ').trim();

// One candidate turn: capture -> bounded local WebSocket -> live ASR -> draft.
// Interim text is a replacement hypothesis; final segments are appended exactly once.
export class LiveInput {
  constructor(options) {
    Object.assign(this, options);
    this.jobs = new Set();
    this.finalText = '';
    this.interim = '';
    this.cancelled = false;
    this.finishing = false;
    this.heard = false;
    this.quiet = 0;
    this.voiced = 0;
  }
  later(ms, fn) {
    const id = this.timers.setTimeout(() => {
      this.jobs.delete(id);
      if (!this.cancelled) fn();
    }, ms);
    this.jobs.add(id);
    return id;
  }
  releaseMic() {
    if (this.node) {
      this.node.port.onmessage = null;
      this.node.disconnect();
    }
    this.source?.disconnect();
    this.gain?.disconnect();
    this.node = this.source = this.gain = null;
    this.stream?.getTracks().forEach((track) => {
      track.onended = null;
      track.stop();
    });
    this.stream = null;
    this.context?.close().catch(() => {});
    this.context = null;
  }
  cancel() {
    this.cancelled = true;
    for (const id of this.jobs) this.timers.clearTimeout(id);
    this.jobs.clear();
    this.releaseMic();
    if (this.socket) {
      this.socket.onopen = this.socket.onmessage = this.socket.onclose = this.socket.onerror = null;
      this.socket.close();
      this.socket = null;
    }
  }
  fail(message) {
    if (this.cancelled) return;
    this.cancel();
    this.onError(message, false);
  }
  async start() {
    this.onState({ phase: 'starting', notice: 'Connecting live voice…', live: true });
    this.startup = this.later(15000, () =>
      this.fail('Voice did not start. Allow microphone access, then resume voice.'),
    );
    try {
      // Request capture and resume the audio context immediately, preserving a user gesture when available.
      const Context = this.browser.AudioContext || this.browser.webkitAudioContext;
      this.context = new Context({ sampleRate: 16000 });
      const resume = this.context
        .resume()
        .catch(() => this.fail('Microphone audio is paused. Resume voice to allow audio capture.'));
      const stream = await this.browser.navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      if (this.cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      this.stream = stream;
      await resume;
      if (this.cancelled) return;
      if (this.context.sampleRate !== 16000)
        return this.fail(
          'This device cannot start live audio at 16 kHz. Turn off Automatic voice to record an answer.',
        );
      await this.context.audioWorklet.addModule(
        new URL('./pcm-capture.worklet.js', import.meta.url),
      );
      if (this.cancelled) return;
      const { protocol, host } = this.browser.location;
      this.socket = new this.browser.WebSocket(
        `${protocol === 'https:' ? 'wss:' : 'ws:'}//${host}/api/interviewer/voice/live`,
      );
      this.socket.binaryType = 'arraybuffer';
      this.socket.onopen = () =>
        this.socket.send(
          JSON.stringify({ type: 'start', language: this.language, locale: this.locale }),
        );
      this.socket.onmessage = ({ data }) => this.message(data);
      this.socket.onerror = () =>
        this.fail('Live voice cannot connect. Check the interview server, then resume voice.');
      this.socket.onclose = () =>
        this.fail(
          'Live voice disconnected. Your visible text is preserved; resume voice to continue.',
        );
      for (const track of stream.getTracks())
        track.onended = () => this.fail('Microphone disconnected. Reconnect it and resume voice.');
    } catch (error) {
      this.fail(
        error.name === 'NotAllowedError'
          ? 'Microphone permission is blocked. Allow it in site and system settings, then resume voice.'
          : 'Could not start live microphone capture. Check your input device and resume voice.',
      );
    }
  }
  message(data) {
    if (this.cancelled) return;
    try {
      const event = JSON.parse(data);
      if (event.type === 'error')
        return this.fail(event.message || 'Live voice failed. Resume voice.');
      if (event.type === 'ready') {
        if (this.node) return;
        this.timers.clearTimeout(this.startup);
        this.source = this.context.createMediaStreamSource(this.stream);
        this.node = new this.browser.AudioWorkletNode(this.context, 'interview-pcm-capture');
        this.gain = this.context.createGain();
        this.gain.gain.value = 0; // Keep the worklet processing without playing mic audio.
        this.node.port.onmessage = ({ data: packet }) => this.packet(packet);
        this.source.connect(this.node);
        this.node.connect(this.gain);
        this.gain.connect(this.context.destination);
        this.onState({
          phase: 'recording',
          notice: 'Listening · your words appear here as you speak.',
          waiting: false,
          live: true,
        });
        this.later(120000, () => this.finish(false));
      } else if (event.type === 'transcript' && typeof event.text === 'string') {
        if (event.final) {
          this.finalText = join(this.finalText, event.text);
          this.interim = '';
        } else this.interim = event.text;
        const preview = join(this.finalText, this.interim);
        this.onPreview?.(preview.slice(0, 10000));
        if (preview.length > 10000)
          return this.fail('Answer limit reached. Review the visible text before sending.');
        // Provider-confirmed words are required before local silence can submit a turn.
        if (preview.trim()) this.heard = true;
      } else if (event.type === 'done' && this.finishing) {
        const text = this.finalText;
        this.cancel();
        if (!text.trim())
          return this.onError('No clear speech detected. Resume voice when you are ready.', false);
        this.onText(text, this.submit);
      }
    } catch {
      this.fail('Live voice returned an invalid response. Resume voice to retry.');
    }
  }
  packet(packet) {
    if (this.cancelled) return;
    if (packet.type === 'flushed') {
      if (!this.finishing) return;
      this.socket.send(JSON.stringify({ type: 'finish' }));
      this.releaseMic();
      return;
    }
    if (packet.type !== 'audio' || this.socket?.readyState !== 1) return;
    if (this.socket.bufferedAmount > 64000)
      return this.fail('Network is too slow for live voice. Your visible text is preserved.');
    this.socket.send(packet.buffer);
    if (this.finishing) return;
    const active = packet.rms > 0.018;
    if (active) {
      this.voiced += packet.ms;
      this.quiet = 0;
      this.onActivity?.();
    } else {
      this.voiced = 0;
      this.quiet += packet.ms;
    }
    const waiting = this.heard && !active;
    if (waiting !== this.waiting) {
      this.waiting = waiting;
      this.onState({ waiting });
    }
    if (this.autoSend && this.heard && this.quiet >= this.silenceMs) this.finish(true);
  }
  finish(submit = false) {
    if (this.cancelled || this.finishing || !this.node) return;
    this.finishing = true;
    this.submit = submit;
    this.onState({ phase: 'transcribing', waiting: false, notice: 'Finishing your answer…' });
    this.node.port.postMessage({ type: 'flush' });
    this.later(12000, () =>
      this.fail('Final transcript timed out. Review your visible text before sending.'),
    );
  }
}
