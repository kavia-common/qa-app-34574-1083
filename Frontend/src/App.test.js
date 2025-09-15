import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { AuthProvider } from './state/AuthContext';
import { UIProvider } from './state/UIContext';
import { NotificationProvider } from './state/NotificationContext';

test('renders home welcome text', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>
        <NotificationProvider>
          <UIProvider>
            <AppRoutes />
          </UIProvider>
        </NotificationProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  const heading = screen.getByText(/Welcome to Q&A/i);
  expect(heading).toBeInTheDocument();
});
