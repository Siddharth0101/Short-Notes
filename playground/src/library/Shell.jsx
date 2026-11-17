import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { TRACKS } from '../lib/content.js';
import { notes, noteById } from '../data/catalog.js';
import { useProgress } from '../lib/progressContext.js';
import Icon from './Icons.jsx';
import UpdatePrompt from './UpdatePrompt.jsx';
import { normalizeTheme, readTheme, resolveTheme, THEME_KEY } from '../lib/theme.js';
import { LANGUAGES } from '../lib/lang.js';
import { useLang } from '../lib/langContext.js';
import { usePlay } from '../lib/playContext.js';
export default function Shell({ children }) {
  const { lang, setLang, t } = useLang();
  const { stats } = usePlay();
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
      ?.setAttribute('content', theme === 'dark' ? '#0e1014' : '#f7f7f4');
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
        setMobile(false);
        window.requestAnimationFrame(() => {
          search.current?.focus();
          search.current?.select();
        });
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
    setQuery(new URLSearchParams(location.search).get('q') || '');
    setMobile(false);
  }, [location.pathname, location.search]);
  useEffect(() => {
    const desktop = window.matchMedia?.('(min-width: 721px)');
    const closeOnDesktop = (event) => {
      if (event.matches) setMobile(false);
    };
    desktop?.addEventListener('change', closeOnDesktop);
    return () => desktop?.removeEventListener('change', closeOnDesktop);
  }, []);
  const selectedTrack =
    new URLSearchParams(location.search).get('track') ||
    noteById[location.pathname.split('/notes/')[1]]?.track;
  const navItems = [
    ['/', 'dashboard', t('nav.overview')],
    ['/library', 'book', t('nav.library')],
    ['/paths', 'path', t('nav.paths')],
    ['/visuals', 'play', t('nav.visuals')],
    ['/play', 'gamepad', t('nav.play')],
    ['/interview', 'messages', t('nav.interview')],
    ['/interview/live', 'sparkles', t('nav.live')],
    ['/saved', 'bookmark', t('nav.saved')],
  ];
  const pageName = location.pathname.startsWith('/notes')
    ? TRACKS.find((track) => track.id === selectedTrack)?.name || t('shell.chapter')
    : navItems.find(([to]) => to === location.pathname)?.[2] ||
      (location.pathname.startsWith('/play') ? t('nav.play') : t('shell.originalPlayground'));
  return (
    <div className="workspace">
      <a className="skip-link" href="#main-content">
        {t('shell.skip')}
      </a>
      {mobile && (
        <button
          className="sidebar-backdrop"
          aria-label={t('shell.closeNavigation')}
          onClick={() => setMobile(false)}
        />
      )}
      <aside
        id="notebook-navigation"
        ref={sidebar}
        role={mobile ? 'dialog' : undefined}
        aria-modal={mobile ? true : undefined}
        className={`sidebar ${mobile ? 'is-open' : ''}`}
        aria-label={t('shell.notebookNavigation')}
      >
        <Link className="brand" to="/" onClick={() => setMobile(false)}>
          <span className="brand-mark">
            <Icon name="book" size={22} />
          </span>
          <span>
            shortnotes<span className="brand-dot">.</span>
          </span>
        </Link>
        <button
          className="icon-button sidebar-close"
          aria-label={t('shell.closeMenu')}
          onClick={() => setMobile(false)}
        >
          <Icon name="close" />
        </button>
        <div className="workspace-label">{t('shell.tagline')}</div>
        <nav aria-label={t('shell.mainNavigation')} className="main-nav">
          {navItems.map(([to, icon, label]) => (
            <NavLink
              key={to}
              end={to === '/' || to === '/interview'}
              data-nav={to}
              to={to}
              onClick={() => setMobile(false)}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon name={icon} size={18} />
              <span>{label}</span>
              {to === '/interview/live' && <span className="tiny-badge">AI</span>}
              {to === '/play' && stats.streak.current > 0 && (
                <span
                  className="nav-count nav-streak"
                  aria-label={t('shell.streakLabel', { count: stats.streak.current })}
                >
                  🔥 {stats.streak.current}
                </span>
              )}
              {to === '/saved' && progress.saved.length > 0 && (
                <span className="nav-count">{progress.saved.length}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-section-label">
          {t('shell.subjects')} <span>{TRACKS.length - 1}</span>
        </div>
        <nav aria-label={t('shell.subjectNavigation')} className="subject-nav">
          {TRACKS.filter((t) => t.id !== 'interview').map((track) => {
            const chapters = notes.filter((note) => note.track === track.id);
            const revised = chapters.filter((note) => progress.completed.includes(note.id)).length;
            return (
              <Link
                key={track.id}
                to={`/library?track=${track.id}`}
                onClick={() => setMobile(false)}
                className={`subject-link ${selectedTrack === track.id ? 'selected' : ''}`}
                aria-current={selectedTrack === track.id ? 'true' : undefined}
                style={{
                  '--track-color': track.color,
                  '--done': chapters.length ? revised / chapters.length : 0,
                }}
              >
                <span className="subject-dot" style={{ background: track.color }} />
                {track.shortName || track.name}
                <span>{chapters.length}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="progress-widget">
            <div>
              <span>{t('shell.learnDaily')}</span>
              <Icon name="sparkles" size={16} />
            </div>
            <p>{t('shell.chaptersCompleted', { done, total: notes.length })}</p>
            <div className="progress-track">
              <div style={{ width: `${notes.length ? (done / notes.length) * 100 : 0}%` }} />
            </div>
            <Link to="/paths" onClick={() => setMobile(false)}>
              {t('shell.keepStudying')} <Icon name="arrow" size={14} />
            </Link>
          </div>
          <div className="profile">
            <Link
              className="avatar avatar-level"
              to="/play"
              onClick={() => setMobile(false)}
              aria-label={`${t('shell.levelLabel', { level: stats.level })} · ${t(`level.${stats.level}`)}`}
              title={`${t('shell.levelLabel', { level: stats.level })} · ${t(`level.${stats.level}`)}`}
            >
              {stats.level}
            </Link>
            <div>
              <strong>{t('shell.yourPace')}</strong>
              <span>{t('shell.savedInBrowser')}</span>
            </div>
            <button
              className="icon-button theme-toggle"
              aria-label={t('shell.switchTheme', { mode: theme === 'light' ? 'dark' : 'light' })}
              title={t('shell.currentAppearance', { value: preference })}
              onClick={() => setPreference(theme === 'light' ? 'dark' : 'light')}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
            </button>
          </div>
        </div>
      </aside>
      <div className="workspace-main" inert={mobile ? true : undefined}>
        <header className="topbar">
          <div className="topbar-title">
            <button
              className="icon-button mobile-menu"
              aria-label={t('shell.openNavigation')}
              aria-expanded={mobile}
              aria-controls="notebook-navigation"
              onClick={() => setMobile(true)}
            >
              <Icon name="menu" />
            </button>
            <span>{t('shell.brand')}</span>
            <Icon name="chevron" size={13} />
            <strong>{pageName}</strong>
          </div>
          <form
            className="global-search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              navigate(
                query.trim() ? `/library?q=${encodeURIComponent(query.trim())}` : '/library',
                { state: { scrollToTop: true } },
              );
              search.current?.blur();
            }}
          >
            <Icon name="search" size={16} />
            <input
              ref={search}
              aria-label={t('shell.searchLabel')}
              placeholder={t('shell.searchPlaceholder')}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <kbd>⌘ K</kbd>
            <button className="search-submit" type="submit" aria-label={t('shell.submitSearch')}>
              <Icon name="arrow" size={16} />
            </button>
          </form>
          <label className="appearance-control language-control">
            <Icon name="globe" size={17} />
            <span className="visually-hidden">{t('shell.language')}</span>
            <select
              aria-label={t('shell.language')}
              value={lang}
              onChange={(event) => setLang(event.target.value)}
            >
              {LANGUAGES.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.label}
                </option>
              ))}
            </select>
          </label>
          <label className="appearance-control">
            <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={17} />
            <span className="visually-hidden">{t('shell.appearance')}</span>
            <select
              aria-label={t('shell.appearance')}
              value={preference}
              onChange={(event) => setPreference(event.target.value)}
            >
              <option value="system">{t('shell.themeSystem')}</option>
              <option value="light">{t('shell.themeLight')}</option>
              <option value="dark">{t('shell.themeDark')}</option>
            </select>
          </label>
        </header>
        {storageError && (
          <div className="storage-notice" role="status">
            {t('shell.storageNotice')}
          </div>
        )}
        <main id="main-content" className="page-content" tabIndex={-1}>
          {children}
        </main>
        <UpdatePrompt />
        <nav className="mobile-bottom-nav" aria-label={t('shell.quickNavigation')}>
          {[
            ['/', 'dashboard', t('mobile.home')],
            ['/library', 'book', t('mobile.notes')],
            ['/play', 'gamepad', t('mobile.play')],
            ['/interview', 'messages', t('mobile.practice')],
            ['/saved', 'bookmark', t('mobile.saved')],
          ].map(([to, icon, label]) => (
            <NavLink key={to} to={to} end className={({ isActive }) => (isActive ? 'active' : '')}>
              <Icon name={icon} size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <footer className="app-footer">
          <span>{t('footer.purpose')}</span>
          <span>
            {t('footer.oneConcept')} <span className="footer-dot">●</span>
          </span>
        </footer>
      </div>
    </div>
  );
}
