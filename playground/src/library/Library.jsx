import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { TRACKS, filterNotes } from '../lib/content.js';
import { notes, trackById, resources } from '../data/catalog.js';
import { useProgress } from '../lib/progressContext.js';
import Icon from './Icons.jsx';
import CourseOutline from './CourseOutline.jsx';

export function NoteRow({ note, index }) {
  const { progress, toggle } = useProgress();
  const track = trackById[note.track];
  return (
    <article className="note-row">
      <span className={`note-row-number ${progress.completed.includes(note.id) ? 'done' : ''}`}>
        {progress.completed.includes(note.id) ? (
          <Icon name="check" size={18} />
        ) : (
          String(note.kind === 'chapter' ? note.order : index + 1).padStart(2, '0')
        )}
      </span>
      <Link className="note-row-body" to={`/notes/${note.id}`}>
        <div className="note-row-title">
          <h3>{note.title}</h3>
          {note.visual && (
            <span className="visual-tag">
              <Icon name="play" size={11} /> Animated walkthrough
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
              <span>{note.minutes} min study</span>
            </>
          )}
        </div>
      </Link>
      <button
        className={`icon-button save-button ${progress.saved.includes(note.id) ? 'is-saved' : ''}`}
        aria-label={`${progress.saved.includes(note.id) ? 'Remove bookmark for' : 'Bookmark'} ${note.title}`}
        aria-pressed={progress.saved.includes(note.id)}
        onClick={() => toggle('saved', note.id)}
      >
        <Icon name="bookmark" size={18} />
      </button>
      <Link
        to={`/notes/${note.id}`}
        className="icon-button row-open"
        aria-label={`Read ${note.title}`}
      >
        <Icon name="arrow" size={18} />
      </Link>
    </article>
  );
}

function ProgressBackup() {
  const { progress, importProgress } = useProgress();
  const input = useRef(null);
  const [message, setMessage] = useState('');
  function exportData() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify({ version: 1, ...progress }, null, 2)], {
        type: 'application/json',
      }),
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'shortnotes-progress.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage('Progress backup downloaded.');
  }
  async function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 1000000) throw new Error('Please use a progress backup smaller than 1 MB.');
      const value = JSON.parse(await file.text());
      if (
        value.version !== 1 ||
        !['saved', 'completed', 'known', 'recent'].every(
          (key) =>
            Array.isArray(value[key]) && value[key].every((item) => typeof item === 'string'),
        )
      )
        throw new Error('This isn’t a valid Shortnotes progress backup.');
      importProgress(
        Object.fromEntries(
          ['saved', 'completed', 'known', 'recent'].map((key) => [
            key,
            [...new Set([...progress[key], ...value[key]])],
          ]),
        ),
      );
      setMessage('Backup merged with your current progress.');
    } catch (error) {
      setMessage(error.message || 'The backup could not be read.');
    }
    event.target.value = '';
  }
  return (
    <div className="backup-panel">
      <div>
        <strong>Your progress travels with you.</strong>
        <p>Saved on this browser. Export a backup or merge one from another device.</p>
        <span role="status">{message}</span>
      </div>
      <div className="button-group">
        <button className="subtle-button" onClick={exportData}>
          <Icon name="download" size={15} /> Export
        </button>
        <button className="subtle-button" onClick={() => input.current.click()}>
          <Icon name="upload" size={15} /> Import
        </button>
        <input
          ref={input}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          aria-label="Import progress backup"
          onChange={importData}
        />
      </div>
    </div>
  );
}

