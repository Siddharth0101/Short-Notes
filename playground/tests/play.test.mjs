import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import {
  addDays,
  BADGES,
  BOX_INTERVALS,
  cardStats,
  dailyIndex,
  dayKey,
  earnedBadges,
  LEVELS,
  levelFor,
  logActivity,
  MAX_BOX,
  mergePlay,
  normalizePlay,
  PLAY_KEY,
  reviewCard,
  shuffled,
  streakFor,
  totalXp,
  XP,
} from '../src/lib/playState.js';

const dom = new JSDOM('<!doctype html><div id="root"></div>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});
for (const name of [
  'window',
  'document',
  'HTMLElement',
  'HTMLInputElement',
  'HTMLSelectElement',
  'Event',
  'FormData',
  'MouseEvent',
  'KeyboardEvent',
  'localStorage',
])
  globalThis[name] = dom.window[name];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
window.scrollTo = () => {};
const server = await createServer({
  configFile: false,
  plugins: [react()],
  resolve: { dedupe: ['react', 'react-dom', 'react-router-dom'] },
  server: { middlewareMode: true, watch: null, hmr: false, ws: false },
  appType: 'custom',
  logLevel: 'error',
});
const React = await import('react');
const { createRoot } = await import('react-dom/client');
const { MemoryRouter } = await import('react-router-dom');
const { default: App } = await server.ssrLoadModule('/src/App.jsx');
// Chapter text loads on demand in the app; fetch it all once so screens render without waiting.
const store = await server.ssrLoadModule('/src/data/store.js');
await store.preloadAll();
const { notes } = store.getCatalog('hinglish');
const { buildMatch, buildQuiz, chapterCards, deckFor, quizPoints } =
  await server.ssrLoadModule('/src/play/decks.js');
await Promise.all([
  ...['PlayHub', 'Flashcards', 'RapidFire', 'MemoryMatch'].map((name) =>
    server.ssrLoadModule(`/src/play/${name}.jsx`),
  ),
  ...['Reader', 'VisualLab'].map((name) => server.ssrLoadModule(`/src/library/${name}.jsx`)),
]);
let root;
async function settle(ms = 30) {
  await React.act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
}
async function mount(route) {
  if (root) await React.act(async () => root.unmount());
  root = createRoot(document.getElementById('root'));
  await React.act(async () => {
    root.render(
      React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(App)),
    );
  });
  await settle();
}
const text = () => document.body.textContent;
const button = (label) =>
  [...document.querySelectorAll('button')].find(
    (element) =>
      element.textContent.trim() === label || element.getAttribute('aria-label') === label,
  );
