export async function transcribeAudio(blob, { language, locale, signal }) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192)
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  let response;
  try {
    response = await fetch('/api/interviewer/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        audio: btoa(binary),
        mimeType: blob.type.split(';')[0],
        language,
        locale,
      }),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error(
      'Transcription server is unreachable. Start npm run dev:agent, then retry the recording.',
    );
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Voice transcription is unavailable. Restart the interview server and retry.');
  }
  if (!response.ok) throw new Error(data.error || 'Transcription failed. Retry the recording.');
  if (typeof data.text !== 'string') throw new Error('Invalid transcript. Retry the recording.');
  return data.text;
}
