import { useEffect, useMemo, useState } from 'react';
import { getCatalog, loadEnglish } from '../data/localized.js';
import { CatalogContext } from './catalogContext.js';
import { useLang } from './langContext.js';

export function CatalogProvider({ children }) {
  const { lang, t } = useLang();
  const [english, setEnglish] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (lang !== 'en' || english) return;
    let current = true;
    setFailed(false);
    loadEnglish()
      .then((module) => {
        if (current) setEnglish(module);
      })
      .catch(() => {
        if (current) setFailed(true);
      });
    return () => {
      current = false;
    };
  }, [lang, english]);
  const loading = lang === 'en' && !english && !failed;
  const value = useMemo(
    () => ({ ...getCatalog(lang, english), loading }),
    [lang, english, loading],
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
