import axios from 'axios';

// Create Axios Instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to automatically add JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to capture token expiration or auth failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized access (401), clean token and redirect to login if appropriate
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if we are on a protected dashboard or editor route
      const path = window.location.pathname;
      if (path.startsWith('/dashboard') || path.startsWith('/builder') || path.startsWith('/admin')) {
        window.location.href = `/login?expired=true`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
