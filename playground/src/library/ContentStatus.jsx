import { useLang } from '../lib/langContext.js';

// What a screen shows while its chapter text or answers are on the way, and the way to try again
// when they did not arrive (offline, flaky network).
export default function ContentStatus({ failed, retry, label }) {
  const { t } = useLang();
  return failed ? (
    <div className="content-status content-status--failed" role="alert">
      <p>
        {typeof navigator !== 'undefined' && navigator.onLine === false
          ? t('content.offline')
          : t('content.failed')}
      </p>
      <button className="primary-button" onClick={retry}>
        {t('content.retry')}
      </button>
    </div>
  ) : (
    <div className="content-status" role="status">
      <span className="content-spinner" aria-hidden="true" />
      {label || t('content.loading')}
    </div>
  );
}
