import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Profile from '../components/Profile/Profile';

const Sidebar = ({ isOpen, onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/visualizer', label: 'Visualizer', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { path: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
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
      min-h-full bg-gray-800 text-white
      transition-all duration-300 ease-in-out
      border-r border-gray-700 fixed z-30
      ${isOpen ? 'w-64' : 'w-16'}
    `}>
      <div className="h-screen bg-gray-800 text-white flex flex-col">
        <div className="p-4 overflow-hidden whitespace-nowrap flex items-center justify-center">
          <button
            onClick={() => onToggleSidebar(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 focus:outline-none transition-colors relative z-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d={isOpen ? "M15 19l-7-7 7-7" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 space-y-1 px-2 py-4">
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d={item.icon} />
                </svg>
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-4 border-t border-gray-700">
          {authButton}
        </div>

        {isAuthenticated && (
          <div className="mt-auto border-t border-gray-700">
            <Profile isExpanded={isOpen} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
