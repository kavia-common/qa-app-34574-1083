import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { flagContent } from '../../services/moderationService';
import { useUI } from '../../state/UIContext';

// PUBLIC_INTERFACE
export function FlagButton({ contentType, contentId }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('spam');
  const [comment, setComment] = useState('');
  const { addToast } = useUI();

  const submit = async () => {
    try {
      await flagContent(contentType, contentId, reason, comment);
      addToast('Flag submitted', 'success');
      setOpen(false); setComment('');
    } catch (e) { addToast(e.message || 'Failed to flag', 'error'); }
  };

  if (!open) return <button className="btn btn-secondary" onClick={() => setOpen(true)}>Flag</button>;
  return (
    <div className="card" style={{ marginTop: '.5rem' }}>
      <div className="form-group">
        <label htmlFor="reason">Reason</label>
        <select id="reason" value={reason} onChange={(e) => setReason(e.target.value)}>
          <option value="spam">Spam</option>
          <option value="abuse">Abuse</option>
          <option value="off-topic">Off-topic</option>
          <option value="incorrect">Incorrect information</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="comment">Comment (optional)</label>
        <textarea id="comment" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <button className="btn" onClick={submit}>Submit flag</button>
        <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </div>
  );
}
FlagButton.propTypes = { contentType: PropTypes.string.isRequired, contentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired };
