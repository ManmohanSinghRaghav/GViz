import { createContext, useContext, useState, useEffect } from 'react';
import { mockAdmin } from '../Mock_data/authMock';
import storage from '../utils/storage';

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

  const logout = () => {
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
      setError(err.message);
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
        token: 'mock-jwt-token',
        bio: userData.bio || '',
        location: userData.location || '',
        company: userData.company || '',
        website: userData.website || '',
        skills: userData.skills || [],
        education: userData.education || [],
        experience: userData.experience || []
      };
      
      storage.set('token', newUser.token);
      storage.set('user', newUser);
      setIsAuthenticated(true);
      setUser(newUser);
      return true;
    } catch (err) {
      setError(err.message);
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
