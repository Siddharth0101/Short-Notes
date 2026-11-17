import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { trackById } from '../data/catalog.js';
import { chapterHeadings, splitPractice } from '../lib/content.js';
import { useProgress } from '../lib/progressContext.js';
import { useLang } from '../lib/langContext.js';
import { useCatalog, useContent } from '../lib/catalogContext.js';
import { usePageDescription } from '../lib/pageMeta.js';
import { analogyFor } from '../data/analogies.js';
import Markdown from './Markdown.jsx';
import Icon from './Icons.jsx';
import ContentStatus from './ContentStatus.jsx';
import { QuestionCard } from './Interviews.jsx';
import SourceExamples from './SourceExamples.jsx';
import PracticeSet, { InlineTitle } from './PracticeSet.jsx';
import { NoteLink } from './Navigation.jsx';
import './reader.css';
const VisualLab = lazy(() => import('./VisualLab.jsx'));

// Reading position ko section list mein highlight karo: last heading above the fold.
function useActiveHeading(headings, enabled) {
  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    if (!enabled || !headings.length) return;
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        let current = '';
        for (const heading of headings) {
          const element = document.getElementById(heading.id);
          if (element && element.getBoundingClientRect().top < window.innerHeight * 0.35)
            current = heading.id;
        }
        setActiveId(current || headings[0].id);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
    };
  }, [headings, enabled]);
  return activeId;
}

// Thin bar at the top that shows how far the chapter has been read.
function ReadingProgress() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setValue(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return (
    <div className="reading-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${value})` }} />
    </div>
  );
}

