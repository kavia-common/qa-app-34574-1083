import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchSession, login as authLogin, logout as authLogout } from '../services/authService';
import { authStorage } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authenticated user, roles, and auth helpers. */
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load session on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const session = await fetchSession();
        if (!isMounted) return;
        setUser(session?.user || null);
        setRoles(session?.roles || []);
      } catch {
        setUser(null);
        setRoles([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const isAuthenticated = !!user;

  const value = useMemo(() => ({
    user,
    roles,
    isAuthenticated,
    hasRole: (r) => roles.includes(r),
    async login(credentials) {
      const data = await authLogin(credentials);
      // If backend returns a token (JWT), store it; else rely on HttpOnly cookie
      if (data?.token) authStorage.setToken(data.token);
      setUser(data.user);
      setRoles(data.roles || []);
      return data;
    },
    async logout() {
      try {
        await authLogout();
      } catch { /* ignore network errors on logout */ }
      authStorage.clear();
      setUser(null);
      setRoles([]);
      navigate('/login', { replace: true });
    },
    setUser, setRoles
  }), [user, roles, isAuthenticated, navigate]);

  if (loading) return <div style={{ padding: '2rem' }} role="status" aria-live="polite">Loading session…</div>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node };

// PUBLIC_INTERFACE
export function useAuth() {
  /** Access authentication state and helpers. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