export default function Library({ saved = false, paths = false }) {
  const [params, setParams] = useSearchParams();
  const { progress } = useProgress();
  const track = params.get('track') || 'all';
  const query = params.get('q') || '';
  const level = params.get('level') === 'Reference' ? 'all' : params.get('level') || 'all';
  const source = saved
    ? notes.filter(
        (note) =>
          progress.saved.includes(note.id) ||
          note.references.some((item) => progress.saved.includes(item.id)),
      )
    : notes;
  const filtered = filterNotes(source, { query, track, level });
  const selected = trackById[track];
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
    <div className="page-enter">
      <div className="page-eyebrow">
        <span className="small-line" />{' '}
        {saved
          ? 'KEEP THE GOOD STUFF CLOSE'
          : paths
            ? 'A LITTLE STRUCTURE GOES A LONG WAY'
            : 'YOUR KNOWLEDGE, ORGANIZED'}
      </div>
      <div className="page-heading">
        <div>
          <h1>
            {saved
              ? 'Your bookmarks'
              : paths
                ? 'One step, then the next'
                : selected?.name || 'The whole notebook'}
            <span>.</span>
          </h1>
          <p>
            {saved
              ? 'The ideas you want to come back to.'
              : paths
                ? 'Follow the sequence. Practice as you go. Make the concepts yours.'
                : selected?.description ||
                  'Choose a subject and follow its numbered stages from the first lesson.'}
          </p>
        </div>
        <span className="count-pill">{filtered.length} chapters</span>
      </div>
      {saved && <ProgressBackup />}
      {!saved && (
        <p className="learning-tip">
          One course, one sequence: learn the concept, explore the source examples, then answer the
          interview questions in the same chapter.
        </p>
      )}
      <div className="filter-toolbar">
        <label className="filter-search">
          <Icon name="search" size={18} />
          <input
            placeholder="Search concepts, source examples, or interview questions…"
            aria-label="Search this collection"
            value={query}
            onChange={(event) => update('q', event.target.value)}
          />
          {query && (
            <button
              className="icon-button"
              aria-label="Clear search"
              onClick={() => update('q', '')}
            >
              <Icon name="close" size={15} />
            </button>
          )}
        </label>
        <select
          aria-label="Filter difficulty"
          value={level}
          onChange={(event) => update('level', event.target.value)}
        >
          <option value="all">All levels</option>
          <option>Foundation</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>
      <div className="filter-chips" aria-label="Filter subject">
        <button className={track === 'all' ? 'active' : ''} onClick={() => update('track', 'all')}>
          All subjects
        </button>
        {TRACKS.map((item) => (
          <button
            className={track === item.id ? 'active' : ''}
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
            <strong>A suggested rhythm:</strong> JavaScript → React → frontend design. Java → Spring
            → backend design. Study DSA alongside either track. Har chapter ke baad bina notes dekhe
            concept explain karo.
          </p>
        </div>
      )}
      {!saved && (
        <div className="resource-links">
          {resources.map((resource) => (
            <a key={resource.source} href={resource.url} target="_blank" rel="noreferrer">
              <Icon name="file" size={18} />
              <span>
                <strong>{resource.title}</strong>
                <small>Existing PDF · opens in a new tab</small>
              </span>
              <Icon name="external" size={17} />
            </a>
          ))}
        </div>
      )}
      <div className="results-heading">
        <span>
          {filtered.length} results
          {query && (
            <>
              {' '}
              for <strong>“{query}”</strong>
            </>
          )}
        </span>
        <span>Course order · lesson numbers stay fixed when filtering</span>
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <Icon name={saved ? 'bookmark' : 'search'} size={32} />
          <h2>
            {saved && !query && track === 'all' ? 'Make a little collection.' : 'No notes found.'}
          </h2>
          <p>
            {saved
              ? 'Bookmark any chapter to find it here.'
              : 'Try a broader search or choose another subject.'}
          </p>
          <Link className="subtle-button" to="/library">
            Explore all notes <Icon name="arrow" size={16} />
          </Link>
        </div>
      ) : !saved ? (
        <div className="learning-paths">
          {TRACKS.map((item) => {
            const chapters = filtered.filter((note) => note.track === item.id);
            if (!chapters.length) return null;
            return (
              <CourseOutline
                key={item.id}
                track={item}
                visibleNotes={chapters}
                renderNote={(note, index) => <NoteRow key={note.id} note={note} index={index} />}
              />
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
    </div>
  );
}
