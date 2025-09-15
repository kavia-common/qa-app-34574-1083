import React, { useEffect, useState } from 'react';
import { searchQuestions } from '../../services/questionService';
import { Link } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
import { useUI } from '../../state/UIContext';

// PUBLIC_INTERFACE
export default function UserDashboard() {
  const { user } = useAuth();
  const { addToast } = useUI();
  const [mine, setMine] = useState({ items: [], total: 0, page: 1, pageSize: 10 });

  useEffect(() => {
    (async () => {
      try {
        const data = await searchQuestions({ authorId: user?.id, page: 1, pageSize: 10 });
        setMine(data);
      } catch (e) {
        addToast(e.message || 'Failed to load your questions', 'error');
      }
    })();
  }, [user, addToast]);

  return (
    <div>
      <h1>My Dashboard</h1>
      <section className="card">
        <h2>My Questions</h2>
        <ul>
          {mine.items.map(q => (
            <li key={q.id} style={{ marginBottom: '.5rem' }}>
              <Link to={`/questions/${q.id}`}>{q.title}</Link> · <span className="badge">{q.status}</span> · <Link to={`/questions/${q.id}/edit`}>Edit</Link>
            </li>
          ))}
        </ul>
        <div>Total: {mine.total}</div>
      </section>
    </div>
  );
}
