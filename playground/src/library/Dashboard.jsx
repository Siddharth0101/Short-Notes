import { useState } from 'react';
import { NoteLink } from './Navigation.jsx';
import { Link } from 'react-router-dom';
import { TRACKS } from '../lib/content.js';
import { archive, trackById, practiceTotal } from '../data/catalog.js';
import { useProgress } from '../lib/progressContext.js';
import { useLang } from '../lib/langContext.js';
import { useCatalog } from '../lib/catalogContext.js';
import { usePlay } from '../lib/playContext.js';
import { dayKey } from '../lib/playState.js';
import { VISUAL_IDS } from '../lib/visualIds.js';
import Icon from './Icons.jsx';

export function TrackCard({ track, index }) {
  const { progress } = useProgress();
  const { t } = useLang();
  const { notes } = useCatalog();
  const chapters = notes.filter((note) => note.track === track.id);
  const complete = chapters.filter((note) => progress.completed.includes(note.id)).length;
  const practice = chapters.reduce((total, note) => total + note.practiceCount, 0);
  return (
    <Link
      to={`/library?track=${track.id}`}
      className="track-card"
      style={{ '--track-color': track.color, '--track-tint': track.tint }}
    >
      <div className="track-card-top">
        <span className="track-icon">
          <Icon name={track.icon} size={22} />
        </span>
        <span className="track-number">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3>{track.shortName || track.name}</h3>
      <p>{t(`track.${track.id}.description`)}</p>
      <div className="track-topics">{t(`track.${track.id}.topics`)}</div>
      <div className="track-facts">
        <span>{t('track.chapters', { count: chapters.length })}</span>
        {practice > 0 && <span>{t('track.practiceQs', { count: practice })}</span>}
      </div>
      <div className="track-progress" aria-hidden="true">
        <span style={{ width: `${(complete / chapters.length) * 100}%` }} />
      </div>
      <div className="track-card-footer">
        <span>{t('track.revised', { done: complete, total: chapters.length })}</span>
        <Icon name="arrow" size={17} />
      </div>
    </Link>
  );
}

