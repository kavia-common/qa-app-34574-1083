import React, { useState } from 'react';
import { useAuth } from '../../state/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { oauthStart } from '../../services/authService';
import { useUI } from '../../state/UIContext';

// PUBLIC_INTERFACE
export default function Login() {
  /** Login form with remember me and OAuth buttons. */
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useUI();
  const [form, setForm] = useState({ identifier: '', password: '', remember: false });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate('/', { replace: true });
      addToast('Welcome back!', 'success');
    } catch (e2) {
      addToast(e2.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startOAuth = async (provider) => {
    try {
      const { url } = await oauthStart(provider);
      window.location.href = url;
    } catch {
      addToast('Failed to start social login', 'error');
    }
  };

  return (
    <div className="card" style={{ maxWidth: 480, margin: '2rem auto' }}>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="identifier">Email or username</label>
          <input id="identifier" value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} required autoComplete="username" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />
        </div>
        <div className="form-group">
          <label><input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} /> Remember me</label>
        </div>
        <button className="btn" disabled={loading} aria-disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
      </form>
      <div style={{ marginTop: '1rem' }}>
        <button className="btn btn-secondary" onClick={() => startOAuth('google')} aria-label="Login with Google">Continue with Google</button>
        <button className="btn btn-secondary" onClick={() => startOAuth('facebook')} aria-label="Login with Facebook">Continue with Facebook</button>
      </div>
      <p style={{ marginTop: '1rem' }}>
        <Link to="/forgot-password">Forgot password?</Link> · New user? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
