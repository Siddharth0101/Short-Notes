import { AgentError } from '../agent/errors.mjs';
import { QuotaError } from './quota.mjs';
import { AvailabilityError } from './availability.mjs';

export function reasoningModels(env = process.env) {
  const primary = env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const fallback = env.GEMINI_FALLBACK_MODELS ?? '';
  const models = [
    ...new Set([
      primary,
      ...fallback
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    ]),
  ];
  if (models.length > 3 || models.some((model) => !/^[a-zA-Z0-9._-]{1,100}$/.test(model)))
    throw new AgentError(
      'Configure one GEMINI_MODEL and at most two valid GEMINI_FALLBACK_MODELS.',
      503,
    );
  return models;
}

// Per-process cooldowns belong to the provider boundary, not learner memory.
// A model is pinned for an entire attempt; signed tool histories never cross models.
export class ModelRouter {
  constructor({ now = Date.now } = {}) {
    this.now = now;
    this.cooldowns = new Map();
  }
  async run(attempt, { models = reasoningModels(), signal } = {}) {
    const attempts = [];
    for (const [model, entry] of this.cooldowns)
      if (entry.until <= this.now()) this.cooldowns.delete(model);
    for (const [index, model] of models.entries()) {
      if (signal?.aborted)
        throw new AgentError('Interview turn timed out. Your draft is preserved.', 503);
      const cooldown = this.cooldowns.get(model);
      if (cooldown?.until > this.now()) {
        attempts.push({ model, status: 'cooldown' });
        continue;
      }
      try {
        const canFailover = models
          .slice(index + 1)
          .some((next) => !(this.cooldowns.get(next)?.until > this.now()));
        const result = await attempt(model, { canFailover });
        attempts.push({ model, status: 'ok' });
        return {
          result,
          attempts,
          routing: { preferredModel: models[0], model, fallback: model !== models[0] },
        };
      } catch (error) {
        if (!(error instanceof QuotaError) && !(error instanceof AvailabilityError))
          throw error;
        const unavailable = error instanceof AvailabilityError;
        const until = this.now() + error.retryAfterMs;
        this.cooldowns.set(model, { until, daily: error.daily, unavailable });
        // Bound state even if development repeatedly changes the configured model list.
        while (this.cooldowns.size > 32)
          this.cooldowns.delete(this.cooldowns.keys().next().value);
        attempts.push({
          model,
          status: unavailable ? 'unavailable' : error.daily ? 'daily-quota' : 'rate-limit',
        });
      }
    }
    const availableAt = Math.min(
      ...models.map((model) => this.cooldowns.get(model)?.until || this.now() + 60000),
    );
    const daily = models.every((model) => this.cooldowns.get(model)?.daily);
    if (models.some((model) => this.cooldowns.get(model)?.unavailable))
      throw new AvailabilityError(
        'No configured interviewer model is available right now (provider load or quota). Your answer is preserved. Wait before retrying.',
        { retryAfterMs: Math.max(1000, availableAt - this.now()) },
      );
    throw new QuotaError(
      daily
        ? 'All configured interviewer models reached their daily quota. Your answer is preserved. Retry after the quota reset at midnight Pacific time, or check AI Studio.'
        : 'All configured interviewer models are cooling down after quota errors. Your answer is preserved. Wait before retrying, or check AI Studio; daily quotas reset at midnight Pacific time.',
      { retryAfterMs: Math.max(1000, availableAt - this.now()), daily },
    );
  }
}
export const reasoningRouter = new ModelRouter();