async function click(element) {
  assert(element, 'Expected interactive element');
  await React.act(async () =>
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })),
  );
}
async function select(element, value) {
  assert(element, 'Expected a select element');
  await React.act(async () => {
    element.value = value;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
}
const stored = () => JSON.parse(localStorage.getItem(PLAY_KEY));
// A boolean on purpose: a failed assert on a jsdom node tries to print the whole DOM and hangs.
const celebrating = () => document.querySelector('.celebration') !== null;
after(async () => {
  if (root) await React.act(async () => root.unmount());
  await server.close();
  dom.window.close();
});

test('Levels, XP and streaks follow the documented rules', () => {
  assert.deepEqual(levelFor(0), { level: 1, floor: 0, next: 100, progress: 0, toNext: 100 });
  assert.equal(levelFor(99).level, 1);
  assert.equal(levelFor(100).level, 2);
  assert.equal(levelFor(LEVELS.at(-1)).level, LEVELS.length);
  assert.equal(levelFor(10 ** 9).next, null);
  assert.equal(levelFor(175).progress, 0.5);
  const progress = { completed: ['a', 'b'], practiced: ['q1'], known: ['k1', 'k2'], saved: [] };
  assert.equal(totalXp(progress, { xp: 7 }), 2 * XP.completed + XP.practiced + 2 * XP.known + 7);
  const today = '2026-03-10';
  assert.deepEqual(streakFor({}, today), { current: 0, longest: 0, activeToday: false });
  // Yesterday still counts: the streak is only lost after a full missed day.
  assert.equal(streakFor({ '2026-03-09': 1, '2026-03-08': 2 }, today).current, 2);
  assert.equal(streakFor({ '2026-03-08': 1 }, today).current, 0);
  const days = {
    '2026-03-10': 1,
    '2026-03-09': 1,
    '2026-03-01': 1,
    '2026-02-28': 1,
    '2026-02-27': 4,
  };
  assert.deepEqual(streakFor(days, today), { current: 2, longest: 3, activeToday: true });
  assert.equal(addDays('2026-02-28', 1), '2026-03-01');
  assert.equal(addDays('2024-02-28', 1), '2024-02-29');
  assert.equal(dayKey(new Date(2026, 0, 5)), '2026-01-05');
});

test('Flashcards move up a box when remembered and return to box one when missed', () => {
  let play = normalizePlay(null);
  const today = '2026-05-01';
  play = reviewCard(play, 'c#x', true, today);
  assert.deepEqual(play.cards['c#x'], { box: 1, due: addDays(today, BOX_INTERVALS[1]) });
  play = reviewCard(play, 'c#x', true, today);
  assert.deepEqual(play.cards['c#x'], { box: 2, due: addDays(today, BOX_INTERVALS[2]) });
  for (let i = 0; i < 10; i++) play = reviewCard(play, 'c#x', true, today);
  assert.equal(play.cards['c#x'].box, MAX_BOX);
  play = reviewCard(play, 'c#x', false, today);
  assert.deepEqual(play.cards['c#x'], { box: 1, due: today });
  assert.equal(play.counts.cards, 13);
  play = reviewCard(play, 'c#y', true, today);
  assert.deepEqual(cardStats(play, ['c#x', 'c#y', 'c#new'], today), {
    fresh: 1,
    due: 1,
    mastered: 0,
    total: 3,
  });
  assert.equal(cardStats(play, ['c#y'], addDays(today, 1)).due, 1);
});

test('Saved arcade data is sanitised, bounded and mergeable', () => {
  const junk = normalizePlay({
    xp: -5,
    days: { 'not-a-day': 3, '2026-01-01': 2.9, '2026-01-02': 'x' },
    cards: { a: { box: 99, due: '2026-01-01' }, b: { box: 2, due: 'tomorrow' }, c: null },
    badges: { 'first-chapter': '2026-01-01', broken: 5 },
    best: { quiz: '900', match: 14 },
    counts: null,
    daily: ['2026-01-01', '2026-01-01', 7, 'nope'],
    visuals: 'bfs',
    languages: ['en', 'en'],
    nightOwl: 'yes',
  });
  assert.equal(junk.xp, 0);
  assert.deepEqual(junk.days, { '2026-01-01': 2 });
  assert.deepEqual(junk.cards, { a: { box: MAX_BOX, due: '2026-01-01' } });
  assert.deepEqual(junk.badges, { 'first-chapter': '2026-01-01' });
  assert.deepEqual(junk.best, { quiz: 0, combo: 0, match: 14, matchTime: 0 });
  assert.deepEqual(junk.daily, ['2026-01-01']);
  assert.deepEqual(junk.visuals, []);
  assert.deepEqual(junk.languages, ['en']);
  assert.equal(junk.nightOwl, false);
  assert.deepEqual(normalizePlay(normalizePlay('garbage')), normalizePlay(undefined));
  const merged = mergePlay(
    {
      xp: 40,
      days: { '2026-01-01': 2 },
      cards: { a: { box: 2, due: '2026-01-05' } },
      best: { quiz: 300, match: 12 },
      counts: { cards: 4 },
      badges: { x: '2026-01-03' },
    },
    {
      xp: 90,
      days: { '2026-01-01': 5, '2026-01-02': 1 },
      cards: { a: { box: 1, due: '2026-01-02' }, b: { box: 3, due: '2026-01-09' } },
      best: { quiz: 200, match: 9 },
      counts: { cards: 2 },
      badges: { x: '2026-01-01' },
    },
  );
  assert.equal(merged.xp, 90);
  assert.deepEqual(merged.days, { '2026-01-01': 5, '2026-01-02': 1 });
  assert.equal(merged.cards.a.box, 2);
  assert.equal(merged.cards.b.box, 3);
  assert.deepEqual([merged.best.quiz, merged.best.match, merged.counts.cards], [300, 9, 4]);
  assert.equal(merged.badges.x, '2026-01-01');
});

test('Badges unlock from progress and play, and daily picks are deterministic', () => {
  const base = {
    progress: { completed: [], practiced: [], known: [], saved: [] },
    play: normalizePlay(null),
    streak: { current: 0, longest: 0 },
    trackTotals: { javascript: { total: 2, done: 0 } },
    chapterTotal: 4,
  };
  assert.deepEqual(earnedBadges(base), []);
  const busy = {
    ...base,
    progress: { completed: ['a', 'b'], practiced: Array(10).fill('q'), known: [], saved: [] },
    play: normalizePlay({
      counts: { cards: 50, perfectRounds: 1 },
      best: { combo: 8 },
      languages: ['hinglish', 'en'],
    }),
    streak: { current: 3, longest: 7 },
    trackTotals: { javascript: { total: 2, done: 2 } },
  };
  assert.deepEqual(earnedBadges(busy), [
    'first-chapter',
    'subject-master',
    'practice-10',
    'streak-3',
    'streak-7',
    'cards-50',
    'combo-8',
    'perfect-round',
    'bilingual',
  ]);
  assert.equal(new Set(BADGES.map((badge) => badge.id)).size, BADGES.length);
  assert.equal(dailyIndex(0), 0);
  assert.equal(dailyIndex(50, '2026-03-10'), dailyIndex(50, '2026-03-10'));
  const spread = new Set(
    Array.from({ length: 60 }, (_, i) => dailyIndex(50, addDays('2026-01-01', i))),
  );
  assert(spread.size > 20, 'Daily picks should vary from day to day');
  assert.deepEqual(shuffled([1, 2, 3, 4, 5], 42), shuffled([1, 2, 3, 4, 5], 42));
  assert.deepEqual([...shuffled([1, 2, 3, 4, 5], 42)].sort(), [1, 2, 3, 4, 5]);
  const night = logActivity(normalizePlay(null), { xp: 5, now: new Date(2026, 0, 1, 2, 30) });
  assert.deepEqual([night.xp, night.days['2026-01-01'], night.nightOwl], [5, 1, true]);
});

test('Every chapter yields unique cards, and quiz and match boards are well formed', () => {
  const ids = new Set();
  for (const note of notes) {
    const cards = chapterCards(note);
    assert(cards.length >= 5, `${note.id}: expected revision cards`);
    for (const card of cards) {
      assert(card.id.startsWith(`${note.id}#`), card.id);
      assert(!ids.has(card.id), `Duplicate card id: ${card.id}`);
      ids.add(card.id);
      assert(card.term && card.meaning, card.id);
    }
  }
  assert.equal(deckFor(notes).length, ids.size);
  assert.equal(
    deckFor(notes, { chapter: 'js-variables' }).length,
    chapterCards(notes.find((n) => n.id === 'js-variables')).length,
  );
  for (const track of ['javascript', 'react-native', 'system-design']) {
    const deck = deckFor(notes, { track });
    const quiz = buildQuiz(deck, { count: 10, seed: 11 });
    assert.equal(quiz.length, 10, track);
    assert.deepEqual(quiz, buildQuiz(deck, { count: 10, seed: 11 }));
    for (const { card, options, answer } of quiz) {
      assert.equal(options.length, 4);
      assert.equal(new Set(options.map((option) => option.toLowerCase())).size, 4);
      assert.equal(options[answer], card.term);
      assert(
        !card.meaning.toLowerCase().includes(card.term.replace(/`/g, '').toLowerCase()),
        card.id,
      );
    }
    const board = buildMatch(deck, { pairs: 6, seed: 5 });
    assert.equal(board.tiles.length, 12);
    for (const card of board.cards)
      assert.deepEqual(
        board.tiles
          .filter((tile) => tile.pair === card.id)
          .map((tile) => tile.side)
          .sort(),
        ['meaning', 'term'],
      );
  }
  assert.equal(buildMatch([], { pairs: 6 }), null);
  assert.deepEqual(buildQuiz([], { count: 10 }), []);
  assert.equal(quizPoints({ correct: false, timeLeft: 1, combo: 9 }), 0);
  assert.equal(quizPoints({ correct: true, timeLeft: 0, combo: 0 }), 100);
  assert.equal(quizPoints({ correct: true, timeLeft: 1, combo: 9 }), 250);
});

test('Language switch persists, translates the shell and chapters, and keeps progress ids', async () => {
  localStorage.clear();
  await mount('/');
  assert.equal(document.documentElement.lang, 'hi-Latn');
  assert.match(text(), /Chhote notes/);
  await select(document.querySelector('[aria-label="Language"]'), 'en');
  await settle(60);
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(localStorage.getItem('shortnotes.lang'), 'en');
  assert.match(text(), /Short notes\. Clear concepts\./);
  assert.match(document.querySelector('.study-routine').textContent, /Read the quick revision/);
  assert.equal(document.title, 'Short notes. Clear concepts. · Shortnotes');
  // A fully translated chapter: English text, canonical anchors, shared practice ids.
  await mount('/notes/js-variables');
  await settle(60);
  assert.match(document.querySelector('.reader-article').textContent, /a name given to a value/);
  assert.equal(
    document.querySelector('.reader .translation-notice:not(.translation-notice--inline)'),
    null,
  );
  assert(document.querySelector('.markdown h2#recall-aur-practice'));
  assert.equal(
    document.querySelector('.markdown h2#recall-aur-practice').textContent,
    'Recall and practice',
  );
  assert.equal(document.querySelectorAll('.recall-answer').length, 1);
  await click(document.querySelector('.practice-card .practice-actions button'));
  await click(document.querySelector('.practice-card .practice-mark'));
  const practiced = JSON.parse(localStorage.getItem('shortnotes.progress.v1')).practiced;
  assert.deepEqual(practiced, ['js-variables#const-object-mutate-vs-reassign']);
  // The same mark is visible after switching back to Hinglish.
  await select(document.querySelector('[aria-label="Language"]'), 'hinglish');
  assert.match(document.querySelector('.reader-article').textContent, /value ko diya hua naam/);
  assert.equal(document.querySelectorAll('.practice-card.is-clear').length, 1);
  assert.equal(document.documentElement.lang, 'hi-Latn');
  // Another tab changing the language is followed here.
  await React.act(async () =>
    window.dispatchEvent(
      new dom.window.StorageEvent('storage', { key: 'shortnotes.lang', newValue: 'en' }),
    ),
  );
  assert.match(document.querySelector('.reader-article').textContent, /a name given to a value/);
});

test('A chapter without an English body falls back to Hinglish with a clear notice', async () => {
  localStorage.clear();
  localStorage.setItem('shortnotes.lang', 'en');
  const pending = notes.find((note) => !note.english);
  if (!pending) return; // every chapter is translated
  await mount(`/notes/${pending.id}`);
  await settle(60);
  assert.match(document.querySelector('.translation-notice').textContent, /no English version yet/);
  assert(document.querySelector('.markdown h2#quick-revision'));
  assert.equal(button('Mark complete').textContent.trim(), 'Mark complete');
});

test('Arcade hub shows the scorecard and a daily challenge that pays out once', async () => {
  localStorage.clear();
  await mount('/play');
  assert.match(text(), /Padhai ko game banao/);
  assert.equal(document.querySelectorAll('.game-card').length, 3);
  assert.equal(document.querySelectorAll('.badge').length, BADGES.length);
  assert.equal(document.querySelectorAll('.badge.is-earned').length, 0);
  assert.match(document.querySelector('.scorecard-level').textContent, /Naya Coder/);
  const daily = document.querySelector('.daily-card');
  assert(daily.querySelector('h3').textContent.length > 3);
  assert.equal(daily.querySelector('.daily-answer') === null, true);
  assert.equal(button('Ho gaya — streak bachao'), undefined);
  await click(button('Answer dekho'));
  assert(daily.querySelector('.daily-answer'));
  await click(button('Ho gaya — streak bachao'));
  assert.match(daily.textContent, /Aaj ka challenge complete/);
  const play = stored();
  assert.equal(play.xp, XP.daily);
  assert.deepEqual(play.daily, [dayKey()]);
  assert.equal(play.counts.daily, 1);
  assert.match(document.querySelector('.scorecard-streak').textContent, /1/);
  assert(document.querySelector('.streak-flame.is-lit'));
  // Remounting must not offer the reward again.
  await mount('/play');
  assert.match(document.querySelector('.daily-card').textContent, /Aaj ka challenge complete/);
  await click(button('Answer dekho'));
  assert.equal(button('Ho gaya — streak bachao'), undefined);
  assert.equal(stored().xp, XP.daily);
});

test('Flashcards flip, schedule the next review and finish the round', async () => {
  localStorage.clear();
  await mount('/play/flashcards?chapter=js-scope-closures');
  const cards = chapterCards(notes.find((note) => note.id === 'js-scope-closures'));
  assert.match(
    document.querySelector('.deck-stats').textContent,
    new RegExp(`${cards.length} total`),
  );
  assert.equal(document.querySelector('.flashcard').getAttribute('aria-pressed'), 'false');
  assert.equal(button('Yaad hai'), undefined);
  await click(document.querySelector('.flashcard'));
  assert.equal(document.querySelector('.flashcard').getAttribute('aria-pressed'), 'true');
  await click(document.querySelector('.card-good'));
  let play = stored();
  assert.deepEqual(play.cards[cards[0].id], { box: 1, due: addDays(dayKey(), 1) });
  assert.equal(play.xp, XP.card);
  await click(document.querySelector('.flashcard'));
  await click(document.querySelector('.card-again'));
  play = stored();
  assert.deepEqual(play.cards[cards[1].id], { box: 1, due: dayKey() });
  // The missed card is queued once more, so the round has one extra card.
  const total = Math.min(12, cards.length) + 1;
  assert.match(
    document.querySelector('.flashcard-progress').textContent,
    new RegExp(`3 / ${total}`),
  );
  for (let i = 2; i < total; i++) {
    await click(document.querySelector('.flashcard'));
    await click(document.querySelector('.card-good'));
  }
  assert.match(text(), /Deck khatam/);
  assert.equal(stored().counts.cards, total);
  // Every reviewed card ended the round remembered, so only the unseen cards are offered next.
  await click(button('Ek aur round'));
  assert.match(
    document.querySelector('.flashcard-progress').textContent,
    new RegExp(`1 / ${Math.min(12, cards.length - (total - 1))}`),
  );
  assert.deepEqual(stored().cards[cards[1].id], { box: 2, due: addDays(dayKey(), 3) });
});

test('Rapid fire scores a flawless untimed round and records the best score', async () => {
  localStorage.clear();
  await mount('/play/quiz?chapter=js-async-event-loop');
  await select(document.querySelector('[aria-label="Quiz timer"]'), 'off');
  await click(button('Shuru karo'));
  const deck = chapterCards(notes.find((note) => note.id === 'js-async-event-loop'));
  let rounds = 0;
  while (document.querySelector('.quiz-stage') && rounds++ < 20) {
    const meaning = document.querySelector('.quiz-meaning').textContent;
    const card = deck.find((item) => item.meaning.replace(/`/g, '') === meaning);
    assert(card, `No card for meaning: ${meaning}`);
    const option = [...document.querySelectorAll('.quiz-option')].find(
      (element) => element.querySelector('span').textContent === card.term.replace(/`/g, ''),
    );
    await click(option);
    assert(option.classList.contains('is-correct'));
    assert.match(document.querySelector('.quiz-feedback').textContent, /Sahi jawab/);
    await click(document.querySelector('.quiz-feedback .primary-button'));
  }
  assert.match(text(), /Round khatam/);
  const play = stored();
  const total = play.counts.quizCorrect;
  assert(total >= 5 && total <= 10);
  assert.equal(play.counts.perfectRounds, 1);
  assert.equal(play.best.combo, total);
  assert.equal(
    play.best.quiz,
    Array.from({ length: total }, (_, i) => 100 + 20 * Math.min(i, 5)).reduce((a, b) => a + b),
  );
  assert.match(text(), /Naya best score/);
  assert.match(text(), /Sau taka sahi/);
});

test('A wrong rapid-fire answer breaks the combo and is listed for review', async () => {
  localStorage.clear();
  await mount('/play/quiz?chapter=js-async-event-loop');
  await select(document.querySelector('[aria-label="Quiz timer"]'), 'off');
  await click(button('Shuru karo'));
  const deck = chapterCards(notes.find((note) => note.id === 'js-async-event-loop'));
  let first = true;
  while (document.querySelector('.quiz-stage')) {
    const meaning = document.querySelector('.quiz-meaning').textContent;
    const card = deck.find((item) => item.meaning.replace(/`/g, '') === meaning);
    const options = [...document.querySelectorAll('.quiz-option')];
    const right = options.find(
      (element) => element.querySelector('span').textContent === card.term.replace(/`/g, ''),
    );
    await click(first ? options.find((element) => element !== right) : right);
    if (first) {
      assert.match(document.querySelector('.quiz-feedback').textContent, /Galat\. Sahi jawab/);
      assert(right.classList.contains('is-correct'));
    }
    first = false;
    await click(document.querySelector('.quiz-feedback .primary-button'));
  }
  assert.equal(document.querySelectorAll('.quiz-review li').length, 1);
  assert.equal(stored().counts.perfectRounds, 0);
});

test('Memory match reveals tiles, counts moves and locks a found pair', async () => {
  localStorage.clear();
  await mount('/play/match?chapter=js-loops');
  const tiles = () => [...document.querySelectorAll('.match-tile')];
  assert.equal(tiles().length, 12);
  assert.equal(document.querySelectorAll('.match-tile.is-open').length, 0);
  // Peek at every tile through its accessible name to learn where the pairs are.
  const deck = chapterCards(notes.find((note) => note.id === 'js-loops'));
  const seen = [];
  for (let i = 0; i < 12; i += 2) {
    await click(tiles()[i]);
    await click(tiles()[i + 1]);
    seen[i] = tiles()[i].textContent;
    seen[i + 1] = tiles()[i + 1].textContent;
    await settle(950);
  }
  const pairOf = (label) =>
    deck.find((card) => [card.term, card.meaning].some((side) => side.replace(/`/g, '') === label));
  const firstCard = pairOf(seen[0]);
  const partner = seen.findIndex((label, index) => index !== 0 && pairOf(label) === firstCard);
  assert(partner > 0);
  if (!tiles()[0].classList.contains('is-matched')) {
    await click(tiles()[0]);
    await click(tiles()[partner]);
  }
  assert(tiles()[0].classList.contains('is-matched'));
  assert(tiles()[partner].classList.contains('is-matched'));
  assert.match(document.querySelector('.match-status').textContent, /Jodi [1-6] \/ 6/);
  assert.match(tiles()[0].getAttribute('aria-label'), /jodi ban gayi/);
});

test('Finishing a visual and exporting a backup include arcade progress', async () => {
  localStorage.clear();
  await mount('/visuals?topic=two-pointers');
  assert.match(document.querySelector('.simulator h2').textContent, /Two pointers/);
  let guard = 0;
  while (!button('Agla step').disabled && guard++ < 50) await click(button('Agla step'));
  assert.match(document.querySelector('.step-explanation').textContent, /3 \+ 11 = 14/);
  assert.deepEqual(stored().visuals, ['two-pointers']);
  assert.equal(stored().xp, XP.visual);
  await click(button('Doosra input try karo'));
  while (!button('Agla step').disabled && guard++ < 100) await click(button('Agla step'));
  assert.match(document.querySelector('.step-explanation').textContent, /Koi pair nahi mila/);
  assert.equal(stored().xp, XP.visual, 'A visual pays out only once');

  await mount('/saved');
  const input = document.querySelector('[aria-label="Import progress backup"]');
  const backup = {
    version: 1,
    saved: [],
    completed: ['js-variables'],
    known: [],
    recent: [],
    play: { xp: 500, counts: { cards: 60 }, days: { '2026-01-01': 3 } },
  };
  Object.defineProperty(input, 'files', {
    configurable: true,
    value: [{ size: 200, text: async () => JSON.stringify(backup) }],
  });
  await React.act(async () => {
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  assert.match(text(), /Backup current progress ke saath merge ho gaya/);
  const play = stored();
  assert.equal(play.xp, 500);
  assert.equal(play.counts.cards, 60);
  assert.deepEqual(play.visuals, ['two-pointers']);
  assert(play.badges['first-chapter'] && play.badges['cards-50']);
  // Imported milestones are recorded without a celebration popup.
  assert.equal(celebrating(), false);
});

test('A newly earned badge is celebrated once and can be dismissed', async (t) => {
  // Pin the clock to midday: before 4 am the night-owl badge would join the queue.
  t.mock.timers.enable({ apis: ['Date'], now: new Date(2026, 0, 15, 12) });
  localStorage.clear();
  await mount('/notes/js-variables');
  assert.equal(celebrating(), false);
  await click(button('Complete mark karo'));
  const card = document.querySelector('.celebration-card');
  assert.match(card.textContent, /Badge unlock!/);
  assert.match(card.textContent, /Pehla kadam/);
  await click(button('Celebration band karo'));
  assert.equal(celebrating(), false);
  assert(stored().badges['first-chapter']);
  assert.equal(stored().badges['night-owl'], undefined);
  await mount('/notes/js-variables');
  assert.equal(celebrating(), false);
});

test('Badges earned together are celebrated one after the other', async (t) => {
  // 2 am: finishing the first chapter also unlocks the night-owl badge.
  t.mock.timers.enable({ apis: ['Date'], now: new Date(2026, 0, 15, 2) });
  localStorage.clear();
  await mount('/notes/js-variables');
  await click(button('Complete mark karo'));
  const shown = [];
  for (let guard = 0; celebrating() && guard < 5; guard++) {
    assert.equal(document.querySelectorAll('.celebration-card').length, 1);
    shown.push(document.querySelector('.celebration-card strong').textContent);
    await click(button('Celebration band karo'));
  }
  assert.deepEqual(shown.sort(), ['Pehla kadam', 'Raat ka ullu']);
  assert.equal(celebrating(), false);
  assert(stored().badges['first-chapter'] && stored().badges['night-owl']);
});
