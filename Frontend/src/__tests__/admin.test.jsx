import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from './test-utils';

jest.mock('../services/authService', () => ({
  fetchSession: jest.fn().mockResolvedValue({ user: { id: 1, username: 'admin' }, roles: ['administrator'] }),
}));

jest.mock('../services/adminService', () => ({
  analyticsOverview: jest.fn().mockResolvedValue({ growth: [{ date: '2024-01-01', users: 10 }] }),
  popularTopicsReport: jest.fn().mockResolvedValue({ items: [{ topic: 'react', count: 5 }] }),
  unansweredAndResponseTimes: jest.fn().mockResolvedValue({ items: [{ date: '2024-01-01', unanswered: 3, avgResponseMins: 42 }] }),
  exportReport: jest.fn().mockResolvedValue(new Blob(['id,name\n1,a'])),
  listUsers: jest.fn().mockResolvedValue({ items: [{ id: 1, username: 'u', email: 'u@e.com', role: 'user' }] }),
  updateUserRole: jest.fn().mockResolvedValue({ ok: true }),
  systemSettingsGet: jest.fn().mockResolvedValue({ name: 'Q&A', registrationEnabled: true, maintenanceMode: false, supportUrl: '' }),
  systemSettingsUpdate: jest.fn().mockResolvedValue({ ok: true }),
}));

jest.mock('../services/notificationService', () => ({
  listNotifications: jest.fn().mockResolvedValue({ items: [] }),
  markAsRead: jest.fn(),
}));

const admin = require('../services/adminService');

describe('Admin pages', () => {
  test('analytics renders and can export', async () => {
    renderApp({ route: '/admin/analytics' });
    await screen.findByRole('heading', { name: /Admin Analytics/i });
    await userEvent.click(screen.getByRole('button', { name: /Export CSV/i }));
    await waitFor(() => expect(admin.exportReport).toHaveBeenCalled());
  });

  test('admin users can update role', async () => {
    renderApp({ route: '/admin/users' });
    await screen.findByRole('heading', { name: /Manage Users/i });
    await userEvent.click(screen.getByRole('button', { name: /^Moderator$/i }));
    await waitFor(() => expect(admin.updateUserRole).toHaveBeenCalled());
  });

  test('admin settings save', async () => {
    renderApp({ route: '/admin/settings' });
    await screen.findByRole('heading', { name: /System Settings/i });
    await userEvent.type(screen.getByLabelText(/Platform name/i), 'X');
    await userEvent.click(screen.getByRole('button', { name: /Save/i }));
    await waitFor(() => expect(admin.systemSettingsUpdate).toHaveBeenCalled());
  });
});
