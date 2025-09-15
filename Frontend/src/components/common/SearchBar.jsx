import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
export function SearchBar({ onSearch, placeholder = 'Search…', suggestions = [], onChange }) {
  /** Search bar with debounce and suggestions dropdown (keyboard accessible). */
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const debounced = useMemo(() => {
    let t;
    return (q) => {
      clearTimeout(t);
      t = setTimeout(() => onSearch?.(q), 300);
    };
  }, [onSearch]);

  useEffect(() => { debounced(query); }, [query, debounced]);

  const visibleSuggestions = useMemo(() => {
    if (!query) return suggestions.slice(0, 5);
    const q = query.toLowerCase();
    return suggestions.filter(s => s.toLowerCase().includes(q)).slice(0, 5);
  }, [query, suggestions]);

  const selectSuggestion = (value) => {
    setQuery(value);
    onChange?.(value);
    onSearch?.(value);
    setOpen(false);
  };

  return (
    <div className="card" role="search" aria-label="Search questions">
      <label htmlFor="search-input">Search</label>
      <input
        id="search-input"
        type="search"
        value={query}
        onChange={(e) => { setQuery(e.target.value); onChange?.(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="search-suggestions"
      />
      {open && visibleSuggestions.length > 0 && (
        <ul id="search-suggestions" role="listbox" className="card" style={{ marginTop: '.5rem' }}>
          {visibleSuggestions.map((s, idx) => (
            <li
              key={s}
              role="option"
              aria-selected={active === idx}
              onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s); }}
              onMouseEnter={() => setActive(idx)}
              style={{
                padding: '.5rem', cursor: 'pointer', background: active === idx ? 'var(--border-color)' : 'transparent'
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
SearchBar.propTypes = { onSearch: PropTypes.func, placeholder: PropTypes.string, suggestions: PropTypes.array, onChange: PropTypes.func };
