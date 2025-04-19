import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaLock, FaInfoCircle } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error: authError, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Please enter both email and password');
      }
      
      console.log('Attempting login with:', { email: formData.email, password: '****' });
      
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/');
      } else {
        // Display the error from auth context or a default message
        setError(authError || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      console.error('Login form error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen tech-bg flex items-center justify-center p-6">
      <div className="tech-card max-w-md w-full space-y-8 p-8 rounded-lg pixel-border">
        <div className="text-center">
          <h2 className="text-3xl font-bold tech-text bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Sign in to GViz
          </h2>
          <button 
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            className="text-xs text-gray-400 mt-1 flex items-center justify-center mx-auto"
          >
            <FaInfoCircle className="mr-1" /> {showDebugInfo ? 'Hide' : 'Show'} Test Accounts
          </button>
        </div>

        {showDebugInfo && (
          <div className="bg-gray-800 p-3 rounded text-xs text-gray-300">
            <p className="font-bold mb-1">Test Accounts:</p>
            <p>Email: <span className="text-green-400">admin@example.com</span> / Password: <span className="text-green-400">admin123</span></p>
            <p>Email: <span className="text-green-400">test@example.com</span> / Password: <span className="text-green-400">password123</span></p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded">
            {error}
          </div>
        )}
        
        {!error && authError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded">
            {authError}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FaUser className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="tech-input block w-full pl-10 pr-3 py-2 rounded-lg"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FaLock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="tech-input block w-full pl-10 pr-3 py-2 rounded-lg"
                placeholder="admin123"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="cyber-button w-full flex justify-center py-2 px-4 rounded-lg"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
