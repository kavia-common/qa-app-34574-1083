import React, { useEffect, useState } from 'react';
import { systemSettingsGet, systemSettingsUpdate } from '../../services/adminService';
import { useUI } from '../../state/UIContext';

// PUBLIC_INTERFACE
export default function AdminSettings() {
  const { addToast } = useUI();
  const [settings, setSettings] = useState({ name: 'Q&A', registrationEnabled: true, maintenanceMode: false, supportUrl: '' });

  useEffect(() => {
    (async () => {
      try {
        const s = await systemSettingsGet();
        setSettings({ ...settings, ...s });
      } catch { /* ignore */ }
    })();
    // eslint-disable-next-line
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await systemSettingsUpdate(settings);
      addToast('Settings saved', 'success');
    } catch (e2) { addToast(e2.message || 'Failed to save settings', 'error'); }
  };

  return (
    <div className="card">
      <h1>System Settings</h1>
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="name">Platform name</label>
          <input id="name" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label><input type="checkbox" checked={settings.registrationEnabled} onChange={(e) => setSettings({ ...settings, registrationEnabled: e.target.checked })} /> Enable registration</label>
        </div>
        <div className="form-group">
          <label><input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} /> Maintenance mode</label>
        </div>
        <div className="form-group">
          <label htmlFor="supportUrl">Support URL</label>
          <input id="supportUrl" value={settings.supportUrl} onChange={(e) => setSettings({ ...settings, supportUrl: e.target.value })} />
        </div>
        <button className="btn">Save</button>
      </form>
    </div>
  );
}
