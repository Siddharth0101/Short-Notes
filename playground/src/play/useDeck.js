import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TRACKS } from '../lib/content.js';
import { useCatalog } from '../lib/catalogContext.js';
import { deckFor } from './decks.js';

// Subject/chapter selection lives in the URL so the reader can deep-link a chapter into a game.
export function useDeck() {
  const [params, setParams] = useSearchParams();
  const { notes, noteById } = useCatalog();
  const requested = noteById[params.get('chapter')];
  const chapter = requested?.kind === 'chapter' ? requested.id : 'all';
  const track =
    chapter !== 'all'
      ? requested.track
      : TRACKS.some((item) => item.id === params.get('track'))
        ? params.get('track')
        : 'all';
  const cards = useMemo(() => deckFor(notes, { track, chapter }), [notes, track, chapter]);
  const select = (next) => {
    const value = { track, chapter, ...next };
    const query = {};
    if (value.chapter !== 'all') query.chapter = value.chapter;
    else if (value.track !== 'all') query.track = value.track;
    setParams(query, { replace: true });
  };
  return { track, chapter, cards, select, notes, noteById };
}
