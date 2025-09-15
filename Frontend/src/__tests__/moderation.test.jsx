import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from './test-utils';

jest.mock('../services/authService', () => ({
  fetchSession: jest.fn().mockResolvedValue({ user: { id: 2, username: 'mod' }, roles: ['moderator'] }),
}));

jest.mock('../services/moderationService', () => ({
  listFlagged: jest.fn(),
  moderateAction: jest.fn(),
  flagContent: jest.fn(),
}));

jest.mock('../services/notificationService', () => ({
  listNotifications: jest.fn().mockResolvedValue({ items: [] }),
  markAsRead: jest.fn(),
}));

const mod = require('../services/moderationService');

describe('Moderation dashboard', () => {
  test('filters, selects and bulk actions', async () => {
    mod.listFlagged.mockResolvedValueOnce({
      items: [
        { id: 1, type: 'question', reason: 'spam', status: 'pending', excerpt: 'Buy now' },
        { id: 2, type: 'answer', reason: 'abuse', status: 'pending', excerpt: 'You are...' }
      ],
      total: 2
    });

    renderApp({ route: '/moderation' });
    await screen.findByRole('heading', { name: /Moderation/i });
    expect(await screen.findAllByRole('row')).toHaveLength(3); // header + 2 rows

    // Select all and approve
    const table = screen.getByRole('table');
    const headerCheckbox = within(table).getAllByRole('checkbox')[0];
    await userEvent.click(headerCheckbox);

    const approveBtn = screen.getByRole('button', { name: /Approve/i });
    await userEvent.click(approveBtn);
    await waitFor(() => expect(mod.moderateAction).toHaveBeenCalled());
  });
});

describe('User FlagButton', () => {
  test('opens, sets reason and submits flag', async () => {
    mod.flagContent.mockResolvedValue({ ok: true });

    // Need a page that renders FlagButton; simplest is render component itself inside providers
    const { renderWithProviders } = require('./test-utils');
    const { FlagButton } = require('../components/moderation/FlagButton.jsx'); // Note: exported named

    const { container } = renderWithProviders(<FlagButton contentType="question" contentId={99} />);
    // Initial button
    await userEvent.click(screen.getByRole('button', { name: /Flag/i }));
    await userEvent.selectOptions(screen.getByLabelText(/Reason/i), 'abuse');
    await userEvent.type(screen.getByLabelText(/Comment/i), 'offensive language');
    await userEvent.click(screen.getByRole('button', { name: /Submit flag/i }));
    await waitFor(() => expect(mod.flagContent).toHaveBeenCalledWith('question', 99, 'abuse', 'offensive language'));
    expect(container).toBeTruthy();
  });
});
