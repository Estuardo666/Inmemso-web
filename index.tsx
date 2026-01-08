import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FALLBACK_PROJECTS, FALLBACK_SERVICES, FALLBACK_HOME } from './src/data/fallbackContent';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App services={Object.values(FALLBACK_SERVICES)} projects={FALLBACK_PROJECTS} home={FALLBACK_HOME} />
  </React.StrictMode>
);