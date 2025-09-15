import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
export function TagSelector({ allTags = [], value = [], onChange, max = 5 }) {
  /** Tag selector with suggestions and limit enforcement. */
  const [q, setQ] = useState('');

  const suggestions = useMemo(() => {
    const needle = q.toLowerCase();
    return allTags.filter(t => t.toLowerCase().includes(needle) && !value.includes(t)).slice(0, 6);
  }, [q, allTags, value]);

  const add = (tag) => {
    if (value.length >= max) return;
    onChange?.([...value, tag]);
    setQ('');
  };
  const remove = (tag) => onChange?.(value.filter(t => t !== tag));

  return (
    <div className="card">
      <label htmlFor="tag-input">Tags (max {max})</label>
      <input id="tag-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Add a tag…" />
      <div style={{ marginTop: '.5rem', display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
        {value.map(t => (
          <span key={t} className="badge" aria-label={`Tag ${t}`}>{t} <button className="btn btn-secondary" onClick={() => remove(t)} aria-label={`Remove tag ${t}`}>×</button></span>
        ))}
      </div>
      {suggestions.length > 0 && (
        <div className="card" style={{ marginTop: '.5rem' }}>
          <strong>Suggestions</strong>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
            {suggestions.map(s => (
              <button key={s} className="btn btn-secondary" onClick={() => add(s)} disabled={value.length >= max} aria-disabled={value.length >= max}>{s}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
TagSelector.propTypes = { allTags: PropTypes.array, value: PropTypes.array, onChange: PropTypes.func, max: PropTypes.number };
