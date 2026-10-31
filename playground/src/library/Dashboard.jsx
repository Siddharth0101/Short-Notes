import { useState } from 'react';
import { NoteLink } from './Navigation.jsx';
import { Link } from 'react-router-dom';
import { TRACKS } from '../lib/content.js';
import { notes, archive, noteById, trackById, practiceTotal } from '../data/catalog.js';
import { useProgress } from '../lib/progressContext.js';
import { VISUAL_IDS } from '../lib/visualIds.js';
import { interviewQuestions } from '../data/interviewQuestions.js';
import Icon from './Icons.jsx';

export function TrackCard({ track, index }) {
  const { progress } = useProgress();
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
      <p>{track.description}</p>
      <div className="track-topics">{track.topics}</div>
      <div className="track-facts">
        <span>{chapters.length} chapters</span>
        {practice > 0 && <span>{practice} practice Qs</span>}
      </div>
      <div className="track-progress" aria-hidden="true">
        <span style={{ width: `${(complete / chapters.length) * 100}%` }} />
      </div>
      <div className="track-card-footer">
        <span>
          {complete} / {chapters.length} revised
        </span>
        <Icon name="arrow" size={17} />
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { progress } = useProgress();
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
            <span className="small-line" /> TUMHARI STUDY NOTEBOOK
          </div>
          <h1>
            Chhote notes.
            <br /> <span>Clear concepts.</span>
          </h1>
          <p>
            Har chapter mein seedhe concept, ek worked example aur Easy → Hard practice questions.
            Hinglish mein samjho, interview mein English mein bolo.
          </p>
        </div>
        <div className="desk-note" aria-label="Overall progress">
          <div
            className="progress-ring"
            style={{ '--value': percent }}
            role="img"
            aria-label={`${percent}% chapters revised`}
          >
            <span>{percent}%</span>
          </div>
          <div>
            <p>
              <strong>
                {completed} / {notes.length}
              </strong>{' '}
              chapters revised
            </p>
            <p>
              <strong>{progress.practiced.length}</strong> practice questions clear
            </p>
          </div>
        </div>
      </div>

      <div className="study-start-grid">
        <section
          className="study-session"
          aria-label="Continue revision"
          style={{ '--track-color': track.color, '--track-tint': track.tint }}
        >
          <div className="study-session-top">
            <span className="card-overline">
              <span className="session-dot" /> AAJ KA FOCUS
            </span>
            <label className="study-subject">
              <span className="visually-hidden">Revision subject</span>
              <select
                aria-label="Revision subject"
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
              {track.shortName || track.name} <span> / </span> CHAPTER{' '}
              {String(next.order).padStart(2, '0')}
            </span>
            <h2>{next.title}</h2>
            <p>{next.summary}</p>
            <div className="session-meta">
              <span>
                <Icon name="clock" size={15} /> ~{next.minutes} min
              </span>
              <span>{next.level}</span>
              {next.practiceCount > 0 && (
                <span>
                  <Icon name="target" size={15} /> {next.practiceCount} practice Qs
                </span>
              )}
            </div>
          </div>
          <div className="study-session-footer">
            <NoteLink className="primary-button" to={`/notes/${next.id}`}>
              <Icon name="play" size={16} />
              {done === chapters.length
                ? 'Dobara revise karo'
                : recent[0]?.id === next.id
                  ? 'Continue revision'
                  : 'Revision shuru karo'}
              <Icon name="arrow" size={17} />
            </NoteLink>
            <span>
              {done} / {chapters.length} revised
            </span>
          </div>
          <progress
            className="session-progress"
            aria-label={`${track.name} revision progress`}
            value={done}
            max={chapters.length}
          />
        </section>
        <aside className="study-routine" aria-label="Revision routine">
          <div className="card-overline">EK CHAPTER, CHAAR STEP</div>
          <h2>Read. Recall. Practice.</h2>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>Quick revision padho</strong>
                <p>Har bullet: term — meaning aur uska catch.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Example trace karo</strong>
                <p>Output pehle predict karo, phir trace se match karo.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Recall bina dekhe</strong>
                <p>Sawal ka jawab bolo, phir answer kholkar gap pakdo.</p>
              </div>
            </li>
            <li>
              <span>04</span>
              <div>
                <strong>Practice questions</strong>
                <p>Easy → Hard. Jo sahi ho, use clear mark karo.</p>
              </div>
            </li>
          </ol>
          <Link className="text-button" to="/paths">
            Apna learning route dekho <Icon name="arrow" size={16} />
          </Link>
        </aside>
      </div>

      <div className="stats-strip" aria-label="Your notebook in numbers">
        {[
          [notes.length, 'revision chapters', 'book'],
          [archive.length, 'code examples', 'code'],
          [VISUAL_IDS.length, 'visual labs', 'play'],
          [practiceTotal, 'chapter practice questions', 'target'],
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
              <span className="section-kicker">WAHI SE SHURU KARO</span>
              <h2>Abhi padhe hue notes</h2>
            </div>
            <Link className="text-button" to="/saved">
              Bookmarks <Icon name="arrow" size={16} />
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
                  {progress.completed.includes(note.id) ? 'Revised' : `${note.minutes} min`}{' '}
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
            <span className="section-kicker">SUBJECTS</span>
            <h2>Kya seekhna hai aaj?</h2>
            <p>Foundations se interview tak. Har subject ka ordered syllabus.</p>
          </div>
          <Link className="text-button" to="/library">
            Saare notes dekho <Icon name="arrow" size={16} />
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
            <span className="section-kicker">CONFIDENCE BANAO</span>
            <h2>Padha? Ab practice karo.</h2>
          </div>
        </div>
        <div className="practice-options">
          <Link to="/visuals?topic=event-loop" className="practice-option">
            <span className="practice-option-icon">
              <Icon name="play" size={22} />
            </span>
            <span className="card-overline">{VISUAL_IDS.length} INTERACTIVE VISUALS</span>
            <h3>Dekhkar samjho</h3>
            <p>Event loop, React renders aur algorithms ko step-by-step chalao.</p>
            <span className="text-button">
              Visual lab kholo <Icon name="arrow" size={16} />
            </span>
          </Link>
          <Link
            to={`/interview?track=${activeTrack === 'interview' ? 'all' : activeTrack}`}
            className="practice-option"
          >
            <span className="practice-option-icon">
              <Icon name="messages" size={22} />
            </span>
            <span className="card-overline">{interviewQuestions.length} INTERVIEW QUESTIONS</span>
            <h3>Khud ko test karo</h3>
            <p>Filters, mock session aur follow-ups ke saath question bank.</p>
            <span className="text-button">
              Interview prep <Icon name="arrow" size={16} />
            </span>
          </Link>
          <Link to="/interview/live" className="practice-option">
            <span className="practice-option-icon">
              <Icon name="sparkles" size={22} />
            </span>
            <span className="card-overline">ONE FOCUSED HOUR</span>
            <h3>Interview ka rehearsal</h3>
            <p>Intro, theory aur coding rounds. Voice ya typing se apna answer do.</p>
            <span className="text-button">
              AI interview kholo <Icon name="arrow" size={16} />
            </span>
          </Link>
        </div>
      </section>
      <div className="desk-footnote">
        <Icon name="bookmark" size={16} />
        <p>
          Progress isi browser mein rehti hai. <Link to="/saved">Bookmarks se backup rakho.</Link>{' '}
          Revised aur clear marks tumhara self-check hain.
        </p>
      </div>
    </div>
  );
}
