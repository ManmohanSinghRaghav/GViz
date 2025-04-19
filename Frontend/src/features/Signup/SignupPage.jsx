import React, { useState } from 'react';
import SignupForm from './SignupForm';
import { useNavigate, Link } from 'react-router-dom';
import SocialLogin from '../../components/SocialLogin/SocialLogin';
import { authService } from '../../services/api';

const SignupPage = () => {
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (userData) => {
    try {
      setIsLoading(true);
      setSignupError('');
      
      // Add a small delay to ensure proper UI update
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const response = await authService.register({
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
      
      console.log('Registration successful:', response.data);
      
      // Redirect to login page after successful registration
      navigate('/login', { 
        state: { message: 'Registration successful! Please log in with your credentials.' } 
      });
    } catch (error) {
      console.error('Signup failed:', error);
      
      let errorMessage = 'Registration failed. Please try again later.';
      
      if (error.response) {
        // Handle specific status codes
        if (error.response.status === 503) {
          errorMessage = 'The database service is currently unavailable. Please try again later.';
        } else if (error.response.data && error.response.data.msg) {
          errorMessage = error.response.data.msg;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }
      
      setSignupError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      console.log('Google signup attempt');
    } catch (error) {
      console.error('Google signup failed:', error);
    }
  };

  const handleGithubSignup = async () => {
    try {
      console.log('GitHub signup attempt');
    } catch (error) {
      console.error('GitHub signup failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignupForm onSubmit={handleSignup} error={signupError} isLoading={isLoading} />
          <SocialLogin 
            onGoogleLogin={handleGoogleSignup}
            onGithubLogin={handleGithubSignup}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
