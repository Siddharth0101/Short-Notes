import { Suspense, lazy } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import AppLayout from './components/layouts/AppLayout/AppLayout.jsx';
import Home from './components/pages/Home/Home.jsx';
import Spinner from './components/atoms/Spinner/Spinner.jsx';
import { getAllScenarios } from './registry/index.js';

// Lazy load pages and NoteSandbox
const Domain = lazy(() => import('./components/pages/Domain/Domain.jsx'));
const Topic = lazy(() => import('./components/pages/Topic/Topic.jsx'));
const NoteSandbox = lazy(() => import('./components/organisms/NoteSandbox/NoteSandbox.jsx'));

const ALL_SCENARIOS = getAllScenarios();

function SandboxRouteHandler() {
  const { domainId, topicSlug, scenarioId } = useParams();
  
  const scenario = ALL_SCENARIOS.find(
    (s) => s.domainId === domainId && s.topicSlug === topicSlug && s.id === scenarioId
  );

  if (!scenario) {
    return (
      <div style={{ padding: '40px' }}>
        <h2>Sandbox Not Found 😢</h2>
      </div>
    );
  }

  const ComponentToRender = scenario.component;

  if (ComponentToRender) {
    return <ComponentToRender />;
  }

  return <NoteSandbox title={scenario.title} fetchFile={scenario.fetchFile} />;
}

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Domain Selection Topics list */}
        <Route 
          path="/domain/:domainId" 
          element={
            <Suspense fallback={<Spinner label="Loading domain..." />}>
              <Domain />
            </Suspense>
          } 
        />

        {/* Dynamic Topic Pages */}
        <Route 
          path="/domain/:domainId/topic/:topicSlug" 
          element={
            <Suspense fallback={<Spinner label="Loading topic..." />}>
              <Topic />
            </Suspense>
          } 
        />

        {/* Dynamic Scenario Sandbox Pages inside Topics */}
        <Route
          path="/domain/:domainId/topic/:topicSlug/:scenarioId"
          element={
            <Suspense fallback={<Spinner label="Loading sandbox..." />}>
              <SandboxRouteHandler />
            </Suspense>
          }
        />
      </Routes>
    </AppLayout>
  );
}

export default App;
