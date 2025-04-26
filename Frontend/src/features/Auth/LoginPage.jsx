import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaEnvelope, FaLock, FaGoogle, FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';

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

      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/');
      } else {
        setError(authError || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
    };

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const signupData = {
        name: formData.email.split('@')[0],
        email: formData.email,
        password: formData.password,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.email.split('@')[0])}`,
      };

      const success = await signup(signupData);

      if (success) {
        navigate('/');
      } else {
        throw new Error(authError || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20" />
        <div className="absolute top-0 left-0 w-96 h-96 -translate-x-1/2 -translate-y-1/2
          bg-gradient-to-br from-violet-600 to-purple-800 rounded-full opacity-30 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 translate-x-1/3 translate-y-1/2
          bg-gradient-to-br from-violet-600 to-purple-800 rounded-full opacity-30 blur-3xl animate-pulse-slow" />
      </div>

      {/* Login Container */}
      <div className="w-full max-w-md p-8 relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="SynqTech Logo" 
            className="w-20 h-20 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          />
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to SynqTech</h1>
          <p className="text-slate-300">Visualize • Analyze • Sync</p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-2xl">
          {/* Toggle Buttons */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800/50 p-1 rounded-xl backdrop-blur-sm border border-violet-500/10">
              <button
                className={`px-8 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  isLogin ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white' : 'text-violet-400'
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`px-8 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  !isLogin ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white' : 'text-violet-400'
                }`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded text-sm">
                {error}
              </div>
            )}

            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Login Form Fields */}
                <div className="space-y-4">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg
                      text-white placeholder-slate-400 focus:outline-none focus:ring-2 
                      focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                    placeholder="Email address"
                  />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg
                      text-white placeholder-slate-400 focus:outline-none focus:ring-2 
                      focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                    placeholder="Password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600
                    text-white rounded-lg font-medium hover:from-violet-500 hover:to-purple-500
                    focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                    focus:ring-offset-slate-900 transition-all duration-300"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-6">
                {/* Sign Up Form Fields */}
                <div className="space-y-4">
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg
                      text-white placeholder-slate-400 focus:outline-none focus:ring-2 
                      focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                    placeholder="Email address"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg
                      text-white placeholder-slate-400 focus:outline-none focus:ring-2 
                      focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                    placeholder="Password"
                    required
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg
                      text-white placeholder-slate-400 focus:outline-none focus:ring-2 
                      focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                    placeholder="Confirm password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600
                    text-white rounded-lg font-medium hover:from-violet-500 hover:to-purple-500
                    focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                    focus:ring-offset-slate-900 transition-all duration-300"
                >
                  Create account
                </button>
              </form>
            )}

            {/* Social Login */}
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { Icon: FaGoogle, color: 'hover:bg-red-500/20' },
                { Icon: FaGithub, color: 'hover:bg-slate-500/20' },
                { Icon: FaTwitter, color: 'hover:bg-blue-500/20' },
                { Icon: FaDiscord, color: 'hover:bg-indigo-500/20' }
              ].map(({ Icon, color }, index) => (
                <button
                  key={index}
                  type="button"
                  className={`flex justify-center items-center p-2 bg-white/10 
                    rounded-lg transition-all duration-300 ${color}`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
