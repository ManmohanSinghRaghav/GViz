import { createContext, useContext, useState, useEffect } from 'react';
import storage from '../utils/storage';
import { authService } from '../services/api';

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
          const userData = await authService.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Token validation failed:', err);
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
      // For development convenience, keep the mock login option
      if (email === 'admin@example.com' && password === 'admin123') {
        const user = {
          id: 1,
          name: 'Admin User',
          email: email,
          role: 'admin',
          avatar: `https://ui-avatars.com/api/?name=Admin+User`,
          defaultPage: '/',
          token: 'mock-jwt-token'
        };
        
        storage.set('token', user.token);
        storage.set('user', user);
        setIsAuthenticated(true);
        setUser(user);
        setIsLoading(false);
        return true;
      }
      
      // For testing convenience, add a hardcoded test user
      if (email === 'test@example.com' && password === 'password123') {
        const user = {
          id: 2,
          name: 'Test User',
          email: email,
          role: 'user',
          avatar: `https://ui-avatars.com/api/?name=Test+User`,
          token: 'test-jwt-token'
        };
        
        storage.set('token', user.token);
        storage.set('user', user);
        setIsAuthenticated(true);
        setUser(user);
        setIsLoading(false);
        return true;
      }
      
      // Actual API login
      const response = await authService.login(email, password);
      
      // Store data from response
      storage.set('token', response.access_token);
      storage.set('user', response.user);
      setIsAuthenticated(true);
      setUser(response.user);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.msg || 'Invalid credentials');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Try to call logout API if authenticated
      if (isAuthenticated) {
        try {
          await authService.logout();
        } catch (err) {
          console.warn('Logout API call failed, clearing locally anyway');
        }
      }
      
      // Always clean up local storage
      storage.remove('token');
      storage.remove('user');
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      setError(err.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!userData.email || !userData.name || !userData.password) {
        throw { msg: 'Please provide all required information' };
      }
      
      // Call the API for registration
      const response = await authService.signup(userData);
      
      // If signup returns a token, store it and log user in
      if (response.access_token) {
        storage.set('token', response.access_token);
        storage.set('user', response.user);
        setIsAuthenticated(true);
        setUser(response.user);
      }
      
      return true;
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.msg || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
