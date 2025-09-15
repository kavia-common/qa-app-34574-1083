import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { listNotifications, markAsRead } from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

// PUBLIC_INTERFACE
export function NotificationProvider({ children }) {
  /** Provides notifications and real-time polling. */
  const { isAuthenticated } = useAuth() || { isAuthenticated: false };
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!isAuthenticated) {
          setItems([]); setUnread(0);
          return;
        }
        const data = await listNotifications({ limit: 20 });
        setItems(data?.items || []);
        setUnread((data?.items || []).filter(n => !n.read).length);
      } catch {
        // silent fail
      }
    }
    fetchData();
    if (isAuthenticated) {
      timerRef.current = setInterval(fetchData, 10000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isAuthenticated]);

  const value = useMemo(() => ({
    notifications: items,
    unread,
    async markRead(id) {
      try { await markAsRead(id); } catch { /* ignore */ }
      setItems((arr) => arr.map(n => n.id === id ? { ...n, read: true } : n));
      setUnread((n) => Math.max(0, n - 1));
    }
  }), [items, unread]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

NotificationProvider.propTypes = { children: PropTypes.node };

// PUBLIC_INTERFACE
export function useNotifications() {
  /** Access notification data and helpers. */
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
