import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestion, updateQuestion, deleteQuestion } from '../../services/questionService';
import { RichTextEditor } from '../../components/editor/RichTextEditor';
import { TagSelector } from '../../components/common/TagSelector';
import { Modal } from '../../components/common/Modal';
import { useUI } from '../../state/UIContext';

// PUBLIC_INTERFACE
export default function EditQuestion() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const { addToast } = useUI();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const q = await getQuestion(id);
        setTitle(q.title); setContent(q.content || ''); setTags(q.tags || []);
      } catch (e) { addToast(e.message || 'Failed to load question', 'error'); }
    })();
  }, [id, addToast]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await updateQuestion(id, { title, content, tags });
      addToast('Question updated', 'success');
      navigate(`/questions/${id}`);
    } catch (e2) {
      addToast(e2.message || 'Failed to update', 'error');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteQuestion(id, { permanent: false });
      addToast('Question deleted', 'success');
      navigate('/questions');
    } catch (e2) {
      addToast(e2.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="card">
      <h1>Edit Question</h1>
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <RichTextEditor value={content} onChange={setContent} label="Details" />
        <div style={{ marginTop: '.5rem' }}>
          <TagSelector value={tags} onChange={setTags} allTags={[]} />
        </div>
        <div style={{ display: 'flex', gap: '.5rem', marginTop: '1rem' }}>
          <button className="btn">Save</button>
          <button type="button" className="btn btn-danger" onClick={() => setShowDelete(true)}>Delete</button>
        </div>
      </form>
      {showDelete && (
        <Modal title="Delete Question" onClose={() => setShowDelete(false)} onConfirm={confirmDelete} confirmText="Delete">
          <p>Are you sure you want to delete this question? It can be recovered by admins if needed.</p>
        </Modal>
      )}
    </div>
  );
}
