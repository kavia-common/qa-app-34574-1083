import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { AuthProvider } from './state/AuthContext';
import { UIProvider } from './state/UIContext';
import { NotificationProvider } from './state/NotificationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <UIProvider>
            <AppRoutes />
          </UIProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
