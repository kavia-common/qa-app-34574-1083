/* jest-dom adds custom jest matchers for asserting on DOM nodes. */
import '@testing-library/jest-dom';

// Polyfills and globals for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    media: query,
    matches: false,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock localStorage where used by authStorage and UI theme
class LocalStorageMock {
  constructor() { this.store = {}; }
  clear() { this.store = {}; }
  getItem(key) { return this.store[key] || null; }
  setItem(key, value) { this.store[key] = String(value); }
  removeItem(key) { delete this.store[key]; }
}
Object.defineProperty(window, 'localStorage', { value: new LocalStorageMock() });

// Mock createObjectURL to avoid crashes in export tests
window.URL.createObjectURL = window.URL.createObjectURL || (() => 'blob:mock');
window.URL.revokeObjectURL = window.URL.revokeObjectURL || (() => {});

// Silence React Router act warnings from lazy/Suspense where necessary
jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
  const text = String(msg || '');
  if (text.includes('Warning: An update to') || text.includes('Not implemented:')) return;
  // Allow other errors
  // eslint-disable-next-line no-console
  console.warn(text, ...args);
});

// Reset all jest mocks between tests for isolation
afterEach(() => {
  jest.clearAllMocks();
});
