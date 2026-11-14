import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { TRACKS, filterNotes } from '../lib/content.js';
import { trackById, resources } from '../data/catalog.js';
import { useProgress } from '../lib/progressContext.js';
import { useLang } from '../lib/langContext.js';
import { useCatalog } from '../lib/catalogContext.js';
import { usePlay } from '../lib/playContext.js';
import Icon from './Icons.jsx';
import CourseOutline from './CourseOutline.jsx';
import { NoteLink } from './Navigation.jsx';

export function NoteRow({ note, index }) {
  const { progress, toggle } = useProgress();
  const { t } = useLang();
  const track = trackById[note.track];
  return (
    <article
      className="note-row"
      style={{ '--track-color': track.color, '--track-tint': track.tint }}
    >
      <span className={`note-row-number ${progress.completed.includes(note.id) ? 'done' : ''}`}>
        {progress.completed.includes(note.id) ? (
          <Icon name="check" size={18} />
        ) : (
          String(note.kind === 'chapter' ? note.order : index + 1).padStart(2, '0')
        )}
      </span>
      <NoteLink className="note-row-body" to={`/notes/${note.id}`}>
        <div className="note-row-title">
          <h3>{note.title}</h3>
          {note.visual && (
            <span className="visual-tag">
              <Icon name="play" size={11} /> {t('row.animated')}
            </span>
          )}
        </div>
        <p>{note.summary}</p>
        <div className="note-meta">
          <span style={{ color: track.color }}>{track.shortName || track.name}</span>
          <span>·</span>
          <span>{note.level}</span>
          {note.minutes > 0 && (
            <>
              <span>·</span>
              <span>{t('row.minRevision', { minutes: note.minutes })}</span>
            </>
          )}
          {note.practiceCount > 0 && (
            <>
              <span>·</span>
              <span>{t('row.practiceQs', { count: note.practiceCount })}</span>
            </>
          )}
        </div>
      </NoteLink>
      <button
        className={`icon-button save-button ${progress.saved.includes(note.id) ? 'is-saved' : ''}`}
        aria-label={t(progress.saved.includes(note.id) ? 'row.removeBookmark' : 'row.bookmark', {
          title: note.title,
        })}
        aria-pressed={progress.saved.includes(note.id)}
        onClick={() => toggle('saved', note.id)}
      >
        <Icon name="bookmark" size={18} />
      </button>
      <NoteLink
        to={`/notes/${note.id}`}
        className="icon-button row-open"
        aria-label={t('row.read', { title: note.title })}
      >
        <Icon name="arrow" size={18} />
      </NoteLink>
    </article>
  );
}

function ProgressBackup() {
  const { progress, importProgress } = useProgress();
  const { play, importPlay } = usePlay();
  const { t } = useLang();
  const input = useRef(null);
  const [message, setMessage] = useState('');
  function exportData() {
    // `play` (arcade stats) is optional in the backup format; version 1 readers ignore it.
    const url = URL.createObjectURL(
      new Blob([JSON.stringify({ version: 1, ...progress, play }, null, 2)], {
        type: 'application/json',
      }),
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'shortnotes-progress.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage('backup.downloaded');
  }
  async function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 1000000) throw new Error('backup.tooLarge');
      const value = JSON.parse(await file.text());
      const list = (key) =>
        Array.isArray(value[key]) && value[key].every((item) => typeof item === 'string');
      // `practiced` came later; older backups without it stay valid.
      if (
        value.version !== 1 ||
        !['saved', 'completed', 'known', 'recent'].every(list) ||
        (value.practiced !== undefined && !list('practiced'))
      )
        throw new Error('backup.invalid');
      importProgress(
        Object.fromEntries(
          ['saved', 'completed', 'known', 'practiced', 'recent'].map((key) => [
            key,
            [...new Set([...progress[key], ...(value[key] || [])])],
          ]),
        ),
      );
      // Always routed through the arcade store so imported milestones are not re-celebrated.
      importPlay(value.play && typeof value.play === 'object' ? value.play : null);
      setMessage('backup.merged');
    } catch (error) {
      setMessage(error.message?.startsWith('backup.') ? error.message : 'backup.unreadable');
    }
    event.target.value = '';
  }
  return (
    <div className="backup-panel">
      <div>
        <strong>{t('backup.title')}</strong>
        <p>{t('backup.body')}</p>
        <span role="status">{message && t(message)}</span>
      </div>
      <div className="button-group">
        <button className="subtle-button" onClick={exportData}>
          <Icon name="download" size={15} /> {t('backup.export')}
        </button>
        <button className="subtle-button" onClick={() => input.current.click()}>
          <Icon name="upload" size={15} /> {t('backup.import')}
        </button>
        <input
          ref={input}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          aria-label={t('backup.importLabel')}
          onChange={importData}
        />
      </div>
    </div>
  );
}

