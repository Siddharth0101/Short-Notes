// Explicit action metadata distinguishes assessed submissions from code sent for hints/end.
// Legacy sessions used fixed navigation labels; retain compatibility without rewriting history.
const navigationLabels = new Set([
  'Can I have a hint?',
  'End interview and review my performance.',
]);
export function submittedCodeAttempts(session, input) {
  const committed = session.messages.filter(
    (message) =>
      message.role === 'user' &&
      message.code?.trim() &&
      (message.action ? message.action === 'answer' : !navigationLabels.has(message.text)),
  ).length;
  return committed + (input.action === 'answer' && input.code?.trim() ? 1 : 0);
}
