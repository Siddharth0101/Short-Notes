import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { notes } from '../data/catalog.js';
import { useProgress } from './progressContext.js';
import { useLang } from './langContext.js';
import { PlayContext } from './playContext.js';
import {
  dayKey,
  earnedBadges,
  levelFor,
  logActivity,
  mergePlay,
  normalizePlay,
  PLAY_KEY,
  quizXp,
  reviewCard,
  streakFor,
  totalXp,
  XP,
} from './playState.js';
import Celebration from '../play/Celebration.jsx';

function readPlay() {
  try {
    return normalizePlay(JSON.parse(localStorage.getItem(PLAY_KEY)));
  } catch {
    return normalizePlay(null);
  }
}
const chapterTracks = notes.reduce((totals, note) => {
  (totals[note.track] ||= []).push(note.id);
  return totals;
}, {});

export function PlayProvider({ children }) {
  const { progress } = useProgress();
  const { lang } = useLang();
  const [play, setPlay] = useState(readPlay);
  const [celebrations, setCelebrations] = useState([]);
  useEffect(() => {
    try {
      localStorage.setItem(PLAY_KEY, JSON.stringify(play));
    } catch {
      /* Game stats still work for this session. */
    }
  }, [play]);
  useEffect(() => {
    setPlay((previous) =>
      previous.languages.includes(lang)
        ? previous
        : { ...previous, languages: [...previous.languages, lang] },
    );
  }, [lang]);

  // Marking chapters or questions counts as today's activity for the streak.
  const lastProgress = useRef(progress);
  useEffect(() => {
    const gained = ['completed', 'practiced', 'known'].reduce(
      (sum, key) => sum + Math.max(0, progress[key].length - lastProgress.current[key].length),
      0,
    );
    lastProgress.current = progress;
    if (gained > 0) setPlay((previous) => logActivity(previous, { points: Math.min(gained, 10) }));
  }, [progress]);

  const stats = useMemo(() => {
    const xp = totalXp(progress, play);
    const streak = streakFor(play.days);
    const trackTotals = Object.fromEntries(
      Object.entries(chapterTracks).map(([track, ids]) => [
        track,
        { total: ids.length, done: ids.filter((id) => progress.completed.includes(id)).length },
      ]),
    );
    const earned = earnedBadges({
      progress,
      play,
      streak,
      trackTotals,
      chapterTotal: notes.length,
    });
    return { xp, ...levelFor(xp), streak, earned };
  }, [progress, play]);

  // New badges and level-ups get one celebration each. Whatever was already earned when the
  // app opened (older saves) or arrives through an import is recorded without fanfare.
  const seen = useRef(null);
  if (seen.current === null) seen.current = new Set([...stats.earned, ...Object.keys(play.badges)]);
  const lastLevel = useRef(stats.level);
  const quiet = useRef(false);
  useEffect(() => {
    const undated = stats.earned.filter((id) => !play.badges[id]);
    if (undated.length) {
      const today = dayKey();
      setPlay((previous) => ({
        ...previous,
        badges: { ...Object.fromEntries(undated.map((id) => [id, today])), ...previous.badges },
      }));
    }
    const fresh = stats.earned.filter((id) => !seen.current.has(id));
    fresh.forEach((id) => seen.current.add(id));
    const leveledUp = stats.level > lastLevel.current;
    lastLevel.current = stats.level;
    const silent = quiet.current;
    quiet.current = false;
    if (silent || (!fresh.length && !leveledUp)) return;
    setCelebrations((queue) => [
      ...queue,
      ...(leveledUp ? [{ key: `level-${stats.level}`, type: 'level', level: stats.level }] : []),
      ...fresh.map((id) => ({ key: `badge-${id}`, type: 'badge', id })),
    ]);
  }, [stats.earned, stats.level, play.badges]);

  const award = useCallback((options) => setPlay((previous) => logActivity(previous, options)), []);
  const review = useCallback(
    (id, remembered) =>
      setPlay((previous) => logActivity(reviewCard(previous, id, remembered), { xp: XP.card })),
    [],
  );
  const finishQuiz = useCallback(({ score, correct, total, bestCombo }) => {
    setPlay((previous) => {
      const next = logActivity(previous, { xp: quizXp(score), points: total });
      return {
        ...next,
        best: {
          ...next.best,
          quiz: Math.max(next.best.quiz, score),
          combo: Math.max(next.best.combo, bestCombo),
        },
        counts: {
          ...next.counts,
          quizRounds: next.counts.quizRounds + 1,
          quizCorrect: next.counts.quizCorrect + correct,
          perfectRounds: next.counts.perfectRounds + (total > 0 && correct === total ? 1 : 0),
        },
      };
    });
  }, []);
  const finishMatch = useCallback(({ moves, seconds }) => {
    setPlay((previous) => {
      const next = logActivity(previous, { xp: XP.matchWin, points: 3 });
      return {
        ...next,
        best: {
          ...next.best,
          match: next.best.match ? Math.min(next.best.match, moves) : moves,
          matchTime: next.best.matchTime ? Math.min(next.best.matchTime, seconds) : seconds,
        },
        counts: { ...next.counts, matchWins: next.counts.matchWins + 1 },
      };
    });
  }, []);
  const completeDaily = useCallback(() => {
    setPlay((previous) => {
      const today = dayKey();
      if (previous.daily.includes(today)) return previous;
      const next = logActivity(previous, { xp: XP.daily, points: 3 });
      return {
        ...next,
        daily: [...next.daily, today].slice(-400),
        counts: { ...next.counts, daily: next.counts.daily + 1 },
      };
    });
  }, []);
  const finishVisual = useCallback((id) => {
    setPlay((previous) =>
      previous.visuals.includes(id)
        ? previous
        : { ...logActivity(previous, { xp: XP.visual }), visuals: [...previous.visuals, id] },
    );
  }, []);
  const importPlay = useCallback((value) => {
    quiet.current = true; // a merged backup is not a fresh achievement
    setPlay((previous) => mergePlay(previous, value));
  }, []);

  const dismiss = useCallback(() => setCelebrations((queue) => queue.slice(1)), []);

  const value = useMemo(
    () => ({
      play,
      stats,
      award,
      review,
      finishQuiz,
      finishMatch,
      completeDaily,
      finishVisual,
      importPlay,
    }),
    [play, stats, award, review, finishQuiz, finishMatch, completeDaily, finishVisual, importPlay],
  );
  return (
    <PlayContext.Provider value={value}>
      {children}
      {celebrations[0] && (
        <Celebration key={celebrations[0].key} item={celebrations[0]} onDone={dismiss} />
      )}
    </PlayContext.Provider>
  );
}
