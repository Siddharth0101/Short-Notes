import { useSyncExternalStore } from 'react';
import { applyUpdate, getOfflineState, subscribeOffline } from '../lib/offline.js';
import { useLang } from '../lib/langContext.js';
import Icon from './Icons.jsx';

// A new release was downloaded in the background. It takes over only when the reader agrees,
// so nothing changes under a page they are reading.
export default function UpdatePrompt() {
  const { t } = useLang();
  const { updateReady } = useSyncExternalStore(subscribeOffline, getOfflineState, getOfflineState);
  if (!updateReady) return null;
  return (
    <div className="update-prompt" role="status">
      <span>{t('update.ready')}</span>
      <button className="primary-button" onClick={applyUpdate}>
        <Icon name="refresh" size={15} /> {t('update.reload')}
      </button>
    </div>
  );
}
