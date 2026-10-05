import { AgentError } from '../agent/errors.mjs';
import { validateSpeech } from './synthesis.mjs';
import { quotaFromResponse } from './quota.mjs';

// One provider request per spoken turn. Gemini streams raw mono PCM16 at 24 kHz.
export async function* streamSpeech(input, { signal, fetchImpl = fetch } = {}) {
  const { text, voice } = validateSpeech(input);
  const model = process.env.GEMINI_SPEECH_MODEL || 'gemini-3.8-flash-lite-tts';
  const key = process.env.GEMINI_API_KEY;
  if (!key || !/^[a-zA-Z0-9._-]+$/.test(model))
    throw new AgentError('Configure the speech model and API key on the server.', 503);
  const deadline = AbortSignal.any([AbortSignal.timeout(45000), ...(signal ? [signal] : [])]);
  let response;
  try {
    response = await fetchImpl(
      'https://generativelanguage.googleapis.com/v1beta/interactions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          model,
          store: false,
          stream: true,
          input: [{ type: 'user_input', content: [{ type: 'text', text }] }],
          response_format: { type: 'audio', mime_type: 'audio/l16', sample_rate: 24000 },
          generation_config: { speech_config: [{ voice }] },
        }),
        signal: deadline,
      },
    );
  } catch {
    throw new AgentError('Speech could not connect or timed out. Tap Replay to retry.', 503);
  }
  if (!response.ok) {
    if (response.status === 429)
      throw await quotaFromResponse(response, model, 'Speech generation');
    await response.body?.cancel();
    throw new AgentError('Speech is unavailable. Check the speech model and API key.', 502);
  }
  let audioBytes = 0;
  try {
    for await (const event of readEvents(response.body)) {
      deadline.throwIfAborted();
      if (event.event_type === 'step.delta' && event.delta?.type === 'audio') {
        const { data, mime_type: mime } = event.delta;
        if (
          typeof data !== 'string' ||
          !/^[A-Za-z0-9+/]*={0,2}$/.test(data) ||
          (mime && !/^audio\/l16(?:;|$)/i.test(mime))
        )
          throw new Error('Invalid PCM');
        const bytes = Buffer.from(data, 'base64');
        audioBytes += bytes.length;
        if (audioBytes > 8 * 1024 * 1024 || bytes.length % 2)
          throw new Error('Invalid PCM size');
        if (bytes.length) yield { type: 'audio', data, sampleRate: 24000 };
      } else if (event.event_type === 'interaction.completed') {
        if (!audioBytes || event.interaction?.status !== 'completed')
          throw new Error('Incomplete speech');
        return;
      } else if (['error', 'interaction.failed'].includes(event.event_type)) {
        throw new Error('Provider stream failed');
      }
    }
    throw new Error('Speech stream ended early');
  } catch {
    throw new AgentError(
      'Speech was interrupted or returned invalid audio. Tap Replay to retry.',
      502,
    );
  }
}

async function* readEvents(body) {
  if (!body) throw new Error('Missing speech stream');
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '',
    total = 0,
    frame = [];
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > 12 * 1024 * 1024) throw new Error('Oversized speech stream');
      buffer += decoder.decode(value, { stream: true });
      if (buffer.length > 2 * 1024 * 1024) throw new Error('Oversized speech event');
      let end;
      while ((end = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, end).replace(/\r$/, '');
        buffer = buffer.slice(end + 1);
        if (!line) {
          if (frame.length) {
            const data = frame.join('\n');
            frame = [];
            if (data !== '[DONE]') yield JSON.parse(data);
          }
        } else if (line.startsWith('data:')) {
          frame.push(line.slice(5).trimStart());
        }
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
