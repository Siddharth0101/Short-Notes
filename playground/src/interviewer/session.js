export const PHASES = ['intro', 'theory', 'coding', 'review'];
export const LABELS = {
  intro: 'Introduction',
  theory: 'Technical depth',
  coding: 'Machine coding',
  review: 'Review',
};
export const STAGES = ['05 min', '25 min', '25 min', '05 min'];
export function clock(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
export function defaultCodeLanguage(subject) {
  return ['java', 'spring-boot'].includes(subject)
    ? 'java'
    : ['react', 'react-native'].includes(subject)
      ? 'jsx'
      : 'javascript';
}
export function timing(session, now = Date.now()) {
  if (!session) return { remaining: 3600000, scheduled: 'intro' };
  const duration = session.durationMinutes * 60000;
  const spent = Math.min(
    duration,
    Math.max(0, session.elapsedMs) +
      (session.status === 'active' ? Math.max(0, now - session.runningSince) : 0),
  );
  return {
    remaining: duration - spent,
    scheduled:
      PHASES[
        Math.max(
          PHASES.indexOf(session.phase),
          spent < 300000 ? 0 : spent < 1800000 ? 1 : spent < 3300000 ? 2 : 3,
        )
      ],
  };
}
