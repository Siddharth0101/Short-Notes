import { useId, useState } from 'react';
import { PRACTICE_HEADING, PRACTICE_LEVELS, headingId } from '../lib/content.js';
import { useProgress } from '../lib/progressContext.js';
import Markdown from './Markdown.jsx';
import Icon from './Icons.jsx';

// Titles only use inline code, so keep them as plain heading text.
function InlineTitle({ text }) {
  return text
    .split(/(`[^`]+`)/)
    .map((part, index) =>
      part.startsWith('`') && part.endsWith('`') ? (
        <code key={index}>{part.slice(1, -1)}</code>
      ) : (
        part
      ),
    );
}

function practiceId(noteId, question) {
  return `${noteId}#${question.slug}`;
}

function PracticeCard({ noteId, question, number }) {
  const { progress, toggle } = useProgress();
  const [open, setOpen] = useState(false);
  const answerId = useId();
  const id = practiceId(noteId, question);
  const clear = progress.practiced.includes(id);
  return (
    <article
      className={`practice-card${clear ? ' is-clear' : ''}`}
      data-level={question.level.toLowerCase()}
      aria-labelledby={`${answerId}-title`}
    >
      <header className="practice-card-top">
        <span className="practice-number">Q{number}</span>
        <span className={`practice-level practice-level--${question.level.toLowerCase()}`}>
          {question.level}
        </span>
        {clear && (
          <span className="practice-clear-tag">
            <Icon name="check" size={13} /> Clear
          </span>
        )}
      </header>
      <h3 id={`${answerId}-title`}>
        <InlineTitle text={question.title} />
      </h3>
      {question.prompt && (
        <Markdown terms idPrefix={`practice-${number}`}>
          {question.prompt}
        </Markdown>
      )}
      <div className="practice-actions">
        <button
          type="button"
          className={open ? 'subtle-button' : 'primary-button'}
          aria-expanded={open}
          aria-controls={answerId}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? 'eyeOff' : 'eye'} size={16} />
          {open ? 'Answer chhupao' : 'Answer dekho'}
        </button>
        {!open && <span className="practice-hint">Pehle khud socho ya likho.</span>}
      </div>
      <div id={answerId} className="practice-answer" hidden={!open}>
        <span className="practice-answer-label">
          <Icon name="idea" size={15} /> Answer
        </span>
        <Markdown terms idPrefix={`practice-${number}-answer`}>
          {question.answer}
        </Markdown>
        <button
          type="button"
          className={`practice-mark${clear ? ' is-active' : ''}`}
          aria-pressed={clear}
          onClick={() => toggle('practiced', id)}
        >
          <Icon name={clear ? 'complete' : 'circle'} size={16} />
          {clear ? 'Clear mark hai' : 'Mera answer sahi tha — clear mark karo'}
        </button>
      </div>
    </article>
  );
}

export default function PracticeSet({ noteId, questions }) {
  const { progress } = useProgress();
  const [level, setLevel] = useState('All');
  if (!questions.length) return null;
  const clear = questions.filter((question) =>
    progress.practiced.includes(practiceId(noteId, question)),
  ).length;
  const shown = questions
    .map((question, index) => ({ question, number: index + 1 }))
    .filter(({ question }) => level === 'All' || question.level === level);
  const levels = [
    'All',
    ...PRACTICE_LEVELS.filter((item) => questions.some((q) => q.level === item)),
  ];
  return (
    <section className="practice-set" aria-labelledby={headingId(PRACTICE_HEADING)}>
      <div className="practice-set-head">
        <div>
          <span className="section-kicker">
            <Icon name="target" size={14} /> KHUD KO TEST KARO
          </span>
          <h2 id={headingId(PRACTICE_HEADING)}>{PRACTICE_HEADING}</h2>
          <p>
            Easy se Hard tak. Answer kholne se pehle apna jawab bolo ya likho — phir compare karo.
          </p>
        </div>
        <div className="practice-score" aria-label={`${clear} of ${questions.length} clear`}>
          <strong>
            {clear}
            <span>/{questions.length}</span>
          </strong>
          <span>clear</span>
          <progress value={clear} max={questions.length} aria-hidden="true" />
        </div>
      </div>
      <div className="practice-filter" role="group" aria-label="Question level">
        {levels.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={level === item}
            className={level === item ? 'active' : ''}
            onClick={() => setLevel(item)}
          >
            {item === 'All' ? `Sab (${questions.length})` : item}
          </button>
        ))}
      </div>
      <div className="practice-list">
        {shown.map(({ question, number }) => (
          <PracticeCard key={question.slug} noteId={noteId} question={question} number={number} />
        ))}
      </div>
    </section>
  );
}
