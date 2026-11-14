import { lazy, Suspense, Component, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { ProgressProvider } from './lib/progress.jsx';
import { LanguageProvider } from './lib/i18n.jsx';
import { CatalogProvider } from './lib/catalog.jsx';
import { PlayProvider } from './lib/play.jsx';
import { useLang } from './lib/langContext.js';
import Shell from './library/Shell.jsx';
import Dashboard from './library/Dashboard.jsx';
import Library from './library/Library.jsx';
import { RouteViewport } from './library/Navigation.jsx';
const InterviewAgent = lazy(() => import('./interviewer/InterviewAgent.jsx'));
const Reader = lazy(() => import('./library/Reader.jsx'));
const VisualLab = lazy(() => import('./library/VisualLab.jsx'));
const Interviews = lazy(() => import('./library/Interviews.jsx'));
const LegacyRoute = lazy(() => import('./library/LegacyRoute.jsx'));
const PlayHub = lazy(() => import('./play/PlayHub.jsx'));
const Flashcards = lazy(() => import('./play/Flashcards.jsx'));
const RapidFire = lazy(() => import('./play/RapidFire.jsx'));
const MemoryMatch = lazy(() => import('./play/MemoryMatch.jsx'));
class PageBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    const { t } = this.props;
    return this.state.error ? (
      <div className="empty-state">
        <h1>{t('app.errorTitle')}</h1>
        <p>{t('app.errorBody')}</p>
        <button className="primary-button" onClick={() => window.location.reload()}>
          {t('app.reload')}
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
function Pages() {
  const location = useLocation();
  const positions = useRef(new Map());
  const { lang, t } = useLang();
  // The tab title mirrors the page heading, so it has to follow a language switch too.
  useEffect(() => {
    const heading = document.querySelector('#main-content h1');
    if (heading) document.title = `${heading.textContent.trim()} · Shortnotes`;
  }, [lang]);
  return (
    <Shell>
      <PageBoundary key={location.pathname} t={t}>
        <Suspense
          fallback={
            <div className="loading-state page-skeleton" role="status" aria-busy="true">
              <span>{t('app.loading')}</span>
              <div aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            </div>
          }
        >
          <RouteViewport positions={positions}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/library" element={<Library />} />
              <Route path="/paths" element={<Library paths />} />
              <Route path="/saved" element={<Library saved />} />
              <Route path="/notes/:noteId" element={<Reader />} />
              <Route path="/visuals" element={<VisualLab />} />
              <Route path="/play" element={<PlayHub />} />
              <Route path="/play/flashcards" element={<Flashcards />} />
              <Route path="/play/quiz" element={<RapidFire />} />
              <Route path="/play/match" element={<MemoryMatch />} />
              <Route path="/interview" element={<Interviews />} />
              <Route path="/interview/live" element={<InterviewAgent />} />
              <Route path="/domain/:domainId/*" element={<LegacyRoute />} />
              <Route
                path="*"
                element={
                  <div className="empty-state">
                    <h1>{t('app.notFoundTitle')}</h1>
                    <Link className="primary-button" to="/library">
                      {t('app.explore')}
                    </Link>
                  </div>
                }
              />
            </Routes>
          </RouteViewport>
        </Suspense>
      </PageBoundary>
    </Shell>
  );
}
export default function App() {
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);
  return (
    <LanguageProvider>
      <ProgressProvider>
        <CatalogProvider>
          <PlayProvider>
            <Pages />
          </PlayProvider>
        </CatalogProvider>
      </ProgressProvider>
    </LanguageProvider>
  );
}
