import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App';
import { AppStateProvider } from './store';
import './index.css';

function InitApp() {
  const enableStrictMode = window.localStorage.getItem('cfStrictMode');

  return enableStrictMode != null && enableStrictMode ? (
    <StrictMode>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </StrictMode>
  ) : (
    <AppStateProvider>
      <App />
    </AppStateProvider>
  );
}
const rootEl = document.getElementById('root') as HTMLElement;

createRoot(rootEl).render(<InitApp />);