function Chapter({ note }) {
  const location = useLocation();
  const from = location.state?.from;
  const [params, setParams] = useSearchParams();
  const body = note.body;
  const { progress, toggle, visit } = useProgress();
  const { lang, t } = useLang();
  const { notes } = useCatalog();
  const analogy = analogyFor(note.id, lang);
  const tab = params.get('tab') === 'visual' && note.visual ? 'visual' : 'notes';
  const [largeText, setLargeText] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) return;
    const exitFocus = (event) => {
      if (event.key === 'Escape') setFocused(false);
    };
    window.addEventListener('keydown', exitFocus);
    return () => window.removeEventListener('keydown', exitFocus);
  }, [focused]);
  useEffect(() => {
    visit(note.id);
  }, [note.id, visit]);
  const track = trackById[note.track];
  const sequence = notes.filter((item) => item.track === note.track);
  const index = sequence.findIndex((item) => item.id === note.id);
  const next = sequence[index + 1];
  const previous = sequence[index - 1];
  const parts = useMemo(() => splitPractice(body, note.practiceSlugs), [body, note.practiceSlugs]);
  const conceptCount = useMemo(
    () =>
      body
        .split('\n## ')[0]
        .split('\n')
        .filter((line) => line.startsWith('- ')).length,
    [body],
  );
  const headings = useMemo(
    () => [
      ...chapterHeadings(note),
      ...(note.references?.length
        ? [{ id: 'source-examples', title: t('reader.sourceExamples') }]
        : []),
      ...(note.questionCount
        ? [{ id: 'chapter-practice', title: t('reader.interviewPractice') }]
        : []),
    ],
    [note, t],
  );
  const activeHeading = useActiveHeading(headings, tab === 'notes');
  const recallHeading = headings.find((heading) => /recall/i.test(heading.title));
  const complete = progress.completed.includes(note.id);
  return (
    <div
      className={`reader page-enter${largeText ? ' reader--large-text' : ''}${focused && tab === 'notes' ? ' reader--focused' : ''}`}
    >
      {tab === 'notes' && <ReadingProgress />}
      {from?.url?.startsWith('/') && !from.url.startsWith('//') && (
        <Link className="text-button reader-return" to={from.url} state={{ restoreKey: from.key }}>
          <Icon name="back" size={16} />{' '}
          {from.labelKey ? t(from.labelKey) : from.label || t('reader.back')}
        </Link>
      )}
      <header
        className="reader-hero"
        style={{ '--track-color': track.color, '--track-tint': track.tint }}
      >
        <div className="reader-breadcrumb">
          <Link to={`/library?track=${note.track}`}>
            <span className="subject-dot" style={{ background: track.color }} />
            {track.shortName || track.name}
          </Link>
          <Icon name="chevron" size={14} />
          <span>
            {t('reader.chapterOf', {
              index: String(index + 1).padStart(2, '0'),
              total: sequence.length,
            })}
          </span>
        </div>
        <div className="reader-heading">
          <div>
            <h1>{note.title}</h1>
            <p>{note.summary}</p>
          </div>
          <button
            className={`subtle-button save-toggle ${progress.saved.includes(note.id) ? 'is-saved' : ''}`}
            aria-pressed={progress.saved.includes(note.id)}
            onClick={() => toggle('saved', note.id)}
          >
            <Icon name="bookmark" size={17} />
            {progress.saved.includes(note.id) ? t('reader.saved') : t('reader.save')}
          </button>
        </div>
        <ul className="reader-glance" aria-label={t('reader.glanceLabel')}>
          <li>
            <span className="level-pill">{note.level}</span>
          </li>
          {note.minutes > 0 && (
            <li>
              <Icon name="clock" size={15} /> {t('reader.minutes', { minutes: note.minutes })}
            </li>
          )}
          <li>
            <Icon name="checklist" size={15} /> {t('reader.concepts', { count: conceptCount })}
          </li>
          {parts.questions.length > 0 && (
            <li>
              <Icon name="target" size={15} />{' '}
              {t('reader.practiceQuestions', { count: parts.questions.length })}
            </li>
          )}
          {note.visual && (
            <li>
              <Icon name="play" size={15} /> {t('reader.visual')}
            </li>
          )}
        </ul>
      </header>
      <div className="reader-quick-actions">
        <Link className="text-button" to={`/paths?track=${note.track}`}>
          <Icon name="path" size={16} />{' '}
          {note.stage && t('reader.stage', { stage: note.stageNumber })}
          {t('reader.lessonPath', { order: note.order, total: sequence.length })}
        </Link>
        <button
          className={complete ? 'subtle-button' : 'primary-button'}
          aria-pressed={complete}
          onClick={() => toggle('completed', note.id)}
        >
          <Icon name={complete ? 'check' : 'circle'} size={16} />{' '}
          {complete ? t('reader.completed') : t('reader.markComplete')}
        </button>
      </div>
      <div className="tab-bar">
        <button
          className={tab === 'notes' ? 'active' : ''}
          aria-pressed={tab === 'notes'}
          onClick={() => setParams({}, { state: location.state })}
        >
          <Icon name="book" size={16} /> {t('reader.tab.notes')}
        </button>
        {note.visual && (
          <button
            className={tab === 'visual' ? 'active' : ''}
            aria-pressed={tab === 'visual'}
            onClick={() => setParams({ tab: 'visual' }, { state: location.state })}
          >
            <Icon name="play" size={16} /> {t('reader.tab.visual')}
          </button>
        )}
      </div>
      {tab === 'visual' ? (
        <Suspense fallback={<p>{t('reader.visualLoading')}</p>}>
          <VisualLab embedded topic={note.visual} />
        </Suspense>
      ) : (
        <>
          {note.untranslated && lang === 'en' && (
            <p className="translation-notice" role="note">
              <Icon name="globe" size={16} /> {t('content.untranslated')}
            </p>
          )}
          <div className="reader-tools" role="group" aria-label={t('reader.controlsLabel')}>
            <div className="reader-tools-hint">
              <Icon name="book" size={17} />
              <span>{t('reader.hint')}</span>
            </div>
            <div className="reader-tools-actions">
              <button
                type="button"
                aria-label={t('reader.largeTextLabel')}
                aria-pressed={largeText}
                onClick={() => setLargeText(!largeText)}
              >
                <span className="reader-type-icon" aria-hidden="true">
                  Aa
                </span>{' '}
                {t('reader.largeText')}
              </button>
              <button
                type="button"
                aria-label={t('reader.focusLabel')}
                aria-pressed={focused}
                onClick={() => setFocused(!focused)}
              >
                <Icon name={focused ? 'check' : 'book'} size={15} /> {t('reader.focus')}
              </button>
              <Link to={`/play/flashcards?chapter=${note.id}`}>
                <Icon name="cards" size={15} /> {t('reader.flashcards')}
              </Link>
              {recallHeading && (
                <a
                  href={`#${recallHeading.id}`}
                  onClick={() => {
                    const target = document.getElementById(recallHeading.id);
                    if (target) {
                      target.tabIndex = -1;
                      target.focus({ preventScroll: true });
                    }
                  }}
                >
                  {t('reader.recall')} <Icon name="arrow" size={15} />
                </a>
              )}
            </div>
          </div>
          {focused && (
            <p className="reader-focus-hint" role="status">
              {t('reader.focusHint')}
            </p>
          )}
          <details className="mobile-toc">
            <summary>
              <Icon name="book" size={16} /> {t('reader.mobileToc', { count: headings.length })}{' '}
              <Icon name="down" size={16} />
            </summary>
            <nav aria-label={t('reader.sectionsLabel')}>
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  onClick={(event) => {
                    event.currentTarget.closest('details').open = false;
                    const target = document.getElementById(heading.id);
                    if (target) {
                      target.tabIndex = -1;
                      target.focus({ preventScroll: true });
                    }
                  }}
                >
                  {heading.title}
                </a>
              ))}
            </nav>
          </details>
          <div className="reader-layout">
            <article className="reader-article">
              {analogy && (
                <aside className="analogy-card" aria-label={t('analogy.reader')}>
                  <span className="section-kicker">
                    <Icon name="laugh" size={14} /> {t('analogy.kicker')}
                  </span>
                  <strong>
                    <InlineTitle text={analogy.title} />
                  </strong>
                  <p>
                    <InlineTitle text={analogy.text} />
                  </p>
                  <p className="analogy-catch">
                    <b>{t('analogy.catch')}:</b> <InlineTitle text={analogy.catch} />
                  </p>
                </aside>
              )}
              <Markdown recallAnswers headingIds={note.headingIds}>
                {parts.before}
              </Markdown>
              <PracticeSet noteId={note.id} questions={parts.questions} />
              {parts.after && (
                <Markdown recallAnswers headingIds={note.headingIds}>
                  {parts.after}
                </Markdown>
              )}
              <section className="chapter-play" aria-label={t('reader.playTitle')}>
                <div>
                  <span className="section-kicker">
                    <Icon name="gamepad" size={14} /> {t('reader.playKicker')}
                  </span>
                  <h3>{t('reader.playTitle')}</h3>
                  <p>{t('reader.playBody')}</p>
                </div>
                <div className="chapter-play-links">
                  <Link className="subtle-button" to={`/play/flashcards?chapter=${note.id}`}>
                    <Icon name="cards" size={16} /> {t('play.flashcards.name')}
                  </Link>
                  <Link className="subtle-button" to={`/play/quiz?chapter=${note.id}`}>
                    <Icon name="timer" size={16} /> {t('play.quiz.name')}
                  </Link>
                  <Link className="subtle-button" to={`/play/match?chapter=${note.id}`}>
                    <Icon name="grid" size={16} /> {t('play.match.name')}
                  </Link>
                </div>
              </section>
              <SourceExamples references={note.references || []} />
              {note.questionCount > 0 && <ChapterQuestions noteId={note.id} />}
              <div className="chapter-complete">
                <div>
                  <Icon name="complete" size={27} />
                  <div>
                    <h3>{complete ? t('reader.doneTitle') : t('reader.notDoneTitle')}</h3>
                    <p>{t('reader.doneBody')}</p>
                  </div>
                </div>
                <button
                  className={complete ? 'subtle-button' : 'primary-button'}
                  aria-pressed={complete}
                  onClick={() => toggle('completed', note.id)}
                >
                  <Icon name={complete ? 'check' : 'circle'} size={17} />
                  {complete ? t('reader.completed') : t('reader.markComplete')}
                </button>
              </div>
              <div className="chapter-navigation">
                {previous ? (
                  <NoteLink to={`/notes/${previous.id}`}>
                    <span>{t('reader.previous')}</span>
                    <strong>{previous.title}</strong>
                  </NoteLink>
                ) : (
                  <span />
                )}
                {next && (
                  <NoteLink to={`/notes/${next.id}`}>
                    <span>{t('reader.next')}</span>
                    <strong>{next.title}</strong>
                  </NoteLink>
                )}
              </div>
              {note.stage && note.stage.chapters.at(-1) === note.id && (
                <div className="stage-checkpoint">
                  <Icon name="check" size={20} />
                  <p>
                    <strong>{t('reader.stageCheckpoint')}</strong> {note.stage.checkpoint}
                  </p>
                </div>
              )}
              {!next && note.kind === 'chapter' && (
                <Link
                  className="primary-button"
                  to={`/interview?track=${note.track === 'interview' ? 'all' : note.track}`}
                >
                  {t('reader.courseComplete')} <Icon name="arrow" size={16} />
                </Link>
              )}
            </article>
            <aside className="reader-toc">
              <div className="toc-sticky">
                <span className="card-overline">
                  {t('reader.chapterMap')}{' '}
                  <span className="reader-section-count">{headings.length}</span>
                </span>
                <nav aria-label={t('reader.tocLabel')}>
                  {headings.map((heading, i) => (
                    <a
                      key={`${heading.id}-${i}`}
                      href={`#${heading.id}`}
                      className={activeHeading === heading.id ? 'active' : ''}
                      aria-current={activeHeading === heading.id ? 'location' : undefined}
                    >
                      <span className="reader-section-number" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{heading.title}</span>
                    </a>
                  ))}
                </nav>
                <div className="toc-tip">
                  <Icon name="sparkles" size={18} />
                  <strong>{t('reader.tipTitle')}</strong>
                  <p>{t('reader.tipBody')}</p>
                </div>
                <Link
                  to={`/interview?track=${note.track === 'interview' ? 'all' : note.track}`}
                  className="text-button"
                >
                  {t('reader.practiceLink')} <Icon name="arrow" size={15} />
                </Link>
                <div className="source-path">
                  <span>{t('reader.noteSource')}</span>
                  <code>{note.source}</code>
                </div>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
