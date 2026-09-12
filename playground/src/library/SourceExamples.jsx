import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { legacyToMarkdown } from '../lib/content.js';
import Markdown from './Markdown.jsx';

function Example({ reference }) {
  const { hash } = useLocation();
  const anchor = `source-${reference.id}`;
  const [open, setOpen] = useState(hash === `#${anchor}`);
  useEffect(() => {
    if (hash === `#${anchor}`) {
      setOpen(true);
      document.getElementById(anchor)?.scrollIntoView?.({ block: 'start' });
    }
  }, [hash, anchor]);
  const [body, setBody] = useState('');
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!open || body) return;
    let current = true;
    setError(false);
    reference
      .load()
      .then((raw) => {
        if (current) setBody(legacyToMarkdown(raw, reference.language));
      })
      .catch(() => {
        if (current) setError(true);
      });
    return () => {
      current = false;
    };
  }, [open, body, reference, attempt]);
  return (
    <details
      id={anchor}
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="source-example"
    >
      <summary>{reference.title}</summary>
      {open && (
        <div className="source-example-body">
          <p className="source-caption">
            Course example · {reference.language} · Snippets may need their own runtime or project
            setup.
          </p>
          {reference.originalUrl && (
            <Link className="text-button" to={reference.originalUrl}>
              Open interactive playground →
            </Link>
          )}
          {error ? (
            <p role="alert">
              Example could not load.{' '}
              <button className="text-button" onClick={() => setAttempt(attempt + 1)}>
                Retry
              </button>
            </p>
          ) : body ? (
            <Markdown idPrefix={anchor}>{body}</Markdown>
          ) : (
            <p role="status">Loading example…</p>
          )}
        </div>
      )}
    </details>
  );
}
export default function SourceExamples({ references }) {
  if (!references.length) return null;
  return (
    <section className="source-examples" aria-labelledby="source-examples">
      <h2 id="source-examples">Source examples and walkthroughs</h2>
      <p>Expand an example to connect the lesson to the course code.</p>
      {references.map((reference) => (
        <Example key={reference.id} reference={reference} />
      ))}
    </section>
  );
}
