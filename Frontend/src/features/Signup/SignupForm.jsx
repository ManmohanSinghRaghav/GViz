import React, { useState } from 'react';

const SignupForm = ({ onSubmit, isLoading, validatePassword }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  });

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.name) validationErrors.name = 'Name is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    
    if (!formData.password) {
      validationErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.acceptTerms) {
      validationErrors.acceptTerms = 'You must accept the Terms and Conditions';
    }

    return validationErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    const score = validatePassword(password)
      ? 100
      : password.length >= 8
      ? 75
      : password.length >= 6
      ? 50
      : password.length > 0
      ? 25
      : 0;

    setPasswordStrength({
      score,
      feedback: getPasswordFeedback(score),
    });
  };

  const getPasswordFeedback = (score) => {
    if (score === 100) return 'Strong password';
    if (score >= 75) return 'Good password';
    if (score >= 50) return 'Moderate password';
    if (score >= 25) return 'Weak password';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="username"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={formData.password}
          onChange={handleChange}
        />
        {formData.password && (
          <div className="mt-1">
            <div className="h-2 rounded bg-gray-200">
              <div
                className={`h-full rounded transition-all duration-300 ${
                  passwordStrength.score >= 100
                    ? 'bg-green-500'
                    : passwordStrength.score >= 75
                    ? 'bg-yellow-500'
                    : passwordStrength.score >= 50
                    ? 'bg-orange-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${passwordStrength.score}%` }}
              />
            </div>
            <p className="mt-1 text-sm text-gray-600">{passwordStrength.feedback}</p>
          </div>
        )}
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="acceptTerms"
          name="acceptTerms"
          type="checkbox"
          checked={formData.acceptTerms}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
          I accept the{' '}
          <a href="/terms" className="text-indigo-600 hover:text-indigo-500">
            Terms and Conditions
          </a>
        </label>
        {errors.acceptTerms && <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.acceptTerms || passwordStrength.score < 75}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isLoading || !formData.acceptTerms || passwordStrength.score < 75
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
      >
        {isLoading ? 'Creating account...' : 'Sign up'}
      </button>
    </form>
  );
};

export default SignupForm;
