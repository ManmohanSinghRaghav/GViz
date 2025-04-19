import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="border rounded px-3 py-2 w-full"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mr-2"
          />
          Remember me
        </label>
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Forgot password?
        </Link>
      </div>
      
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
        Login
      </button>
    </form>
  );
};

export default LoginForm;