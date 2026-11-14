import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../lib/langContext.js';
import { usePlay } from '../lib/playContext.js';
import { XP } from '../lib/playState.js';
import Icon from '../library/Icons.jsx';
import { DeckPicker, GameFrame, Inline } from './shared.jsx';
import { useDeck } from './useDeck.js';
import { buildMatch } from './decks.js';
import './play.css';

const PAIRS = 6;

export default function MemoryMatch() {
  const { t } = useLang();
  const { play, finishMatch } = usePlay();
  const deck = useDeck();
  const [round, setRound] = useState(() => Math.floor(Math.random() * 100000) + 1);
  // `deck.cards` changes with the selection and the language, so a new board follows both.
  const board = useMemo(
    () => buildMatch(deck.cards, { pairs: PAIRS, seed: round }),
    [deck.cards, round],
  );
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [previousBest, setPreviousBest] = useState(0);
  const startedAt = useRef(null);
  const won = board && matched.length === PAIRS;
  useEffect(() => {
    setOpen([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    startedAt.current = null;
  }, [board]);
  // The clock starts on the first flip and stops when the board is cleared.
  useEffect(() => {
    if (!moves && !open.length) return;
    if (won) return;
    const timer = setInterval(
      () => setSeconds(Math.round((Date.now() - startedAt.current) / 1000)),
      500,
    );
    return () => clearInterval(timer);
  }, [moves, open.length, won]);
  // Two different tiles stay visible for a moment, then flip back.
  useEffect(() => {
    if (open.length < 2) return;
    const timer = setTimeout(() => setOpen([]), 900);
    return () => clearTimeout(timer);
  }, [open]);

  function flip(index) {
    if (!board || won || open.includes(index) || open.length >= 2) return;
    const tile = board.tiles[index];
    if (matched.includes(tile.pair)) return;
    startedAt.current ??= Date.now();
    if (open.length === 0) {
      setOpen([index]);
      return;
    }
    const first = board.tiles[open[0]];
    const total = moves + 1;
    setMoves(total);
    if (first.pair === tile.pair && first.side !== tile.side) {
      const nextMatched = [...matched, tile.pair];
      setMatched(nextMatched);
      setOpen([]);
      if (nextMatched.length === PAIRS) {
        const elapsed = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
        setSeconds(elapsed);
        setPreviousBest(play.best.match);
        finishMatch({ moves: total, seconds: elapsed });
      }
    } else {
      setOpen([open[0], index]);
    }
  }
  return (
    <GameFrame icon="grid" title={t('match.title')} lead={t('match.lead')}>
      <div className="game-setup">
        <DeckPicker deck={deck} />
        <button className="subtle-button" onClick={() => setRound(round + 1)}>
          <Icon name="shuffle" size={16} /> {t('game.again')}
        </button>
      </div>
      {!board ? (
        <div className="empty-state">
          <Icon name="grid" size={30} />
          <p>{t('game.empty')}</p>
        </div>
      ) : (
        <>
          <div className="match-status" role="status">
            <span>
              {t('match.moves')}: <strong>{moves}</strong>
            </span>
            <span>
              {t('match.time')}: <strong>{seconds}s</strong>
            </span>
            <span>{t('match.pairs', { found: matched.length, total: PAIRS })}</span>
          </div>
          {won && (
            <section className="game-result" aria-live="polite">
              <span className="game-result-emoji" aria-hidden="true">
                🧠
              </span>
              <h2>{t('match.doneTitle')}</h2>
              <p>{t('match.doneBody', { moves, seconds })}</p>
              <p className="game-xp">
                {t('game.xpEarned', { xp: XP.matchWin })} ·{' '}
                {!previousBest || moves < previousBest
                  ? t('match.newBest')
                  : t('match.best', { moves: previousBest })}
              </p>
              <div className="button-group">
                <button className="primary-button" onClick={() => setRound(round + 1)}>
                  <Icon name="reset" size={16} /> {t('game.again')}
                </button>
                <Link className="subtle-button" to="/play">
                  {t('game.back')}
                </Link>
              </div>
            </section>
          )}
          <div className="match-board">
            {board.tiles.map((tile, index) => {
              const isMatched = matched.includes(tile.pair);
              const shown = isMatched || open.includes(index);
              const text = tile.text.replace(/`/g, '');
              return (
                <button
                  key={tile.key}
                  type="button"
                  className={`match-tile match-tile--${tile.side}${shown ? ' is-open' : ''}${isMatched ? ' is-matched' : ''}`}
                  aria-label={
                    shown
                      ? `${t(tile.side === 'term' ? 'match.tileTerm' : 'match.tileMeaning', { text })}${isMatched ? ` · ${t('match.matched')}` : ''}`
                      : t('match.tileHidden', { number: index + 1 })
                  }
                  aria-disabled={isMatched}
                  onClick={() => flip(index)}
                >
                  {shown ? (
                    <span>
                      <Inline text={tile.text} />
                    </span>
                  ) : (
                    <span className="match-tile-back" aria-hidden="true">
                      ?
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {won && (
            <section className="match-pairs">
              <h3>{t('match.pairList')}</h3>
              <ul className="term-list">
                {board.cards.map((card) => (
                  <li key={card.id}>
                    <strong>
                      <Inline text={card.term} />
                    </strong>{' '}
                    — <Inline text={card.meaning} />
                  </li>
                ))}
              </ul>
              <Link className="text-button" to={`/notes/${board.cards[0].noteId}`}>
                <Icon name="book" size={15} /> {t('game.readChapter')}
              </Link>
            </section>
          )}
        </>
      )}
    </GameFrame>
  );
}
