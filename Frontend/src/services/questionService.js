import { api } from './api';

// PUBLIC_INTERFACE
export async function searchQuestions(params) {
  /** Search and filter questions with pagination and sorting. */
  const res = await api.get('/questions', { params });
  return res.data; // { items, total, page, pageSize }
}

// PUBLIC_INTERFACE
export async function getQuestion(id) {
  const res = await api.get(`/questions/${id}`);
  return res.data;
}

// PUBLIC_INTERFACE
export async function createQuestion(payload) {
  const res = await api.post('/questions', payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function updateQuestion(id, payload) {
  const res = await api.put(`/questions/${id}`, payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function deleteQuestion(id, { permanent = false } = {}) {
  const res = await api.delete(`/questions/${id}`, { params: { permanent } });
  return res.data;
}

// PUBLIC_INTERFACE
export async function saveDraft(payload) {
  const res = await api.post('/questions/drafts', payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function listDrafts() {
  const res = await api.get('/questions/drafts');
  return res.data;
}
