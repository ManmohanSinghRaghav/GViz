import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import storage from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return storage.get('token') !== null;
  });
  
  const [user, setUser] = useState(() => {
    return storage.get('user');
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if token is still valid on app startup
  useEffect(() => {
    const validateToken = async () => {
      const token = storage.get('token');
      if (token) {
        try {
          // Get user profile to verify token is still valid
          const res = await authService.getProfile();
          setUser(res.data.user);
          setIsAuthenticated(true);
        } catch (err) {
          // Token is invalid, clear storage
          storage.remove('token');
          storage.remove('user');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    };

    validateToken();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({ email, password });
      const { access_token, user } = response.data;
      
      // Store token and user data
      storage.set('token', access_token);
      storage.set('user', user);
      
      setIsAuthenticated(true);
      setUser(user);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Call logout API if authenticated
      if (isAuthenticated) {
        await authService.logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear storage and state regardless of API response
      storage.remove('token');
      storage.remove('user');
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register({ 
        email, 
        password, 
        name 
      });
      
      setIsLoading(false);
      
      // Auto-login after successful registration
      return await login(email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      setIsLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      signup, 
      isLoading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
