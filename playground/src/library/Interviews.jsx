import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TRACKS } from '../lib/content.js';
import { trackById } from '../data/catalog.js';
import { useProgress } from '../lib/progressContext.js';
import { useLang } from '../lib/langContext.js';
import { useCatalog } from '../lib/catalogContext.js';
import Icon from './Icons.jsx';
import Markdown from './Markdown.jsx';
import { INTERVIEW_TOPICS, questionTopic } from '../data/interviewTopics.js';
import { NoteLink } from './Navigation.jsx';

export function QuestionCard({ item, number }) {
  const [revealed, setRevealed] = useState(false);
  const { progress, toggle } = useProgress();
  const { lang, t } = useLang();
  const { notes } = useCatalog();
  const known = progress.known.includes(item.id);
  const related = item.noteId
    ? notes.find((note) => note.id === item.noteId)
    : notes
        .filter((note) => note.track === item.track)
        .map((note) => ({ note, score: note.tags.filter((tag) => item.tags.includes(tag)).length }))
        .sort((a, b) => b.score - a.score)[0]?.note;
  return (
    <article className={`question-card ${known ? 'known' : ''}`}>
      <div className="question-top">
        <span className="question-number">
          {t('iq.question', { number: String(number).padStart(2, '0') })}
        </span>
        <div>
          <span style={{ color: trackById[item.track].color }}>
            {trackById[item.track].shortName || trackById[item.track].name}
          </span>
          <span className="level-pill">{item.level}</span>
          {known && <Icon name="complete" size={17} />}
        </div>
      </div>
      <h2>{item.question}</h2>
      {item.untranslated && lang === 'en' && (
        <p className="translation-notice translation-notice--inline" role="note">
          <Icon name="globe" size={14} /> {t('iq.untranslated')}
        </p>
      )}
      {item.promptCode && <Markdown>{item.promptCode}</Markdown>}
      <div className="question-tags">
        {item.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      {revealed && (
        <div className="question-answer" id={`answer-${item.id}`}>
          <span className="card-overline">{t('iq.quickAnswer')}</span>
          <Markdown>{item.answer}</Markdown>
          <div className="follow-up">
            <Icon name="messages" size={18} />
            <div>
              <strong>{t('iq.deeper')}</strong>
              <p>{item.followUp}</p>
            </div>
          </div>
          {item.sources?.map((source) => (
            <a
              className="text-button answer-reading"
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              {source.title} ↗
            </a>
          ))}
          {related && (
            <NoteLink className="text-button answer-reading" to={`/notes/${related.id}`}>
              <Icon name="book" size={16} /> {t('iq.study', { title: related.title })}{' '}
              <Icon name="arrow" size={16} />
            </NoteLink>
          )}
        </div>
      )}
      <div className="question-actions">
        <button
          className="text-button"
          aria-expanded={revealed}
          aria-controls={`answer-${item.id}`}
          onClick={() => setRevealed(!revealed)}
        >
          {revealed ? t('iq.hide') : t('iq.show')}
          <Icon name={revealed ? 'close' : 'down'} size={16} />
        </button>
        <button
          className={`subtle-button ${known ? 'known-button' : ''}`}
          aria-pressed={known}
          onClick={() => toggle('known', item.id)}
        >
          <Icon name={known ? 'check' : 'circle'} size={15} />
          {known ? t('iq.known') : t('iq.markKnown')}
        </button>
      </div>
    </article>
  );
}

function MockSession({ questions, onClose }) {
  const { t } = useLang();
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState('');
  const [ratings, setRatings] = useState([]);
  const [remaining, setRemaining] = useState(15 * 60);
  const [running, setRunning] = useState(true);
  const deadline = useRef(Date.now() + 15 * 60 * 1000);
  const heading = useRef(null);
  const finished = index >= questions.length;
  useEffect(() => {
    heading.current?.focus();
  }, [index]);
  useEffect(() => {
    if (!running || finished) return;
    const timer = setInterval(() => {
      const next = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setRemaining(next);
      if (!next) setRunning(false);
    }, 250);
    return () => clearInterval(timer);
  }, [running, finished]);
  function toggleTimer() {
    if (running) setRemaining(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)));
    else deadline.current = Date.now() + remaining * 1000;
    setRunning(!running);
  }
  function rate(value) {
    setRatings([...ratings, { item: questions[index], value, draft }]);
    setDraft('');
    setIndex(index + 1);
  }
  return (
    <section className="mock-session" aria-label={t('mock.label')}>
      <div className="mock-header">
        <div>
          <span className="card-overline">{t('mock.overline')}</span>
          <h2 ref={heading} tabIndex={-1}>
            {finished
              ? t('mock.review')
              : t('mock.questionOf', { index: index + 1, total: questions.length })}
          </h2>
        </div>
        <div className="button-group">
          {!finished && (
            <>
              <span className="mock-timer" role="timer" aria-label={t('mock.timeRemaining')}>
                {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
              </span>
              <button className="subtle-button" disabled={!remaining} onClick={toggleTimer}>
                {running ? t('mock.pause') : t('mock.resume')}
              </button>
            </>
          )}
          <button className="subtle-button" onClick={onClose}>
            {finished ? t('mock.back') : t('mock.end')}
          </button>
        </div>
      </div>
      <p className="mock-help">{t('mock.help')}</p>
      {!remaining && !finished && (
        <p role="status" className="learning-tip">
          {t('mock.timeUp')}
        </p>
      )}
      {finished ? (
        <>
          <p>
            {t('mock.summary', {
              confident: ratings.filter((r) => r.value === 'confident').length,
              total: questions.length,
            })}
          </p>
          {ratings.map(({ item, value, draft: answer }) => (
            <details className="mock-review" key={item.id}>
              <summary>
                {value === 'confident' ? t('mock.confident') : t('mock.revisit')} · {item.question}
              </summary>
              <p className="mock-draft">{answer || t('mock.noDraft')}</p>
              <QuestionCard
                item={item}
                number={ratings.findIndex((r) => r.item.id === item.id) + 1}
              />
            </details>
          ))}
        </>
      ) : (
        <>
          <QuestionCard key={questions[index].id} item={questions[index]} number={index + 1} />
          <label className="mock-answer">
            {t('mock.answerLabel')}
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t('mock.placeholder')}
              rows={5}
            />
          </label>
          <div className="mock-rubric">
            <strong>{t('mock.rubric')}</strong>
            <span>{t('mock.rubric1')}</span>
            <span>{t('mock.rubric2')}</span>
            <span>{t('mock.rubric3')}</span>
            <span>{t('mock.rubric4')}</span>
          </div>
          <div className="mock-actions">
            <button className="subtle-button" onClick={() => rate('revisit')}>
              {t('mock.needsRevision')}
            </button>
            <button className="primary-button" onClick={() => rate('confident')}>
              {t('mock.clearNext')} <Icon name="arrow" size={16} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
export default function Interviews() {
  const [params, setParams] = useSearchParams();
  const { t } = useLang();
  const { questions: interviewQuestions } = useCatalog();
  const query = params.get('q') || '';
  const level = ['Foundation', 'Intermediate', 'Advanced'].includes(params.get('level'))
    ? params.get('level')
    : 'all';
  const unreviewed = params.get('status') === 'practicing';
  const [order, setOrder] = useState(interviewQuestions.map((item) => item.id));
  const [session, setSession] = useState(0);
  const limit = Math.max(
    12,
    Math.min(interviewQuestions.length, Number(params.get('limit')) || 12),
  );
  const [mock, setMock] = useState(null);
  const nextQuestion = useRef(null);
  useEffect(() => {
    if (nextQuestion.current === null) return;
    const heading = document.querySelectorAll('.question-list .question-card h2')[
      nextQuestion.current
    ];
    if (heading) {
      heading.tabIndex = -1;
      heading.focus();
    }
    nextQuestion.current = null;
  }, [limit]);
  const { progress } = useProgress();
  const track = TRACKS.some((item) => item.id === params.get('track') && item.id !== 'interview')
    ? params.get('track')
    : 'all';
  const topic = INTERVIEW_TOPICS.some((item) => item.id === params.get('topic'))
    ? params.get('topic')
    : 'all';
  const updateFilter = (key, value) => {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (!value || value === 'all') next.delete(key);
        else next.set(key, value);
        next.delete('limit');
        return next;
      },
      { replace: true },
    );
  };
  const resetFilters = () => {
    setParams({}, { replace: true });
  };
  const filtered = interviewQuestions
    .filter(
      (item) =>
        (track === 'all' || item.track === track) &&
        (topic === 'all' || questionTopic(item) === topic) &&
        (level === 'all' || item.level === level) &&
        (!unreviewed || !progress.known.includes(item.id)) &&
        `${item.question} ${item.promptCode || ''} ${item.answer} ${item.tags.join(' ')}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  function shuffle() {
    const ids = [...order];
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setOrder(ids);
    setSession(session + 1);
  }
  const known = interviewQuestions.filter((item) => progress.known.includes(item.id)).length;
  if (mock)
    return (
      <div className="interview-page page-enter">
        <MockSession questions={mock} onClose={() => setMock(null)} />
      </div>
    );
  return (
    <div className="interview-page page-enter">
      <div className="page-eyebrow">
        <span className="small-line" /> {t('iq.eyebrow')}
      </div>
      <div className="page-heading">
        <div>
          <h1>
            {t('iq.title')}
            <span>.</span>
          </h1>
          <p>{t('iq.lead')}</p>
        </div>
        <button className="subtle-button" onClick={shuffle}>
          <Icon name="shuffle" size={16} /> {t('iq.shuffle')}
        </button>
      </div>
      <div className="interview-summary">
        <div>
          <span className="track-icon">
            <Icon name="messages" size={27} />
          </span>
          <div>
            <h3>{t('iq.summaryTitle')}</h3>
            <p>{t('iq.summaryBody')}</p>
          </div>
        </div>
        <div className="interview-score">
          <strong>
            {known}
            <span> / {interviewQuestions.length}</span>
          </strong>
          <span>{t('iq.confident')}</span>
        </div>
      </div>
      <div className="filter-toolbar">
        <label className="filter-search">
          <Icon name="search" size={18} />
          <input
            aria-label={t('iq.searchLabel')}
            placeholder={t('iq.searchPlaceholder')}
            value={query}
            onChange={(event) => updateFilter('q', event.target.value)}
          />
          {query && (
            <button
              className="icon-button"
              aria-label={t('iq.clearSearch')}
              onClick={() => updateFilter('q', '')}
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </label>
        <select
          aria-label={t('iq.topicLabel')}
          value={topic}
          onChange={(event) => {
            updateFilter('topic', event.target.value);
          }}
        >
          <option value="all">{t('iq.allTopics')}</option>
          {INTERVIEW_TOPICS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          aria-label={t('iq.levelLabel')}
          value={level}
          onChange={(event) => updateFilter('level', event.target.value)}
        >
          <option value="all">{t('iq.allLevels')}</option>
          <option>Foundation</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={unreviewed}
            onChange={(event) =>
              updateFilter('status', event.target.checked ? 'practicing' : 'all')
            }
          />{' '}
          {t('iq.stillPracticing')}
        </label>
      </div>
      <div className="filter-chips" aria-label={t('iq.subjectsLabel')}>
        <button
          aria-pressed={track === 'all'}
          className={track === 'all' ? 'active' : ''}
          onClick={() => updateFilter('track', 'all')}
        >
          {t('iq.allSubjects')}
        </button>
        {TRACKS.filter((item) => item.id !== 'interview').map((item) => (
          <button
            className={track === item.id ? 'active' : ''}
            key={item.id}
            aria-pressed={track === item.id}
            onClick={() => updateFilter('track', item.id)}
          >
            {item.shortName || item.name}
          </button>
        ))}
      </div>
      <div className="results-heading">
        <span role="status">
          {t('iq.results', { count: filtered.length, shown: Math.min(limit, filtered.length) })}
        </span>
        {(query || track !== 'all' || topic !== 'all' || level !== 'all' || unreviewed) && (
          <button className="text-button" onClick={resetFilters}>
            <Icon name="reset" size={14} /> {t('iq.reset')}
          </button>
        )}
        <button
          className="primary-button"
          disabled={!filtered.length}
          onClick={() => setMock(filtered.slice(0, 5))}
        >
          <Icon name="clock" size={16} />{' '}
          {t('iq.startMock', { count: Math.min(filtered.length, 5) })}
        </button>
      </div>
      <div className="question-list">
        {filtered.slice(0, limit).map((item, i) => (
          <QuestionCard key={`${item.id}-${session}`} item={item} number={i + 1} />
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <Icon name="messages" size={32} />
          <h2>{t('iq.emptyTitle')}</h2>
          <p>{t('iq.emptyBody')}</p>
          <button className="subtle-button" onClick={resetFilters}>
            {t('iq.removeFilters')} <Icon name="reset" size={16} />
          </button>
        </div>
      )}
      {filtered.length > limit && (
        <button
          className="subtle-button load-more"
          onClick={() => {
            nextQuestion.current = limit;
            setParams(
              (previous) => {
                const next = new URLSearchParams(previous);
                next.set('limit', String(limit + 12));
                return next;
              },
              { replace: true },
            );
          }}
        >
          {t('iq.loadMore', { count: Math.min(12, filtered.length - limit) })}{' '}
          <Icon name="down" size={16} />
        </button>
      )}
    </div>
  );
}
