import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const UIContext = createContext(null);

// PUBLIC_INTERFACE
export function UIProvider({ children }) {
  /** UI state for theme and global toasts. */
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [toasts, setToasts] = useState([]);

  useEffect(() => { localStorage.setItem('theme', theme); }, [theme]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };
  const removeToast = (id) => setToasts((t) => t.filter(x => x.id !== id));

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    addToast, removeToast, toasts
  }), [theme, toasts]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

UIProvider.propTypes = { children: PropTypes.node };

// PUBLIC_INTERFACE
export function useUI() {
  /** Access UI state and helpers. */
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
