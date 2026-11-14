// Pure game-state rules for the arcade: XP, levels, streaks, flashcard boxes and badges.
// Stored separately from chapter progress so existing `shortnotes.progress.v1` saves stay untouched.
export const PLAY_KEY = 'shortnotes.play.v1';

export const XP = {
  completed: 50, // chapter marked revised
  practiced: 10, // chapter practice question cleared
  known: 5, // interview question marked confident
  card: 2, // flashcard reviewed
  matchWin: 20,
  daily: 30,
  visual: 10, // first time a visual is played to the end
};

// Rapid-fire score → XP. A flawless timed round is worth roughly two chapters.
export const quizXp = (score) => Math.round(score / 25);

// Level thresholds are total XP. Titles live in the dictionaries as `level.<n>`.
export const LEVELS = [0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000, 6500, 8500];

// Leitner boxes: days until a card is due again after a correct recall.
export const BOX_INTERVALS = [0, 1, 3, 7, 14, 30];
export const MAX_BOX = BOX_INTERVALS.length - 1;

export function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
export function addDays(key, days) {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + days));
}

const isDay = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
const count = (value) => (Number.isFinite(value) && value > 0 ? Math.floor(value) : 0);
const strings = (value, limit) =>
  Array.isArray(value)
    ? [...new Set(value.filter((item) => typeof item === 'string'))].slice(0, limit)
    : [];

// Accept anything (old saves, imports, corrupted storage) and return a safe, bounded shape.
export function normalizePlay(value) {
  const source = value && typeof value === 'object' ? value : {};
  const days = {};
  for (const [key, amount] of Object.entries(source.days || {})) {
    if (isDay(key) && count(amount)) days[key] = Math.min(count(amount), 100000);
  }
  const cards = {};
  for (const [id, card] of Object.entries(source.cards || {}).slice(0, 5000)) {
    if (!card || typeof card !== 'object') continue;
    const box = Math.min(MAX_BOX, Math.max(1, count(card.box) || 1));
    if (isDay(card.due)) cards[id] = { box, due: card.due };
  }
  const badges = {};
  for (const [id, day] of Object.entries(source.badges || {})) if (isDay(day)) badges[id] = day;
  const best = source.best && typeof source.best === 'object' ? source.best : {};
  const counts = source.counts && typeof source.counts === 'object' ? source.counts : {};
  return {
    xp: count(source.xp),
    days,
    cards,
    badges,
    best: {
      quiz: count(best.quiz),
      combo: count(best.combo),
      match: count(best.match), // fewest moves; 0 means never won
      matchTime: count(best.matchTime), // fastest win in seconds
    },
    counts: {
      cards: count(counts.cards),
      quizRounds: count(counts.quizRounds),
      quizCorrect: count(counts.quizCorrect),
      perfectRounds: count(counts.perfectRounds),
      matchWins: count(counts.matchWins),
      daily: count(counts.daily),
    },
    daily: strings(source.daily, 400).filter(isDay),
    visuals: strings(source.visuals, 200),
    languages: strings(source.languages, 4),
    nightOwl: source.nightOwl === true,
  };
}

// Merge two saves (import from another device): keep the best of each.
export function mergePlay(a, b) {
  const left = normalizePlay(a);
  const right = normalizePlay(b);
  const days = { ...left.days };
  for (const [key, amount] of Object.entries(right.days))
    days[key] = Math.max(days[key] || 0, amount);
  const cards = { ...left.cards };
  for (const [id, card] of Object.entries(right.cards))
    if (!cards[id] || card.box > cards[id].box) cards[id] = card;
  const badges = { ...right.badges, ...left.badges };
  for (const [id, day] of Object.entries(right.badges))
    if (left.badges[id] && day < left.badges[id]) badges[id] = day;
  const fewest = (x, y) => (x && y ? Math.min(x, y) : x || y);
  return normalizePlay({
    xp: Math.max(left.xp, right.xp),
    days,
    cards,
    badges,
    best: {
      quiz: Math.max(left.best.quiz, right.best.quiz),
      combo: Math.max(left.best.combo, right.best.combo),
      match: fewest(left.best.match, right.best.match),
      matchTime: fewest(left.best.matchTime, right.best.matchTime),
    },
    counts: Object.fromEntries(
      Object.keys(left.counts).map((key) => [key, Math.max(left.counts[key], right.counts[key])]),
    ),
    daily: [...left.daily, ...right.daily],
    visuals: [...left.visuals, ...right.visuals],
    languages: [...left.languages, ...right.languages],
    nightOwl: left.nightOwl || right.nightOwl,
  });
}

// Total XP: chapter progress is derived (un-marking removes it), game XP is earned.
export function totalXp(progress, play) {
  return (
    progress.completed.length * XP.completed +
    progress.practiced.length * XP.practiced +
    progress.known.length * XP.known +
    play.xp
  );
}

export function levelFor(xp) {
  let level = 1;
  for (let index = 0; index < LEVELS.length; index++) if (xp >= LEVELS[index]) level = index + 1;
  const floor = LEVELS[level - 1];
  const next = LEVELS[level] ?? null;
  return {
    level,
    floor,
    next,
    progress: next ? (xp - floor) / (next - floor) : 1,
    toNext: next ? next - xp : 0,
  };
}

