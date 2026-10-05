/* global AudioWorkletProcessor, registerProcessor */
// Capture only: fixed 100 ms PCM packets. No speech recognition runs in the browser.
class PcmCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.samples = new Int16Array(1600);
    this.count = 0;
    this.energy = 0;
    this.stopped = false;
    this.port.onmessage = ({ data }) => {
      if (data.type !== 'flush') return;
      this.flush();
      this.stopped = true;
      this.port.postMessage({ type: 'flushed' });
    };
  }
  flush() {
    if (!this.count) return;
    const buffer = new ArrayBuffer(this.count * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < this.count; i++) view.setInt16(i * 2, this.samples[i], true);
    this.port.postMessage(
      { type: 'audio', buffer, rms: Math.sqrt(this.energy / this.count), ms: this.count / 16 },
      [buffer],
    );
    this.count = 0;
    this.energy = 0;
  }
  process(inputs) {
    if (this.stopped) return false;
    const channel = inputs[0]?.[0];
    if (channel)
      for (const sample of channel) {
        const value = Math.max(-1, Math.min(1, sample));
        this.samples[this.count++] = Math.round(value * (value < 0 ? 32768 : 32767));
        this.energy += value * value;
        if (this.count === this.samples.length) this.flush();
      }
    return true;
  }
}
registerProcessor('interview-pcm-capture', PcmCapture);
