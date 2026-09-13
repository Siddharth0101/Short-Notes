import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { interviewQuestions } from '../data/interviewQuestions.js';
import { TRACKS } from '../lib/content.js';
import { notes, trackById } from '../data/catalog.js';
import { useProgress } from '../lib/progressContext.js';
import Icon from './Icons.jsx';
import Markdown from './Markdown.jsx';
import { INTERVIEW_TOPICS, questionTopic } from '../data/interviewTopics.js';

export function QuestionCard({ item, number }) {
  const [revealed, setRevealed] = useState(false);
  const { progress, toggle } = useProgress();
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
        <span className="question-number">QUESTION {String(number).padStart(2, '0')}</span>
        <div>
          <span style={{ color: trackById[item.track].color }}>
            {trackById[item.track].shortName || trackById[item.track].name}
          </span>
          <span className="level-pill">{item.level}</span>
          {known && <Icon name="complete" size={17} />}
        </div>
      </div>
      <h2>{item.question}</h2>
      {item.promptCode && <Markdown>{item.promptCode}</Markdown>}
      <div className="question-tags">
        {item.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      {revealed && (
        <div className="question-answer" id={`answer-${item.id}`}>
          <span className="card-overline">A STRONG ANSWER</span>
          <Markdown>{item.answer}</Markdown>
          <div className="follow-up">
            <Icon name="messages" size={18} />
            <div>
              <strong>Go one level deeper</strong>
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
            <Link className="text-button answer-reading" to={`/notes/${related.id}`}>
              <Icon name="book" size={16} /> Study: {related.title} <Icon name="arrow" size={16} />
            </Link>
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
          {revealed ? 'Hide answer' : 'Reveal answer'}
          <Icon name={revealed ? 'close' : 'down'} size={16} />
        </button>
        <button
          className={`subtle-button ${known ? 'known-button' : ''}`}
          aria-pressed={known}
          onClick={() => toggle('known', item.id)}
        >
          <Icon name={known ? 'check' : 'circle'} size={15} />
          {known ? 'Feeling confident' : 'I know this'}
        </button>
      </div>
    </article>
  );
}

function MockSession({ questions, onClose }) {
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
    <section className="mock-session" aria-label="Mock interview session">
      <div className="mock-header">
        <div>
          <span className="card-overline">FOCUSED PRACTICE</span>
          <h2 ref={heading} tabIndex={-1}>
            {finished ? 'Your session review' : `Question ${index + 1} of ${questions.length}`}
          </h2>
        </div>
        <div className="button-group">
          {!finished && (
            <>
              <span className="mock-timer" role="timer" aria-label="Time remaining">
                {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
              </span>
              <button className="subtle-button" disabled={!remaining} onClick={toggleTimer}>
                {running ? 'Pause timer' : 'Resume timer'}
              </button>
            </>
          )}
          <button className="subtle-button" onClick={onClose}>
            {finished ? 'Back to questions' : 'End session'}
          </button>
        </div>
      </div>
      <p className="mock-help">
        15-minute practice target. Drafts and self-assessments stay in this session only; leaving
        clears them.
      </p>
      {!remaining && !finished && (
        <p role="status" className="learning-tip">
          Time is up. You can still compare answers and finish your review.
        </p>
      )}
      {finished ? (
        <>
          <p>
            {ratings.filter((r) => r.value === 'confident').length} of {questions.length} self-rated
            confident. Use the explanations below to plan your next revision.
          </p>
          {ratings.map(({ item, value, draft: answer }) => (
            <details className="mock-review" key={item.id}>
              <summary>
                {value === 'confident' ? 'Confident' : 'Revisit'} · {item.question}
              </summary>
              <p className="mock-draft">{answer || 'No written draft — answered aloud.'}</p>
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
            Your answer or talking points
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Explain the model, trace an example, name a failure case, then justify your tradeoff…"
              rows={5}
            />
          </label>
          <div className="mock-rubric">
            <strong>Before you move on</strong>
            <span>Correct model</span>
            <span>Concrete example</span>
            <span>Failure case</span>
            <span>Clear tradeoff</span>
          </div>
          <div className="mock-actions">
            <button className="subtle-button" onClick={() => rate('revisit')}>
              Needs revision · Next
            </button>
            <button className="primary-button" onClick={() => rate('confident')}>
              Confident · Next <Icon name="arrow" size={16} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
export default function Interviews() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('all');
  const [unreviewed, setUnreviewed] = useState(false);
  const [order, setOrder] = useState(interviewQuestions.map((item) => item.id));
  const [session, setSession] = useState(0);
  const [limit, setLimit] = useState(12);
  const [mock, setMock] = useState(null);
  const { progress } = useProgress();
  const track = params.get('track') || 'all';
  const topic = params.get('topic') || 'all';
  const filtered = interviewQuestions
    .filter(
      (item) =>
        (track === 'all' || item.track === track) &&
        (topic === 'all' || questionTopic(item) === topic) &&
        (level === 'all' || item.level === level) &&
        (!unreviewed || !progress.known.includes(item.id)) &&
        `${item.question} ${item.promptCode || ''} ${item.answer} ${item.tags.join(' ')}`
          .toLowerCase()
          .includes(query.toLowerCase()),
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
        <span className="small-line" /> PREPARATION, WITH INTENTION
      </div>
      <div className="page-heading">
        <div>
          <h1>
            Let’s talk about what you know<span>.</span>
          </h1>
          <p>Think out loud, reveal the answer, then challenge yourself with a follow-up.</p>
        </div>
        <button className="subtle-button" onClick={shuffle}>
          <Icon name="shuffle" size={16} /> Shuffle questions
        </button>
      </div>
      <div className="interview-summary">
        <div>
          <span className="track-icon">
            <Icon name="messages" size={27} />
          </span>
          <div>
            <h3>Understanding beats memorizing.</h3>
            <p>Pehle apne words mein answer do. Phir compare karo.</p>
          </div>
        </div>
        <div className="interview-score">
          <strong>
            {known}
            <span> / {interviewQuestions.length}</span>
          </strong>
          <span>feeling confident</span>
        </div>
      </div>
      <div className="filter-toolbar">
        <label className="filter-search">
          <Icon name="search" size={18} />
          <input
            aria-label="Search interview questions"
            placeholder="Search interview questions…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <select
          aria-label="Interview topic"
          value={topic}
          onChange={(event) => {
            setParams(event.target.value === 'all' ? {} : { topic: event.target.value });
            setLimit(12);
          }}
        >
          <option value="all">All topics</option>
          {INTERVIEW_TOPICS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Interview difficulty"
          value={level}
          onChange={(event) => setLevel(event.target.value)}
        >
          <option value="all">All levels</option>
          <option>Foundation</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={unreviewed}
            onChange={(event) => setUnreviewed(event.target.checked)}
          />{' '}
          Still practicing
        </label>
      </div>
      <div className="filter-chips">
        <button className={track === 'all' ? 'active' : ''} onClick={() => setParams({})}>
          All subjects
        </button>
        {TRACKS.filter((item) => item.id !== 'interview').map((item) => (
          <button
            className={track === item.id ? 'active' : ''}
            key={item.id}
            onClick={() => setParams({ track: item.id })}
          >
            {item.shortName || item.name}
          </button>
        ))}
      </div>
      <div className="results-heading">
        <span>{filtered.length} questions</span>
        <button
          className="primary-button"
          disabled={!filtered.length}
          onClick={() => setMock(filtered.slice(0, 5))}
        >
          <Icon name="clock" size={16} /> Start mock interview · {Math.min(filtered.length, 5)}{' '}
          questions
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
          <h2>No questions in this view.</h2>
          <p>Try another filter, or revisit the questions you already know.</p>
        </div>
      )}
      {filtered.length > limit && (
        <button className="subtle-button load-more" onClick={() => setLimit(limit + 12)}>
          Load 12 more questions <Icon name="down" size={16} />
        </button>
      )}
    </div>
  );
}
