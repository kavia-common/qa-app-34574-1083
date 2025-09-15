import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from './test-utils';

jest.useFakeTimers();

jest.mock('../services/authService', () => ({
  fetchSession: jest.fn().mockResolvedValue({ user: { id: 3, username: 'alice' }, roles: ['user'] }),
}));
jest.mock('../services/notificationService', () => ({
  listNotifications: jest.fn().mockResolvedValue({
    items: [
      { id: 1, title: 'New answer', message: 'Someone answered your question', createdAt: Date.now(), read: false },
      { id: 2, title: 'Welcome', message: 'Thanks for joining!', createdAt: Date.now(), read: true },
    ]
  }),
  markAsRead: jest.fn().mockResolvedValue({ ok: true }),
}));

const ns = require('../services/notificationService');

describe('Notifications', () => {
  test('unread badge shows in NavBar and center lists items', async () => {
    renderApp({ route: '/' });
    // NavBar has notifications button with aria-label containing unread count "1 unread"
    const notifLink = await screen.findByRole('link', { name: /Notifications, 1 unread/ });
    expect(notifLink).toBeInTheDocument();

    // Navigate to center
    await userEvent.click(notifLink);
    await screen.findByRole('heading', { name: /Notifications/i });
    await screen.findByText(/New answer/i);
  });

  test('mark as read updates state', async () => {
    renderApp({ route: '/notifications' });
    const markButtons = await screen.findAllByRole('button', { name: /Mark as read/i });
    await userEvent.click(markButtons[0]);
    expect(ns.markAsRead).toHaveBeenCalledWith(1);
  });
});
