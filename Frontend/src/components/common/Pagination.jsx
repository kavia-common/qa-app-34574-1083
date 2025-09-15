import React from 'react';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
export function Pagination({ page, pageSize, total, onChange }) {
  /** Simple accessible pagination. */
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 10)));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const go = (p) => { if (p >= 1 && p <= totalPages) onChange(p); };

  return (
    <nav aria-label="Pagination" style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
      <button className="btn btn-secondary" onClick={() => go(1)} disabled={!canPrev} aria-disabled={!canPrev}>First</button>
      <button className="btn btn-secondary" onClick={() => go(page - 1)} disabled={!canPrev} aria-disabled={!canPrev}>Prev</button>
      <span aria-live="polite">Page {page} of {totalPages}</span>
      <button className="btn btn-secondary" onClick={() => go(page + 1)} disabled={!canNext} aria-disabled={!canNext}>Next</button>
      <button className="btn btn-secondary" onClick={() => go(totalPages)} disabled={!canNext} aria-disabled={!canNext}>Last</button>
    </nav>
  );
}
Pagination.propTypes = {
  page: PropTypes.number.isRequired, pageSize: PropTypes.number.isRequired, total: PropTypes.number, onChange: PropTypes.func.isRequired
};
