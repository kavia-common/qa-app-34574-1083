import React from 'react';
import { useNotifications } from '../../state/NotificationContext';

// PUBLIC_INTERFACE
export default function NotificationsCenter() {
  const { notifications, markRead } = useNotifications();

  return (
    <div>
      <h1>Notifications</h1>
      {notifications.length === 0 ? <p>No notifications</p> : (
        <ul>
          {notifications.map(n => (
            <li key={n.id} className="card" style={{ marginBottom: '.5rem', opacity: n.read ? .7 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{n.title}</strong>
                  <div>{n.message}</div>
                  <div style={{ fontSize: '.9rem' }}>{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.read && <button className="btn btn-secondary" onClick={() => markRead(n.id)}>Mark as read</button>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
