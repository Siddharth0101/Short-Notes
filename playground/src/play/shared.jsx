import { Link } from 'react-router-dom';
import { TRACKS } from '../lib/content.js';
import { useLang } from '../lib/langContext.js';
import Icon from '../library/Icons.jsx';
import { InlineTitle } from '../library/PracticeSet.jsx';

// Notes text uses backticks for code; cards and tiles render them as <code>.
export const Inline = InlineTitle;

export function DeckPicker({ deck, disabled = false }) {
  const { t } = useLang();
  const chapters = deck.notes.filter((note) => deck.track === 'all' || note.track === deck.track);
  return (
    <div className="deck-picker">
      <label>
        <span>{t('game.subject')}</span>
        <select
          aria-label={t('game.subjectLabel')}
          value={deck.track}
          disabled={disabled}
          onChange={(event) => deck.select({ track: event.target.value, chapter: 'all' })}
        >
          <option value="all">{t('lib.allSubjects')}</option>
          {TRACKS.map((track) => (
            <option key={track.id} value={track.id}>
              {track.shortName || track.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>{t('game.chapter')}</span>
        <select
          aria-label={t('game.chapterLabel')}
          value={deck.chapter}
          disabled={disabled}
          onChange={(event) => deck.select({ chapter: event.target.value })}
        >
          <option value="all">{t('game.allChapters')}</option>
          {chapters.map((note) => (
            <option key={note.id} value={note.id}>
              {deck.track === 'all' ? `${note.track} · ` : ''}
              {String(note.order).padStart(2, '0')} · {note.title}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function GameFrame({ icon, title, lead, children }) {
  const { t } = useLang();
  return (
    <div className="game-page page-enter">
      <Link className="text-button game-back" to="/play">
        <Icon name="back" size={16} /> {t('game.back')}
      </Link>
      <div className="game-heading">
        <span className="game-heading-icon">
          <Icon name={icon} size={24} />
        </span>
        <div>
          <h1>{title}</h1>
          <p>{lead}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
