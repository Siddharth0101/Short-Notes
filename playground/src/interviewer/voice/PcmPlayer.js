// Schedule PCM on the audio clock, not JS timers. A small buffer absorbs arrival jitter.
export class PcmPlayer {
  constructor(context, rate = 1) {
    this.context = context;
    this.rate = rate;
    this.sources = new Set();
    this.pending = [];
    this.pendingBytes = 0;
    this.totalBytes = 0;
    this.nextTime = 0;
    this.done = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  push(bytes) {
    if (this.closed || this.finished) return;
    this.totalBytes += bytes.length;
    if (this.totalBytes > 8 * 1024 * 1024 || bytes.length % 2)
      throw new Error('Invalid speech audio size.');
    this.pending.push(bytes);
    this.pendingBytes += bytes.length;
    if (this.pendingBytes >= 4800) this.flush(); // 100 ms; avoid hundreds of tiny sources.
  }
  flush() {
    if (!this.pendingBytes) return;
    const context = this.context;
    const buffer = context.createBuffer(1, this.pendingBytes / 2, 24000);
    const samples = buffer.getChannelData(0);
    let offset = 0;
    for (const bytes of this.pending) {
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      for (let i = 0; i < bytes.length; i += 2)
        samples[offset++] = view.getInt16(i, true) / 32768;
    }
    this.pending = [];
    this.pendingBytes = 0;
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = this.rate;
    source.connect(context.destination);
    this.sources.add(source);
    source.onended = () => {
      source.disconnect();
      this.sources.delete(source);
      this.complete();
    };
    const start = Math.max(this.nextTime, context.currentTime + 0.08);
    this.nextTime = start + buffer.duration / this.rate;
    source.start(start);
  }
  finish() {
    this.flush();
    this.finished = true;
    this.complete();
    return this.done;
  }
  complete() {
    if (this.finished && !this.sources.size) this.resolve();
  }
  cancel() {
    this.closed = true;
    for (const source of this.sources) {
      source.onended = null;
      source.stop();
      source.disconnect();
    }
    this.sources.clear();
    this.pending = [];
    this.pendingBytes = 0;
    this.resolve();
  }
}
