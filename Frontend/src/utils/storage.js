const TOKEN_KEY = 'qaapp_token';

export const authStorage = {
  setToken(token) {
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* ignore */ }
  },
  getToken() {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  clear() {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
  }
};
