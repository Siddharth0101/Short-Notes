import { executeTool } from '../tools/registry.mjs';

// Read-only evidence, prepared once per turn and reused across model failover.
// The normal scoped tools remain available when these small excerpts are insufficient.
export function prepareContext(session, input, content, specialist, budget) {
  if (!['theory', 'coding'].includes(specialist.id)) return null;
  const previous = [...session.messages].reverse().find((m) => m.role === 'assistant');
  const query = [session.revisitTarget?.topic, previous?.text, input.text, session.subject]
    .filter(Boolean)
    .join(' ')
    .replace(/[^\p{L}\p{N}_+#.-]+/gu, ' ')
    .slice(0, 300);
  const prepared = { notes: [], questions: [], tools: [] };
  const read = (name, args) => {
    if (!specialist.allowedTools.includes(name)) return [];
    budget.toolCalls++;
    prepared.tools.push(name);
    return executeTool(name, args, session, content, specialist.allowedTools);
  };
  prepared.notes = read('search_notes', { query })
    .slice(0, 2)
    .map((note) => ({
      id: note.id,
      title: note.title,
      excerpt: note.body.slice(0, 2000),
      truncated: note.body.length > 2000,
    }));
  // Once a task is assigned, its full requirements are already in the session.
  if (specialist.id === 'theory' || !session.coding) {
    prepared.questions = read('get_questions', {
      query,
      kind: specialist.id === 'coding' ? 'coding' : 'theory',
    })
      .slice(0, 2)
      .map((question) => ({
        id: question.id,
        question: question.question.slice(0, 600),
        noteId: question.noteId || null,
        prompt: question.promptCode?.slice(0, 1000) || '',
        privateAnswerGuide: String(question.answer || '').slice(0, 800),
        excerptOnly: true,
      }));
  }
  return prepared;
}
