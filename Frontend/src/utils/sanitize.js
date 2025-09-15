import DOMPurify from 'dompurify';

// PUBLIC_INTERFACE
export function sanitizeHtml(html) {
  /** Sanitize rich text to prevent XSS before rendering with dangerouslySetInnerHTML. */
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}
