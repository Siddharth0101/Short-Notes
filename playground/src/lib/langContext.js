import { createContext, useContext } from 'react';
import { createTranslator, DEFAULT_LANG } from './lang.js';
import { dictionaries } from '../i18n/index.js';

// A default value keeps isolated components (tests, legacy routes) usable without a provider.
export const LanguageContext = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: createTranslator(dictionaries, DEFAULT_LANG),
});
export const useLang = () => useContext(LanguageContext);
