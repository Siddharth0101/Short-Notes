import hinglish from './hinglish.js';
import en from './en.js';
import playHinglish from './play.hinglish.js';
import playEn from './play.en.js';

// UI dictionaries by language id. Feature areas keep their own files and merge here.
export const dictionaries = {
  hinglish: { ...hinglish, ...playHinglish },
  en: { ...en, ...playEn },
};
