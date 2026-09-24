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
          <span className="card-overline">QUICK ANSWER</span>
          <Markdown>{item.answer}</Markdown>
          <div className="follow-up">
            <Icon name="messages" size={18} />
            <div>
              <strong>Thoda aur deep samjho</strong>
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
          {revealed ? 'Answer chhupao' : 'Answer dekho'}
          <Icon name={revealed ? 'close' : 'down'} size={16} />
        </button>
        <button
          className={`subtle-button ${known ? 'known-button' : ''}`}
          aria-pressed={known}
          onClick={() => toggle('known', item.id)}
        >
          <Icon name={known ? 'check' : 'circle'} size={15} />
          {known ? 'Concept clear hai' : 'Yeh samajh aa gaya'}
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
          <span className="card-overline">FOCUSED PRACTICE KARO</span>
          <h2 ref={heading} tabIndex={-1}>
            {finished
              ? 'Tumhare session ka review'
              : `Question ${index + 1} of ${questions.length}`}
          </h2>
        </div>
        <div className="button-group">
          {!finished && (
            <>
              <span className="mock-timer" role="timer" aria-label="Time remaining">
                {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
              </span>
              <button className="subtle-button" disabled={!remaining} onClick={toggleTimer}>
                {running ? 'Timer pause karo' : 'Timer continue karo'}
              </button>
            </>
          )}
          <button className="subtle-button" onClick={onClose}>
            {finished ? 'Questions par wapas' : 'Session khatam karo'}
          </button>
        </div>
      </div>
      <p className="mock-help">
        15-minute practice target hai. Drafts aur self-review sirf is session mein rehte hain;
        session chhodne par clear ho jaate hain.
      </p>
      {!remaining && !finished && (
        <p role="status" className="learning-tip">
          Time khatam. Answers compare karke review ab bhi complete kar sakte ho.
        </p>
      )}
      {finished ? (
        <>
          <p>
            {ratings.filter((r) => r.value === 'confident').length} of {questions.length} answers
            tumne clear mark kiye. Neeche explanations se next revision plan karo.
          </p>
          {ratings.map(({ item, value, draft: answer }) => (
            <details className="mock-review" key={item.id}>
              <summary>
                {value === 'confident' ? 'Confident' : 'Revisit'} · {item.question}
              </summary>
              <p className="mock-draft">{answer || 'Written draft nahi — bolkar answer diya.'}</p>
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
            Apna answer ya talking points likho
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Concept samjhao, example trace karo, failure aur tradeoff ka reason likho…"
              rows={5}
            />
          </label>
          <div className="mock-rubric">
            <strong>Aage badhne se pehle</strong>
            <span>Correct concept</span>
            <span>Apna example</span>
            <span>Failure ka case</span>
            <span>Tradeoff ka reason</span>
          </div>
          <div className="mock-actions">
            <button className="subtle-button" onClick={() => rate('revisit')}>
              Revision chahiye · Agla
            </button>
            <button className="primary-button" onClick={() => rate('confident')}>
              Clear hai · Agla <Icon name="arrow" size={16} />
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
  const updateFilter = (key, value) => {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value === 'all') next.delete(key);
      else next.set(key, value);
      return next;
    });
    setLimit(12);
  };
  const resetFilters = () => {
    setParams({});
    setQuery('');
    setLevel('all');
    setUnreviewed(false);
    setLimit(12);
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
            Jo seekha, use samjhao<span>.</span>
          </h1>
          <p>Pehle bolkar answer do, phir compare aur follow-up attempt karo.</p>
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
            <h3>Recall karo. Confidence badhao.</h3>
            <p>Short answers · follow-ups · 5-question mock</p>
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
            updateFilter('topic', event.target.value);
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
      <div className="filter-chips" aria-label="Interview subjects">
        <button
          aria-pressed={track === 'all'}
          className={track === 'all' ? 'active' : ''}
          onClick={() => updateFilter('track', 'all')}
        >
          Saare subjects
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
        <span role="status">{filtered.length} questions</span>
        {(query || track !== 'all' || topic !== 'all' || level !== 'all' || unreviewed) && (
          <button className="text-button" onClick={resetFilters}>
            <Icon name="reset" size={14} /> Reset filters
          </button>
        )}
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
          <h2>Is filter mein questions nahi mile.</h2>
          <p>Doosra filter lo ya practiced questions revise karo.</p>
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
