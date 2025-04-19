import axios from 'axios';
import storage from '../utils/storage';

// Base API URL - use relative URL to work with Vite's proxy
const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Don't use withCredentials when using Bearer token auth
  withCredentials: false,
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = storage.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Debug request config
    console.log(`🚀 Request: ${config.method.toUpperCase()} ${config.url}`, { 
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    // Debug successful response
    console.log(`✅ Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    // Log the error details for debugging
    console.error('❌ API Error:', error);
    
    if (error.response) {
      console.log('Response data:', error.response.data);
      console.log('Response status:', error.response.status);
    } else if (error.request) {
      console.log('No response received', error.request);
    } else {
      console.log('Error setting up request:', error.message);
    }
    
    // Handle 401 Unauthorized errors (token expired/invalid)
    if (error.response && error.response.status === 401) {
      storage.remove('token');
      storage.remove('user');
    }
    
    return Promise.reject(error.response?.data || { 
      msg: error.message || 'Server error occurred' 
    });
  }
);

// Auth service functions
export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post('/user/register', userData);
      return response.data;
    } catch (error) {
      console.error('Signup API error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Profile API error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout API error:', error);
      throw error;
    }
  }
};

// Chat service functions
export const chatService = {
  sendMessage: async (message, image = null) => {
    try {
      const data = { message };
      
      // If image is provided, include it as base64
      if (image) {
        data.image = image;
      }
      
      console.log('Sending chat request with data:', { 
        message, 
        hasImage: !!image 
      });
      
      const response = await api.post('/api/chat', data);
      console.log('Chat API response:', response);
      return response.data;
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  }
};

export default api;
