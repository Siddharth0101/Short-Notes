import { AgentError } from '../agent/errors.mjs';

export class QuotaError extends AgentError {
  constructor(message, { model, retryAfterMs = 60000, daily = false } = {}) {
    super(message, 429);
    this.model = model;
    this.retryAfterMs = retryAfterMs;
    this.daily = daily;
  }
}

// Gemini RPD resets at midnight America/Los_Angeles, including DST changes.
export function nextQuotaReset(now = Date.now()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  const parts = (date) =>
    Object.fromEntries(
      formatter
        .formatToParts(date)
        .filter(({ type }) => type !== 'literal')
        .map(({ type, value }) => [type, Number(value)]),
    );
  const current = parts(now);
  const midnight = Date.UTC(current.year, current.month - 1, current.day + 1);
  let guess = midnight + 8 * 3600000;
  for (let i = 0; i < 3; i++) {
    const local = parts(guess);
    const wall = Date.UTC(
      local.year,
      local.month - 1,
      local.day,
      local.hour,
      local.minute,
      local.second,
    );
    guess += midnight - wall;
  }
  return guess;
}

// Parse only a bounded error body, then retain numeric retry information. Raw messages,
// resource names, project identifiers, and credentials are never logged or forwarded.
export async function quotaFromResponse(
  response,
  model,
  label = 'Interviewer',
  now = Date.now(),
) {
  let retryAfterMs = 60000,
    daily = false;
  const header = response.headers?.get?.('retry-after');
  if (header) {
    const seconds = Number(header);
    const wait = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(header) - now;
    if (Number.isFinite(wait) && wait > 0) retryAfterMs = wait;
  }
  try {
    const chunks = [];
    let size = 0;
    for await (const chunk of response.body || []) {
      size += chunk.length;
      if (size > 65536) throw new Error('Quota response exceeded its limit');
      chunks.push(chunk);
    }
    const error = JSON.parse(Buffer.concat(chunks).toString('utf8')).error;
    for (const detail of Array.isArray(error?.details) ? error.details : []) {
      if (detail['@type']?.endsWith('RetryInfo')) {
        const match = /^(\d+(?:\.\d+)?)s$/.exec(detail.retryDelay || '');
        if (match) retryAfterMs = Math.max(retryAfterMs, Number(match[1]) * 1000);
      }
      if (detail['@type']?.endsWith('QuotaFailure'))
        for (const item of Array.isArray(detail.violations) ? detail.violations : [])
          if (/per[_-]?day|daily/i.test(`${item.quotaId || ''} ${item.quotaMetric || ''}`))
            daily = true;
    }
  } catch {
    // Missing/malformed quota metadata falls back to a bounded cooldown.
  }
  if (daily) retryAfterMs = Math.max(retryAfterMs, nextQuotaReset(now) - now);
  retryAfterMs = Math.max(1000, Math.min(retryAfterMs, 25 * 3600000));
  return new QuotaError(
    daily
      ? `${label} daily quota reached. Your answer is preserved. Daily quota resets at midnight Pacific time; check AI Studio for your project limits.`
      : `${label} quota or rate limit reached. Your answer is preserved. Wait and retry, or check this model's limits in AI Studio.`,
    { model, retryAfterMs, daily },
  );
}
