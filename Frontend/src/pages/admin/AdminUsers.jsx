import React, { useEffect, useState } from 'react';
import { listUsers, updateUserRole } from '../../services/adminService';
import { useUI } from '../../state/UIContext';

// PUBLIC_INTERFACE
export default function AdminUsers() {
  const { addToast } = useUI();
  const [users, setUsers] = useState([]);

  const load = async () => {
    try {
      const data = await listUsers({});
      setUsers(data?.items || []);
    } catch (e) { addToast(e.message || 'Failed to load users', 'error'); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const setRole = async (id, role) => {
    try {
      await updateUserRole(id, role);
      addToast('Role updated', 'success');
      load();
    } catch (e) { addToast(e.message || 'Failed to update role', 'error'); }
  };

  return (
    <div>
      <h1>Manage Users</h1>
      <table className="table">
        <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td style={{ display: 'flex', gap: '.5rem' }}>
                <button className="btn btn-secondary" onClick={() => setRole(u.id, 'user')}>User</button>
                <button className="btn btn-secondary" onClick={() => setRole(u.id, 'moderator')}>Moderator</button>
                <button className="btn btn-secondary" onClick={() => setRole(u.id, 'administrator')}>Admin</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
