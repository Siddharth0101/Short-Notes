import { AgentError } from '../agent/errors.mjs';
import { quotaFromResponse } from './quota.mjs';

// Dedicated speech services are outside the interviewer reasoning/tool loop.
// A single bounded call per clip; cancellation and quota errors never trigger hidden retries.
export async function speechInteraction(
  body,
  { signal, fetchImpl = fetch, label = 'Speech', maxBytes = 12000000 } = {},
) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AgentError('Configure GEMINI_API_KEY on the server to use speech.', 503);
  if (!/^[a-zA-Z0-9._-]+$/.test(body.model))
    throw new AgentError('Invalid speech model setting.', 503);
  let response;
  try {
    response = await fetchImpl(
      'https://generativelanguage.googleapis.com/v1beta/interactions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({ ...body, store: false }),
        signal: signal
          ? AbortSignal.any([signal, AbortSignal.timeout(45000)])
          : AbortSignal.timeout(45000),
      },
    );
  } catch {
    throw new AgentError(`${label} could not connect or timed out. Please retry.`, 503);
  }
  if (!response.ok) {
    if (response.status === 429) throw await quotaFromResponse(response, body.model, label);
    await response.body?.cancel();
    throw new AgentError(
      `${label} is unavailable. Check the speech model and API key, then retry.`,
      502,
    );
  }
  try {
    // Bound the entire response, including base64 audio, before parsing it.
    const chunks = [];
    let bytes = 0;
    for await (const chunk of response.body) {
      bytes += chunk.length;
      if (bytes > maxBytes) throw new Error('Speech response too large');
      chunks.push(chunk);
    }
    const data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    return (data.steps || [])
      .filter((step) => step.type === 'model_output')
      .flatMap((step) => (Array.isArray(step.content) ? step.content : []));
  } catch {
    throw new AgentError(
      `${label} returned an invalid or oversized response. Please retry.`,
      502,
    );
  }
}
