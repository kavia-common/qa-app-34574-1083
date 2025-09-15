import React, { useEffect, useState } from 'react';
import { listDrafts } from '../../services/questionService';
import { Link } from 'react-router-dom';
import { useUI } from '../../state/UIContext';

// PUBLIC_INTERFACE
export default function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const { addToast } = useUI();

  useEffect(() => {
    (async () => {
      try {
        const data = await listDrafts();
        setDrafts(data?.items || []);
      } catch (e) {
        addToast(e.message || 'Failed to load drafts', 'error');
      }
    })();
  }, [addToast]);

  return (
    <div>
      <h1>Your Drafts</h1>
      {drafts.length === 0 ? <p>No drafts yet.</p> : (
        <ul>
          {drafts.map(d => (
            <li key={d.id} className="card" style={{ marginBottom: '.75rem' }}>
              <strong>{d.title || '(Untitled draft)'}</strong>
              <div><Link to={`/questions/ask?draftId=${d.id}`}>Continue editing</Link></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
