import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { TRACKS } from '../lib/content.js';
import { notes } from '../data/catalog.js';
import { useProgress } from '../lib/progressContext.js';
import Icon from './Icons.jsx';
import { normalizeTheme, readTheme, resolveTheme, THEME_KEY } from '../lib/theme.js';
export default function Shell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const search = useRef(null);
  const sidebar = useRef(null);
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState('');
  const [preference, setPreference] = useState(readTheme);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia?.('(prefers-color-scheme: dark)').matches || false,
  );
  const theme = resolveTheme(preference, systemDark);
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    const change = (event) => setSystemDark(event.matches);
    const storage = (event) => {
      if (event.key === THEME_KEY || event.key === null)
        setPreference(normalizeTheme(event.newValue));
    };
    media?.addEventListener('change', change);
    window.addEventListener('storage', storage);
    return () => {
      media?.removeEventListener('change', change);
      window.removeEventListener('storage', storage);
    };
  }, []);
  const { progress, storageError } = useProgress();
  const done = notes.filter((note) => progress.completed.includes(note.id)).length;
  useEffect(() => {
    if (!mobile) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => [...sidebar.current.querySelectorAll('a, button:not(:disabled)')];
    focusable()[0]?.focus();
    function trapFocus(event) {
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    window.addEventListener('keydown', trapFocus);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', trapFocus);
      previousFocus?.focus();
    };
  }, [mobile]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#101c18' : '#f6f8f7');
    try {
      localStorage.setItem(THEME_KEY, preference);
    } catch {
      /* Theme still works for this session. */
    }
  }, [theme, preference]);
  useEffect(() => {
    function shortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        search.current?.focus();
      }
      if (event.key === 'Escape') {
        setMobile(false);
        search.current?.blur();
      }
    }
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const navItems = [
    ['/', 'dashboard', 'Overview'],
    ['/library', 'book', 'All notes'],
    ['/paths', 'path', 'Learning paths'],
    ['/visuals', 'play', 'Visual lab'],
    ['/interview', 'messages', 'Interview prep'],
    ['/saved', 'bookmark', 'Bookmarks'],
  ];
  const pageName = location.pathname.startsWith('/notes')
    ? 'Your notebook'
    : navItems.find(([to]) => to === location.pathname)?.[2] || 'Original playground';
  return (
    <div className="workspace">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {mobile && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <aside
        ref={sidebar}
        className={`sidebar ${mobile ? 'is-open' : ''}`}
        aria-label="Notebook navigation"
      >
        <Link className="brand" to="/" onClick={() => setMobile(false)}>
          <span className="brand-mark">
            <Icon name="book" size={22} />
          </span>
          <span>
            shortnotes<span className="brand-dot">.</span>
          </span>
        </Link>
        <div className="workspace-label">
          YOUR LEARNING SPACE <span>PERSONAL</span>
        </div>
        <nav aria-label="Main navigation" className="main-nav">
          {navItems.map(([to, icon, label]) => (
            <NavLink
              key={to}
              end={to === '/'}
              to={to}
              onClick={() => setMobile(false)}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon name={icon} size={18} />
              <span>{label}</span>
              {to === '/visuals' && <span className="tiny-badge">PLAY</span>}
              {to === '/saved' && progress.saved.length > 0 && (
                <span className="nav-count">{progress.saved.length}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-section-label">
          YOUR SUBJECTS <span>{TRACKS.length - 1}</span>
        </div>
        <nav aria-label="Subject navigation" className="subject-nav">
          {TRACKS.filter((t) => t.id !== 'interview').map((track) => (
            <Link
              key={track.id}
              to={`/library?track=${track.id}`}
              onClick={() => setMobile(false)}
              className={`subject-link ${new URLSearchParams(location.search).get('track') === track.id ? 'selected' : ''}`}
            >
              <span className="subject-dot" style={{ background: track.color }} />
              {track.shortName || track.name}
              <span>{notes.filter((note) => note.track === track.id).length}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="progress-widget">
            <div>
              <span>A little, every day.</span>
              <Icon name="sparkles" size={16} />
            </div>
            <p>
              {done} of {notes.length} chapters completed
            </p>
            <div className="progress-track">
              <div style={{ width: `${notes.length ? (done / notes.length) * 100 : 0}%` }} />
            </div>
            <Link to="/paths">
              Keep the momentum <Icon name="arrow" size={14} />
            </Link>
          </div>
          <div className="profile">
            <span className="avatar">S</span>
            <div>
              <strong>My notebook</strong>
              <span>Curiosity, organized.</span>
            </div>
            <button
              className="icon-button theme-toggle"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Current appearance: ${preference}`}
              onClick={() => setPreference(theme === 'light' ? 'dark' : 'light')}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
            </button>
          </div>
        </div>
      </aside>
      <div className="workspace-main">
        <header className="topbar">
          <div className="topbar-title">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              aria-expanded={mobile}
              onClick={() => setMobile(true)}
            >
              <Icon name="menu" />
            </button>
            <span>Workspace</span>
            <Icon name="chevron" size={13} />
            <strong>{pageName}</strong>
          </div>
          <form
            className="global-search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              navigate(`/library?q=${encodeURIComponent(query)}`);
            }}
          >
            <Icon name="search" size={16} />
            <input
              ref={search}
              aria-label="Search all notes"
              placeholder="Search anything…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <kbd>⌘ K</kbd>
          </form>
          <label className="appearance-control">
            <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={17} />
            <span className="visually-hidden">Appearance</span>
            <select
              aria-label="Appearance"
              value={preference}
              onChange={(event) => setPreference(event.target.value)}
            >
              <option value="system">System theme</option>
              <option value="light">Light mode</option>
              <option value="dark">Dark mode</option>
            </select>
          </label>
        </header>
        {storageError && (
          <div className="storage-notice" role="status">
            Browser storage is unavailable. Progress works this session; export it from Bookmarks to
            keep a backup.
          </div>
        )}
        <main id="main-content" className="page-content">
          {children}
        </main>
        <footer className="app-footer">
          <span>Made for understanding. Built for remembering.</span>
          <span>
            One concept at a time <span className="footer-dot">●</span>
          </span>
        </footer>
      </div>
    </div>
  );
}
