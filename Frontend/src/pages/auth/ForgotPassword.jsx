import React, { useState } from 'react';
import { forgotPassword } from '../../services/authService';
import { useUI } from '../../state/UIContext';

// PUBLIC_INTERFACE
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { addToast } = useUI();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSent(true);
      addToast('If the email is registered, a reset link has been sent.', 'success');
    } catch (e2) {
      addToast(e2.message || 'Failed to request reset', 'error');
    }
  };

  return (
    <div className="card" style={{ maxWidth: 480, margin: '2rem auto' }}>
      <h1>Forgot Password</h1>
      {!sent ? (
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className="btn">Send reset link</button>
        </form>
      ) : (
        <p>Please check your email for a link to reset your password.</p>
      )}
    </div>
  );
}
