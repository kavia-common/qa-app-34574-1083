import React from 'react';
import { useUI } from '../../state/UIContext';
import { LiveMessage } from 'react-aria-live';

// PUBLIC_INTERFACE
export function Toasts() {
  /** Renders and announces toasts. */
  const { toasts, removeToast } = useUI();
  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 1100 }}>
      {toasts.map(t => (
        <div key={t.id} className="card" role="status" aria-live="polite" style={{ minWidth: 280 }}>
          <strong>{t.type === 'error' ? 'Error' : t.type === 'success' ? 'Success' : 'Info'}</strong>
          <div>{t.message}</div>
          <button className="btn btn-secondary" onClick={() => removeToast(t.id)} aria-label="Dismiss">Dismiss</button>
          <LiveMessage message={t.message} aria-live="polite" />
        </div>
      ))}
    </div>
  );
}
