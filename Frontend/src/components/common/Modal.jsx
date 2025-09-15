import React from 'react';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
export function Modal({ title, children, onClose, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  /** Accessible modal dialog. */
  return (
    <div role="dialog" aria-modal="true" className="card" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: 'min(95vw, 600px)' }}>
        <h2 id="modal-title">{title}</h2>
        <div>{children}</div>
        <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>{cancelText}</button>
          <button className="btn btn-danger" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
Modal.propTypes = {
  title: PropTypes.string.isRequired, children: PropTypes.node, onClose: PropTypes.func.isRequired, onConfirm: PropTypes.func.isRequired,
  confirmText: PropTypes.string, cancelText: PropTypes.string
};
