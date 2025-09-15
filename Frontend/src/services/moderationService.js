import { api } from './api';

// PUBLIC_INTERFACE
export async function listFlagged(params) {
  const res = await api.get('/moderation/flagged', { params });
  return res.data; // { items, total }
}

// PUBLIC_INTERFACE
export async function moderateAction(ids, action, note) {
  const res = await api.post('/moderation/actions', { ids, action, note });
  return res.data;
}

// PUBLIC_INTERFACE
export async function flagContent(contentType, contentId, reason, comment) {
  const res = await api.post('/flags', { contentType, contentId, reason, comment });
  return res.data;
}
