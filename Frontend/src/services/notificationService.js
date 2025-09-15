import { api } from './api';

// PUBLIC_INTERFACE
export async function listNotifications(params) {
  const res = await api.get('/notifications', { params });
  return res.data;
}

// PUBLIC_INTERFACE
export async function markAsRead(id) {
  const res = await api.post(`/notifications/${id}/read`);
  return res.data;
}

// PUBLIC_INTERFACE
export async function markAllAsRead() {
  const res = await api.post('/notifications/read-all');
  return res.data;
}

// PUBLIC_INTERFACE
export async function preferencesGet() {
  const res = await api.get('/notifications/preferences');
  return res.data;
}

// PUBLIC_INTERFACE
export async function preferencesUpdate(prefs) {
  const res = await api.put('/notifications/preferences', prefs);
  return res.data;
}
