import React, { useEffect, useState } from 'react';
import { listFlagged, moderateAction } from '../../services/moderationService';
import { useUI } from '../../state/UIContext';

// PUBLIC_INTERFACE
export default function ModerationDashboard() {
  const { addToast } = useUI();
  const [data, setData] = useState({ items: [], total: 0 });
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({ type: '', status: '' });

  const fetchData = async () => {
    try {
      const d = await listFlagged(filters);
      setData(d);
    } catch (e) {
      addToast(e.message || 'Failed to load flagged content', 'error');
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [filters.type, filters.status]);

  const toggle = (id) => setSelected((s) => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const bulk = async (action) => {
    try {
      await moderateAction(selected, action, '');
      addToast('Action applied', 'success');
      setSelected([]);
      fetchData();
    } catch (e) { addToast(e.message || 'Failed to apply action', 'error'); }
  };

  return (
    <div>
      <h1>Moderation</h1>
      <div className="card" style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
        <div>
          <label htmlFor="type">Type</label>
          <select id="type" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">Any</option>
            <option value="question">Question</option>
            <option value="answer">Answer</option>
          </select>
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Any</option>
            <option value="pending">Pending</option>
            <option value="removed">Removed</option>
            <option value="approved">Approved</option>
          </select>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '.5rem' }}>
          <button className="btn" onClick={() => bulk('approve')} disabled={selected.length === 0}>Approve</button>
          <button className="btn btn-danger" onClick={() => bulk('remove')} disabled={selected.length === 0}>Remove</button>
          <button className="btn btn-secondary" onClick={() => bulk('escalate')} disabled={selected.length === 0}>Escalate</button>
        </div>
      </div>

      <table className="table" style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th><input type="checkbox" aria-label="Select all" onChange={(e) => {
              if (e.target.checked) setSelected(data.items.map(i => i.id));
              else setSelected([]);
            }} checked={selected.length > 0 && selected.length === data.items.length} /></th>
            <th>Type</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Excerpt</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map(item => (
            <tr key={item.id}>
              <td><input type="checkbox" aria-label={`Select ${item.id}`} checked={selected.includes(item.id)} onChange={() => toggle(item.id)} /></td>
              <td>{item.type}</td>
              <td>{item.reason}</td>
              <td><span className="badge">{item.status}</span></td>
              <td>{item.excerpt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
