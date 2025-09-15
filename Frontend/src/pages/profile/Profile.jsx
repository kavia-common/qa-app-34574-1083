import React from 'react';
import { useAuth } from '../../state/AuthContext';

// PUBLIC_INTERFACE
export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="card">
      <h1>Profile</h1>
      <dl>
        <dt>Username</dt><dd>{user?.username}</dd>
        <dt>Display name</dt><dd>{user?.displayName}</dd>
        <dt>Email</dt><dd>{user?.email}</dd>
        <dt>Reputation</dt><dd>{user?.reputation || 0}</dd>
      </dl>
    </div>
  );
}
