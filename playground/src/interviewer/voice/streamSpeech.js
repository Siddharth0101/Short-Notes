// Transport only: browser APIs play server-generated audio, never synthesize speech.
export async function streamAudio(text, { voice, signal, onAudio, fetchImpl = fetch }) {
  const response = await fetchImpl('/api/interviewer/speech/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice }),
    signal,
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Speech generation failed. Tap Replay to retry.');
  }
  if (
    !response.headers.get('content-type')?.startsWith('application/x-ndjson') ||
    !response.body
  )
    throw new Error('Streaming speech is unavailable. Restart the interview server.');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const chunks = [];
  let buffer = '',
    received = 0,
    audioBytes = 0;
  try {
    while (true) {
      signal?.throwIfAborted();
      const { value, done } = await reader.read();
      if (done) throw new Error('Speech stream ended early. Tap Replay to retry.');
      received += value.length;
      if (received > 12 * 1024 * 1024) throw new Error('Speech stream is too large.');
      buffer += decoder.decode(value, { stream: true });
      if (buffer.length > 2 * 1024 * 1024) throw new Error('Speech chunk is too large.');
      let end;
      while ((end = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 1);
        if (!line.trim()) continue;
        const event = JSON.parse(line);
        if (event.type === 'error') throw new Error(event.error || 'Speech was interrupted.');
        if (event.type === 'done') {
          if (!audioBytes) throw new Error('Speech returned no audio.');
          return wav(chunks, audioBytes);
        }
        if (
          event.type !== 'audio' ||
          event.sampleRate !== 24000 ||
          typeof event.data !== 'string'
        )
          throw new Error('Invalid speech chunk.');
        const bytes = Uint8Array.from(atob(event.data), (char) => char.charCodeAt(0));
        audioBytes += bytes.length;
        if (!bytes.length || bytes.length % 2 || audioBytes > 8 * 1024 * 1024)
          throw new Error('Invalid speech audio size.');
        chunks.push(bytes);
        onAudio(bytes);
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

function wav(chunks, size) {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const label = (offset, text) =>
    [...text].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  label(0, 'RIFF');
  view.setUint32(4, size + 36, true);
  label(8, 'WAVE');
  label(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 24000, true);
  view.setUint32(28, 48000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  label(36, 'data');
  view.setUint32(40, size, true);
  return new Blob([header, ...chunks], { type: 'audio/wav' });
}
