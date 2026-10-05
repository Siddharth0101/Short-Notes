const MAX_BYTES = 2 * 1024 * 1024;
const FORMATS = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
export function canRecord(browser) {
  return Boolean(browser.MediaRecorder && browser.navigator?.mediaDevices?.getUserMedia);
}

// Independent capture adapter; owns its stream, timers, buffered audio and upload cancellation.
export class RecordedInput {
  constructor({
    browser,
    timers,
    transcribe,
    language,
    locale = 'auto',
    silenceMs,
    autoSend,
    onState,
    onText,
    onError,
    onActivity,
  }) {
    Object.assign(this, {
      browser,
      timers,
      transcribe,
      language,
      locale,
      silenceMs,
      autoSend,
      onState,
      onText,
      onError,
      onActivity,
    });
    this.jobs = new Set();
    this.cancelled = false;
    this.chunks = [];
    this.bytes = 0;
    this.finishing = false;
  }
  later(ms, fn) {
    const id = this.timers.setTimeout(() => {
      this.jobs.delete(id);
      if (!this.cancelled) fn();
    }, ms);
    this.jobs.add(id);
    return id;
  }
  clearTimers() {
    for (const id of this.jobs) this.timers.clearTimeout(id);
    this.jobs.clear();
  }
  releaseMic() {
    this.clearTimers();
    this.stream?.getTracks().forEach((track) => {
      track.onended = null;
      track.stop();
    });
    this.stream = null;
    try {
      this.source?.disconnect();
    } catch {
      /* Already disconnected. */
    }
    this.context?.close().catch(() => {});
    this.context = null;
  }
  cancel() {
    this.cancelled = true;
    this.request?.abort();
    if (this.recorder?.state !== 'inactive') {
      try {
        this.recorder?.stop();
      } catch {
        /* Already stopped. */
      }
    }
    this.releaseMic();
    this.chunks = [];
    this.blob = null;
  }
  fail(message, retryable = false) {
    if (this.cancelled) return;
    this.releaseMic();
    this.onError(message, retryable);
  }
  async start() {
    this.onState({
      phase: 'starting',
      notice: 'Allow microphone access, then speak. Audio is transcribed by Gemini.',
    });
    this.later(15000, () =>
      this.fail(
        'Microphone did not start. Allow it in the site permissions, then tap Speak again.',
      ),
    );
    try {
      const stream = await this.browser.navigator.mediaDevices.getUserMedia({
        audio: {
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
      this.clearTimers();
      const Recorder = this.browser.MediaRecorder;
      const mimeType = FORMATS.find((type) => Recorder.isTypeSupported?.(type));
      if (!mimeType)
        return this.fail(
          'This browser cannot record a supported audio format. Use Chrome or type your answer.',
        );
      this.recorder = new Recorder(stream, {
        mimeType,
        audioBitsPerSecond: 64000,
      });
      this.recorder.ondataavailable = ({ data }) => {
        if (this.cancelled || !data?.size) return;
        this.bytes += data.size;
        if (this.bytes > MAX_BYTES)
          return this.fail('Recording is too large. Try a shorter answer.');
        this.chunks.push(data);
      };
      this.recorder.onerror = () =>
        this.fail('Recording stopped unexpectedly. Check your microphone and try again.');
      this.recorder.onstop = () => {
        if (this.cancelled) return;
        this.releaseMic();
        if (!this.finishing)
          return this.fail('Microphone disconnected. Tap Speak to record again.');
        this.blob = new this.browser.Blob(this.chunks, {
          type: this.recorder.mimeType || mimeType,
        });
        this.chunks = [];
        if (!this.blob.size) return this.fail('No audio was recorded. Tap Speak and try again.');
        void this.upload();
      };
      for (const track of stream.getTracks())
        track.onended = () =>
          this.fail('Microphone disconnected. Check your input device and tap Speak.');
      this.recorder.start(1000);
      this.onState({
        phase: 'recording',
        notice:
          'Recording · tap Stop mic to turn your speech into editable text. Each clip can be up to 2 minutes.',
      });
      this.onActivity?.();
      this.monitorSilence();
      this.later(120000, () => this.finish(false));
    } catch (error) {
      if (this.cancelled) return;
      const message =
        error.name === 'NotAllowedError'
          ? 'Microphone permission is blocked. Allow Microphone in the address-bar site settings and your system settings, then tap Speak.'
          : error.name === 'NotFoundError'
            ? 'No microphone found. Connect an input device and tap Speak.'
            : 'Could not open the microphone. Check that another app is not using it, then tap Speak.';
      this.fail(message);
    }
  }
  monitorSilence() {
    if (!this.autoSend) return;
    const Context = this.browser.AudioContext || this.browser.webkitAudioContext;
    if (!Context) return;
    try {
      this.context = new Context();
      this.context.resume().catch(() => {});
      this.source = this.context.createMediaStreamSource(this.stream);
      const analyser = this.context.createAnalyser();
      analyser.fftSize = 1024;
      this.source.connect(analyser); // Never connect microphone audio to the speakers.
      const data = new Float32Array(analyser.fftSize);
      let voiced = 0,
        quiet = 0,
        heard = false;
      const check = () => {
        if (this.finishing) return;
        if (this.context?.state !== 'running') {
          this.later(100, check);
          return;
        }
        analyser.getFloatTimeDomainData(data);
        const rms = Math.sqrt(data.reduce((sum, n) => sum + n * n, 0) / data.length);
        if (rms > 0.025) {
          voiced += 100;
          quiet = 0;
          if (voiced >= 300) heard = true;
          this.onState({ waiting: false });
          this.onActivity?.();
        } else {
          voiced = 0;
          if (heard) quiet += 100;
          this.onState({ waiting: heard });
        }
        if (heard && quiet >= this.silenceMs) return this.finish(true);
        this.later(100, check);
      };
      this.later(100, check);
    } catch {
      /* Manual Stop mic still works when silence detection is unavailable. */
    }
  }
  finish(submit = false) {
    if (this.cancelled || this.finishing) return;
    this.finishing = true;
    this.submit = submit;
    this.clearTimers();
    this.onState({
      phase: 'transcribing',
      waiting: false,
      notice: 'Turning your recording into text…',
    });
    this.later(3000, () => this.fail('The recorder did not finish. Tap Speak to try again.'));
    try {
      this.recorder.stop();
    } catch {
      this.fail('Could not finish the recording. Tap Speak to try again.');
    }
  }
  async upload() {
    if (this.cancelled || !this.blob || this.uploading) return;
    this.uploading = true;
    this.request = new AbortController();
    this.onState({
      phase: 'transcribing',
      error: '',
      canRetryRecording: false,
      notice: 'Turning your recording into text…',
    });
    const timeout = this.later(50000, () => this.request.abort());
    try {
      const text = await this.transcribe(this.blob, {
        signal: this.request.signal,
        language: this.language,
        locale: this.locale,
      });
      if (!this.cancelled) this.onText(text, this.submit);
    } catch (error) {
      if (!this.cancelled) {
        this.submit = false; // A retried transcript is always reviewed before submission.
        this.fail(
          error.name === 'AbortError'
            ? 'Transcription timed out. Retry the recording.'
            : error.message || 'Transcription failed. Retry the recording.',
          true,
        );
      }
    } finally {
      this.timers.clearTimeout(timeout);
      this.jobs.delete(timeout);
      this.uploading = false;
    }
  }
}
