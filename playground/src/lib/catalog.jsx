import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { getCatalog, getVersion, isReady, loadEnglishMeta, subscribe } from '../data/store.js';
import { CatalogContext } from './catalogContext.js';
import { useLang } from './langContext.js';

export function CatalogProvider({ children }) {
  const { lang, t } = useLang();
  // The store's version moves whenever chapter text or answers arrive; consumers then re-render.
  const version = useSyncExternalStore(subscribe, getVersion, getVersion);
  const [failed, setFailed] = useState(false);
  const titlesReady = isReady(lang);
  useEffect(() => {
    if (titlesReady) return undefined;
    let current = true;
    setFailed(false);
    loadEnglishMeta().catch(() => {
      if (current) setFailed(true);
    });
    return () => {
      current = false;
    };
  }, [titlesReady]);
  const loading = !titlesReady && !failed;
  const value = useMemo(
    () => ({ ...getCatalog(lang), version, loading }),
    [lang, version, loading],
  );
  return (
    <CatalogContext.Provider value={value}>
      {loading && (
        <div className="content-loading" role="status">
          {t('content.loadingEnglish')}
        </div>
      )}
      {children}
    </CatalogContext.Provider>
  );
}