// Streak, level and a nudge into the arcade — the playful side of the same notes.
function PlayTeaser() {
  const { t } = useLang();
  const { play, stats } = usePlay();
  const dailyDone = play.daily.includes(dayKey());
  return (
    <section className="play-teaser" aria-label={t('dash.playTitle')}>
      <div className="play-teaser-copy">
        <span className="section-kicker">
          <Icon name="gamepad" size={14} /> {t('dash.playKicker')}
        </span>
        <h2>{t('dash.playTitle')}</h2>
        <p>{t('dash.playBody')}</p>
        <div className="play-teaser-actions">
          <Link className="primary-button" to="/play">
            <Icon name={dailyDone ? 'check' : 'zap'} size={16} />
            {dailyDone ? t('dash.playLink') : t('daily.title')}
            <Icon name="arrow" size={16} />
          </Link>
          <Link className="subtle-button" to="/play/flashcards">
            <Icon name="cards" size={16} /> {t('play.flashcards.name')}
          </Link>
          <Link className="subtle-button" to="/play/quiz">
            <Icon name="timer" size={16} /> {t('play.quiz.name')}
          </Link>
        </div>
      </div>
      <div className="play-teaser-stats">
        <div className={`streak-flame${stats.streak.activeToday ? ' is-lit' : ''}`}>
          <span aria-hidden="true">🔥</span>
          <strong>{stats.streak.current}</strong>
          <small>{t('play.streak')}</small>
        </div>
        <div className="level-meter">
          <span className="level-chip">{t('play.level', { level: stats.level })}</span>
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
          <small>{stats.next ? t('play.toNext', { xp: stats.toNext }) : t('play.maxLevel')}</small>
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const { progress } = useProgress();
  const { t } = useLang();
  const { notes, noteById, questions } = useCatalog();
  const recent = progress.recent
    .map((id) => noteById[id])
    .filter(Boolean)
    .slice(0, 3);
  const [chosenTrack, setChosenTrack] = useState('');
  const activeTrack = chosenTrack || recent[0]?.track || 'javascript';
  const chapters = notes.filter((note) => note.track === activeTrack);
  const next =
    (recent[0]?.track === activeTrack && !progress.completed.includes(recent[0].id)
      ? recent[0]
      : null) ||
    chapters.find((note) => !progress.completed.includes(note.id)) ||
    chapters[0];
  const track = trackById[activeTrack];
  const done = chapters.filter((note) => progress.completed.includes(note.id)).length;
  const completed = notes.filter((note) => progress.completed.includes(note.id)).length;
  const percent = notes.length ? Math.round((completed / notes.length) * 100) : 0;
  return (
    <div className="dashboard page-enter">
      <div className="desk-intro">
        <div>
          <div className="page-eyebrow">
            <span className="small-line" /> {t('dash.eyebrow')}
          </div>
          <h1>
            {t('dash.title1')}
            <br /> <span>{t('dash.title2')}</span>
          </h1>
          <p>{t('dash.lead')}</p>
        </div>
        <div className="desk-note" aria-label={t('dash.overallProgress')}>
          <div
            className="progress-ring"
            style={{ '--value': percent }}
            role="img"
            aria-label={t('dash.percentRevised', { percent })}
          >
            <span>{percent}%</span>
          </div>
          <div>
            <p>
              <strong>
                {completed} / {notes.length}
              </strong>{' '}
              {t('dash.chaptersRevised')}
            </p>
            <p>
              <strong>{progress.practiced.length}</strong> {t('dash.practiceClear')}
            </p>
          </div>
        </div>
      </div>

      <div className="study-start-grid">
        <section
          className="study-session"
          aria-label={t('dash.continueLabel')}
          style={{ '--track-color': track.color, '--track-tint': track.tint }}
        >
          <div className="study-session-top">
            <span className="card-overline">
              <span className="session-dot" /> {t('dash.todayFocus')}
            </span>
            <label className="study-subject">
              <span className="visually-hidden">{t('dash.revisionSubject')}</span>
              <select
                aria-label={t('dash.revisionSubject')}
                value={activeTrack}
                onChange={(event) => setChosenTrack(event.target.value)}
              >
                {TRACKS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.shortName || item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="study-session-content" aria-live="polite">
            <span className="session-chapter">
              {track.shortName || track.name} <span> / </span> {t('dash.chapter')}{' '}
              {String(next.order).padStart(2, '0')}
            </span>
            <h2>{next.title}</h2>
            <p>{next.summary}</p>
            <div className="session-meta">
              <span>
                <Icon name="clock" size={15} /> {t('dash.minutes', { minutes: next.minutes })}
              </span>
              <span>{next.level}</span>
              {next.practiceCount > 0 && (
                <span>
                  <Icon name="target" size={15} />{' '}
                  {t('dash.practiceQs', { count: next.practiceCount })}
                </span>
              )}
            </div>
          </div>
          <div className="study-session-footer">
            <NoteLink className="primary-button" to={`/notes/${next.id}`}>
              <Icon name="play" size={16} />
              {done === chapters.length
                ? t('dash.reviseAgain')
                : recent[0]?.id === next.id
                  ? t('dash.continue')
                  : t('dash.start')}
              <Icon name="arrow" size={17} />
            </NoteLink>
            <span>{t('dash.revisedOf', { done, total: chapters.length })}</span>
          </div>
          <progress
            className="session-progress"
            aria-label={t('dash.trackProgress', { name: track.name })}
            value={done}
            max={chapters.length}
          />
        </section>
        <aside className="study-routine" aria-label={t('dash.routineLabel')}>
          <div className="card-overline">{t('dash.routineOverline')}</div>
          <h2>{t('dash.routineTitle')}</h2>
          <ol>
            {[1, 2, 3, 4].map((step) => (
              <li key={step}>
                <span>{String(step).padStart(2, '0')}</span>
                <div>
                  <strong>{t(`dash.step${step}.title`)}</strong>
                  <p>{t(`dash.step${step}.body`)}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link className="text-button" to="/paths">
            {t('dash.seeRoute')} <Icon name="arrow" size={16} />
          </Link>
        </aside>
      </div>

      <PlayTeaser />

      <div className="stats-strip" aria-label={t('dash.numbersLabel')}>
        {[
          [notes.length, t('dash.stat.chapters'), 'book'],
          [archive.length, t('dash.stat.examples'), 'code'],
          [VISUAL_IDS.length, t('dash.stat.visuals'), 'play'],
          [practiceTotal, t('dash.stat.practice'), 'target'],
        ].map(([number, label, icon]) => (
          <div className="stat" key={label}>
            <span className="stat-icon">
              <Icon name={icon} size={19} />
            </span>
            <div>
              <strong>{number}</strong>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>

      {recent.length > 0 && (
        <section className="recent-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">{t('dash.recentKicker')}</span>
              <h2>{t('dash.recentTitle')}</h2>
            </div>
            <Link className="text-button" to="/saved">
              {t('dash.bookmarks')} <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div className="recent-grid">
            {recent.map((note) => (
              <NoteLink
                className="recent-note"
                key={note.id}
                to={`/notes/${note.id}`}
                style={{ '--track-color': trackById[note.track].color }}
              >
                <span className="recent-note-track">
                  {trackById[note.track].shortName || trackById[note.track].name}
                </span>
                <strong>{note.title}</strong>
                <span>
                  {progress.completed.includes(note.id)
                    ? t('dash.revised')
                    : t('dash.min', { minutes: note.minutes })}{' '}
                  <Icon name="arrow" size={16} />
                </span>
              </NoteLink>
            ))}
          </div>
        </section>
      )}

      <section className="subject-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">{t('dash.subjectsKicker')}</span>
            <h2>{t('dash.subjectsTitle')}</h2>
            <p>{t('dash.subjectsBody')}</p>
          </div>
          <Link className="text-button" to="/library">
            {t('dash.allNotes')} <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="track-grid">
          {TRACKS.filter((item) => item.id !== 'interview').map((item, index) => (
            <TrackCard key={item.id} track={item} index={index} />
          ))}
        </div>
      </section>

      <section className="practice-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">{t('dash.practiceKicker')}</span>
            <h2>{t('dash.practiceTitle')}</h2>
          </div>
        </div>
        <div className="practice-options">
          <Link to="/visuals?topic=event-loop" className="practice-option">
            <span className="practice-option-icon">
              <Icon name="play" size={22} />
            </span>
            <span className="card-overline">
              {t('dash.visualsOverline', { count: VISUAL_IDS.length })}
            </span>
            <h3>{t('dash.visualsTitle')}</h3>
            <p>{t('dash.visualsBody')}</p>
            <span className="text-button">
              {t('dash.visualsLink')} <Icon name="arrow" size={16} />
            </span>
          </Link>
          <Link
            to={`/interview?track=${activeTrack === 'interview' ? 'all' : activeTrack}`}
            className="practice-option"
          >
            <span className="practice-option-icon">
              <Icon name="messages" size={22} />
            </span>
            <span className="card-overline">
              {t('dash.questionsOverline', { count: questions.length })}
            </span>
            <h3>{t('dash.questionsTitle')}</h3>
            <p>{t('dash.questionsBody')}</p>
            <span className="text-button">
              {t('dash.questionsLink')} <Icon name="arrow" size={16} />
            </span>
          </Link>
          <Link to="/interview/live" className="practice-option">
            <span className="practice-option-icon">
              <Icon name="sparkles" size={22} />
            </span>
            <span className="card-overline">{t('dash.liveOverline')}</span>
            <h3>{t('dash.liveTitle')}</h3>
            <p>{t('dash.liveBody')}</p>
            <span className="text-button">
              {t('dash.liveLink')} <Icon name="arrow" size={16} />
            </span>
          </Link>
        </div>
      </section>
      <div className="desk-footnote">
        <Icon name="bookmark" size={16} />
        <p>
          {t('dash.footnote1')} <Link to="/saved">{t('dash.footnoteLink')}</Link>{' '}
          {t('dash.footnote2')}
        </p>
      </div>
    </div>
  );
}
