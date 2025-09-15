import React from 'react';

// PUBLIC_INTERFACE
export default function VerifyEmail() {
  /** Informational page after registration. Backend verification link is sent via email. */
  return (
    <div className="card" style={{ maxWidth: 640, margin: '2rem auto' }}>
      <h1>Verify your email</h1>
      <p>We have sent a verification link to your email. Please click the link to activate your account.</p>
      <p>If you did not receive the email, check your spam folder or request a new link from the login page.</p>
    </div>
  );
}
