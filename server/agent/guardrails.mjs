import { applyMemoryReminder } from '../memory/learner-memory.mjs';
import { declarations } from './schemas.mjs';
import { AgentError } from './errors.mjs';
export const LIMITS = Object.freeze({
  rounds: 6,
  turnToolCalls: 12,
  toolResultChars: 24000,
  promptChars: 180000,
  assessmentContextChars: 16000,
  toolCallsPerRound: 8,
  turnMs: 90000,
  historyChars: 28000,
  answerChars: 10000,
  codeChars: 30000,
  messages: 240,
});
function validate(value, schema, path) {
  if (schema.type === 'OBJECT') {
    if (!value || typeof value !== 'object' || Array.isArray(value))
      throw new Error(`${path} must be an object.`);
    for (const key of schema.required || [])
      if (value[key] === undefined) throw new Error(`${path}.${key} is required.`);
    for (const [key, item] of Object.entries(value)) {
      if (!Object.hasOwn(schema.properties, key))
        throw new Error(`Unexpected argument ${path}.${key}.`);
      validate(item, schema.properties[key], `${path}.${key}`);
    }
  } else if (schema.type === 'STRING') {
    if (typeof value !== 'string' || value.length > 16000)
      throw new Error(`${path} must be a bounded string.`);
    if (schema.enum && !schema.enum.includes(value))
      throw new Error(`${path} has an unsupported value.`);
  } else if (schema.type === 'ARRAY') {
    if (!Array.isArray(value) || value.length > 12)
      throw new Error(`${path} must be a bounded array.`);
    value.forEach((item, i) => validate(item, schema.items, `${path}[${i}]`));
  }
}
export function validateTool(name, args, allowedTools) {
  const definition = declarations.find((d) => d.name === name);
  if (!definition || !allowedTools.includes(name))
    throw new Error('This specialist is not allowed to call that tool.');
  validate(args, definition.parameters, name);
  return args;
}
export function validateInput(input) {
  if (typeof input.requestId !== 'string' || !input.requestId || input.requestId.length > 100)
    throw new AgentError('A request ID is required.', 400);
  if (
    !['answer', 'hint', 'next', 'transition', 'end', 'pause', 'resume'].includes(input.action)
  )
    throw new AgentError('Unknown interview action.', 400);
  if (
    input.text !== undefined &&
    (typeof input.text !== 'string' || input.text.length > LIMITS.answerChars)
  )
    throw new AgentError('Answer is too long (maximum 10,000 characters).', 400);
  if (
    input.code !== undefined &&
    (typeof input.code !== 'string' || input.code.length > LIMITS.codeChars)
  )
    throw new AgentError('Code is too long (maximum 30,000 characters).', 400);
  if (
    input.codeLanguage !== undefined &&
    (typeof input.codeLanguage !== 'string' || input.codeLanguage.length > 30)
  )
    throw new AgentError('Invalid code language.', 400);
  if (input.action === 'answer' && !input.text?.trim() && !input.code?.trim())
    throw new AgentError('Say or type an answer first.', 400);
}
export function validateReply(args, session, content, action, assessmentPhase = session.phase) {
  validateTool('respond', args, ['respond']);
  if (session.revisitTarget && args.revisitMemoryId !== session.revisitTarget.id)
    throw new Error(
      'The hub selected a prior topic to retest. Ask about revisitTarget.topic and set revisitMemoryId to revisitTarget.id.',
    );

  if (!args.message.trim() || !args.speech.trim())
    throw new Error('respond requires nonempty message and speech.');
  if (session.phase === 'coding' && !session.coding && action !== 'end')
    throw new Error('Assign a coding task before responding in the coding phase.');
  const validChapter = (id) =>
    content.notes.some((n) => n.id === id && n.track === session.subject);
  // Only real chapter links are allowed; prevent model-invented paths and external navigation.
  const message = args.message
    .slice(0, 14000)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (whole, label, url) =>
      url.startsWith('/notes/') && validChapter(url.slice(7)) ? whole : label,
    );
  const reply = {
    message,
    speech: args.speech.slice(0, 5000),
    reviewChapterIds: [...new Set((args.reviewChapterIds || []).filter(validChapter))].slice(
      0,
      8,
    ),
  };
  const a = args.assessment;
  if (
    action === 'answer' &&
    ['theory', 'coding'].includes(assessmentPhase) &&
    a &&
    a.topic.trim() &&
    a.evidence.trim()
  ) {
    reply.assessment = {
      topic: a.topic.slice(0, 150),
      verdict: a.verdict,
      evidence: a.evidence.slice(0, 1500),
      chapterId: validChapter(a.chapterId) ? a.chapterId : null,
    };
  }
  return applyMemoryReminder(reply, args, session, action, assessmentPhase);
}
