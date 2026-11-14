// Language preference: Hinglish is the notebook's original voice, English is the full translation.
export const LANG_KEY = 'shortnotes.lang';
export const DEFAULT_LANG = 'hinglish';
export const LANGUAGES = [
  { id: 'hinglish', label: 'Hinglish', htmlLang: 'hi-Latn' },
  { id: 'en', label: 'English', htmlLang: 'en' },
];
export function normalizeLang(value) {
  return LANGUAGES.some((language) => language.id === value) ? value : DEFAULT_LANG;
}
export function readLang() {
  try {
    return normalizeLang(localStorage.getItem(LANG_KEY));
  } catch {
    return DEFAULT_LANG;
  }
}
export function htmlLang(lang) {
  return LANGUAGES.find((language) => language.id === lang)?.htmlLang || 'hi-Latn';
}

// `{name}` placeholders; a `_one` sibling key handles the singular when `count` is 1.
export function format(template, vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match,
  );
}
export function createTranslator(dictionaries, lang) {
  const primary = dictionaries[lang] || {};
  const fallback = dictionaries[DEFAULT_LANG] || {};
  return function t(key, vars) {
    const singular = vars?.count === 1 ? `${key}_one` : null;
    const template =
      (singular && (primary[singular] ?? fallback[singular])) ??
      primary[key] ??
      fallback[key] ??
      key;
    return format(template, vars);
  };
}
