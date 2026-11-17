import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../lib/langContext.js';
import { usePlay } from '../lib/playContext.js';
import { cardStats, dayKey, shuffled, XP } from '../lib/playState.js';
import Icon from '../library/Icons.jsx';
import ContentStatus from '../library/ContentStatus.jsx';
import { DeckPicker, GameFrame, Inline } from './shared.jsx';
import { useDeck } from './useDeck.js';
import './play.css';

const SESSION_SIZE = 12;

// Smart mix: what is due comes first (oldest first), then cards never seen before.
function buildQueue(cards, play, mode, seed) {
  if (mode === 'all') return shuffled(cards, seed).slice(0, SESSION_SIZE);
  const today = dayKey();
  const due = cards
    .filter((card) => play.cards[card.id] && play.cards[card.id].due <= today)
    .sort((a, b) => play.cards[a.id].due.localeCompare(play.cards[b.id].due));
  const fresh = cards.filter((card) => !play.cards[card.id]);
  return [...due, ...fresh].slice(0, SESSION_SIZE);
}

export default function Flashcards() {
  const { lang, t } = useLang();
  const { play, review } = usePlay();
  const deck = useDeck();
  const [mode, setMode] = useState('smart');
  const [round, setRound] = useState(1);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({ good: 0, again: 0 });
  // The queue is fixed when a round starts; reviewing cards must not reshuffle it mid-round.
  // The deck is read through a ref for the same reason; `deckKey` says when it really changed.
  const latest = useRef({ play, cards: deck.cards });
  latest.current = { play, cards: deck.cards };
  const deckKey = `${deck.track}|${deck.chapter}|${lang}|${deck.cards.length}`;
  useEffect(() => {
    setQueue(buildQueue(latest.current.cards, latest.current.play, mode, round * 7919));
    setIndex(0);
    setFlipped(false);
    setResults({ good: 0, again: 0 });
  }, [deckKey, mode, round]);

  const card = queue[index];
  const finished = queue.length > 0 && index >= queue.length;
  const stats = cardStats(
    play,
    deck.cards.map((item) => item.id),
  );
  const answer = (remembered) => {
    if (!card) return;
    review(card.id, remembered);
    setResults((previous) => ({
      good: previous.good + (remembered ? 1 : 0),
      again: previous.again + (remembered ? 0 : 1),
    }));
    // A missed card comes back once more at the end of this round.
    if (!remembered && !card.retry) setQueue((items) => [...items, { ...card, retry: true }]);
    setFlipped(false);
    setIndex((value) => value + 1);
  };
  const keys = useRef({});
  keys.current = { card, flipped, answer };
  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^(INPUT|SELECT|TEXTAREA|BUTTON|A)$/.test(event.target.tagName)) return;
      const state = keys.current;
      if (!state.card) return;
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        setFlipped((value) => !value);
      } else if (state.flipped && event.key === '1') state.answer(false);
      else if (state.flipped && event.key === '2') state.answer(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const box = card ? play.cards[card.id]?.box : 0;
  return (
    <GameFrame icon="cards" title={t('cards.title')} lead={t('cards.lead')}>
      <div className="game-setup">
        <DeckPicker deck={deck} />
        <label>
          <span>{t('cards.mode')}</span>
          <select
            aria-label={t('cards.modeLabel')}
            value={mode}
            onChange={(event) => setMode(event.target.value)}
          >
            <option value="smart">{t('cards.mode.smart')}</option>
            <option value="all">{t('cards.mode.all')}</option>
          </select>
        </label>
      </div>
      <p className="deck-stats" role="status">
        {t('cards.deckStats', stats)}
      </p>
      {!deck.ready ? (
        <ContentStatus failed={deck.failed} retry={deck.retry} label={t('content.loadingCards')} />
      ) : !deck.cards.length ? (
        <div className="empty-state">
          <Icon name="cards" size={30} />
          <p>{t('game.empty')}</p>
        </div>
      ) : !queue.length ? (
        <div className="empty-state">
          <Icon name="complete" size={30} />
          <p>{t('cards.nothingDue')}</p>
          <button className="primary-button" onClick={() => setMode('all')}>
            {t('cards.mode.all')}
          </button>
        </div>
      ) : finished ? (
        <section className="game-result" aria-live="polite">
          <span className="game-result-emoji" aria-hidden="true">
            🎉
          </span>
          <h2>{t('cards.doneTitle')}</h2>
          <p>{t('cards.doneBody', results)}</p>
          <p className="game-xp">
            {t('game.xpEarned', { xp: (results.good + results.again) * XP.card })}
          </p>
          <p className="muted">{t('cards.nextDue')}</p>
          <div className="button-group">
            <button className="primary-button" onClick={() => setRound(round + 1)}>
              <Icon name="reset" size={16} /> {t('game.again')}
            </button>
            <Link className="subtle-button" to="/play">
              {t('game.back')}
            </Link>
          </div>
        </section>
      ) : (
        <section className="flashcard-stage" aria-label={t('cards.title')}>
          <div className="flashcard-progress">
            <span>{t('cards.progress', { index: index + 1, total: queue.length })}</span>
            <span className="flashcard-box">{box ? t('cards.box', { box }) : t('cards.new')}</span>
            <progress value={index} max={queue.length} aria-hidden="true" />
          </div>
          <button
            type="button"
            className={`flashcard${flipped ? ' is-flipped' : ''}`}
            aria-label={t('cards.flip')}
            aria-pressed={flipped}
            onClick={() => setFlipped(!flipped)}
          >
            <span className="flashcard-face flashcard-front" aria-hidden={flipped}>
              <small>{t('cards.front')}</small>
              <strong>
                <Inline text={card.term} />
              </strong>
              <em>{card.chapter}</em>
            </span>
            <span className="flashcard-face flashcard-back" aria-hidden={!flipped}>
              <small>{t('cards.back')}</small>
              <span className="flashcard-meaning">
                <Inline text={card.meaning} />
              </span>
              <em>
                <Inline text={card.term} />
              </em>
            </span>
          </button>
          <div className="flashcard-live visually-hidden" aria-live="polite">
            {/* Code ticks are markup for the eye; a screen reader should hear only the words. */}
            {(flipped ? `${card.term} — ${card.meaning}` : card.term).replace(/`/g, '')}
          </div>
          {flipped ? (
            <div className="flashcard-actions">
              <button className="subtle-button card-again" onClick={() => answer(false)}>
                <Icon name="reset" size={16} />
                <span>
                  {t('cards.again')}
                  <small>{t('cards.againHint')}</small>
                </span>
              </button>
              <button className="primary-button card-good" onClick={() => answer(true)}>
                <Icon name="check" size={16} />
                <span>
                  {t('cards.good')}
                  <small>{t('cards.goodHint')}</small>
                </span>
              </button>
            </div>
          ) : (
            <p className="flashcard-hint">{t('cards.flipHint')}</p>
          )}
          <div className="flashcard-footer">
            <Link className="text-button" to={`/notes/${card.noteId}`}>
              <Icon name="book" size={15} /> {t('game.readChapter')}
            </Link>
            <span className="game-keys">{t('cards.keys')}</span>
          </div>
        </section>
      )}
    </GameFrame>
  );
}
