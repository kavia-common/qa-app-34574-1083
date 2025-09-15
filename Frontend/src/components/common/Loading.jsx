import React from 'react';

// PUBLIC_INTERFACE
export function Loading({ label = 'Loading' }) {
  /** Accessible loading indicator. */
  return (
    <div role="status" aria-live="polite" style={{ padding: '2rem' }}>
      <span className="sr-only">{label}</span>
      <div className="card">
        <strong>{label}…</strong>
      </div>
    </div>
  );
}