// The interview questions of a chapter sit near its end, so their answers are fetched only when
// the reader gets close to them. Without IntersectionObserver they load with the chapter.
function ChapterQuestions({ noteId }) {
  const { t } = useLang();
  const section = useRef(null);
  const [near, setNear] = useState(typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    if (near || !section.current) return undefined;
    const observer = new IntersectionObserver(
      (entries) => entries.some((entry) => entry.isIntersecting) && setNear(true),
      { rootMargin: '900px 0px' },
    );
    observer.observe(section.current);
    return () => observer.disconnect();
  }, [near]);
  const { noteById, ready, failed, retry } = useContent({ questions: near });
  const questions = near && ready ? noteById[noteId]?.questions || [] : null;
  return (
    <section className="chapter-practice" aria-labelledby="chapter-practice" ref={section}>
      <h2 id="chapter-practice">{t('reader.interviewPractice')}</h2>
      <p>{t('reader.interviewPracticeLead')}</p>
      {questions ? (
        questions.map((item, index) => (
          <QuestionCard key={item.id} item={item} number={index + 1} />
        ))
      ) : (
        <ContentStatus failed={failed} retry={retry} label={t('content.loadingQuestions')} />
      )}
    </section>
  );
}

// The page a reader sees for the moment a chapter's text is still on its way.
function ChapterLoading({ note, failed, retry }) {
  const { t } = useLang();
  const track = trackById[note.track];
  return (
    <div className="reader page-enter">
      <header
        className="reader-hero"
        style={{ '--track-color': track.color, '--track-tint': track.tint }}
      >
        <div className="reader-breadcrumb">
          <Link to={`/library?track=${note.track}`}>
            <span className="subject-dot" style={{ background: track.color }} />
            {track.shortName || track.name}
          </Link>
        </div>
        <div className="reader-heading">
          <div>
            <h1>{note.title}</h1>
            <p>{note.summary}</p>
          </div>
        </div>
      </header>
      <ContentStatus failed={failed} retry={retry} label={t('content.loadingChapter')} />
    </div>
  );
}

