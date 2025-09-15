import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuestion } from '../../services/questionService';
import { listAnswers, createAnswer } from '../../services/answerService';
import { useUI } from '../../state/UIContext';
import { useAuth } from '../../state/AuthContext';
import { RichTextEditor } from '../../components/editor/RichTextEditor';
import { sanitizeHtml } from '../../utils/sanitize';

// PUBLIC_INTERFACE
export default function QuestionDetail() {
  const { id } = useParams();
  const { addToast } = useUI();
  const { isAuthenticated } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [preview, setPreview] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [q, a] = await Promise.all([getQuestion(id), listAnswers(id)]);
      setQuestion(q);
      setAnswers(a?.items || []);
    } catch (e) {
      addToast(e.message || 'Failed to load question', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [id]);

  const submitAnswer = async (e) => {
    e.preventDefault();
    try {
      await createAnswer(id, { content: answer });
      setAnswer('');
      setPreview(false);
      addToast('Answer submitted', 'success');
      fetchData();
    } catch (e2) {
      addToast(e2.message || 'Failed to submit answer', 'error');
    }
  };

  if (loading) return <p>Loading…</p>;
  if (!question) return <p>Question not found</p>;

  return (
    <div>
      <div className="card">
        <h1>{question.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(question.contentHtml || '') }} />
        <div style={{ marginTop: '.5rem', display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          {question.tags?.map(t => <span key={t} className="badge">{t}</span>)}
        </div>
        <div style={{ marginTop: '.5rem' }}>
          <Link to={`/questions/${id}/edit`} className="btn btn-secondary">Edit</Link>
        </div>
      </div>

      <section aria-label="Answers" style={{ marginTop: '1rem' }}>
        <h2>{answers.length} Answers</h2>
        {answers.map(ans => (
          <article key={ans.id} className="card" aria-label="Answer">
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(ans.contentHtml || '') }} />
            <div style={{ marginTop: '.5rem', fontSize: '.9rem' }}>
              Answered by {ans.author?.displayName || ans.author?.username}
            </div>
          </article>
        ))}
      </section>

      {isAuthenticated && (
        <section className="card" style={{ marginTop: '1rem' }} aria-label="Your answer">
          <h2>Your Answer</h2>
          <RichTextEditor value={answer} onChange={setAnswer} label="Answer content" />
          <div style={{ display: 'flex', gap: '.5rem', marginTop: '.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setPreview(p => !p)}>{preview ? 'Hide preview' : 'Preview'}</button>
            <button className="btn" onClick={submitAnswer} disabled={!answer.trim()}>Post your answer</button>
          </div>
          {preview && (
            <div className="card" style={{ marginTop: '.75rem' }}>
              <h3>Preview</h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(answer) }} />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
