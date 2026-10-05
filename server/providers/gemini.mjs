import { setTimeout as delay } from 'node:timers/promises';
import { declarations } from '../agent/schemas.mjs';
import { AgentError } from '../agent/errors.mjs';
import { quotaFromResponse } from './quota.mjs';
import { availabilityFromResponse } from './availability.mjs';

function jsonSchema(value) {
  if (Array.isArray(value)) return value.map(jsonSchema);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      key === 'type' ? item.toLowerCase() : jsonSchema(item),
    ]),
  );
}

// Keep provider-specific wire formats at this boundary. The runtime uses neutral messages/tool parts.
export function interactionHistory(contents) {
  return contents.flatMap((message) => {
    if (message.providerSteps) return message.providerSteps;
    return message.parts.flatMap((part) => {
      if (part.functionResponse) {
        const call = part.functionResponse;
        return [
          {
            type: 'function_result',
            name: call.name,
            call_id: call.id,
            result: [{ type: 'text', text: JSON.stringify(call.response) }],
          },
        ];
      }
      if (part.text)
        return [
          {
            type: message.role === 'model' ? 'model_output' : 'user_input',
            content: [{ type: 'text', text: part.text }],
          },
        ];
      return [];
    });
  });
}

export async function geminiGenerate({
  system,
  contents,
  signal,
  forceRespond = false,
  tools = declarations,
  model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
  canFailover = false,
}) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AgentError('GEMINI_API_KEY is missing in the repository .env file.', 503);
  if (!/^[a-zA-Z0-9._-]+$/.test(model))
    throw new AgentError('Invalid GEMINI_MODEL setting.', 503);
  const body = JSON.stringify({
    model,
    store: false,
    system_instruction: system,
    input: interactionHistory(contents),
    tools: tools.map((d) => ({ type: 'function', ...d, parameters: jsonSchema(d.parameters) })),
    generation_config: {
      temperature: 0.55,
      max_output_tokens: 4096,
      tool_choice: forceRespond
        ? { allowed_tools: { mode: 'any', tools: ['respond'] } }
        : 'any',
    },
  });
  let response;
  try {
    // With a usable backup, leave overload handling to the router immediately.
    // Without one, permit one same-model availability retry within the turn deadline.
    for (let attempt = 0; attempt < 2; attempt++) {
      response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body,
        signal,
      });
      if (![502, 503, 504].includes(response.status) || canFailover || attempt === 1) break;
      await response.body?.cancel();
      await delay(600 + Math.floor(Math.random() * 400), undefined, { signal });
    }
  } catch {
    throw new AgentError(
      'Gemini could not be reached in time. Your answer is preserved; try again.',
      503,
    );
  }
  if (!response.ok) {
    if (response.status === 429) throw await quotaFromResponse(response, model);
    if ([502, 503, 504].includes(response.status)) {
      await response.body?.cancel();
      throw availabilityFromResponse(response);
    }
    const message = [400, 401, 403, 404].includes(response.status)
      ? 'Gemini rejected the request. Check the API key, project permissions and selected model.'
      : 'Gemini is temporarily unavailable. Your draft is preserved; you can pause the interview and retry shortly.';
    // Raw upstream bodies can contain sensitive request details. Never forward or log them.
    await response.body?.cancel();
    throw new AgentError(message, 502);
  }
  const data = await response.json(),
    steps = data.steps || [];
  const parts = steps.flatMap((step) =>
    step.type === 'function_call'
      ? [{ functionCall: { name: step.name, args: step.arguments, id: step.id } }]
      : step.type === 'model_output'
        ? (Array.isArray(step.content) ? step.content : [])
            .filter((c) => c.type === 'text')
            .map((c) => ({ text: c.text }))
        : [],
  );
  if (!parts.length)
    throw new AgentError('Gemini returned no interview response. Please retry.');
  // Replay exact steps, including signatures, when supplying function results in the next loop iteration.
  return { role: 'model', parts, providerSteps: steps };
}
