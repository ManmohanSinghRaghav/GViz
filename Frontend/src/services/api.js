import axios from 'axios';
import storage from '../utils/storage';

// Create axios instance with custom config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
  withCredentials: false,
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = storage.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('API request error:', error);
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API response error:', error);
    
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Handle authentication errors
        storage.remove('token');
        storage.remove('user');
        window.location.href = '/login';
      } else if (error.response.status === 503) {
        // Service unavailable - could add global notification here
        console.error('Service temporarily unavailable');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Check API health before making critical requests
const checkApiHealth = async () => {
  try {
    const response = await api.get('/api/health');
    console.log('API health status:', response.data);
    return {
      isHealthy: response.data.status === 'healthy',
      dbStatus: response.data.database,
      mode: response.data.mode
    };
  } catch (error) {
    console.error('API health check failed:', error);
    return { isHealthy: false, dbStatus: 'unknown', mode: 'unknown' };
  }
};

export default api;

// Auth service methods
export const authService = {
  login: (credentials) => api.post('/api/login', credentials),
  register: async (userData) => {
    try {
      // Check API health before registration
      const health = await checkApiHealth();
      
      // If database is not connected, inform the user
      if (health.dbStatus !== 'connected') {
        console.warn(`Using API in ${health.mode} mode with database status: ${health.dbStatus}`);
      }
      
      // Proceed with registration even if in degraded mode
      return api.post('/api/user/register', userData);
    } catch (error) {
      console.error('Registration health check failed:', error);
      // Continue with registration attempt anyway
      return api.post('/api/user/register', userData);
    }
  },
  getProfile: () => api.get('/api/user/profile'),
  updateProfile: (data) => api.put('/api/user/profile', data),
};

// Recommendation service methods
export const recommendationService = {
  getJobRecommendations: () => api.get('/api/recommendation/job'),
  getSkillRecommendations: () => api.get('/api/recommendation/skill'),
};
