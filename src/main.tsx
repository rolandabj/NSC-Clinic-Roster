import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { DialogHost } from './components/common/dialogs';
import './index.css';

// After a new version is published, files of the old version are gone. When
// a screen's file fails to load, reload once to pick up the new version.
window.addEventListener('vite:preloadError', (event) => {
  const key = 'clinic_roster_reloaded_for_update';
  try {
    if (sessionStorage.getItem(key)) return; // already tried; the error screen offers Reload
    sessionStorage.setItem(key, '1');
  } catch {
    return;
  }
  event.preventDefault();
  window.location.reload();
});
window.addEventListener('load', () => {
  setTimeout(() => {
    try {
      sessionStorage.removeItem('clinic_roster_reloaded_for_update');
    } catch {
      // ignore
    }
  }, 10_000);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <DialogHost />
  </StrictMode>,
);
