import React from 'react';
import { screen } from '@testing-library/react';
import { renderApp } from './test-utils';

jest.mock('../services/authService', () => ({
  fetchSession: jest.fn()
    .mockResolvedValueOnce({ user: null, roles: [] }) // first test
    .mockResolvedValue({ user: { id: 5, username: 'joe' }, roles: ['user'] }),
}));

jest.mock('../services/notificationService', () => ({
  listNotifications: jest.fn().mockResolvedValue({ items: [] }),
  markAsRead: jest.fn(),
}));

describe('Routes and RBAC', () => {
  test('unauthenticated redirected from protected routes to login', async () => {
    renderApp({ route: '/profile' });
    await screen.findByRole('heading', { name: /Login/i });
  });

  test('authenticated user can access profile and not moderation/admin', async () => {
    renderApp({ route: '/profile' });
    await screen.findByRole('heading', { name: /Profile/i });

    renderApp({ route: '/moderation' });
    // Redirected to home
    await screen.findByRole('heading', { name: /Welcome to Q&A/i });
  });

  test('not found route shows 404 page', async () => {
    renderApp({ route: '/does-not-exist' });
    await screen.findByRole('heading', { name: /Page not found/i });
  });
});
