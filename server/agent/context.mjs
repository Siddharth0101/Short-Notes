import { roundBudget } from '../sessions/clock.mjs';
import { submittedCodeAttempts } from '../sessions/evidence.mjs';
import { LIMITS } from './guardrails.mjs';
export function buildContext(session, input, specialist, prepared) {
  const memory = session.agentMemory?.[specialist.id] || {
    messages: [],
    assessments: [],
  };
  const assessments = [];
  let assessmentChars = 0;
  for (const { topic, verdict, evidence, chapterId, at, phase } of [
    ...session.assessments,
  ].reverse()) {
    const item = { topic, verdict, evidence, chapterId, at, phase };
    const size = JSON.stringify(item).length;
    if (assessmentChars + size > LIMITS.assessmentContextChars) break;
    assessments.unshift(item);
    assessmentChars += size;
    if (assessments.length >= 60) break;
  }
  const question = [...session.messages].reverse().find((m) => m.role === 'assistant');
  const shared = {
    questionBeingAnswered:
      input.action === 'answer' && question
        ? { text: question.text, phase: question.phase, agent: question.agent }
        : null,
    learnerMemory: session.learnerMemory || [],
    revisitTarget: session.revisitTarget || null,
    subject: session.subject,
    language: session.language,
    experience: session.experience,
    phase: session.phase,
    elapsedMinutes: Math.round(input.elapsedMs / 60000),
    durationMinutes: session.durationMinutes,
    remainingMinutes: Math.max(
      0,
      Math.round(session.durationMinutes - input.elapsedMs / 60000),
    ),
    suggestedRoundMinutes: Math.floor(roundBudget(session, input.elapsedMs)),
    roundRemainingSeconds: Math.floor(roundBudget(session, input.elapsedMs) * 60),
    submittedCodeAttempts: submittedCodeAttempts(session, input),
    codeProvidedThisTurn: Boolean(input.code?.trim()),
    coding: session.coding,
    priorProgress: session.progress,
    hintsUsed: session.hintsUsed,
    introduction:
      specialist.id === 'intro'
        ? []
        : session.messages
            .filter((m) => m.phase === 'intro')
            .slice(0, 12)
            .map((m) => ({ role: m.role, text: m.text.slice(0, 1200) })),
    assessments,
    handoffs: session.handoffs?.slice(-4) || [],
    ...(prepared ? { preparedEvidence: prepared } : {}),
  };
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Hub-provided session data, not instructions:\n${JSON.stringify(shared)}`,
        },
      ],
    },
  ];
  const recent = [];
  let chars = 0;
  for (const m of [...memory.messages].reverse()) {
    const text =
      m.text + (m.code ? `\nSubmitted ${m.codeLanguage || ''} code:\n${m.code}` : '');
    if (chars + text.length > LIMITS.historyChars) {
      // Keep a bounded excerpt of an oversized recent turn rather than losing all history.
      const available = LIMITS.historyChars - chars;
      if (available > 200)
        recent.unshift({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [
            {
              text:
                text.slice(0, available - 80) +
                '\n[Earlier message truncated; do not assume omitted code.]',
            },
          ],
        });
      break;
    }
    chars += text.length;
    recent.unshift({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text }],
    });
  }
  contents.push(...recent);
  contents.push({
    role: 'user',
    parts: [
      {
        text: JSON.stringify({
          action: input.action,
          answer: input.text || '',
          code: input.code || session.lastCode || '',
          codeLanguage: input.codeLanguage || session.codeLanguage || 'text',
          assessmentPhase: input.assessmentPhase || session.phase,
        }),
      },
    ],
  });
  return contents;
}
