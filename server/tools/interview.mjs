export function assignCoding(args, session, content) {
  if (session.phase !== 'coding')
    throw new Error('Coding assignment is only available in the coding phase.');
  if (session.coding) return session.coding;
  const q = content.questions.find(
    (q) =>
      q.id === args.questionId && q.track === session.subject && q.tags?.includes('machine-coding'),
  );
  if (!q) throw new Error('Select a coding question from get_questions for this subject.');
  session.coding = {
    id: q.id,
    title: q.question,
    prompt: q.promptCode || q.question,
    noteId: q.noteId || null,
  };
  return session.coding;
}
