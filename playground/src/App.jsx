import { lazy, Suspense, Component } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { ProgressProvider } from './lib/progress.jsx';
import Shell from './library/Shell.jsx';
import Dashboard from './library/Dashboard.jsx';
import Library from './library/Library.jsx';
const Reader = lazy(() => import('./library/Reader.jsx'));
const VisualLab = lazy(() => import('./library/VisualLab.jsx'));
const Interviews = lazy(() => import('./library/Interviews.jsx'));
const LegacyRoute = lazy(() => import('./library/LegacyRoute.jsx'));
class PageBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="empty-state">
        <h1>This page couldn’t load.</h1>
        <p>Your saved progress is still on this device. Reload to try again.</p>
        <button className="primary-button" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  const location = useLocation();
  return (
    <ProgressProvider>
      <Shell>
        <PageBoundary key={location.pathname}>
          <Suspense
            fallback={
              <div className="loading-state" role="status">
                Opening your notebook…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/library" element={<Library />} />
              <Route path="/paths" element={<Library paths />} />
              <Route path="/saved" element={<Library saved />} />
              <Route path="/notes/:noteId" element={<Reader />} />
              <Route path="/visuals" element={<VisualLab />} />
              <Route path="/interview" element={<Interviews />} />
              <Route path="/domain/:domainId/*" element={<LegacyRoute />} />
              <Route
                path="*"
                element={
                  <div className="empty-state">
                    <h1>That page isn’t in the notebook.</h1>
                    <Link className="primary-button" to="/library">
                      Explore the library
                    </Link>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </PageBoundary>
      </Shell>
    </ProgressProvider>
  );
}
