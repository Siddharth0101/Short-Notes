// Turns chapters into game material. Every `term — meaning` revision bullet becomes one card.
import { extractTerms, headingId } from '../lib/content.js';
import { canonicalText } from '../data/store.js';
import { shuffled } from '../lib/playState.js';

const plain = (text) => text.replace(/[`*_]/g, '');
const cache = new WeakMap();

// Card ids come from the canonical (Hinglish) chapter so review history survives a language switch.
export function chapterCards(note) {
  if (cache.has(note)) return cache.get(note);
  const canonical = extractTerms(canonicalText(note.id) ?? note.body ?? '');
  const local = extractTerms(note.body ?? '');
  const source = local.length === canonical.length ? local : canonical;
  const seen = new Set();
  const cards = [];
  canonical.forEach((entry, index) => {
    const id = `${note.id}#${headingId(plain(entry.term)) || index}`;
    if (seen.has(id)) return;
    seen.add(id);
    cards.push({
      id,
      noteId: note.id,
      track: note.track,
      chapter: note.title,
      term: source[index].term,
      meaning: source[index].meaning,
    });
  });
  cache.set(note, cards);
  return cards;
}

export function deckFor(notes, { track = 'all', chapter = 'all' } = {}) {
  return notes
    .filter(
      (note) =>
        (chapter === 'all' ? track === 'all' || note.track === track : note.id === chapter) &&
        note.kind === 'chapter',
    )
    .flatMap(chapterCards);
}

// A meaning that spells out its own term would give the answer away.
function revealsTerm(card) {
  const term = plain(card.term).toLowerCase().trim();
  return term.length > 2 && plain(card.meaning).toLowerCase().includes(term);
}

// Multiple-choice round: read a meaning, pick the term. Wrong options come from the same chapter
// first (the confusable ones), then from the rest of the deck.
export function buildQuiz(cards, { count = 10, seed } = {}) {
  const usable = cards.filter((card) => !revealsTerm(card) && card.meaning.length <= 240);
  const pool = shuffled(usable, seed);
  const questions = [];
  for (const card of pool) {
    if (questions.length >= count) break;
    const label = plain(card.term).toLowerCase();
    const taken = new Set([label]);
    const wrong = [];
    const candidates = [
      ...shuffled(
        cards.filter((other) => other.noteId === card.noteId),
        (seed ?? 1) + questions.length,
      ),
      ...shuffled(
        cards.filter((other) => other.noteId !== card.noteId),
        (seed ?? 1) + questions.length + 97,
      ),
    ];
    for (const other of candidates) {
      const otherLabel = plain(other.term).toLowerCase();
      if (taken.has(otherLabel)) continue;
      taken.add(otherLabel);
      wrong.push(other.term);
      if (wrong.length === 3) break;
    }
    if (wrong.length < 3) continue;
    const options = shuffled([card.term, ...wrong], (seed ?? 1) * 31 + questions.length);
    questions.push({ card, options, answer: options.indexOf(card.term) });
  }
  return questions;
}

// Points for one answer: quick answers and unbroken runs are worth more.
export function quizPoints({ correct, timeLeft = 0, combo = 0 }) {
  if (!correct) return 0;
  return 100 + Math.round(50 * Math.min(1, Math.max(0, timeLeft))) + 20 * Math.min(combo, 5);
}

// Memory match board: `pairs` short cards from one deck, as shuffled term and meaning tiles.
export function buildMatch(cards, { pairs = 6, seed } = {}) {
  const short = cards.filter((card) => card.meaning.length <= 120 && card.term.length <= 40);
  const picked = shuffled(short, seed).slice(0, pairs);
  if (picked.length < pairs) return null;
  const tiles = picked.flatMap((card) => [
    { key: `${card.id}:term`, pair: card.id, side: 'term', text: card.term },
    { key: `${card.id}:meaning`, pair: card.id, side: 'meaning', text: card.meaning },
  ]);
  return { cards: picked, tiles: shuffled(tiles, (seed ?? 7) * 13 + 5) };
}
