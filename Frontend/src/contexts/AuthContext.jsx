import { createContext, useContext, useState, useEffect } from 'react';
import { mockAdmin, mockUsers } from '../Mock_data/authMock';
import storage from '../utils/storage';
import authService from '../services/authService';

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
      // Mock login validation
      if (email === 'admin@example.com' && password === 'admin123') {
        const user = {
          id: 1,
          name: 'Admin User',
          email: email,
          role: 'admin',
          avatar: `https://ui-avatars.com/api/?name=Admin+User`,
          defaultPage: '/',
          token: 'mock-jwt-token' // Add mock token
        };
        
        storage.set('token', user.token);
        storage.set('user', user);
        setIsAuthenticated(true);
        setUser(user);
        setIsLoading(false);
        return true;
      }
      throw new Error('Invalid credentials');
    } catch (err) {
      setError(err.message || 'Login failed');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
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
      const newUser = {
        ...userData,
        id: Date.now(),
        role: 'user',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}`,
        token: 'mock-jwt-token'
      };
      
      storage.set('token', newUser.token);
      storage.set('user', newUser);
      setIsAuthenticated(true);
      setUser(newUser);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed');
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
