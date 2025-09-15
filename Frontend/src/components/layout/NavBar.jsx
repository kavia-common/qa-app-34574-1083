import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
import { useNotifications } from '../../state/NotificationContext';

// PUBLIC_INTERFACE
export function NavBar({ onToggleTheme, currentTheme }) {
  /** Top navigation bar with auth and notifications. */
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const { unread } = useNotifications();
  const navigate = useNavigate();

  return (
    <nav className="navbar" role="navigation" aria-label="Primary">
      <div>
        <Link to="/" style={{ fontWeight: 800 }}>Q&A</Link>
      </div>
      <div className="nav-actions">
        <Link to="/questions" className="btn btn-secondary">Browse</Link>
        <Link to="/questions/ask" className="btn">Ask Question <span className="kbd">A</span></Link>
        <Link to="/notifications" className="btn btn-secondary" aria-label={`Notifications, ${unread} unread`}>
          🔔 {unread > 0 && <span className="badge" aria-live="polite">{unread}</span>}
        </Link>
        {hasRole('moderator') && <Link to="/moderation" className="btn btn-secondary">Moderation</Link>}
        {hasRole('administrator') && <Link to="/admin/analytics" className="btn btn-secondary">Analytics</Link>}
        <button className="btn btn-secondary" onClick={onToggleTheme} aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}>
          {currentTheme === 'light' ? '🌙' : '☀️'}
        </button>
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn">Sign up</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="btn btn-secondary">My Dashboard</Link>
            <Link to="/profile" className="btn btn-secondary">{user?.displayName || user?.username || 'Profile'}</Link>
            <button className="btn btn-secondary" onClick={() => logout().then(() => navigate('/login'))}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
