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
  const [notice, setNotice] = useState(null);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress));
    } catch {
      setStorageError(true);
    }
  }, [progress]);
  const toggle = (type, id) => {
    const wasSelected = progress[type].includes(id);
    setProgress((previous) => ({
      ...previous,
      [type]: previous[type].includes(id)
        ? previous[type].filter((value) => value !== id)
        : [...previous[type], id],
    }));
    const messages = {
      saved: wasSelected ? 'Bookmark hata diya.' : 'Bookmark save ho gaya.',
      completed: wasSelected ? 'Chapter dobara revise karna hai.' : 'Chapter revised. Nice!',
      known: wasSelected ? 'Question practice mein wapas.' : 'Concept clear mark ho gaya.',
    };
    setNotice({ type, id, wasSelected, message: messages[type] });
  };
  const undo = () => {
    if (!notice) return;
    const { type, id, wasSelected } = notice;
    setProgress((previous) => ({
      ...previous,
      [type]: wasSelected
        ? [...new Set([...previous[type], id])]
        : previous[type].filter((value) => value !== id),
    }));
    setNotice(null);
  };
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
      {notice && (
        <div className="progress-toast">
          <span role="status">{notice.message}</span>
          <button className="text-button" onClick={undo}>
            Undo
          </button>
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setNotice(null)}
          >
            ×
          </button>
        </div>
      )}
    </ProgressContext.Provider>
  );
}
