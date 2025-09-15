import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import { SearchBar } from '../components/common/SearchBar';
import { TagSelector } from '../components/common/TagSelector';
import { Pagination } from '../components/common/Pagination';
import { Modal } from '../components/common/Modal';

describe('Common components accessibility', () => {
  test('SearchBar exposes role=search and listbox suggestions', async () => {
    const onSearch = jest.fn();
    renderWithProviders(<SearchBar onSearch={onSearch} suggestions={['React', 'Redux']} />);
    const search = screen.getByRole('search', { name: /Search questions/i });
    expect(search).toBeInTheDocument();
    const input = screen.getByRole('searchbox', { name: /Search/i });
    await userEvent.type(input, 'Rea');
    // Should show suggestions listbox
    const list = await screen.findByRole('listbox');
    expect(list).toBeInTheDocument();
  });

  test('TagSelector enforces max and has accessible remove buttons', async () => {
    const onChange = jest.fn();
    renderWithProviders(<TagSelector value={['a', 'b', 'c', 'd', 'e']} onChange={onChange} allTags={['f', 'g']} max={5} />);
    const suggestionButtons = screen.queryAllByRole('button', { name: 'f' });
    // Disabled because max reached
    if (suggestionButtons[0]) {
      expect(suggestionButtons[0]).toBeDisabled();
    }
    // Remove tag button exists
    const removeBtn = screen.getByRole('button', { name: /Remove tag a/i });
    expect(removeBtn).toBeInTheDocument();
  });

  test('Pagination shows correct aria-disabled and changes page', async () => {
    const onChange = jest.fn();
    renderWithProviders(<Pagination page={1} pageSize={10} total={30} onChange={onChange} />);
    const prev = screen.getByRole('button', { name: /Prev/i });
    expect(prev).toHaveAttribute('aria-disabled', 'true');
    const next = screen.getByRole('button', { name: /Next/i });
    await userEvent.click(next);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  test('Modal has role=dialog and confirm/cancel buttons', async () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    renderWithProviders(
      <Modal title="Delete" onClose={onClose} onConfirm={onConfirm} confirmText="Confirm">
        <p>Are you sure?</p>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));
    expect(onConfirm).toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
