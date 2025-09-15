import React, { useState } from 'react';
import { changePassword } from '../../services/authService';
import { preferencesGet, preferencesUpdate } from '../../services/notificationService';
import { useUI } from '../../state/UIContext';
import { useEffect } from 'react';

// PUBLIC_INTERFACE
export default function Settings() {
  const { addToast } = useUI();
  const [prefs, setPrefs] = useState({ inApp: true, email: true, digest: 'immediate' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  useEffect(() => {
    (async () => {
      try {
        const p = await preferencesGet();
        setPrefs({ inApp: !!p?.inApp, email: !!p?.email, digest: p?.digest || 'immediate' });
      } catch { /* ignore */ }
    })();
  }, []);

  const submitPw = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) return addToast('Passwords do not match', 'error');
    try {
      await changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
      addToast('Password changed', 'success');
    } catch (e2) {
      addToast(e2.message || 'Password change failed', 'error');
    }
  };

  const submitPrefs = async (e) => {
    e.preventDefault();
    try {
      await preferencesUpdate(prefs);
      addToast('Notification preferences saved', 'success');
    } catch (e2) {
      addToast(e2.message || 'Failed to save preferences', 'error');
    }
  };

  return (
    <div className="card">
      <h1>Settings</h1>
      <section className="card">
        <h2>Password</h2>
        <form onSubmit={submitPw}>
          <div className="form-group">
            <label htmlFor="current">Current password</label>
            <input id="current" type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
          </div>
          <div className="form-group">
            <label htmlFor="new">New password</label>
            <input id="new" type="password" minLength={8} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required />
          </div>
          <div className="form-group">
            <label htmlFor="confirm">Confirm new password</label>
            <input id="confirm" type="password" minLength={8} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required />
          </div>
          <button className="btn">Change password</button>
        </form>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <h2>Notification Preferences</h2>
        <form onSubmit={submitPrefs}>
          <div className="form-group">
            <label><input type="checkbox" checked={prefs.inApp} onChange={(e) => setPrefs({ ...prefs, inApp: e.target.checked })} /> In-app notifications</label>
          </div>
          <div className="form-group">
            <label><input type="checkbox" checked={prefs.email} onChange={(e) => setPrefs({ ...prefs, email: e.target.checked })} /> Email notifications</label>
          </div>
          <div className="form-group">
            <label htmlFor="digest">Email frequency</label>
            <select id="digest" value={prefs.digest} onChange={(e) => setPrefs({ ...prefs, digest: e.target.value })}>
              <option value="immediate">Immediate</option>
              <option value="daily">Daily digest</option>
              <option value="weekly">Weekly digest</option>
            </select>
          </div>
          <button className="btn">Save preferences</button>
        </form>
      </section>
    </div>
  );
}
