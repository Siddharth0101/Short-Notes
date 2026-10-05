import { specialists } from './specialists.mjs';
import { runAgent } from './runtime.mjs';
import { runRoutedTurn } from './routed-turn.mjs';
// The hub owns delegation. Specialists cannot change phases or write another agent's memory.
export async function runInterviewTurn(session, input, content, generate) {
  const next = specialists[session.phase];
  session.agentMemory ??= Object.fromEntries(
    Object.keys(specialists).map((id) => [id, { messages: [], assessments: [] }]),
  );
  session.handoffs ??= [];
  const previous = session.activeAgent;
  if (previous && previous !== next.id) {
    const memory = session.agentMemory[previous];
    session.handoffs.push({
      from: previous,
      to: next.id,
      at: Date.now(),
      assessedTopics: memory.assessments
        .map((a) => ({ topic: a.topic, verdict: a.verdict }))
        .slice(-12),
      lastExchange: memory.messages
        .slice(-2)
        .map((m) => ({ role: m.role, text: m.text.slice(0, 1000) })),
    });
  }
  const reply = generate
    ? await runAgent(session, input, content, generate, next)
    : await runRoutedTurn(session, input, content, next);
  session.activeAgent = next.id;
  return reply;
}
