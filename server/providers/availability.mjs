import { AgentError } from '../agent/errors.mjs';

// Only concrete upstream 502/503/504 responses qualify, never arbitrary transport errors.
export class AvailabilityError extends AgentError {
  constructor(
    message = 'The interviewer model is temporarily busy. Your draft is preserved.',
    { retryAfterMs = 30000 } = {},
  ) {
    super(message, 503);
    this.retryAfterMs = retryAfterMs;
  }
}

export function availabilityFromResponse(response) {
  const header = response.headers?.get?.('retry-after');
  const seconds = Number(header);
  const duration = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(header) - Date.now();
  return new AvailabilityError(undefined, {
    retryAfterMs:
      Number.isFinite(duration) && duration > 0
        ? Math.max(1000, Math.min(duration, 300000))
        : 30000,
  });
}
