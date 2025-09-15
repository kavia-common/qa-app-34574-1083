import { api } from './api';

// PUBLIC_INTERFACE
export async function createAnswer(questionId, payload) {
  const res = await api.post(`/questions/${questionId}/answers`, payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function updateAnswer(questionId, answerId, payload) {
  const res = await api.put(`/questions/${questionId}/answers/${answerId}`, payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function deleteAnswer(questionId, answerId) {
  const res = await api.delete(`/questions/${questionId}/answers/${answerId}`);
  return res.data;
}

// PUBLIC_INTERFACE
export async function listAnswers(questionId, params) {
  const res = await api.get(`/questions/${questionId}/answers`, { params });
  return res.data;
}
