import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

/**
 * A tab left open across a deploy keeps the old bundle, which points at chunk
 * files that no longer exist. The lazy import then fails and the app goes
 * blank.
 *
 * Recover once, automatically: reload to pull the fresh bundle.
 *
 * The guard is a timestamp rather than a boolean. A boolean is cleared the
 * moment the next page boots, which would let a genuinely broken build reload
 * forever. A timestamp means a failure within the cooldown is left to the
 * error boundary instead of looping, while a later, unrelated failure can
 * still self-heal.
 */
const RELOAD_KEY = 'sai-rohan-series:chunk-reload-at';
const RELOAD_COOLDOWN_MS = 60_000;

function isChunkFailure(reason: unknown): boolean {
  const message =
    typeof reason === 'string'
      ? reason
      : reason instanceof Error
        ? `${reason.message} ${(reason as { name?: string }).name ?? ''}`
        : '';
  return /dynamically imported module|Importing a module script failed|Failed to fetch/i.test(message);
}

function recoverFromChunkFailure() {
  const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
  if (last && Date.now() - last < RELOAD_COOLDOWN_MS) return; // recently tried — don't loop
  try {
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    /* storage unavailable — reload anyway, worst case the user reloads twice */
  }
  window.location.reload();
}

window.addEventListener('error', (event) => {
  if (isChunkFailure(event.message)) recoverFromChunkFailure();
});

window.addEventListener('unhandledrejection', (event) => {
  if (isChunkFailure(event.reason)) recoverFromChunkFailure();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      {/* A failed dynamic import (stale chunk after a deploy) unmounts the whole
          tree. The boundary turns that blank page into a recoverable one. */}
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </MotionConfig>
  </StrictMode>,
);
