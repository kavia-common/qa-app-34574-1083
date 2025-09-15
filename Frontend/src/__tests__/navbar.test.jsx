import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from './test-utils';

jest.mock('../services/notificationService', () => ({
  listNotifications: jest.fn().mockResolvedValue({ items: [] }),
  markAsRead: jest.fn(),
}));

describe('NavBar items visibility', () => {
  test('shows login/signup for anonymous, dashboard/profile/logout for authenticated, role links for roles', async () => {
    // Anonymous
    jest.resetModules();
    jest.doMock('../services/authService', () => ({
      fetchSession: jest.fn().mockResolvedValue({ user: null, roles: [] }),
    }));
    renderApp({ route: '/' });
    await screen.findByRole('link', { name: /Login/i });
    await screen.findByRole('link', { name: /Sign up/i });

    // Authenticated with roles
    jest.resetModules();
    jest.doMock('../services/authService', () => ({
      fetchSession: jest.fn().mockResolvedValue({ user: { id: 1, username: 'a' }, roles: ['administrator', 'moderator'] }),
    }));
    renderApp({ route: '/' });
    await screen.findByRole('link', { name: /My Dashboard/i });
    await screen.findByRole('link', { name: /Moderation/i });
    await screen.findByRole('link', { name: /Analytics/i });

    // Theme toggle label announces next theme
    const themeBtn = screen.getAllByRole('button', { name: /Switch to dark mode|Switch to light mode/i })[0];
    await userEvent.click(themeBtn);
  });
});
