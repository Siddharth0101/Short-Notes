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
              <Icon name="play" size={11} /> Animated example
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
    setMessage('Progress backup download ho gaya.');
  }
  async function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 1000000) throw new Error('1 MB se chhota progress backup use karo.');
      const value = JSON.parse(await file.text());
      if (
        value.version !== 1 ||
        !['saved', 'completed', 'known', 'recent'].every(
          (key) =>
            Array.isArray(value[key]) && value[key].every((item) => typeof item === 'string'),
        )
      )
        throw new Error('Yeh valid Shortnotes progress backup nahi hai.');
      importProgress(
        Object.fromEntries(
          ['saved', 'completed', 'known', 'recent'].map((key) => [
            key,
            [...new Set([...progress[key], ...value[key]])],
          ]),
        ),
      );
      setMessage('Backup current progress ke saath merge ho gaya.');
    } catch (error) {
      setMessage(error.message || 'Backup read nahi ho saka.');
    }
    event.target.value = '';
  }
  return (
    <div className="backup-panel">
      <div>
        <strong>Apni progress ka backup rakho.</strong>
        <p>
          Progress is browser mein saved hai. Backup export karo ya doosre device ka merge karo.
        </p>
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
          ? 'IMPORTANT CONCEPTS SAVE RAKHO'
          : paths
            ? 'STEP-BY-STEP PADHO'
            : 'TUMHARE ORDERED NOTES'}
      </div>
      <div className="page-heading">
        <div>
          <h1>
            {saved
              ? 'Tumhare bookmarks'
              : paths
                ? 'Ek step, phir agla'
                : selected?.name || 'Poori notebook'}
            <span>.</span>
          </h1>
          <p>
            {saved
              ? 'Jin concepts ko dobara padhna hai, yahan rakho.'
              : paths
                ? 'Order follow karo, saath practice karo, concept khud explain karo.'
                : selected?.description ||
                  'Subject choose karke first lesson se numbered stages follow karo.'}
          </p>
        </div>
        <span className="count-pill">{filtered.length} chapters</span>
      </div>
      {saved && <ProgressBackup />}
      {!saved && (
        <p className="learning-tip">
          Ek course, ek order: concept padho, source example samjho aur usi chapter ke interview
          questions khud attempt karo.
        </p>
      )}
      <div className="filter-toolbar">
        <label className="filter-search">
          <Icon name="search" size={18} />
          <input
            placeholder="Concepts, examples ya interview questions dhundo…"
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
          Saare subjects
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
            <strong>Padhne ka suggested route:</strong> JavaScript → React → frontend design. Java →
            Spring → backend design. Dono mein se kisi route ke saath DSA padho. Har chapter ke baad
            bina notes dekhe concept explain karo.
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
                <small>Original PDF reference · new tab mein khulega</small>
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
        <span>Course order · filter par lesson numbers same rahenge</span>
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <Icon name={saved ? 'bookmark' : 'search'} size={32} />
          <h2>
            {saved && !query && track === 'all'
              ? 'Apne important chapters save karo.'
              : 'Koi note nahi mila.'}
          </h2>
          <p>
            {saved
              ? 'Chapter bookmark karo, woh yahan mil jaega.'
              : 'Search thoda broad karo ya doosra subject chuno.'}
          </p>
          <Link className="subtle-button" to="/library">
            Saare notes kholo <Icon name="arrow" size={16} />
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
