import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { legacyToMarkdown } from '../lib/content.js';
import { useLang } from '../lib/langContext.js';
import Markdown from './Markdown.jsx';
import Icon from './Icons.jsx';

function Example({ reference }) {
  const { hash } = useLocation();
  const { t } = useLang();
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
      <summary>
        <Icon name="code" size={17} />
        <span>{reference.title}</span>
        <span className="source-example-language">{reference.language}</span>
        <Icon name="down" size={16} />
      </summary>
      {open && (
        <div className="source-example-body">
          <p className="source-caption">{t('source.caption', { language: reference.language })}</p>
          {reference.originalUrl && (
            <Link className="text-button" to={reference.originalUrl}>
              {t('source.playground')}
            </Link>
          )}
          {error ? (
            <p role="alert">
              {t('source.error')}{' '}
              <button className="text-button" onClick={() => setAttempt(attempt + 1)}>
                {t('source.retry')}
              </button>
            </p>
          ) : body ? (
            <Markdown idPrefix={anchor}>{body}</Markdown>
          ) : (
            <p role="status">{t('source.loading')}</p>
          )}
        </div>
      )}
    </details>
  );
}
export default function SourceExamples({ references }) {
  const { t } = useLang();
  if (!references.length) return null;
  return (
    <section className="source-examples" aria-labelledby="source-examples">
      <h2 id="source-examples">{t('source.heading')}</h2>
      <p>{t('source.lead')}</p>
      {references.map((reference) => (
        <Example key={reference.id} reference={reference} />
      ))}
    </section>
  );
}
