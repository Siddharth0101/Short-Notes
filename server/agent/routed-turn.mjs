import { runAgent } from './runtime.mjs';
import { LIMITS } from './guardrails.mjs';
import { geminiGenerate } from '../providers/gemini.mjs';
import { reasoningRouter } from '../providers/model-routing.mjs';
import { prepareContext } from './prepare-context.mjs';

export async function runRoutedTurn(
  session,
  input,
  content,
  specialist,
  {
    generate = geminiGenerate,
    router = reasoningRouter,
    models,
    signal = AbortSignal.timeout(LIMITS.turnMs),
  } = {},
) {
  const budget = { rounds: 0, toolCalls: 0 };
  const preparationStarted = Date.now();
  const prepared = prepareContext(session, input, content, specialist, budget);
  const preparationMs = Date.now() - preparationStarted;
  const { result, routing, attempts } = await router.run(
    async (model, { canFailover }) => {
      // Failed attempts may assign a coding task. Discard that tentative state and
      // rebuild context before changing models; only the successful attempt commits.
      const working = structuredClone(session);
      const reply = await runAgent(
        working,
        input,
        content,
        (request) => generate({ ...request, model, canFailover }),
        specialist,
        { signal, budget, model, prepared },
      );
      return { working, reply };
    },
    { models, signal },
  );
  Object.assign(session, result.working);
  result.reply.trace.modelAttempts = attempts;
  result.reply.trace.preparationMs = preparationMs;
  return { ...result.reply, modelRouting: routing };
}
