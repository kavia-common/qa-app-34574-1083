# Q&A Web UI (React)

A modular, secure, and accessible frontend for the Q&A platform.

## Quick start

- Copy `.env.example` to `.env` and configure:
  - REACT_APP_API_BASE_URL: Backend API base (e.g., https://api.example.com)
  - REACT_APP_SITE_URL: Deployed site URL (used for OAuth redirects if needed)
  - OAuth IDs when social login is enabled
- Install and run:
  - npm install
  - npm start

## Key features

- Authentication: registration, email verification, login, logout, password reset/change, OAuth buttons (Google/Facebook)
- Question & Answer: submit, edit, delete, drafts, preview, tags, filters, search, pagination
- Moderation: dashboard, filtering, bulk approve/remove/escalate, audit-ready UX
- Admin: analytics dashboards (user growth, popular topics, response times), users/roles, system settings, export CSV/PDF
- Notifications: in-app center with unread counts, preferences, polling-based real-time
- Accessibility: WCAG 2.1 AA patterns (skip links, ARIA, keyboard operability, focus outlines), high-contrast-ready theme
- Security: CSRF header support, HttpOnly cookies or JWT storage fallback, DOMPurify sanitization for rich text

## Code structure

- src/routes.jsx: router with protected/role-protected routes
- src/state/*: contexts for auth, notifications, UI
- src/services/*: API modules (auth, questions, answers, moderation, notifications, admin)
- src/components/*: layout, common widgets, editor
- src/pages/*: feature pages

## Notes

- This UI expects a REST backend that implements the routes referenced in src/services.
- Do not hardcode secrets; use environment variables via `.env`.
- Rich text editor is lightweight; integrate a full editor if required.

## Scripts

- npm start: dev server
- npm test: tests (non-watch)
- npm run build: production build
