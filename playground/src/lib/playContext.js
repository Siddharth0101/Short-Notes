import { createContext, useContext } from 'react';
import { levelFor, normalizePlay, streakFor } from './playState.js';

const empty = normalizePlay(null);
// Safe defaults so a component rendered outside the provider still works (isolated tests).
export const PlayContext = createContext({
  play: empty,
  stats: { xp: 0, ...levelFor(0), streak: streakFor({}), earned: [] },
  award: () => {},
  review: () => {},
  finishQuiz: () => {},
  finishMatch: () => {},
  completeDaily: () => {},
  finishVisual: () => {},
  importPlay: () => {},
});
export const usePlay = () => useContext(PlayContext);
