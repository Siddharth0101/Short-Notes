import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../lib/langContext.js';
import { usePlay } from '../lib/playContext.js';
import { quizXp } from '../lib/playState.js';
import Icon from '../library/Icons.jsx';
import ContentStatus from '../library/ContentStatus.jsx';
import { DeckPicker, GameFrame, Inline } from './shared.jsx';
import { useDeck } from './useDeck.js';
import { buildQuiz, quizPoints } from './decks.js';
import './play.css';

const ROUND = 10;
const SECONDS = 15;

export default function RapidFire() {
  const { t } = useLang();
  const { play, finishQuiz } = usePlay();
  const deck = useDeck();
  const [timed, setTimed] = useState(true);
  const [questions, setQuestions] = useState(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null); // option index, or 'timeout'
  const [timeLeft, setTimeLeft] = useState(SECONDS);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [previousBest, setPreviousBest] = useState(0);
  const nextButton = useRef(null);
  const question = questions?.[index];
  const done = questions && index >= questions.length;
  const answered = picked !== null;

  // A round needs one answer plus three different wrong options for at least one card.
  const playable = useMemo(
    () => buildQuiz(deck.cards, { count: 1, seed: 1 }).length > 0,
    [deck.cards],
  );
  function start() {
    const built = buildQuiz(deck.cards, { count: ROUND });
    if (!built.length) return;
    setPreviousBest(play.best.quiz);
    setQuestions(built);
    setIndex(0);
    setPicked(null);
    setTimeLeft(SECONDS);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setAnswers([]);
  }
  function choose(option) {
    if (!question || answered) return;
    const correct = option === question.answer;
    const nextCombo = correct ? combo + 1 : 0;
    setPicked(option);
    setCombo(nextCombo);
    setBestCombo(Math.max(bestCombo, nextCombo));
    setScore(score + quizPoints({ correct, timeLeft: timed ? timeLeft / SECONDS : 0, combo }));
    setAnswers([...answers, { question, correct }]);
  }
  function next() {
    if (index + 1 >= questions.length) {
      finishQuiz({
        score,
        correct: answers.filter((item) => item.correct).length,
        total: questions.length,
        bestCombo,
      });
    }
    setIndex(index + 1);
    setPicked(null);
    setTimeLeft(SECONDS);
  }
  // Countdown for the current question; running out of time counts as a miss.
  useEffect(() => {
    if (!timed || !question || answered) return;
    // Each question starts with a full clock (start() and next() reset `timeLeft`).
    const deadline = Date.now() + SECONDS * 1000;
    const timer = setInterval(() => {
      const remaining = Math.max(0, (deadline - Date.now()) / 1000);
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, [timed, question, answered]);
  useEffect(() => {
    if (timed && question && !answered && timeLeft <= 0) choose('timeout');
  });
  useEffect(() => {
    if (answered) nextButton.current?.focus();
  }, [answered]);
  const live = useRef({});
  live.current = { question, answered, choose, next };
  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(event.target.tagName)) return;
      const state = live.current;
      if (!state.question) return;
      if (!state.answered && /^[1-4]$/.test(event.key)) {
        event.preventDefault();
        state.choose(Number(event.key) - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const correctCount = answers.filter((item) => item.correct).length;
  const missed = answers.filter((item) => !item.correct);
  const ratio = questions?.length ? correctCount / questions.length : 0;
  const verdict = ratio === 1 ? 'perfect' : ratio >= 0.7 ? 'great' : ratio >= 0.4 ? 'ok' : 'low';
  const lastCorrect = answers.at(-1)?.correct;
  return (
    <GameFrame icon="timer" title={t('quiz.title')} lead={t('quiz.lead')}>
      {!questions || done ? (
        <>
          {done && (
            <section className="game-result" aria-live="polite">
              <span className="game-result-emoji" aria-hidden="true">
                {{ perfect: '💯', great: '🔥', ok: '👍', low: '☕' }[verdict]}
              </span>
              <h2>{t('quiz.doneTitle')}</h2>
              <p className="game-score">{t('quiz.doneScore', { score })}</p>
              <p>
                {t('quiz.doneBody', {
                  correct: correctCount,
                  total: questions.length,
                  combo: bestCombo,
                })}
              </p>
              <p className="game-verdict">{t(`quiz.verdict.${verdict}`)}</p>
              <p className="game-xp">
                {t('game.xpEarned', { xp: quizXp(score) })} ·{' '}
                {score > previousBest && score > 0
                  ? t('quiz.newBest')
                  : t('quiz.best', { score: Math.max(previousBest, score) })}
              </p>
              {missed.length > 0 && (
                <div className="quiz-review">
                  <h3>{t('quiz.review')}</h3>
                  <ul>
                    {missed.map(({ question: item }) => (
                      <li key={item.card.id}>
                        <strong>
                          <Inline text={item.card.term} />
                        </strong>{' '}
                        — <Inline text={item.card.meaning} />{' '}
                        <Link className="text-button" to={`/notes/${item.card.noteId}`}>
                          {t('game.readChapter')}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
          <div className="game-setup">
            <DeckPicker deck={deck} />
            <label>
              <span>{t('quiz.timer')}</span>
              <select
                aria-label={t('quiz.timerLabel')}
                value={timed ? 'on' : 'off'}
                onChange={(event) => setTimed(event.target.value === 'on')}
              >
                <option value="on">{t('quiz.timerOn', { seconds: SECONDS })}</option>
                <option value="off">{t('quiz.timerOff')}</option>
              </select>
            </label>
          </div>
          {!deck.ready ? (
            <ContentStatus
              failed={deck.failed}
              retry={deck.retry}
              label={t('content.loadingCards')}
            />
          ) : playable ? (
            <button className="primary-button game-start" onClick={start}>
              <Icon name="play" size={16} /> {done ? t('game.again') : t('game.start')}
            </button>
          ) : (
            <div className="empty-state">
              <Icon name="timer" size={30} />
              <p>{t('game.empty')}</p>
            </div>
          )}
          <p className="game-keys">{t('quiz.keys')}</p>
        </>
      ) : (
        <section className="quiz-stage" aria-label={t('quiz.title')}>
          <div className="quiz-status">
            <span>{t('quiz.questionOf', { index: index + 1, total: questions.length })}</span>
            <span className={`quiz-combo${combo >= 2 ? ' is-hot' : ''}`}>
              {combo >= 2 ? `🔥 ${t('quiz.combo', { combo })}` : t('quiz.combo', { combo })}
            </span>
            <span className="quiz-score">
              {t('quiz.score')}: <strong>{score}</strong>
            </span>
          </div>
          {timed && (
            <div
              className={`quiz-timer${timeLeft < 5 && !answered ? ' is-low' : ''}`}
              role="progressbar"
              aria-label={t('quiz.timeLeft')}
              aria-valuemin={0}
              aria-valuemax={SECONDS}
              aria-valuenow={Math.ceil(timeLeft)}
            >
              <span style={{ width: `${(timeLeft / SECONDS) * 100}%` }} />
            </div>
          )}
          <p className="quiz-prompt">{t('quiz.prompt')}</p>
          <blockquote className="quiz-meaning">
            <Inline text={question.card.meaning} />
          </blockquote>
          <div className="quiz-options">
            {question.options.map((option, optionIndex) => {
              const state = !answered
                ? ''
                : optionIndex === question.answer
                  ? ' is-correct'
                  : optionIndex === picked
                    ? ' is-wrong'
                    : ' is-dim';
              return (
                <button
                  key={`${index}-${optionIndex}`}
                  type="button"
                  className={`quiz-option${state}`}
                  disabled={answered}
                  onClick={() => choose(optionIndex)}
                >
                  <kbd>{optionIndex + 1}</kbd>
                  <span>
                    <Inline text={option} />
                  </span>
                </button>
              );
            })}
          </div>
          <div className="quiz-feedback" role="status" aria-live="polite">
            {answered && (
              <>
                <p className={lastCorrect ? 'is-correct' : 'is-wrong'}>
                  <strong>
                    {lastCorrect
                      ? t('quiz.correct')
                      : t(picked === 'timeout' ? 'quiz.timeout' : 'quiz.wrong', {
                          answer: question.card.term.replace(/`/g, ''),
                        })}
                  </strong>{' '}
                  {lastCorrect
                    ? t(`quiz.cheer.${(index % 4) + 1}`)
                    : t(`quiz.oops.${(index % 3) + 1}`)}
                </p>
                <button ref={nextButton} className="primary-button" onClick={next}>
                  {index + 1 >= questions.length ? t('quiz.finish') : t('quiz.next')}
                  <Icon name="arrow" size={16} />
                </button>
              </>
            )}
          </div>
        </section>
      )}
    </GameFrame>
  );
}
