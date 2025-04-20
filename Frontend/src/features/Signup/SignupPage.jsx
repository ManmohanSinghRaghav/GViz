import React, { useState } from 'react';
import SignupForm from './SignupForm';
import { useNavigate, Link } from 'react-router-dom';
import SocialLogin from '../../components/SocialLogin/SocialLogin';
import { useAuth } from '../../contexts/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error: authError } = useAuth();
  const [error, setError] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSignup = async (userData) => {
    try {
      setError(null);
      
      // Validate terms acceptance
      if (!userData.acceptTerms) {
        throw new Error('Please accept the terms and conditions');
      }

      // Password strength validation
      if (!isPasswordStrong(userData.password)) {
        throw new Error('Password does not meet strength requirements');
      }

      // Format the data according to the backend's expected format
      // Match exactly what the backend /user/register endpoint expects
      const signupData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        // Optional fields that backend supports
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}`
      };

      console.log('Sending signup data to /user/register:', {...signupData, password: '******'});
      
      // Call the signup function from AuthContext
      const success = await signup(signupData);
      
      if (success) {
        setVerificationSent(true);
        // Or navigate directly to dashboard if auto-login is enabled
        // navigate('/dashboard');
      } else {
        throw new Error(authError || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError(error.message);
      console.error('Signup failed:', error);
    }
  };

  const isPasswordStrong = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && 
           hasUpperCase && hasLowerCase && 
           hasNumbers && hasSpecialChar;
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

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h2 className="text-2xl font-bold text-center mb-4">Check your email</h2>
            <p className="text-gray-600 text-center">
              We've sent a verification link to your email address.
              Please check your inbox and click the link to complete your registration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-600 text-sm rounded">
            {error}
          </div>
        )}
        {authError && !error && (
          <div className="mt-2 p-2 bg-red-100 text-red-600 text-sm rounded">
            {authError}
          </div>
        )}
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignupForm 
            onSubmit={handleSignup} 
            isLoading={isLoading}
            validatePassword={isPasswordStrong}
          />
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <SocialLogin 
              onGoogleLogin={handleGoogleSignup}
              onGithubLogin={handleGithubSignup}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
