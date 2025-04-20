import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaEnvelope, FaLock, FaUser, FaKey, FaShieldAlt } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, signup, error: authError, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async (e) => {
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Get form data from signup form
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
    };
    
    // Ensure passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }
    
    try {
      // Format data for the API - match exactly what backend expects
      const signupData = {
        name: formData.email.split('@')[0], // Generate name from email if not provided
        email: formData.email,
        password: formData.password,
        // Optional avatar field that backend supports
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.email.split('@')[0])}`
      };
      
      console.log('Submitting registration with:', {...signupData, password: '******'});
      
      // Call signup function from auth context
      const success = await signup(signupData);
      
      if (success) {
        // Navigate to dashboard or home page after successful registration
        navigate('/');
      } else {
        throw new Error(authError || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
      console.error('Signup form error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-[radial-gradient(ellipse_at_top,#1a1a3c,#0f172a)] 
      before:absolute before:inset-0 
      before:bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_100%)] px-4">
      <div className="relative w-full max-w-md">
        {/* Logo and Title Section */}
        <div className="mb-12 text-center">
          <img 
            src="/logo.png" 
            alt="SynqTech Logo" 
            className="w-24 h-24 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          />
          <h1 className="text-4xl font-bold mb-2 text-white">
            SynqTech
          </h1>
          <div className="text-white/60 text-sm tracking-wider">
            Visualize • Analyze • Sync
          </div>
        </div>

        {/* Main Card Container - Adjusted padding */}
        <div className="relative z-40">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur opacity-30"></div>
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-xl p-6 relative border border-violet-500/20">
            {/* Toggle Buttons - Increased spacing */}
            <div className="flex justify-center mb-10">
              <div className="bg-slate-800/50 p-1 rounded-xl backdrop-blur-sm border border-violet-500/10">
                <button
                  className={`px-8 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                    isLogin 
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-[#444] shadow-lg' 
                      : 'text-violet-400 hover:bg-violet-500/10'
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  className={`px-8 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                    !isLogin 
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-[#444] shadow-lg' 
                      : 'text-violet-400 hover:bg-violet-500/10'
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Forms Container - Added proper spacing */}
            <div className="relative overflow-hidden">
              {/* Login Form */}
              <div className={`transform transition-all duration-500 space-y-6 ${
                isLogin ? 'translate-x-0 z-30' : '-translate-x-full'
              }`}>
                <form onSubmit={handleLogin}>
                  <div className="space-y-6">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded">
                        {error}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-white">
                        Email
                      </label>
                      <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="h-5 w-5 text-violet-500/60" />
                        </div>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-lg 
                            bg-slate-900/50 
                            border border-violet-500/20
                            text-white
                            placeholder-violet-400/50
                            focus:outline-none focus:ring-2 focus:ring-violet-500/40
                            transition-all duration-300"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white">
                        Password
                      </label>
                      <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-violet-500/60" />
                        </div>
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-lg 
                            bg-slate-900/50 
                            border border-violet-500/20
                            text-white
                            placeholder-violet-400/50
                            focus:outline-none focus:ring-2 focus:ring-violet-500/40
                            transition-all duration-300"
                          placeholder="Enter your password"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <FaKey className="h-4 w-4 text-violet-500/40 hover:text-violet-500/60 cursor-pointer transition-colors" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg font-medium
                          bg-gradient-to-r from-violet-600 to-purple-600 
                          hover:from-violet-500 hover:to-purple-500
                          text-[#444]
                          transform hover:scale-[1.02]
                          transition-all duration-300
                          focus:outline-none focus:ring-2 focus:ring-violet-500/40
                          shadow-lg hover:shadow-violet-500/25`}
                      >
                        {isLoading ? (
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          'Login'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Register Form */}
              <div className={`absolute top-0 left-0 w-full transform transition-all duration-500 space-y-6 ${
                !isLogin ? 'translate-x-0 z-30' : 'translate-x-full'
              }`}>
                <form onSubmit={handleSignup}>
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-violet-500/60" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      className="w-full pl-10 pr-4 py-3 rounded-lg 
                        bg-slate-900/50 
                        border border-violet-500/20
                        text-white
                        placeholder-violet-400/50
                        focus:outline-none focus:ring-2 focus:ring-violet-500/40
                        transition-all duration-300"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-violet-500/60" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      className="w-full pl-10 pr-4 py-3 rounded-lg 
                        bg-slate-900/50 
                        border border-violet-500/20
                        text-white
                        placeholder-violet-400/50
                        focus:outline-none focus:ring-2 focus:ring-violet-500/40
                        transition-all duration-300"
                      placeholder="Create password"
                      required
                    />
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaShieldAlt className="h-5 w-5 text-violet-500/60" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="w-full pl-10 pr-4 py-3 rounded-lg 
                        bg-slate-900/50 
                        border border-violet-500/20
                        text-white
                        placeholder-violet-400/50
                        focus:outline-none focus:ring-2 focus:ring-violet-500/40
                        transition-all duration-300"
                      placeholder="Confirm password"
                      required
                    />
                  </div>

                  <div className="flex gap-4 relative z-30">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-lg font-medium
                        bg-gradient-to-r from-violet-600 to-purple-600 
                        hover:from-violet-500 hover:to-purple-500
                        text-[#444]
                        transform hover:scale-[1.02]
                        transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-violet-500/40
                        shadow-lg hover:shadow-violet-500/25
                        relative z-30"
                    >
                      Create Account
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="flex-1 py-3 rounded-lg font-medium
                        border border-violet-500/20
                        hover:bg-violet-500/10
                        text-violet-400
                        transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-violet-500/40
                        relative z-30"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
