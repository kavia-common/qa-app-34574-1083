import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function NotFound() {
  return (
    <div className="card">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-secondary">Go home</Link>
    </div>
  );
}
