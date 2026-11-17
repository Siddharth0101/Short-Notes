import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackById } from '../data/catalog.js';
import { ANALOGIES } from '../data/analogies.js';
import { notes as chapters } from '../data/catalog.js';
import { canonicalText } from '../data/store.js';
import { splitPractice } from '../lib/content.js';
import { useLang } from '../lib/langContext.js';
import { useCatalog, useContent } from '../lib/catalogContext.js';
import { usePlay } from '../lib/playContext.js';
import { addDays, BADGES, cardStats, dailyIndex, dayKey, XP } from '../lib/playState.js';
import Icon from '../library/Icons.jsx';
import ContentStatus from '../library/ContentStatus.jsx';
import Markdown from '../library/Markdown.jsx';
import { NoteLink } from '../library/Navigation.jsx';
import { Inline } from './shared.jsx';
import { deckFor } from './decks.js';
import '../library/reader.css';
import './play.css';

// Short, self-contained practice questions make good daily challenges. The pool is built from
// the canonical chapters so every reader — in either language — gets the same question.
// It needs every chapter's text, so it is built once, after the hub has fetched that.
let pool = null;
function dailyPool() {
  pool ??= chapters.flatMap((note) =>
    splitPractice(canonicalText(note.id) ?? '')
      .questions.map((question, index) => ({ noteId: note.id, index, question }))
      .filter(({ question }) => question.prompt && question.answer.length < 1400),
  );
  return pool;
}

function DailyChallenge() {
  const { t } = useLang();
  const { noteById } = useCatalog();
  const { play, completeDaily } = usePlay();
  const [open, setOpen] = useState(false);
  const today = dayKey();
  const candidates = dailyPool();
  const pick = candidates[dailyIndex(candidates.length, today)];
  const note = noteById[pick.noteId];
  const question =
    splitPractice(note.body, note.practiceSlugs).questions[pick.index] || pick.question;
  const done = play.daily.includes(today);
  const track = trackById[note.track];
  return (
    <section className="daily-card" aria-labelledby="daily-title">
      <div className="daily-head">
        <div>
          <span className="section-kicker">
            <Icon name="calendar" size={14} /> {t('daily.kicker')}
          </span>
          <h2 id="daily-title">{t('daily.title')}</h2>
          <p>{t('daily.lead', { xp: XP.daily })}</p>
        </div>
        <span className={`practice-level practice-level--${question.level.toLowerCase()}`}>
          {question.level}
        </span>
      </div>
      <p className="daily-from">
        <span className="subject-dot" style={{ background: track.color }} />
        {t('daily.from', { track: track.shortName || track.name, chapter: note.title })}
      </p>
      <h3>
        <Inline text={question.title} />
      </h3>
      <Markdown terms idPrefix="daily">
        {question.prompt}
      </Markdown>
      {open && (
        <div className="practice-answer daily-answer">
          <span className="practice-answer-label">
            <Icon name="idea" size={15} /> {t('practice.answer')}
          </span>
          <Markdown terms idPrefix="daily-answer">
            {question.answer}
          </Markdown>
        </div>
      )}
      <div className="daily-actions">
        <button
          className={open ? 'subtle-button' : 'primary-button'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? 'eyeOff' : 'eye'} size={16} />
          {open ? t('daily.hide') : t('daily.show')}
        </button>
        {done ? (
          <span className="daily-done" role="status">
            <Icon name="complete" size={17} /> {t('daily.completed')}
          </span>
        ) : open ? (
          <button className="primary-button" onClick={completeDaily}>
            <Icon name="flame" size={16} /> {t('daily.done')}
          </button>
        ) : (
          <span className="practice-hint">{t('daily.think')}</span>
        )}
        <NoteLink className="text-button" to={`/notes/${note.id}`}>
          {t('daily.openChapter')} <Icon name="arrow" size={15} />
        </NoteLink>
      </div>
    </section>
  );
}

