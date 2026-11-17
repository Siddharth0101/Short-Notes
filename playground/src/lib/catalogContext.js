import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { ensure, getCatalog, getVersion, isReady, subscribe } from '../data/store.js';
import { useLang } from './langContext.js';

export const CatalogContext = createContext(null);
// Chapters, stages and interview questions in the reader's language. Chapter text and interview
// answers are only present once a screen has asked for them through `useContent`.
// Without a provider (an isolated component) the catalog is read straight from the store.
export function useCatalog() {
  const provided = useContext(CatalogContext);
  const { lang } = useLang();
  return provided ?? { ...getCatalog(lang), loading: false };
}

// Ask for content this screen needs and learn when it has arrived.
//   chapters: 'all', 'track:<id>' or one chapter id — the chapter text to fetch
//   questions: true — the interview question bank
// Returns the catalog plus `ready`, `failed` and `retry()`. Content that is already in memory is
// `ready` on the first render, so there is no loading flash on a second visit.
export function useContent({ chapters, questions = false } = {}) {
  const { lang } = useLang();
  // Subscribing here keeps the hook correct even where no provider re-renders the tree.
  useSyncExternalStore(subscribe, getVersion, getVersion);
  const catalog = useCatalog();
  const [attempt, setAttempt] = useState(0);
  const [failure, setFailure] = useState(null);
  const request = `${lang}|${chapters || ''}|${questions}|${attempt}`;
  const ready = isReady(lang, { chapters, questions });
  useEffect(() => {
    if (ready) return undefined;
    let current = true;
    ensure(lang, { chapters, questions }).catch(() => {
      if (current) setFailure(request);
    });
    return () => {
      current = false;
    };
  }, [ready, lang, chapters, questions, request]);
  return {
    ...catalog,
    ready,
    failed: !ready && failure === request,
    retry: () => setAttempt((count) => count + 1),
  };
}