export default function Reader() {
  const { noteId } = useParams();
  const { t } = useLang();
  const isChapter = useCatalog().noteById[noteId]?.kind === 'chapter';
  const { noteById, ready, failed, retry } = useContent({
    chapters: isChapter ? noteId : undefined,
  });
  const note = noteById[noteId];
  const shown = Boolean(note && ready && note.body !== undefined);
  usePageDescription(note?.summary);
  // The route settles (focus on the heading, scroll to a #section) before late text arrives.
  // When the chapter replaces its loading page, do those two things again for the real page.
  const { hash } = useLocation();
  const waited = useRef(false);
  useEffect(() => {
    if (!shown) {
      waited.current = true;
      return;
    }
    if (!waited.current) return;
    waited.current = false;
    const heading = document.querySelector('#main-content h1');
    if (heading && document.activeElement === document.body) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
    if (!hash) return;
    let id = '';
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      // A malformed fragment simply does not scroll.
    }
    document.getElementById(id)?.scrollIntoView?.();
  }, [shown, noteId, hash]);
  if (note?.chapterId)
    return <Navigate to={`/notes/${note.chapterId}#source-${note.id}`} replace />;
  if (note && !shown) return <ChapterLoading note={note} failed={failed} retry={retry} />;
  return note ? (
    <Chapter key={note.id} note={note} />
  ) : (
    <div className="empty-state">
      <h1>{t('reader.notFound')}</h1>
      <Link to="/library" className="primary-button">
        {t('reader.backToLibrary')}
      </Link>
    </div>
  );
}
