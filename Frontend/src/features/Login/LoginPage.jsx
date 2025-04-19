import React, { useState } from 'react';
import LoginForm from './LoginForm';
import { useNavigate, Link } from 'react-router-dom';
import SocialLogin from '../../components/SocialLogin/SocialLogin';
import api from '../../services/api';
import storage from '../../utils/storage';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (credentials) => {
    try {
      setLoginError('');
      const response = await api.post('/api/login', credentials);
      
      // Store token and user details
      const { access_token, user } = response.data;
      storage.set('token', access_token);
      storage.set('user', user);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(
        error.response?.data?.msg || 
        'Login failed. Please check your credentials and try again.'
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await api.post('/api/auth/google');
      
      // Store token and user details
      const { access_token, user } = response.data;
      storage.set('token', access_token);
      storage.set('user', user);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login failed:', error);
      setLoginError(
        error.response?.data?.msg || 
        'Google login failed. Please try again.'
      );
    }
  };

  const handleGithubLogin = async () => {
    try {
      const response = await api.post('/api/auth/github');
      
      // Store token and user details
      const { access_token, user } = response.data;
      storage.set('token', access_token);
      storage.set('user', user);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('GitHub login failed:', error);
      setLoginError(
        error.response?.data?.msg || 
        'GitHub login failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loginError && (
            <div className="mb-4 text-red-500 text-sm">
              {loginError}
            </div>
          )}
          <LoginForm onSubmit={handleLogin} />
          <SocialLogin 
            onGoogleLogin={handleGoogleLogin}
            onGithubLogin={handleGithubLogin}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
