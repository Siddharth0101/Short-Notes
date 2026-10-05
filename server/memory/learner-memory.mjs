import { JsonSessionStore } from '../storage/json-session-store.mjs';

const clip = (value, max) => (typeof value === 'string' ? value.slice(0, max) : '');
const newestFirst = (a, b) =>
  b.at - a.at ||
  (a.sessionId === b.sessionId
    ? Number(b.id.split(':').at(-1)) - Number(a.id.split(':').at(-1))
    : b.sessionId.localeCompare(a.sessionId));
export const topicKey = (topic) =>
  clip(topic, 150)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

// Committed sessions are the only source of truth: no second write to drift or duplicate.
// This repository is for the existing single local learner, not a multi-user service.
export class LearnerMemory {
  constructor(source) {
    this.source = typeof source === 'string' ? new JsonSessionStore(source) : source;
  }
  async retrieve(subject) {
    const topics = new Map();
    for await (const session of this.source.assessmentSessions(subject)) {
      if (!session || session.subject !== subject || !Array.isArray(session.assessments))
        continue;
      for (const [index, a] of session.assessments.entries()) {
        if (
          !a ||
          !['theory', 'coding'].includes(a.phase) ||
          !['correct', 'partial', 'incorrect'].includes(a.verdict) ||
          !Number.isFinite(a.at) ||
          !topicKey(a.topic)
        )
          continue;
        const key = `${a.phase}:${topicKey(a.topic)}`;
        const event = {
          id: `${session.id}:${index}`,
          sessionId: session.id,
          topic: clip(a.topic, 150),
          phase: a.phase,
          at: a.at,
          verdict: a.verdict,
          evidence: clip(a.evidence, 900),
          chapterId: clip(a.chapterId, 150),
          question: clip(a.question, 800),
          answer: clip(a.answer, 900),
          correction: clip(a.correction, 1200),
        };
        const history = [...(topics.get(key) || []), event].sort(newestFirst).slice(0, 2);
        topics.set(key, history);
      }
    }
    // Latest verdict wins; an older mistake never becomes the current verdict.
    const selected = [...topics.values()]
      .map(([latest, previous]) => ({
        ...latest,
        previous: previous
          ? {
              at: previous.at,
              verdict: previous.verdict,
              evidence: previous.evidence,
            }
          : null,
        improved: latest.verdict === 'correct' && !!previous && previous.verdict !== 'correct',
      }))
      .sort(newestFirst);
    const result = [];
    let size = 0;
    for (const item of selected) {
      const length = JSON.stringify(item).length;
      if (result.length >= 24) break;
      if (size + length > 20000) continue;
      result.push(item);
      size += length;
    }
    return result;
  }
}

export function applyMemoryReminder(reply, args, session, action, assessmentPhase) {
  const memories = session.learnerMemory || [];
  let earlier;
  if (args.revisitMemoryId) {
    earlier = memories.find(
      (item) => item.id === args.revisitMemoryId && item.phase === session.phase,
    );
    if (!earlier || !['theory', 'coding'].includes(session.phase))
      throw new Error(
        'Revisit must reference a supplied memory from the current technical round.',
      );
  }
  const assessed =
    reply.assessment &&
    memories.find(
      (item) =>
        item.phase === assessmentPhase &&
        topicKey(item.topic) === topicKey(reply.assessment.topic),
    );
  // Assessing the current answer takes priority over announcing a different next topic.
  const reference = assessed || earlier;
  if (!reference) return reply;
  const date = new Date(reference.at).toISOString().slice(0, 10);
  const sameSession = reference.sessionId === session.id;
  const english = session.language === 'english';
  const when = sameSession
    ? english
      ? 'earlier in this interview'
      : 'isi interview mein pehle'
    : date;
  let reminder = english
    ? `We covered “${reference.topic}” ${when}.`
    : `“${reference.topic}” humne ${when} discuss kiya tha.`;
  if (assessed && action === 'answer') {
    if (assessed.verdict !== 'correct' && reply.assessment.verdict === 'correct')
      reminder += english
        ? ' Your answer is correct this time—good improvement.'
        : ' Is baar tumhara answer sahi hai—achha improvement.';
    else if (assessed.verdict !== 'correct' && reply.assessment.verdict !== 'correct')
      reminder += english
        ? ' Your answer still needs work; let’s revisit the explanation.'
        : ' Answer mein abhi bhi gap hai; explanation dobara dekhte hain.';
    else if (reply.assessment.verdict !== 'correct')
      reminder += english
        ? ' Your earlier answer was correct; this answer has a gap to clarify.'
        : ' Pehle answer sahi tha; is answer ka gap clear karte hain.';
  } else {
    reminder += english
      ? ' Let’s check your understanding again.'
      : ' Chalo understanding dobara check karte hain.';
  }
  reply.message = `${reminder}\n\n${reply.message}`;
  reply.speech = `${reminder} ${reply.speech}`;
  reply.memoryReference = {
    id: reference.id,
    topic: reference.topic,
    at: reference.at,
  };
  return reply;
}
