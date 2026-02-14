import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('yoga-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthRequest = url.includes('/api/login') || url.includes('/api/signup');
    if (!isAuthRequest && (error.response?.status === 401 || error.response?.status === 403)) {
      localStorage.removeItem('yoga-token');
      localStorage.removeItem('yoga-user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