// Consecutive active days ending today — or yesterday, so the streak survives until midnight.
export function streakFor(days, today = dayKey()) {
  let cursor = days[today] ? today : addDays(today, -1);
  let current = 0;
  while (days[cursor]) {
    current++;
    cursor = addDays(cursor, -1);
  }
  let longest = 0;
  let run = 0;
  let previous = null;
  for (const key of Object.keys(days).sort()) {
    run = previous && addDays(previous, 1) === key ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = key;
  }
  return { current, longest: Math.max(longest, current), activeToday: Boolean(days[today]) };
}

// Record activity for today (heatmap + streak) and optionally earn game XP.
export function logActivity(play, { xp = 0, points = 1, now = new Date() } = {}) {
  const today = dayKey(now);
  return {
    ...play,
    xp: play.xp + xp,
    days: { ...play.days, [today]: (play.days[today] || 0) + Math.max(1, points) },
    nightOwl: play.nightOwl || now.getHours() < 4,
  };
}

// Flashcards: a correct recall moves the card up a box; a miss sends it back to box 1.
export function reviewCard(play, id, remembered, today = dayKey()) {
  const current = play.cards[id]?.box || 0;
  const box = remembered ? Math.min(MAX_BOX, current + 1) : 1;
  return {
    ...play,
    cards: {
      ...play.cards,
      [id]: { box, due: addDays(today, remembered ? BOX_INTERVALS[box] : 0) },
    },
    counts: { ...play.counts, cards: play.counts.cards + 1 },
  };
}
export function isDue(play, id, today = dayKey()) {
  const card = play.cards[id];
  return !card || card.due <= today;
}
export function cardStats(play, ids, today = dayKey()) {
  let fresh = 0;
  let due = 0;
  let mastered = 0;
  for (const id of ids) {
    const card = play.cards[id];
    if (!card) fresh++;
    else if (card.due <= today) due++;
    if (card?.box >= 4) mastered++;
  }
  return { fresh, due, mastered, total: ids.length };
}

// Badge rules. `context` = { progress, play, trackTotals: { [trackId]: { total, done } }, chapterTotal }.
export const BADGES = [
  { id: 'first-chapter', icon: '🌱', test: (c) => c.progress.completed.length >= 1 },
  { id: 'five-chapters', icon: '🖐️', test: (c) => c.progress.completed.length >= 5 },
  { id: 'twenty-five-chapters', icon: '🥈', test: (c) => c.progress.completed.length >= 25 },
  {
    id: 'subject-master',
    icon: '👑',
    test: (c) => Object.values(c.trackTotals).some((t) => t.total > 0 && t.done === t.total),
  },
  {
    id: 'whole-notebook',
    icon: '📚',
    test: (c) => c.chapterTotal > 0 && c.progress.completed.length >= c.chapterTotal,
  },
  { id: 'practice-10', icon: '🎯', test: (c) => c.progress.practiced.length >= 10 },
  { id: 'practice-100', icon: '🏏', test: (c) => c.progress.practiced.length >= 100 },
  { id: 'interview-25', icon: '🎤', test: (c) => c.progress.known.length >= 25 },
  { id: 'bookworm', icon: '🔖', test: (c) => c.progress.saved.length >= 5 },
  { id: 'streak-3', icon: '🔥', test: (c) => c.streak.longest >= 3 },
  { id: 'streak-7', icon: '⚡', test: (c) => c.streak.longest >= 7 },
  { id: 'streak-30', icon: '🏆', test: (c) => c.streak.longest >= 30 },
  { id: 'cards-50', icon: '🃏', test: (c) => c.play.counts.cards >= 50 },
  { id: 'combo-8', icon: '💥', test: (c) => c.play.best.combo >= 8 },
  { id: 'perfect-round', icon: '💯', test: (c) => c.play.counts.perfectRounds >= 1 },
  { id: 'match-win', icon: '🧠', test: (c) => c.play.counts.matchWins >= 1 },
  { id: 'daily-7', icon: '📅', test: (c) => c.play.counts.daily >= 7 },
  { id: 'visual-5', icon: '👀', test: (c) => c.play.visuals.length >= 5 },
  { id: 'bilingual', icon: '🗣️', test: (c) => c.play.languages.length >= 2 },
  { id: 'night-owl', icon: '🦉', test: (c) => c.play.nightOwl },
];

export function earnedBadges(context) {
  return BADGES.filter((badge) => badge.test(context)).map((badge) => badge.id);
}

// Deterministic "of the day" pick so every reader gets the same daily challenge.
export function dailyIndex(length, today = dayKey()) {
  if (!length) return 0;
  let hash = 2166136261;
  for (const char of today) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % length;
}

// Small seeded shuffle (mulberry32) so games are testable and replays differ by seed.
export function shuffled(items, seed = Math.floor(Math.random() * 2 ** 31)) {
  let state = seed >>> 0;
  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
