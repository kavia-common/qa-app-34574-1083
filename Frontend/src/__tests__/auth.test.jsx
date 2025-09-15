import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp, renderWithProviders } from './test-utils';

// Mock services
jest.mock('../services/authService', () => ({
  login: jest.fn(),
  oauthStart: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  verifyEmail: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  changePassword: jest.fn(),
  fetchSession: jest.fn().mockResolvedValue({ user: null, roles: [] }),
}));

// Mock questionService minimal to avoid incidental calls
jest.mock('../services/questionService', () => ({
  searchQuestions: jest.fn().mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 10 }),
}));

jest.mock('../services/notificationService', () => ({
  listNotifications: jest.fn().mockResolvedValue({ items: [] }),
  markAsRead: jest.fn(),
  preferencesGet: jest.fn().mockResolvedValue({ inApp: true, email: true, digest: 'immediate' }),
  preferencesUpdate: jest.fn().mockResolvedValue({ ok: true }),
}));

const authService = require('../services/authService');

describe('Auth flows', () => {
  test('login success shows toast and redirects home', async () => {
    authService.login.mockResolvedValue({ user: { id: 1, username: 'alice' }, roles: ['user'] });

    const { container } = renderApp({ route: '/login' });

    const idInput = await screen.findByLabelText(/Email or username/i);
    await userEvent.type(idInput, 'alice@example.com');
    const pwInput = screen.getByLabelText(/Password/i);
    await userEvent.type(pwInput, 'correct-horse-battery-staple');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      // After successful login, AppRoutes should redirect to "/"
      expect(container.querySelector('h1')?.textContent).toMatch(/Welcome to Q&A/i);
    });
  });

  test('login failure shows error toast', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'));
    renderApp({ route: '/login' });

    await userEvent.type(await screen.findByLabelText(/Email or username/i), 'bob');
    await userEvent.type(screen.getByLabelText(/Password/i), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    // Toast appears and is announced
    await screen.findByRole('status', { name: /error/i });
  });

  test('OAuth button triggers backend start', async () => {
    authService.oauthStart.mockResolvedValue({ url: 'https://auth.example.com/oauth' });
    renderApp({ route: '/login' });
    await userEvent.click(await screen.findByRole('button', { name: /Login with Google/i }));
    expect(authService.oauthStart).toHaveBeenCalledWith('google');
  });

  test('register success navigates to verify email page', async () => {
    authService.register.mockResolvedValue({ ok: true });
    renderApp({ route: '/register' });
    await userEvent.type(await screen.findByLabelText(/Username/i), 'newuser');
    await userEvent.type(screen.getByLabelText(/Email address/i), 'new@ex.com');
    await userEvent.type(screen.getByLabelText(/^Password /i), 'Passw0rd!');
    await userEvent.click(screen.getByRole('button', { name: /Create account/i }));

    // Verify page content
    await screen.findByRole('heading', { name: /Verify your email/i });
  });

  test('forgot password submits and shows success message', async () => {
    authService.forgotPassword.mockResolvedValue({ ok: true });
    renderApp({ route: '/forgot-password' });
    await userEvent.type(await screen.findByLabelText(/Email/i), 'me@ex.com');
    await userEvent.click(screen.getByRole('button', { name: /Send reset link/i }));
    // Success toast role status
    await screen.findByRole('status');
  });

  test('reset password validates match and calls service', async () => {
    authService.resetPassword.mockResolvedValue({ ok: true });
    const initialEntries = ['/reset-password?token=abc123'];
    renderApp({ initialEntries });
    await userEvent.type(await screen.findByLabelText(/New password/i), 'NewPassw0rd!');
    await userEvent.type(screen.getByLabelText(/Confirm new password/i), 'NewPassw0rd!');
    await userEvent.click(screen.getByRole('button', { name: /Reset password/i }));
    await waitFor(() => expect(authService.resetPassword).toHaveBeenCalled());
  });

  test('change password via settings shows success toast', async () => {
    authService.changePassword.mockResolvedValue({ ok: true });
    // Simulate authenticated session for protected route
    authService.fetchSession.mockResolvedValueOnce({ user: { id: 1, username: 'alice' }, roles: ['user'] });

    const { container } = renderApp({ route: '/settings' });
    await screen.findByRole('heading', { name: /Settings/i });
    await userEvent.type(screen.getByLabelText(/Current password/i), 'currentPW');
    await userEvent.type(screen.getByLabelText(/^New password/i), 'newPW123!');
    await userEvent.type(screen.getByLabelText(/^Confirm new password/i), 'newPW123!');
    await userEvent.click(screen.getByRole('button', { name: /Change password/i }));
    await screen.findByRole('status');
    // Ensure still on settings
    expect(container.textContent).toMatch(/Notification Preferences/i);
  });
});
