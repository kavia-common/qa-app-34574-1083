import React, { useState } from 'react';
import { register } from '../../services/authService';
import { useUI } from '../../state/UIContext';
import { Link, useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration form with optional profile fields. */
  const [form, setForm] = useState({ username: '', email: '', password: '', displayName: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const { addToast } = useUI();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      addToast('Registration successful. Please check your email to verify your account.', 'success');
      navigate('/verify-email');
    } catch (e2) {
      addToast(e2.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 640, margin: '2rem auto' }}>
      <h1>Create your account</h1>
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input id="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required minLength={3} maxLength={30} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password (min 8 chars, mix of upper/lower/number/symbol)</label>
          <input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} autoComplete="new-password" />
        </div>
        <fieldset className="card" style={{ marginTop: '1rem' }}>
          <legend>Optional Profile</legend>
          <div className="form-group">
            <label htmlFor="displayName">Display name</label>
            <input id="displayName" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} maxLength={60} />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Short bio</label>
            <textarea id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} maxLength={300} />
          </div>
        </fieldset>
        <button className="btn" disabled={loading} aria-disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
      </form>
      <p style={{ marginTop: '1rem' }}>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
