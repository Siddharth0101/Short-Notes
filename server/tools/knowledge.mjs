import { search } from '../knowledge/repository.mjs';
export function searchNotes(args, session, content) {
  return search(content.notes, session.subject, args.query.slice(0, 300), 3).map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body.slice(0, 8000),
  }));
}
export function getQuestions(args, session, content) {
  if (session.phase === 'theory' && args.kind !== 'theory')
    throw new Error('The theory specialist may only retrieve theory questions.');
  return search(
    content.questions.filter(
      (q) => Boolean(q.tags?.includes('machine-coding')) === (args.kind === 'coding'),
    ),
    session.subject,
    (args.query || '').slice(0, 300),
    4,
  );
}
