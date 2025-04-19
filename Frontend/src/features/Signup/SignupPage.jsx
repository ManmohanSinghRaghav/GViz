import React from 'react';
import SignupForm from './SignupForm';
import { useNavigate, Link } from 'react-router-dom';
import SocialLogin from '../../components/SocialLogin/SocialLogin';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = async (userData) => {
    try {
      // TODO: Implement actual signup logic
      console.log('Signup attempt:', userData);
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      // TODO: Implement Google signup
      console.log('Google signup attempt');
    } catch (error) {
      console.error('Google signup failed:', error);
    }
  };

  const handleGithubSignup = async () => {
    try {
      // TODO: Implement GitHub signup
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
          <SignupForm onSubmit={handleSignup} />
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