export default function Library({ saved = false, paths = false }) {
  const [params, setParams] = useSearchParams();
  const { progress } = useProgress();
  const { t } = useLang();
  const { notes } = useCatalog();
  const track = trackById[params.get('track')] ? params.get('track') : 'all';
  const query = params.get('q') || '';
  const level = ['Foundation', 'Intermediate', 'Advanced'].includes(params.get('level'))
    ? params.get('level')
    : 'all';
  const source = saved
    ? notes.filter(
        (note) =>
          progress.saved.includes(note.id) ||
          note.references.some((item) => progress.saved.includes(item.id)),
      )
    : notes;
  const status = ['completed', 'pending'].includes(params.get('status'))
    ? params.get('status')
    : 'all';
  const minutes = ['10', '15', '20'].includes(params.get('minutes'))
    ? params.get('minutes')
    : 'all';
  const sort =
    ['shortest', 'title'].includes(params.get('sort')) && !paths ? params.get('sort') : 'course';
  const filtered = filterNotes(source, { query, track, level }).filter(
    (note) =>
      (minutes === 'all' || note.minutes <= Number(minutes)) &&
      (status === 'completed'
        ? progress.completed.includes(note.id)
        : status === 'pending'
          ? !progress.completed.includes(note.id)
          : true),
  );
  if (sort === 'shortest')
    filtered.sort((a, b) => a.minutes - b.minutes || a.title.localeCompare(b.title));
  if (sort === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title));
  const hasFilters =
    !!query ||
    track !== 'all' ||
    level !== 'all' ||
    status !== 'all' ||
    minutes !== 'all' ||
    sort !== 'course';
  const selected = trackById[track];
  const trackNotes = selected ? notes.filter((note) => note.track === track) : [];
  const completed = trackNotes.filter((note) => progress.completed.includes(note.id)).length;
  const nextNote =
    trackNotes.find((note) => !progress.completed.includes(note.id)) || trackNotes[0];
  const update = (key, value) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (!value || value === 'all') next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  return (
    <div className={`collection-page page-enter ${paths ? 'paths-view' : 'browse-view'}`}>
      <div className="page-eyebrow">
        <span className="small-line" />{' '}
        {t(saved ? 'lib.eyebrow.saved' : paths ? 'lib.eyebrow.paths' : 'lib.eyebrow.browse')}
      </div>
      <div className="page-heading">
        <div>
          <h1>
            {saved
              ? t('lib.title.saved')
              : paths
                ? t('lib.title.paths')
                : selected?.name || t('lib.title.browse')}
            <span>.</span>
          </h1>
          <p>
            {saved
              ? t('lib.lead.saved')
              : paths
                ? t('lib.lead.paths')
                : selected
                  ? t(`track.${selected.id}.description`)
                  : t('lib.lead.browse')}
          </p>
        </div>
        <span className="count-pill">{t('lib.chaptersCount', { count: filtered.length })}</span>
      </div>
      {saved && <ProgressBackup />}
      {selected && !saved && !paths && (
        <section
          className="collection-overview"
          aria-label={t('lib.subjectProgress', { name: selected.name })}
          style={{ '--track-color': selected.color, '--track-tint': selected.tint }}
        >
          <span className="collection-icon">
            <Icon name={selected.icon} size={28} />
          </span>
          <div>
            <strong>
              {t('lib.chaptersRevised', { done: completed, total: trackNotes.length })}
            </strong>
            <p>{t(`track.${selected.id}.topics`)}</p>
            <progress
              aria-label={t('lib.subjectRevisionProgress')}
              value={completed}
              max={trackNotes.length}
            />
          </div>
          <NoteLink className="primary-button" to={`/notes/${nextNote.id}`}>
            {completed === trackNotes.length
              ? t('lib.reviseAgain')
              : completed
                ? t('lib.continueSubject')
                : t('lib.startSubject')}
            <Icon name="arrow" size={16} />
          </NoteLink>
        </section>
      )}
      <div className="filter-toolbar">
        <label className="filter-search">
          <Icon name="search" size={18} />
          <input
            placeholder={t('lib.searchPlaceholder')}
            aria-label={t('lib.searchLabel')}
            value={query}
            onChange={(event) => update('q', event.target.value)}
          />
          {query && (
            <button
              className="icon-button"
              aria-label={t('lib.clearSearch')}
              onClick={() => update('q', '')}
            >
              <Icon name="close" size={15} />
            </button>
          )}
        </label>
        <select
          aria-label={t('lib.filterDifficulty')}
          value={level}
          onChange={(event) => update('level', event.target.value)}
        >
          <option value="all">{t('lib.allLevels')}</option>
          <option>Foundation</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <select
          aria-label={t('lib.filterProgress')}
          value={status}
          onChange={(event) => update('status', event.target.value)}
        >
          <option value="all">{t('lib.allProgress')}</option>
          <option value="pending">{t('lib.pending')}</option>
          <option value="completed">{t('lib.revised')}</option>
        </select>
        <select
          aria-label={t('lib.filterTime')}
          value={minutes}
          onChange={(event) => update('minutes', event.target.value)}
        >
          <option value="all">{t('lib.anyDuration')}</option>
          {[10, 15, 20].map((value) => (
            <option key={value} value={value}>
              {t('lib.upTo', { minutes: value })}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-chips" aria-label={t('lib.filterSubject')}>
        <button
          aria-pressed={track === 'all'}
          className={track === 'all' ? 'active' : ''}
          onClick={() => update('track', 'all')}
        >
          {t('lib.allSubjects')}
        </button>
        {TRACKS.map((item) => (
          <button
            className={track === item.id ? 'active' : ''}
            aria-pressed={track === item.id}
            key={item.id}
            onClick={() => update('track', item.id)}
          >
            <span className="subject-dot" style={{ background: item.color }} />
            {item.shortName || item.name}
          </button>
        ))}
      </div>
      {paths && (
        <div className="learning-tip">
          <Icon name="path" />
          <p>
            <strong>{t('lib.routeTipTitle')}</strong> {t('lib.routeTipBody')}
          </p>
        </div>
      )}
      <div className="results-heading">
        <span role="status">
          {t('lib.results', { count: filtered.length })}
          {query && (
            <>
              {' '}
              {t('lib.resultsFor')} <strong>“{query}”</strong>
            </>
          )}
        </span>
        <div className="results-actions">
          {!paths && (
            <label className="collection-sort">
              <span>{t('lib.sort')}</span>
              <select
                aria-label={t('lib.sortLabel')}
                value={sort}
                onChange={(event) =>
                  update('sort', event.target.value === 'course' ? '' : event.target.value)
                }
              >
                <option value="course">{t('lib.sort.course')}</option>
                <option value="shortest">{t('lib.sort.shortest')}</option>
                <option value="title">{t('lib.sort.title')}</option>
              </select>
            </label>
          )}
          {hasFilters ? (
            <button className="text-button" onClick={() => setParams({}, { replace: true })}>
              <Icon name="reset" size={14} /> {t('lib.resetFilters')}
            </button>
          ) : paths ? (
            <span>{t('lib.sort.course')}</span>
          ) : null}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <Icon name={saved ? 'bookmark' : 'search'} size={32} />
          <h2>{saved && !source.length ? t('lib.empty.savedTitle') : t('lib.empty.title')}</h2>
          <p>{saved && !source.length ? t('lib.empty.savedBody') : t('lib.empty.body')}</p>
          {hasFilters && source.length > 0 ? (
            <button className="subtle-button" onClick={() => setParams({}, { replace: true })}>
              {t('lib.removeFilters')} <Icon name="reset" size={16} />
            </button>
          ) : (
            <Link className="subtle-button" to="/library">
              {t('lib.openAll')} <Icon name="arrow" size={16} />
            </Link>
          )}
        </div>
      ) : paths ? (
        <div className="learning-paths">
          {TRACKS.map((item) => {
            const chapters = filtered.filter((note) => note.track === item.id);
            if (!chapters.length) return null;
            return (
              <CourseOutline
                aria-pressed={track === item.id}
                key={item.id}
                track={item}
                visibleNotes={chapters}
                renderNote={(note, index) => <NoteRow key={note.id} note={note} index={index} />}
              />
            );
          })}
        </div>
      ) : track === 'all' && sort === 'course' ? (
        <div className="subject-collections">
          {TRACKS.map((item) => {
            const chapters = filtered.filter((note) => note.track === item.id);
            if (!chapters.length) return null;
            return (
              <section
                className="subject-collection"
                key={item.id}
                aria-label={t('lib.trackChapters', { name: item.name })}
              >
                <div className="collection-section-heading">
                  <h2>
                    <span className="subject-dot" style={{ background: item.color }} />
                    {item.name}
                  </h2>
                  <span>{t('lib.chaptersCount', { count: chapters.length })}</span>
                </div>
                <div className="note-list">
                  {chapters.map((note, index) => (
                    <NoteRow key={note.id} note={note} index={index} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="note-list">
          {filtered.map((note, index) => (
            <NoteRow key={note.id} note={note} index={index} />
          ))}
        </div>
      )}
      {!saved && (
        <details className="reference-drawer">
          <summary>{t('lib.pdfReferences')}</summary>
          <div className="resource-links">
            {resources.map((resource) => (
              <a key={resource.source} href={resource.url} target="_blank" rel="noreferrer">
                <Icon name="file" size={18} />
                <span>
                  <strong>{resource.title}</strong>
                  <small>{t('lib.pdfCaption')}</small>
                </span>
                <Icon name="external" size={17} />
              </a>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
