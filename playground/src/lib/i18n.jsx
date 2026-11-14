import { useEffect, useMemo, useState } from 'react';
import { createTranslator, htmlLang, LANG_KEY, normalizeLang, readLang } from './lang.js';
import { LanguageContext } from './langContext.js';
import { dictionaries } from '../i18n/index.js';

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readLang);
  useEffect(() => {
    // Another tab changed the language: follow it, like the theme does.
    const storage = (event) => {
      if (event.key === LANG_KEY || event.key === null) setLangState(normalizeLang(event.newValue));
    };
    window.addEventListener('storage', storage);
    return () => window.removeEventListener('storage', storage);
  }, []);
  useEffect(() => {
    document.documentElement.lang = htmlLang(lang);
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* The choice still applies for this session. */
    }
  }, [lang]);
  const value = useMemo(
    () => ({
      lang,
      setLang: (next) => setLangState(normalizeLang(next)),
      t: createTranslator(dictionaries, lang),
    }),
    [lang],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
