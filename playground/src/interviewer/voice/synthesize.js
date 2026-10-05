export async function synthesizeAudio(text, { voice, signal }) {
  let response;
  try {
    response = await fetch('/api/interviewer/speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Speech server is unreachable. Start npm run dev:agent, then tap Replay.');
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Speech generation failed. Tap Replay to retry.');
  }
  if (!response.headers.get('content-type')?.startsWith('audio/wav'))
    throw new Error('Speech service returned no audio. Restart the interview server.');
  const blob = await response.blob();
  if (!blob.size || blob.size > 8 * 1024 * 1024)
    throw new Error('Speech audio is too large or empty.');
  return blob;
}
