import React, { useState } from 'react';
import { resetPassword } from '../../services/authService';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUI } from '../../state/UIContext';

// PUBLIC_INTERFACE
export default function ResetPassword() {
  const [sp] = useSearchParams();
  const token = sp.get('token') || '';
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const { addToast } = useUI();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (pw !== confirm) return addToast('Passwords do not match', 'error');
    try {
      await resetPassword({ token, newPassword: pw });
      addToast('Password reset successful. Please login.', 'success');
      navigate('/login');
    } catch (e2) {
      addToast(e2.message || 'Reset failed', 'error');
    }
  };

  return (
    <div className="card" style={{ maxWidth: 480, margin: '2rem auto' }}>
      <h1>Reset Password</h1>
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="pw">New password</label>
          <input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} minLength={8} required />
        </div>
        <div className="form-group">
          <label htmlFor="confirm">Confirm new password</label>
          <input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={8} required />
        </div>
        <button className="btn">Reset password</button>
      </form>
    </div>
  );
}
