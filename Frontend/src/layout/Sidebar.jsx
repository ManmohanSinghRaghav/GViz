import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Profile from '../components/Profile/Profile';
import { FaHome, FaChartLine, FaRoute, FaCog, FaBars } from 'react-icons/fa';

const Sidebar = ({ isOpen, onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaChartLine /> },
    { path: '/journey', label: 'My Journey', icon: <FaRoute /> },
    { path: '/settings', label: 'Settings', icon: <FaCog /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const authButton = isAuthenticated ? (
    <button
      onClick={handleLogout}
      className="flex items-center w-full px-4 py-2 text-sm rounded-lg text-gray-300 hover:bg-gray-700"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      {isOpen && <span className="ml-3">Sign Out</span>}
    </button>
  ) : (
    <Link
      to="/login"
      className="flex items-center px-4 py-2 text-sm rounded-lg text-gray-300 hover:bg-gray-700"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      {isOpen && <span className="ml-3">Login</span>}
    </Link>
  );

  return (
    <div className={`
      min-h-screen bg-gray-800 text-white
      transition-all duration-300 ease-in-out
      border-r border-gray-700 fixed
      ${isOpen ? 'w-64 md:w-64' : 'w-16 md:w-16'}
      z-[1000] overflow-hidden
      md:relative
    `}>
      <div className="h-screen bg-gray-800 text-white flex flex-col relative">
        <div className="p-4 overflow-hidden whitespace-nowrap flex items-center justify-between relative z-[1001]">
          {isOpen && <span className="font-semibold">GViz</span>}
          <button
            onClick={() => onToggleSidebar(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isOpen}
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1 px-2 py-4 relative z-[1001]" aria-label="Main navigation">
          <Link to="/" className="flex items-center px-4 py-2 text-sm rounded-lg text-gray-300 hover:bg-gray-700">
            <FaHome />
            {isOpen && <span className="ml-3">Home</span>}
          </Link>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-4 py-2 text-sm rounded-lg
                  ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'}
                `}
              >
                {item.icon}
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-4 border-t border-gray-700 relative z-[1001]">
          {authButton}
        </div>

        {isAuthenticated && (
          <div className="mt-auto border-t border-gray-700 relative z-[1001]">
            <Profile isExpanded={isOpen} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
