import { api } from './api';

// PUBLIC_INTERFACE
export async function analyticsOverview(params) {
  const res = await api.get('/admin/analytics/overview', { params });
  return res.data;
}

// PUBLIC_INTERFACE
export async function popularTopicsReport(params) {
  const res = await api.get('/admin/analytics/popular-topics', { params });
  return res.data;
}

// PUBLIC_INTERFACE
export async function unansweredAndResponseTimes(params) {
  const res = await api.get('/admin/analytics/unanswered', { params });
  return res.data;
}

// PUBLIC_INTERFACE
export async function exportReport(type, format, params) {
  const res = await api.get(`/admin/analytics/export/${type}`, { params: { ...params, format }, responseType: 'blob' });
  return res.data;
}

// PUBLIC_INTERFACE
export async function listUsers(params) {
  const res = await api.get('/admin/users', { params });
  return res.data;
}

// PUBLIC_INTERFACE
export async function updateUserRole(userId, role) {
  const res = await api.put(`/admin/users/${userId}/role`, { role });
  return res.data;
}

// PUBLIC_INTERFACE
export async function systemSettingsGet() {
  const res = await api.get('/admin/settings');
  return res.data;
}

// PUBLIC_INTERFACE
export async function systemSettingsUpdate(payload) {
  const res = await api.put('/admin/settings', payload);
  return res.data;
}
