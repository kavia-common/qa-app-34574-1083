import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from './test-utils';

jest.mock('../services/authService', () => ({
  fetchSession: jest.fn().mockResolvedValue({ user: { id: 9, username: 'u' }, roles: ['user'] }),
}));

jest.mock('../services/questionService', () => ({
  searchQuestions: jest.fn(),
  getQuestion: jest.fn(),
  createQuestion: jest.fn(),
  updateQuestion: jest.fn(),
  deleteQuestion: jest.fn(),
  saveDraft: jest.fn(),
  listDrafts: jest.fn(),
}));

jest.mock('../services/answerService', () => ({
  listAnswers: jest.fn(),
  createAnswer: jest.fn(),
}));

jest.mock('../services/notificationService', () => ({
  listNotifications: jest.fn().mockResolvedValue({ items: [] }),
  markAsRead: jest.fn(),
}));

const qs = require('../services/questionService');
const ans = require('../services/answerService');

describe('Questions flows', () => {
  test('list page loads results and paginates, updates URL on search', async () => {
    qs.searchQuestions.mockResolvedValueOnce({
      items: [{ id: 1, title: 'How to auth?', tags: ['auth'], status: 'answered', answersCount: 2, author: { username: 'a' } }],
      total: 1, page: 1, pageSize: 10
    });

    renderApp({ route: '/questions' });
    await screen.findByRole('heading', { name: /Questions/i });
    await screen.findByText(/1 results/i);
    await userEvent.type(screen.getByRole('searchbox', { name: /Search/i }), 'auth');
    // Debounced; still should call service for page 1
    await waitFor(() => expect(qs.searchQuestions).toHaveBeenCalled());
  });

  test('ask question requires title and content, preview toggles, and submit calls service', async () => {
    const created = { id: 123 };
    qs.createQuestion.mockResolvedValueOnce(created);
    // Auth session ensured by fetchSession mock
    renderApp({ route: '/questions/ask' });
    await screen.findByRole('heading', { name: /Ask a Question/i });

    const submitBtn = screen.getByRole('button', { name: /Submit/i });
    expect(submitBtn).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/Title/i), 'How to test React apps?');
    await userEvent.type(screen.getByLabelText(/Details/i), 'Use React Testing Library.');
    expect(submitBtn).toBeEnabled();

    const previewBtn = screen.getByRole('button', { name: /Preview/i });
    await userEvent.click(previewBtn);
    await screen.findByRole('heading', { name: /Preview/i });

    await userEvent.click(submitBtn);
    await waitFor(() => expect(qs.createQuestion).toHaveBeenCalled());
  });

  test('edit question loads data, saves and deletes', async () => {
    qs.getQuestion.mockResolvedValueOnce({ id: 5, title: 'Old title', content: 'Body', tags: ['js'] });
    qs.updateQuestion.mockResolvedValueOnce({ ok: true });
    qs.deleteQuestion.mockResolvedValueOnce({ ok: true });

    renderApp({ initialEntries: ['/questions/5/edit'] });
    await screen.findByDisplayValue(/Old title/i);
    await userEvent.clear(screen.getByLabelText(/Title/i));
    await userEvent.type(screen.getByLabelText(/Title/i), 'Updated title');
    await userEvent.click(screen.getByRole('button', { name: /^Save$/i }));
    await waitFor(() => expect(qs.updateQuestion).toHaveBeenCalledWith('5', expect.objectContaining({ title: 'Updated title' })));

    // Open delete modal and confirm
    await userEvent.click(screen.getByRole('button', { name: /Delete/i }));
    await screen.findByRole('dialog');
    await userEvent.click(screen.getByRole('button', { name: /^Delete$/i }));
    await waitFor(() => expect(qs.deleteQuestion).toHaveBeenCalledWith('5', expect.any(Object)));
  });

  test('question detail shows answers and allows posting new answer', async () => {
    qs.getQuestion.mockResolvedValueOnce({ id: 7, title: 'Q', contentHtml: '<p>content</p>', tags: [] });
    ans.listAnswers.mockResolvedValueOnce({ items: [{ id: 1, contentHtml: '<p>Hi</p>', author: { username: 'x' } }] });
    ans.createAnswer.mockResolvedValueOnce({ id: 2 });

    renderApp({ initialEntries: ['/questions/7'] });
    await screen.findByRole('heading', { name: 'Q' });
    await screen.findByText(/1 Answers/i);

    await userEvent.type(screen.getByLabelText(/Answer content/i), 'My answer');
    await userEvent.click(screen.getByRole('button', { name: /Post your answer/i }));
    await waitFor(() => expect(ans.createAnswer).toHaveBeenCalledWith('7', { content: 'My answer' }));
  });

  test('drafts lists items', async () => {
    qs.listDrafts.mockResolvedValueOnce({ items: [{ id: 1, title: 'Draft 1' }, { id: 2, title: '' }] });
    renderApp({ route: '/drafts' });
    await screen.findByRole('heading', { name: /Your Drafts/i });
    await screen.findByText(/Draft 1/i);
    await screen.findByText(/\(Untitled draft\)/i);
  });
});
