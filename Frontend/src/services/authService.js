import { api } from './api';

/** Auth service functions wrapping backend endpoints. */

// PUBLIC_INTERFACE
export async function login({ identifier, password, remember }) {
  /** Perform login with email/username and password. */
  const res = await api.post('/auth/login', { identifier, password, remember });
  return res.data; // expected: { user, token?, roles }
}

// PUBLIC_INTERFACE
export async function oauthStart(provider) {
  /** Start OAuth flow (opens backend redirect URL). */
  const res = await api.get(`/auth/oauth/${provider}/start`);
  return res.data; // { url }
}

// PUBLIC_INTERFACE
export async function logout() {
  /** Invalidate session server-side and clear cookies. */
  const res = await api.post('/auth/logout');
  return res.data;
}

// PUBLIC_INTERFACE
export async function register(data) {
  /** Register a new user; backend sends verification email. */
  const res = await api.post('/auth/register', data);
  return res.data;
}

// PUBLIC_INTERFACE
export async function verifyEmail(token) {
  /** Verify email with token. */
  const res = await api.post('/auth/verify-email', { token });
  return res.data;
}

// PUBLIC_INTERFACE
export async function forgotPassword(email) {
  /** Send password reset email. */
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
}

// PUBLIC_INTERFACE
export async function resetPassword({ token, newPassword }) {
  /** Reset password with token. */
  const res = await api.post('/auth/reset-password', { token, newPassword });
  return res.data;
}

// PUBLIC_INTERFACE
export async function changePassword({ currentPassword, newPassword }) {
  /** Change password for authenticated user. */
  const res = await api.post('/auth/change-password', { currentPassword, newPassword });
  return res.data;
}

// PUBLIC_INTERFACE
export async function fetchSession() {
  /** Get current session user and roles. */
  const res = await api.get('/auth/session');
  return res.data; // { user, roles, preferences }
}
