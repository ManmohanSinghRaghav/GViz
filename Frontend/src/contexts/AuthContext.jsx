import { createContext, useContext, useState, useEffect } from 'react';
import { mockAdmin } from '../Mock_data/authMock';
import storage from '../utils/storage';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => storage.get('token') !== null);
  const [user, setUser] = useState(() => storage.get('user'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (email === mockAdmin.email && password === mockAdmin.password) {
        const user = {
          ...mockAdmin,
          token: 'mock-jwt-token'
        };
        
        storage.set('token', user.token);
        storage.set('user', user);
        setIsAuthenticated(true);
        setUser(user);
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
      setError(err.message);
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
      storage.remove('token');
      storage.remove('user');
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the actual API service
      const response = await authService.signup(userData);
      
      // The backend registration response format doesn't include a token
      // We need to do a login after successful registration to get a token
      if (response && response.user) {
        // If registration is successful, perform login
        const loginResponse = await authService.login(userData.email, userData.password);
        
        // Now extract token from login response
        const token = loginResponse.token || loginResponse.access_token;
        
        if (!token) {
          throw new Error('No authentication token received from server');
        }
        
        // Store token and user data
        storage.set('token', token);
        storage.set('user', loginResponse.user || response.user);
        
        setIsAuthenticated(true);
        setUser(loginResponse.user || response.user);
        return true;
      } else {
        throw new Error(response.msg || 'Failed to create account');
      }
    } catch (err) {
      console.error('Signup error:', err);
      // Extract error message from API response or use generic message
      const errorMsg = err.msg || err.message || 'Failed to create account. Please try again.';
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedUser = {
        ...user,
        ...profileData,
        avatar: profileData.avatar || user.avatar
      };
      
      storage.set('user', updatedUser);
      setUser(updatedUser);
      return true;
    } catch (err) {
      setError(err.message);
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
      updateProfile, 
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
