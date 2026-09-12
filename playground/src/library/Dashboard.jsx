import { Link } from 'react-router-dom';
import { TRACKS } from '../lib/content.js';
import { notes, archive, noteById } from '../data/catalog.js';
import { useProgress } from '../lib/progressContext.js';
import { VISUAL_IDS } from '../lib/visualIds.js';
import Icon from './Icons.jsx';
function HeroDiagram() {
  return (
    <div className="hero-diagram" aria-label="Learn, visualize, and connect concepts">
      <div className="diagram-grid" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="diagram-center">
        <Icon name="layers" size={38} />
        <span>connect the dots.</span>
      </div>
      <span className="floating-node node-js">JS</span>
      <span className="floating-node node-react">
        <Icon name="react" size={30} />
      </span>
      <span className="floating-node node-java">
        <Icon name="coffee" size={27} />
      </span>
      <span className="floating-node node-db">
        <Icon name="database" size={25} />
      </span>
      <div className="diagram-caption">
        <span /> LESS MEMORIZING. MORE UNDERSTANDING.
      </div>
    </div>
  );
}
export function TrackCard({ track, index }) {
  const { progress } = useProgress();
  const chapters = notes.filter((note) => note.track === track.id);
  const complete = chapters.filter((note) => progress.completed.includes(note.id)).length;
  return (
    <Link
      to={`/paths?track=${track.id}`}
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
          {complete > 0 ? `${complete} completed` : 'View course syllabus'}
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
    notes.find((note) => note.track === activeTrack && !progress.completed.includes(note.id)) ||
    notes.find((note) => note.track === activeTrack) ||
    notes[0];
  const completed = notes.filter((note) => progress.completed.includes(note.id)).length;
  return (
    <div className="dashboard page-enter">
      <div className="page-eyebrow">
        <span className="small-line" /> YOUR PERSONAL KNOWLEDGE LIBRARY
      </div>
      <div className="page-heading">
        <div>
          <h1>
            A little clearer, every day<span>.</span>
          </h1>
          <p>Your notes, connected. Your next breakthrough, one concept away.</p>
        </div>
        <Link className="subtle-button" to="/paths">
          My learning paths <Icon name="arrow" size={16} />
        </Link>
      </div>
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="hero-pill">
            <span /> BUILT FOR YOUR DEVELOPER JOURNEY
          </span>
          <h2>
            Don’t just learn it.
            <br />
            <em>Make it click.</em>
          </h2>
          <p>
            From “yeh kaise kaam karta hai?” to “I’ve got this.”
            <br className="desktop-br" /> Clear notes, visual explanations, and practice that
            sticks.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to={next ? `/notes/${next.id}` : '/paths'}>
              <Icon name="book" size={17} />
              {recent.length ? 'Continue learning' : 'Start learning'}
              <Icon name="arrow" size={17} />
            </Link>
            <Link className="text-button" to="/visuals">
              <Icon name="play" size={16} /> Explore visual lab
            </Link>
          </div>
          <div className="hero-footnote">
            <span className="stacked-dots">
              <i>JS</i>
              <i>R</i>
              <i>J</i>
            </span>
            <span>Your entire stack. One thoughtful space.</span>
          </div>
        </div>
        <HeroDiagram />
      </section>
      <div className="stats-strip">
        {[
          [String(notes.length), 'structured chapters', 'book'],
          [String(archive.length), 'integrated examples', 'file'],
          [String(VISUAL_IDS.length), 'interactive visualizations', 'play'],
          [String(completed), 'chapters completed', 'complete'],
        ].map(([number, label, icon]) => (
          <div className="stat" key={label}>
            <span className="stat-icon">
              <Icon name={icon} size={19} />
            </span>
            <div>
              <strong>
                {number}
                <span>{label === 'structured chapters' ? '↗' : ''}</span>
              </strong>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>
      <section>
        <div className="section-heading">
          <div>
            <h2>
              Find your next rabbit hole<span className="heading-dot">.</span>
            </h2>
            <p>Six subjects. A whole lot of “aha!” moments.</p>
          </div>
          <Link className="text-button" to="/library">
            View all notes <Icon name="arrow" size={16} />
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
            <h3>Some things are better seen.</h3>
            <p>
              Slow down the event loop. Watch React render.
              <br />
              Make the invisible, visible.
            </p>
            <span className="text-button">
              Let’s see how it works <Icon name="arrow" size={16} />
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
          <h3>Know it. Explain it. Own it.</h3>
          <p>
            Thoughtful questions, clear answers, and follow-ups
            <br />
            that help you go one level deeper.
          </p>
          <span className="text-button">
            Start a practice session <Icon name="arrow" size={16} />
          </span>
        </Link>
      </section>
      <section className="practice-paths">
        <div className="section-heading">
          <div>
            <h2>Build it. Break it. Explain it.</h2>
            <p>Go from revision notes to a realistic interview round.</p>
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
              'Trace candidates → prove invariants → test edge cases',
              'dsa-monotonic-stack-lab',
              'dsa',
            ],
          ].map(([number, title, description, id, track]) => (
            <article key={id} className="practice-path-card">
              <span className="card-overline">PRACTICE ROUTE {number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <Link className="text-button" to={`/notes/${id}`}>
                Open practical notes <Icon name="arrow" size={15} />
              </Link>
              <Link className="text-button" to={`/interview?track=${track}`}>
                Practice this subject <Icon name="messages" size={15} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      {recent.length > 0 && (
        <section className="recent-section">
          <div className="section-heading">
            <h2>Pick up where you left off</h2>
            <span className="muted">Recently opened</span>
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
    </div>
  );
}