function Scorecard() {
  const { lang, t } = useLang();
  const { play, stats } = usePlay();
  const today = dayKey();
  const week = Array.from({ length: 7 }, (_, index) => addDays(today, index - 6));
  const weekday = new Intl.DateTimeFormat(lang === 'en' ? 'en' : 'en-IN', { weekday: 'narrow' });
  const toDate = (key) => {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  return (
    <section className="scorecard" aria-label={t('play.player')}>
      <div className="scorecard-level">
        <span className="level-badge" aria-hidden="true">
          {stats.level}
        </span>
        <div>
          <span className="card-overline">{t('play.level', { level: stats.level })}</span>
          <strong>{t(`level.${stats.level}`)}</strong>
          <div
            className="xp-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(stats.progress * 100)}
            aria-label={t('play.xp', { xp: stats.xp })}
          >
            <span style={{ width: `${Math.round(stats.progress * 100)}%` }} />
          </div>
          <small>
            {t('play.xp', { xp: stats.xp })} ·{' '}
            {stats.next ? t('play.toNext', { xp: stats.toNext }) : t('play.maxLevel')}
          </small>
        </div>
      </div>
      <div className="scorecard-streak">
        <div className={`streak-flame${stats.streak.activeToday ? ' is-lit' : ''}`}>
          <span aria-hidden="true">🔥</span>
          <strong>{stats.streak.current}</strong>
          <small>{t('play.streak')}</small>
        </div>
        <div>
          <p>{stats.streak.activeToday ? t('play.streakOn') : t('play.streakOff')}</p>
          <small>{t('play.longest', { count: stats.streak.longest })}</small>
          <ol className="week-dots" aria-label={t('play.week')}>
            {week.map((key) => (
              <li
                key={key}
                className={play.days[key] ? 'is-active' : ''}
                title={
                  play.days[key]
                    ? t('play.activityDay', { date: key, count: play.days[key] })
                    : t('play.activityNone', { date: key })
                }
              >
                <span aria-hidden="true">{weekday.format(toDate(key))}</span>
                <span className="visually-hidden">
                  {play.days[key]
                    ? t('play.activityDay', { date: key, count: play.days[key] })
                    : t('play.activityNone', { date: key })}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <dl className="scorecard-stats">
        {[
          [play.counts.cards, t('play.stat.cards')],
          [play.best.quiz || '—', t('play.stat.quiz')],
          [play.best.match || '—', t('play.stat.match')],
          [play.counts.daily, t('play.stat.daily')],
        ].map(([value, label]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// 12 weeks of activity, one column per week. One hue, darker (lighter in dark mode) = more.
function ActivityMap() {
  const { t } = useLang();
  const { play } = usePlay();
  const today = dayKey();
  const [y, m, d] = today.split('-').map(Number);
  const weekdayToday = new Date(y, m - 1, d).getDay();
  const total = 11 * 7 + weekdayToday + 1;
  const days = Array.from({ length: total }, (_, index) => addDays(today, index - (total - 1)));
  const level = (count) => (!count ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4);
  const activeDays = days.filter((key) => play.days[key]).length;
  return (
    <section className="activity-map" aria-labelledby="activity-title">
      <div className="section-heading">
        <h2 id="activity-title">{t('play.activity')}</h2>
        <span className="muted">
          {activeDays} / {days.length}
        </span>
      </div>
      <div className="heat-scroll">
        <div className="heat-grid" role="img" aria-label={`${t('play.activity')}: ${activeDays}`}>
          {days.map((key) => (
            <i
              key={key}
              data-level={level(play.days[key])}
              title={
                play.days[key]
                  ? t('play.activityDay', { date: key, count: play.days[key] })
                  : t('play.activityNone', { date: key })
              }
            />
          ))}
        </div>
      </div>
      <div className="heat-legend" aria-hidden="true">
        <span>{t('play.less')}</span>
        {[0, 1, 2, 3, 4].map((step) => (
          <i key={step} data-level={step} />
        ))}
        <span>{t('play.more')}</span>
      </div>
    </section>
  );
}

function AnalogyOfTheDay() {
  const { lang, t } = useLang();
  const { noteById } = useCatalog();
  const [offset, setOffset] = useState(0);
  const item = ANALOGIES[(dailyIndex(ANALOGIES.length) + offset) % ANALOGIES.length];
  const text = item[lang] || item.hinglish;
  const note = noteById[item.id];
  return (
    <section className="analogy-card analogy-card--hub" aria-labelledby="analogy-title">
      <span className="section-kicker">
        <Icon name="laugh" size={14} /> {t('analogy.kicker')}
      </span>
      <h2 id="analogy-title">{t('analogy.title')}</h2>
      <strong>
        <Inline text={text.title} />
      </strong>
      <p>
        <Inline text={text.text} />
      </p>
      <p className="analogy-catch">
        <b>{t('analogy.catch')}:</b> <Inline text={text.catch} />
      </p>
      <div className="daily-actions">
        <button className="subtle-button" onClick={() => setOffset(offset + 1)}>
          <Icon name="shuffle" size={16} /> {t('analogy.next')}
        </button>
        {note && (
          <NoteLink className="text-button" to={`/notes/${note.id}`}>
            {t('analogy.read')} <Icon name="arrow" size={15} />
          </NoteLink>
        )}
      </div>
    </section>
  );
}

function Badges() {
  const { lang, t } = useLang();
  const { play, stats } = usePlay();
  const format = new Intl.DateTimeFormat(lang === 'en' ? 'en' : 'en-IN', {
    day: 'numeric',
    month: 'short',
  });
  const dated = (key) => {
    const [y, m, d] = key.split('-').map(Number);
    return format.format(new Date(y, m - 1, d));
  };
  return (
    <section className="badge-wall" aria-labelledby="badges-title">
      <div className="section-heading">
        <h2 id="badges-title">{t('badges.title')}</h2>
        <span className="muted">
          {t('badges.lead', { earned: stats.earned.length, total: BADGES.length })}
        </span>
      </div>
      <ul className="badge-grid">
        {BADGES.map((badge) => {
          const earned = stats.earned.includes(badge.id);
          return (
            <li key={badge.id} className={`badge${earned ? ' is-earned' : ''}`}>
              <span className="badge-icon" aria-hidden="true">
                {earned ? badge.icon : '🔒'}
              </span>
              <div>
                <strong>{t(`badge.${badge.id}.name`)}</strong>
                <p>{t(`badge.${badge.id}.how`)}</p>
                <small>
                  {earned
                    ? t('badges.unlocked', { date: dated(play.badges[badge.id] || dayKey()) })
                    : t('badges.locked')}
                </small>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function PlayHub() {
  const { t } = useLang();
  // The flashcard counts and the daily challenge are built from every chapter's text.
  const { notes, ready, failed, retry } = useContent({ chapters: 'all' });
  const { play } = usePlay();
  const cardIds = useMemo(
    () => (ready ? deckFor(notes).map((card) => card.id) : []),
    [notes, ready],
  );
  const cards = cardStats(play, cardIds);
  const games = [
    {
      id: 'flashcards',
      to: '/play/flashcards',
      icon: 'cards',
      stat: ready
        ? t('play.flashcards.stat', { due: cards.due, fresh: cards.fresh })
        : t('content.loading'),
    },
    {
      id: 'quiz',
      to: '/play/quiz',
      icon: 'timer',
      stat: play.best.quiz
        ? t('play.quiz.stat', { score: play.best.quiz })
        : t('play.quiz.statNone'),
    },
    {
      id: 'match',
      to: '/play/match',
      icon: 'grid',
      stat: play.best.match
        ? t('play.match.stat', { moves: play.best.match })
        : t('play.match.statNone'),
    },
  ];
  return (
    <div className="play-hub page-enter">
      <div className="page-eyebrow">
        <span className="small-line" /> {t('play.eyebrow')}
      </div>
      <div className="page-heading">
        <div>
          <h1>
            {t('play.title')}
            <span>.</span>
          </h1>
          <p>{t('play.lead')}</p>
        </div>
      </div>
      <Scorecard />
      {ready ? (
        <DailyChallenge />
      ) : (
        <ContentStatus failed={failed} retry={retry} label={t('content.loadingDaily')} />
      )}
      <section aria-labelledby="games-title">
        <div className="section-heading">
          <div>
            <h2 id="games-title">{t('play.games')}</h2>
            <p>
              <Inline text={t('play.gamesLead')} />
            </p>
          </div>
        </div>
        <div className="game-grid">
          {games.map((game) => (
            <Link key={game.id} to={game.to} className={`game-card game-card--${game.id}`}>
              <span className="game-card-icon">
                <Icon name={game.icon} size={24} />
              </span>
              <span className="card-overline">{t(`play.${game.id}.tagline`)}</span>
              <h3>{t(`play.${game.id}.name`)}</h3>
              <p>{t(`play.${game.id}.body`)}</p>
              <span className="game-card-stat">{game.stat}</span>
              <span className="text-button">
                {t('play.go')} <Icon name="arrow" size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <AnalogyOfTheDay />
      <Badges />
      <ActivityMap />
    </div>
  );
}
