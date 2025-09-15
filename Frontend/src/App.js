import React, { useEffect } from 'react';
import './App.css';
import { useUI } from './state/UIContext';
import { NavBar } from './components/layout/NavBar';
import { SideBar } from './components/layout/SideBar';
import { Footer } from './components/layout/Footer';
import { Outlet } from 'react-router-dom';
import { Toasts } from './components/common/Toasts';

// PUBLIC_INTERFACE
export default function App() {
  /** Main layout wrapper with theme toggle, skip links, and global landmarks for a11y. */
  const { theme, toggleTheme } = useUI();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="App">
      <a href="#main" className="sr-only-focusable">Skip to main content</a>
      <header aria-label="Main navigation">
        <NavBar onToggleTheme={toggleTheme} currentTheme={theme} />
      </header>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 120px)' }}>
        <aside aria-label="Filters and navigation" style={{ minWidth: 240 }}>
          <SideBar />
        </aside>
        <main id="main" role="main" style={{ flex: 1, padding: '1rem' }}>
          <Outlet />
        </main>
      </div>
      <Footer />
      <Toasts />
    </div>
  );
}
