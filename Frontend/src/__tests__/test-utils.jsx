import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render as rtlRender } from '@testing-library/react';
import { AuthProvider } from '../state/AuthContext';
import { UIProvider } from '../state/UIContext';
import { NotificationProvider } from '../state/NotificationContext';
import { AppRoutes } from '../routes';

/**
 * Custom render utility to wrap with providers and MemoryRouter.
 * Allows overriding initialEntries (route) and initialAuth state via mocks.
 */
export function renderWithProviders(ui, { route = '/', initialEntries, ...options } = {}) {
  const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={initialEntries || [route]}>
      <AuthProvider>
        <NotificationProvider>
          <UIProvider>{children}</UIProvider>
        </NotificationProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Helper to render the full app routes with providers
export function renderApp({ route = '/', initialEntries } = {}) {
  return renderWithProviders(<AppRoutes />, { route, initialEntries });
}
