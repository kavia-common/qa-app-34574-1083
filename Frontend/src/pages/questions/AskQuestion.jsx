import React, { useState } from 'react';
import { RichTextEditor } from '../../components/editor/RichTextEditor';
import { TagSelector } from '../../components/common/TagSelector';
import { createQuestion, saveDraft } from '../../services/questionService';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../../state/UIContext';
import { sanitizeHtml } from '../../utils/sanitize';

// PUBLIC_INTERFACE
export default function AskQuestion() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useUI();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await createQuestion({ title, content, tags });
      addToast('Question submitted', 'success');
      navigate(`/questions/${res.id}`);
    } catch (e2) {
      addToast(e2.message || 'Failed to submit question', 'error');
    }
  };

  const saveAsDraft = async () => {
    setSaving(true);
    try {
      await saveDraft({ title, content, tags });
      addToast('Draft saved', 'success');
    } catch (e2) {
      addToast(e2.message || 'Failed to save draft', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h1>Ask a Question</h1>
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required minLength={10} maxLength={150} />
        </div>
        <RichTextEditor value={content} onChange={setContent} label="Details" />
        <div style={{ marginTop: '.5rem' }}>
          <TagSelector value={tags} onChange={setTags} allTags={[]} />
        </div>
        <div style={{ display: 'flex', gap: '.5rem', marginTop: '1rem' }}>
          <button className="btn" disabled={!title.trim() || !content.trim()} aria-disabled={!title.trim() || !content.trim()}>Submit</button>
          <button type="button" className="btn btn-secondary" onClick={() => setPreview(p => !p)}>{preview ? 'Hide preview' : 'Preview'}</button>
          <button type="button" className="btn btn-secondary" onClick={saveAsDraft} disabled={saving} aria-disabled={saving}>{saving ? 'Saving…' : 'Save draft'}</button>
        </div>
      </form>
      {preview && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h2>Preview</h2>
          <h3>{title}</h3>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
        </div>
      )}
    </div>
  );
}
