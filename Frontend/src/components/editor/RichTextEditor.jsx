import React from 'react';
import PropTypes from 'prop-types';

/**
 * Lightweight rich text editor placeholder to keep dependencies minimal.
 * In production, integrate a11y-friendly editor (e.g., TipTap/Slate/Quill) through backend-approved list.
 */
// PUBLIC_INTERFACE
export function RichTextEditor({ value, onChange, label = 'Content' }) {
  return (
    <div className="card">
      <label htmlFor="rte">{label}</label>
      <textarea id="rte" value={value} onChange={(e) => onChange?.(e.target.value)} rows={10} />
      <p style={{ fontSize: '.85rem', color: 'var(--text-secondary)' }}>
        Formatting tips: Markdown-like syntax supported by backend renderer (bold, italics, lists, code).
      </p>
    </div>
  );
}
RichTextEditor.propTypes = { value: PropTypes.string, onChange: PropTypes.func, label: PropTypes.string };
