import { validateTool } from '../agent/guardrails.mjs';
import { searchNotes, getQuestions } from './knowledge.mjs';
import { assignCoding } from './interview.mjs';
const handlers = Object.freeze({
  search_notes: searchNotes,
  get_questions: getQuestions,
  assign_coding: assignCoding,
});
export function executeTool(name, args, session, content, allowedTools = Object.keys(handlers)) {
  validateTool(name, args, allowedTools);
  if (!Object.hasOwn(handlers, name)) throw new Error('Unknown executable tool.');
  return handlers[name](args, session, content);
}
