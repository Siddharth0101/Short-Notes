export const PHASES = ['intro', 'theory', 'coding', 'review'];
export function elapsed(session, now = Date.now()) {
  return Math.min(
    session.durationMinutes * 60000,
    session.elapsedMs +
      (session.status === 'active' ? Math.max(0, now - session.runningSince) : 0),
  );
}
export function phaseAt(session, now = Date.now()) {
  const fraction = elapsed(session, now) / (session.durationMinutes * 60000);
  const timed = fraction < 5 / 60 ? 0 : fraction < 30 / 60 ? 1 : fraction < 55 / 60 ? 2 : 3;
  return PHASES[Math.max(timed, PHASES.indexOf(session.phase))];
}
export function view(session, now = Date.now()) {
  // Do not send tool context, agent memories, request IDs or private shared data to the browser.
  const {
    learnerMemory: _learnerMemory,
    revisitTarget: _revisitTarget,
    requests: _requests,
    agentMemory: _agentMemory,
    progress: _progress,
    lastCode: _lastCode,
    codeLanguage: _codeLanguage,
    traces: _traces,
    ...publicSession
  } = session;
  return {
    ...publicSession,
    elapsedMs: elapsed(session, now),
    runningSince: now,
    scheduledPhase: phaseAt(session, now),
  };
}

// Budget the current round against its boundary, preserving the final review window.
export function roundBudget(session, elapsedMs) {
  const index = PHASES.indexOf(session.phase);
  const endFraction = [5 / 60, 30 / 60, 55 / 60, 1][index] ?? 1;
  const maximum = [5, 25, 25, 5][index] ?? 5;
  return Math.max(
    0,
    Math.min(maximum, (session.durationMinutes * 60000 * endFraction - elapsedMs) / 60000),
  );
}
