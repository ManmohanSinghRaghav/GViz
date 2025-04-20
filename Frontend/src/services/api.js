import axios from 'axios';
import storage from '../utils/storage';
import { 
  GEMINI_API_KEY, 
  GEMINI_API_URL
} from '../config/api.config';

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
      // Using the correct endpoint that matches backend route in user_bp
      const response = await api.post('/user/register', userData);
      console.log('Signup API response:', response.data);
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

// Chat service for Gemini
export const chatService = {
  // Send message to Gemini
  sendMessage: async (message) => {
    try {
      console.log('Sending message to Gemini:', message);
      const response = await sendToGemini(message);
      return response;
    } catch (error) {
      console.error('Error in chat service:', error);
      throw error;
    }
  }
};

// Send message to Gemini
const sendToGemini = async (message) => {
  try {
    console.log('Sending to Gemini API:', message);
    console.log('Gemini API URL:', `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`);
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: message
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          topP: 0.8,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Gemini raw response:', response.data);
    
    // Process Gemini response
    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const candidate = response.data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        return {
          success: true,
          response: candidate.content.parts[0].text
        };
      }
    }

    return {
      success: false,
      response: 'No valid response from Gemini'
    };
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    if (error.response) {
      console.error('Gemini error response:', error.response.data);
    }
    return {
      success: false,
      response: `Gemini API Error: ${error.message}`
    };
  }
};

export default api;
