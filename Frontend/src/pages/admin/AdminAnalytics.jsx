import React, { useEffect, useState } from 'react';
import { analyticsOverview, popularTopicsReport, unansweredAndResponseTimes, exportReport } from '../../services/adminService';
import { useUI } from '../../state/UIContext';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// PUBLIC_INTERFACE
export default function AdminAnalytics() {
  const { addToast } = useUI();
  const [overview, setOverview] = useState(null);
  const [popular, setPopular] = useState({ items: [] });
  const [unanswered, setUnanswered] = useState({ items: [] });
  const [range, setRange] = useState('30d');

  const load = async () => {
    try {
      const [o, p, u] = await Promise.all([
        analyticsOverview({ range }),
        popularTopicsReport({ range }),
        unansweredAndResponseTimes({ range })
      ]);
      setOverview(o); setPopular(p); setUnanswered(u);
    } catch (e) { addToast(e.message || 'Failed to load analytics', 'error'); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [range]);

  const exportFile = async (type, format) => {
    try {
      const blob = await exportReport(type, format, { range });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${type}-${range}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) { addToast(e.message || 'Export failed', 'error'); }
  };

  return (
    <div>
      <h1>Admin Analytics</h1>
      <div className="card" style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
        <label htmlFor="range">Date range</label>
        <select id="range" value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '.5rem' }}>
          <button className="btn btn-secondary" onClick={() => exportFile('overview', 'csv')}>Export CSV</button>
          <button className="btn btn-secondary" onClick={() => exportFile('overview', 'pdf')}>Export PDF</button>
        </div>
      </div>

      <section className="card" style={{ marginTop: '1rem' }}>
        <h2>User Growth</h2>
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <LineChart data={overview?.growth || []}>
              <XAxis dataKey="date" /><YAxis /><Tooltip /><Legend />
              <Line type="monotone" dataKey="users" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <h2>Popular Topics</h2>
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={popular?.items || []} dataKey="count" nameKey="topic" outerRadius={90}>
                {(popular?.items || []).map((_, i) => <Cell key={i} fill={['#60a5fa','#93c5fd','#bfdbfe','#1d4ed8','#2563eb'][i % 5]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <h2>Unanswered & Response Times</h2>
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <LineChart data={unanswered?.items || []}>
              <XAxis dataKey="date" /><YAxis /><Tooltip /><Legend />
              <Line type="monotone" dataKey="unanswered" stroke="#ef4444" />
              <Line type="monotone" dataKey="avgResponseMins" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
