import axios from 'axios';
import { getCSRFToken } from './csrf';
import { authStorage } from '../utils/storage';

const API_URL = process.env.REACT_APP_API_BASE_URL;

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // for HttpOnly cookie-based sessions
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for CSRF and Bearer if applicable
api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const csrf = getCSRFToken();
  if (csrf) {
    config.headers['X-CSRF-Token'] = csrf;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Avoid leaking sensitive info
    const safeError = new Error(error?.response?.data?.message || 'Request failed');
    safeError.status = error?.response?.status;
    return Promise.reject(safeError);
  }
);
