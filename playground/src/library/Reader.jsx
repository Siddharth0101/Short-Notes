import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { notes, noteById, trackById } from '../data/catalog.js';
import { extractHeadings } from '../lib/content.js';
import { useProgress } from '../lib/progressContext.js';
import Markdown from './Markdown.jsx';
import Icon from './Icons.jsx';
import { QuestionCard } from './Interviews.jsx';
import SourceExamples from './SourceExamples.jsx';
const VisualLab = lazy(() => import('./VisualLab.jsx'));

// Reading position ko section list mein highlight karo.
function useActiveHeading(headings) {
  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !headings.length) return;
    const elements = headings.map((heading) => document.getElementById(heading.id)).filter(Boolean);
    if (!elements.length) return;
    const onScreen = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target.id);
          else onScreen.delete(entry.target.id);
        }
        const current = elements.find((element) => onScreen.has(element.id));
        if (current) setActiveId(current.id);
      },
      { rootMargin: '-88px 0px -65% 0px' },
    );
    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [headings]);
  return activeId;
}

function Chapter({ note }) {
  const [params, setParams] = useSearchParams();
  const body = note.body;
  const { progress, toggle, visit } = useProgress();
  const tab = params.get('tab') === 'visual' && note.visual ? 'visual' : 'notes';
  useEffect(() => {
    visit(note.id);
  }, [note, visit]);
  useEffect(() => {
    document.title = `${note.title} · Shortnotes`;
    return () => {
      document.title = 'Shortnotes — Your developer notebook';
    };
  }, [note.title]);
  const track = trackById[note.track];
  const sequence = notes.filter((item) => item.track === note.track);
  const index = sequence.findIndex((item) => item.id === note.id);
  const next = sequence[index + 1];
  const previous = sequence[index - 1];
  const headings = useMemo(
    () => [
      ...extractHeadings(body),
      ...(note.references?.length
        ? [{ id: 'source-examples', title: 'Source examples — step-by-step samjho' }]
        : []),
      ...(note.questions?.length ? [{ id: 'chapter-practice', title: 'Interview practice' }] : []),
    ],
    [body, note],
  );
  const activeHeading = useActiveHeading(headings);
  const complete = progress.completed.includes(note.id);
  return (
    <div className="reader page-enter">
      <div className="reader-breadcrumb">
        <Link to={`/library?track=${note.track}`}>{track.name}</Link>
        <Icon name="chevron" size={14} />
        <span>{`Chapter ${String(index + 1).padStart(2, '0')}`}</span>
      </div>
      <div className="reader-heading">
        <div>
          <div className="note-meta">
            <span className="level-pill">{note.level}</span>
            {note.minutes > 0 && (
              <span>
                <Icon name="clock" size={14} /> {note.minutes} min revision
              </span>
            )}
            <span>Hinglish + code</span>
          </div>
          <h1>{note.title}</h1>
          <p>{note.summary}</p>
        </div>
        <button
          className={`subtle-button ${progress.saved.includes(note.id) ? 'is-saved' : ''}`}
          aria-pressed={progress.saved.includes(note.id)}
          onClick={() => toggle('saved', note.id)}
        >
          <Icon name="bookmark" size={17} />
          {progress.saved.includes(note.id) ? 'Saved' : 'Note save karo'}
        </button>
      </div>
      {note.stage && (
        <div className="reader-course-context">
          <Link to={`/paths?track=${note.track}`}>
            Poora course syllabus <Icon name="arrow" size={14} />
          </Link>
          <strong>
            Stage {note.stageNumber}: {note.stage.title}
          </strong>
          <span>
            Lesson {note.order} of {sequence.length}
            {previous ? ` · Previous: ${previous.title}` : ' · Start here'}
          </span>
          <p>{note.stage.goal}</p>
        </div>
      )}
      <div className="tab-bar">
        <button
          className={tab === 'notes' ? 'active' : ''}
          aria-pressed={tab === 'notes'}
          onClick={() => setParams({})}
        >
          <Icon name="book" size={16} /> Padho aur samjho
        </button>
        {note.visual && (
          <button
            className={tab === 'visual' ? 'active' : ''}
            aria-pressed={tab === 'visual'}
            onClick={() => setParams({ tab: 'visual' })}
          >
            <Icon name="play" size={16} /> Visual se samjho
          </button>
        )}
      </div>
      {tab === 'visual' ? (
        <Suspense fallback={<p>Visual load ho raha hai…</p>}>
          <VisualLab embedded topic={note.visual} />
        </Suspense>
      ) : (
        <div className="reader-layout">
          <article className="reader-article">
            <Markdown>{body}</Markdown>
            <SourceExamples references={note.references || []} />
            {!!note.questions?.length && (
              <section className="chapter-practice" aria-labelledby="chapter-practice">
                <h2 id="chapter-practice">Interview practice</h2>
                <p>
                  Pehle bolkar answer do. Example, failure case aur tradeoff samjhao. Phir answer
                  dekhkar apni reasoning compare karo.
                </p>
                {note.questions.map((item, index) => (
                  <QuestionCard key={item.id} item={item} number={index + 1} />
                ))}
              </section>
            )}
            <div className="chapter-complete">
              <div>
                <Icon name="complete" size={27} />
                <div>
                  <h3>
                    {complete ? 'Ek aur concept clear hua.' : 'Aage badhne se pehle khud samjhao.'}
                  </h3>
                  <p>Notes band karo. Concept samjhao. Exercise attempt karo.</p>
                </div>
              </div>
              <button
                className={complete ? 'subtle-button' : 'primary-button'}
                aria-pressed={complete}
                onClick={() => toggle('completed', note.id)}
              >
                <Icon name={complete ? 'check' : 'circle'} size={17} />
                {complete ? 'Completed' : 'Complete mark karo'}
              </button>
            </div>
            <div className="chapter-navigation">
              {previous ? (
                <Link to={`/notes/${previous.id}`}>
                  <span>← PREVIOUS CHAPTER</span>
                  <strong>{previous.title}</strong>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link to={`/notes/${next.id}`}>
                  <span>NEXT CHAPTER →</span>
                  <strong>{next.title}</strong>
                </Link>
              )}
            </div>
            {note.stage && note.stage.chapters.at(-1) === note.id && (
              <div className="stage-checkpoint">
                <Icon name="check" size={20} />
                <p>
                  <strong>Stage checkpoint:</strong> {note.stage.checkpoint}
                </p>
              </div>
            )}
            {!next && note.kind === 'chapter' && (
              <Link
                className="primary-button"
                to={`/interview?track=${note.track === 'interview' ? 'all' : note.track}`}
              >
                Course complete? Try the interview questions <Icon name="arrow" size={16} />
              </Link>
            )}
          </article>
          <aside className="reader-toc">
            <div className="toc-sticky">
              <span className="card-overline">ON THIS PAGE</span>
              <nav aria-label="Table of contents">
                {headings.map((heading, i) => (
                  <a
                    key={`${heading.id}-${i}`}
                    href={`#${heading.id}`}
                    className={activeHeading === heading.id ? 'active' : ''}
                    aria-current={activeHeading === heading.id ? 'location' : undefined}
                  >
                    {heading.title}
                  </a>
                ))}
              </nav>
              <div className="toc-tip">
                <Icon name="sparkles" size={18} />
                <strong>A quick learning tip</strong>
                <p>Samajh aaya? Ab ek example khud banao. That’s where it sticks.</p>
              </div>
              <Link
                to={`/interview?track=${note.track === 'interview' ? 'all' : note.track}`}
                className="text-button"
              >
                Practice questions <Icon name="arrow" size={15} />
              </Link>
              <div className="source-path">
                <span>NOTE SOURCE</span>
                <code>{note.source}</code>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
export default function Reader() {
  const { noteId } = useParams();
  const note = noteById[noteId];
  if (note?.chapterId)
    return <Navigate to={`/notes/${note.chapterId}#source-${note.id}`} replace />;
  return note ? (
    <Chapter key={note.id} note={note} />
  ) : (
    <div className="empty-state">
      <h1>Note not found.</h1>
      <Link to="/library" className="primary-button">
        Back to library
      </Link>
    </div>
  );
}
