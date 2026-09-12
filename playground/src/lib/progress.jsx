import { useCallback, useEffect, useState } from 'react';
import { normalizeProgress } from './content.js';
import { noteById } from '../data/catalog.js';
import { ProgressContext } from './progressContext.js';

function migrateCourseProgress(value) {
  const progress = normalizeProgress(value);
  for (const key of ['saved', 'recent']) {
    progress[key] = [...new Set(progress[key].map((id) => noteById[id]?.chapterId || id))];
  }
  // Completing a source example does not imply completing its entire chapter.
  return progress;
}
const KEY = 'shortnotes.progress.v1';
export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    try {
      return migrateCourseProgress(JSON.parse(localStorage.getItem(KEY)));
    } catch {
      return normalizeProgress(null);
    }
  });
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress));
    } catch {
      setStorageError(true);
    }
  }, [progress]);
  const toggle = (type, id) =>
    setProgress((previous) => ({
      ...previous,
      [type]: previous[type].includes(id)
        ? previous[type].filter((value) => value !== id)
        : [...previous[type], id],
    }));
  const visit = useCallback(
    (id) =>
      setProgress((previous) =>
        previous.recent[0] === id
          ? previous
          : {
              ...previous,
              recent: [id, ...previous.recent.filter((value) => value !== id)].slice(0, 8),
            },
      ),
    [],
  );
  const importProgress = (value) => setProgress(migrateCourseProgress(value));
  return (
    <ProgressContext.Provider value={{ progress, toggle, visit, importProgress, storageError }}>
      {children}
    </ProgressContext.Provider>
  );
}
