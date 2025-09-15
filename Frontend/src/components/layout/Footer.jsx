import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <span>© {new Date().getFullYear()} Q&A Platform</span>
        <nav aria-label="Footer">
          <Link to="/settings">Settings</Link> · <a href="https://example.com/privacy" rel="noopener noreferrer">Privacy</a> · <a href="https://example.com/terms" rel="noopener noreferrer">Terms</a>
        </nav>
      </div>
    </footer>
  );
}
