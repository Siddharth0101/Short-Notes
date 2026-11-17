import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './theme.css';
import './workspace.css';
import './design.css';
import './engage.css';
import App from './App.jsx';
import { registerServiceWorker } from './lib/offline.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

// Works offline once installed; a no-op in development and in browsers without support.
registerServiceWorker();
