import { StrictMode, type PropsWithChildren } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App';
import { AppStateProvider } from './store';
import './index.css';

function InitApp({ children }: PropsWithChildren) {
  const enableStrictMode = window.localStorage.getItem('cfStrictMode');

  return enableStrictMode != null && enableStrictMode ? (
    <StrictMode>{children}</StrictMode>
  ) : (
    children
  );
}
const rootEl = document.getElementById('root') as HTMLElement;

createRoot(rootEl).render(
  <InitApp>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </InitApp>,
);
