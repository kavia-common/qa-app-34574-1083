import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// PUBLIC_INTERFACE
export function SideBar() {
  /** Sidebar for quick filters and categories. */
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'relevance');

  const apply = () => {
    const next = new URLSearchParams(searchParams);
    if (status) next.set('status', status); else next.delete('status');
    if (sort) next.set('sort', sort); else next.delete('sort');
    setSearchParams(next);
  };

  return (
    <div className="sidebar" role="complementary">
      <h3>Filters</h3>
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select id="status" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Any</option>
          <option value="answered">Answered</option>
          <option value="unanswered">Unanswered</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="sort">Sort</label>
        <select id="sort" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="relevance">Relevance</option>
          <option value="recent">Most recent</option>
          <option value="popular">Most popular</option>
        </select>
      </div>
      <button className="btn" onClick={apply}>Apply</button>

      <div style={{ marginTop: '2rem' }}>
        <h4>Quick links</h4>
        <ul>
          <li><Link to="/questions?status=unanswered">Unanswered</Link></li>
          <li><Link to="/questions?sort=popular">Popular</Link></li>
          <li><Link to="/drafts">My Drafts</Link></li>
        </ul>
      </div>
    </div>
  );
}
