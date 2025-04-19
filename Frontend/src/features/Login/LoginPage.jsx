import React from 'react';
import LoginForm from './LoginForm';
import { useNavigate, Link } from 'react-router-dom';
import SocialLogin from '../../components/SocialLogin/SocialLogin';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      // TODO: Implement actual login logic
      console.log('Login attempt:', credentials);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // TODO: Implement Google login
      console.log('Google login attempt');
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleGithubLogin = async () => {
    try {
      // TODO: Implement GitHub login
      console.log('GitHub login attempt');
    } catch (error) {
      console.error('GitHub login failed:', error);
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
