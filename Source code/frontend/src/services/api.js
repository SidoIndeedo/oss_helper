import axios from 'axios';

const api = axios.create({
  baseURL: '/',  // Vite will proxy this
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('🌐 Axios Request:', request.method.toUpperCase(), request.url, request.data);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('✅ Axios Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('❌ Axios Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const rankIssues = (payload) => {
  console.log('📡 rankIssues called with payload:', payload);
  return api.post('/api/rank', payload);
};
export const healthCheck = () => api.get('/health');

export default api;