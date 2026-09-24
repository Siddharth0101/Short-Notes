import { Link } from 'react-router-dom';
import { TRACKS } from '../lib/content.js';
import { notes, archive, noteById } from '../data/catalog.js';
import { useProgress } from '../lib/progressContext.js';
import { VISUAL_IDS } from '../lib/visualIds.js';
import Icon from './Icons.jsx';
export function TrackCard({ track, index }) {
  const { progress } = useProgress();
  const chapters = notes.filter((note) => note.track === track.id);
  const complete = chapters.filter((note) => progress.completed.includes(note.id)).length;
  return (
    <Link
      to={`/library?track=${track.id}`}
      className="track-card"
      style={{ '--track-color': track.color, '--track-tint': track.tint }}
    >
      <div className="track-card-top">
        <span className="track-icon">
          <Icon name={track.icon} size={25} />
        </span>
        <span className="track-number">0{index + 1}</span>
      </div>
      <h3>{track.name}</h3>
      <p>{track.description}</p>
      <div className="track-topics">{track.topics}</div>
      <div className="track-card-footer">
        <span>
          <Icon name="book" size={14} /> {chapters.length} chapters
        </span>
        <span>
          {complete > 0 ? `${complete} completed` : 'Revise karo'}
          <Icon name="arrow" size={15} />
        </span>
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
  const activeTrack = recent[0]?.track || 'javascript';
  const next =
    (recent[0] && !progress.completed.includes(recent[0].id) ? recent[0] : null) ||
    notes.find((note) => note.track === activeTrack && !progress.completed.includes(note.id)) ||
    notes.find((note) => note.track === activeTrack) ||
    notes[0];
  const completed = notes.filter((note) => progress.completed.includes(note.id)).length;
  return (
    <div className="dashboard page-enter">
      <div className="page-eyebrow">
        <span className="small-line" /> YOUR REVISION DESK
      </div>
      <div className="page-heading">
        <div>
          <h1>
            Chhote notes. Clear concepts<span>.</span>
          </h1>
          <p>Kam padho, jaldi revise karo. Apni Hinglish mein.</p>
        </div>
        <Link className="subtle-button" to="/paths">
          Mera learning route <Icon name="arrow" size={16} />
        </Link>
      </div>
      <section className="revision-launch" aria-label="Continue revision">
        <div className="revision-launch-copy">
          <span className="card-overline">
            <Icon name="sparkles" size={15} />{' '}
            {recent.length ? 'WELCOME BACK' : 'EK CONCEPT SE SHURU KARO'}
          </span>
          <h2>{recent.length ? 'Jahan chhoda tha, wahin se.' : 'Aaj kya revise karein?'}</h2>
          <p>{next.title}</p>
          <Link className="primary-button" to={`/notes/${next.id}`}>
            <Icon name="play" size={16} />{' '}
            {recent.length ? 'Continue revision' : 'Revision shuru karo'}{' '}
            <Icon name="arrow" size={17} />
          </Link>
        </div>
        <div className="revision-preview" aria-label="One-line notes preview">
          <div>
            <span className="preview-dot" />
            <span>notes / quick-revision</span>
            <Icon name="code" size={16} />
          </div>
          <p>
            <code>var</code>
            <span>function scope, redeclare allowed.</span>
          </p>
          <p>
            <code>let</code>
            <span>block scope, value badal sakte ho.</span>
          </p>
          <p>
            <code>const</code>
            <span>block scope, reassign nahi hota.</span>
          </p>
          <small>
            <Icon name="check" size={14} /> Bas itna. Concept clear.
          </small>
        </div>
      </section>
      <div className="stats-strip">
        {[
          [String(notes.length), 'revision chapters', 'book'],
          [String(archive.length), 'code examples', 'file'],
          [String(VISUAL_IDS.length), 'visual labs', 'play'],
          [String(completed), 'revised chapters', 'complete'],
        ].map(([number, label, icon]) => (
          <div className="stat" key={label}>
            <span className="stat-icon">
              <Icon name={icon} size={19} />
            </span>
            <div>
              <strong>
                {number}
                <span>{label === 'revision chapters' ? '↗' : ''}</span>
              </strong>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>
      {recent.length > 0 && (
        <section className="recent-section">
          <div className="section-heading">
            <h2>Recently opened</h2>
            <span className="muted">Ek click mein wapas</span>
          </div>
          {recent.map((note) => (
            <Link className="recent-row" key={note.id} to={`/notes/${note.id}`}>
              <Icon name="book" />
              <span>{note.title}</span>
              <Icon name="arrow" size={17} />
            </Link>
          ))}
        </section>
      )}
      <section>
        <div className="section-heading">
          <div>
            <h2>
              Agla subject chuno<span className="heading-dot">.</span>
            </h2>
            <p>Subject kholo. One-liners padho. Recall karo.</p>
          </div>
          <Link className="text-button" to="/library">
            Saare notes dekho <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="track-grid">
          {TRACKS.filter((track) => track.id !== 'interview').map((track, index) => (
            <TrackCard key={track.id} track={track} index={index} />
          ))}
        </div>
      </section>
      <section className="dashboard-bottom">
        <Link to="/visuals?topic=event-loop" className="feature-card visual-feature">
          <div>
            <span className="card-overline">
              <Icon name="play" size={14} /> THE VISUAL LAB
            </span>
            <h3>Visual se samjho.</h3>
            <p>
              Event loop slow karke dekho. React render trace karo.
              <br />
              Andar ka mechanism step-by-step samjho.
            </p>
            <span className="text-button">
              Dekho kaise kaam karta hai <Icon name="arrow" size={16} />
            </span>
          </div>
          <div className="mini-bars" aria-hidden="true">
            {[38, 64, 47, 88, 58, 100, 77].map((height, i) => (
              <span key={i} style={{ height: `${height}%`, animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
        </Link>
        <Link to="/interview" className="feature-card interview-feature">
          <span className="card-overline">
            <Icon name="messages" size={14} /> INTERVIEW, WITH CONFIDENCE
          </span>
          <h3>Khud ko test karo.</h3>
          <p>
            Questions, clear Hinglish answers aur follow-ups
            <br />
            se quick recall karo.
          </p>
          <span className="text-button">
            Practice session shuru karo <Icon name="arrow" size={16} />
          </span>
        </Link>
      </section>
      <section className="practice-paths">
        <div className="section-heading">
          <div>
            <h2>Banao. Galti pakdo. Samjhao.</h2>
            <p>Revision ke baad realistic interview round attempt karo.</p>
          </div>
        </div>
        <div className="practice-path-grid">
          {[
            [
              '01',
              'React frontend',
              'Identity bugs → accessible search → frontend architecture',
              'react-machine-coding',
              'react',
            ],
            [
              '02',
              'Java backend',
              'SQL races → resource limits → reservation architecture',
              'java-sql-interview-lab',
              'java',
            ],
            [
              '03',
              'Algorithm reasoning',
              'Candidates trace → invariant prove → edge cases test karo',
              'dsa-monotonic-stack-lab',
              'dsa',
            ],
          ].map(([number, title, description, id, track]) => (
            <article key={id} className="practice-path-card">
              <span className="card-overline">PRACTICE ROUTE {number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <Link className="text-button" to={`/notes/${id}`}>
                Practical notes kholo <Icon name="arrow" size={15} />
              </Link>
              <Link className="text-button" to={`/interview?track=${track}`}>
                Is subject ki practice karo <Icon name="messages" size={15} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
