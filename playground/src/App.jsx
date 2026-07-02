import { Suspense, lazy } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import AppLayout from './components/layouts/AppLayout/AppLayout.jsx';
import Home from './components/pages/Home/Home.jsx';
import Spinner from './components/atoms/Spinner/Spinner.jsx';
import { getNodeBySplatPath } from './registry/index.js';

// Lazy load pages and NoteSandbox
const Domain = lazy(() => import('./components/pages/Domain/Domain.jsx'));
const NoteSandbox = lazy(() => import('./components/organisms/NoteSandbox/NoteSandbox.jsx'));

function SandboxRouteHandler() {
  const { domainId } = useParams();
  const splat = useParams()['*'];
  
  const fileNode = getNodeBySplatPath(domainId, splat);

  if (!fileNode || fileNode.type !== 'file') {
    return (
      <div style={{ padding: '40px' }}>
        <h2>Sandbox File Not Found 😢</h2>
      </div>
    );
  }

  const ComponentToRender = fileNode.component;

  if (ComponentToRender) {
    return <ComponentToRender />;
  }

  return <NoteSandbox title={fileNode.title} fetchFile={fileNode.fetchFile} />;
}

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Domain Root Explorer */}
        <Route 
          path="/domain/:domainId" 
          element={
            <Suspense fallback={<Spinner label="Loading folder directory..." />}>
              <Domain />
            </Suspense>
          } 
        />

        {/* Dynamic Nested Directory Explorer */}
        <Route 
          path="/domain/:domainId/dir/*" 
          element={
            <Suspense fallback={<Spinner label="Loading folder..." />}>
              <Domain />
            </Suspense>
          } 
        />

        {/* Dynamic Scenario Sandbox Page View */}
        <Route
          path="/domain/:domainId/file/*"
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
