import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Home() {
  return (
    <div className="card">
      <h1>Welcome to Q&A</h1>
      <p>Ask questions, share knowledge, and help others.</p>
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <Link to="/questions/ask" className="btn">Ask a Question</Link>
        <Link to="/questions" className="btn btn-secondary">Browse Questions</Link>
      </div>
    </div>
  );
}
