import { useEffect, useState } from 'react';
import { notes, questionTotal } from '../data/catalog.js';
import { LANGUAGES } from '../lib/lang.js';
import { useLang } from '../lib/langContext.js';
import { forgetOffline, offlineStatus, offlineSupported, saveOffline } from '../lib/offline.js';
import Icon from './Icons.jsx';

// Save every chapter and interview answer of the reader's language for reading without
// internet. The service worker does the work; this panel shows where it stands.
export default function OfflinePanel() {
  const { lang, t } = useLang();
  const [phase, setPhase] = useState('checking'); // checking | ready | saving | failed | unavailable
  const [info, setInfo] = useState(null); // the worker's status for this language
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!offlineSupported()) return undefined;
    let current = true;
    setPhase('checking');
    offlineStatus()
      .then((status) => {
        if (!current) return;
        setInfo(status.langs[lang]);
        setPhase('ready');
      })
      .catch(() => current && setPhase('unavailable'));
    return () => {
      current = false;
    };
  }, [lang]);
  if (!offlineSupported()) return null;
  const language = LANGUAGES.find((item) => item.id === lang)?.label || lang;
  const saved = phase === 'ready' && info && info.saved === info.total;
  const size = info ? Math.max(0.1, info.bytes / 1048576).toFixed(1) : '…';
  async function save() {
    setPhase('saving');
    setMessage('');
    setProgress({ done: 0, total: info?.total || 0 });
    try {
      const status = await saveOffline(lang, ({ progress: done, total }) =>
        setProgress({ done, total }),
      );
      setInfo(status.langs[lang]);
      setPhase('ready');
    } catch {
      setPhase('failed');
    }
  }
  async function remove() {
    try {
      const status = await forgetOffline();
      setInfo(status.langs[lang]);
      setMessage('offline.removed');
    } catch {
      setMessage('offline.failed');
    }
  }
  return (
    <div className="backup-panel offline-panel">
      <div>
        <strong>
          <Icon name="offline" size={15} /> {t('offline.title')}
        </strong>
        {phase === 'checking' && <p>{t('offline.checking')}</p>}
        {phase === 'unavailable' && <p>{t('offline.unavailable')}</p>}
        {(phase === 'ready' || phase === 'failed') && (
          <p>
            {saved
              ? t('offline.saved', { chapters: notes.length, questions: questionTotal, language })
              : t('offline.body', { language, size })}
          </p>
        )}
        {phase === 'saving' && progress && (
          <>
            <p>{t('offline.saving', progress)}</p>
            <progress
              value={progress.done}
              max={progress.total || 1}
              aria-label={t('offline.progressLabel')}
            />
          </>
        )}
        <span role="status">
          {phase === 'failed' ? t('offline.failed') : message && t(message)}
        </span>
      </div>
      {(phase === 'ready' || phase === 'failed') && (
        <div className="button-group">
          {saved ? (
            <button className="subtle-button" onClick={remove}>
              <Icon name="trash" size={15} /> {t('offline.remove')}
            </button>
          ) : (
            <button className="primary-button" onClick={save}>
              <Icon name={phase === 'failed' ? 'refresh' : 'offline'} size={15} />{' '}
              {phase === 'failed' ? t('content.retry') : t('offline.save')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
