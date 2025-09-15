import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchQuestions } from '../../services/questionService';
import { SearchBar } from '../../components/common/SearchBar';
import { Pagination } from '../../components/common/Pagination';
import { useUI } from '../../state/UIContext';

// PUBLIC_INTERFACE
export default function QuestionsList() {
  /** Browse and search questions with filters and pagination. */
  const [sp, setSp] = useSearchParams();
  const { addToast } = useUI();
  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(true);

  const page = parseInt(sp.get('page') || '1', 10);
  const q = sp.get('q') || '';
  const status = sp.get('status') || '';
  const sort = sp.get('sort') || 'relevance';

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await searchQuestions({ page, pageSize: 10, q, status, sort });
      setData(res);
    } catch (e) {
      addToast(e.message || 'Failed to load questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [page, q, status, sort]);

  const onSearch = (value) => {
    const next = new URLSearchParams(sp);
    if (value) next.set('q', value); else next.delete('q');
    next.set('page', '1');
    setSp(next);
  };
  const onPage = (p) => {
    const next = new URLSearchParams(sp);
    next.set('page', String(p));
    setSp(next);
  };

  return (
    <div>
      <h1>Questions</h1>
      <SearchBar onSearch={onSearch} onChange={() => {}} suggestions={[]} />
      {loading ? <p>Loading…</p> : (
        <>
          <p aria-live="polite">{data.total} results</p>
          <ul>
            {data.items.map((qst) => (
              <li key={qst.id} className="card" style={{ marginBottom: '.75rem' }}>
                <Link to={`/questions/${qst.id}`}><strong>{qst.title}</strong></Link>
                <div style={{ marginTop: '.35rem', display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                  {qst.tags?.map(t => <span key={t} className="badge">{t}</span>)}
                </div>
                <div style={{ fontSize: '.9rem', marginTop: '.5rem' }}>
                  <span className="badge">{qst.status}</span> · {qst.answersCount} answers · Asked by {qst.author?.displayName || qst.author?.username}
                </div>
              </li>
            ))}
          </ul>
          <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onChange={onPage} />
        </>
      )}
    </div>
  );
}
