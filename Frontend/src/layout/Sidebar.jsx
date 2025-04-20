import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Profile from '../components/Profile/Profile';
import { FaHome, FaChartLine, FaRoute, FaCog, FaBars, FaRobot } from 'react-icons/fa';

const Sidebar = ({ isOpen, onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaChartLine /> },
    { path: '/journey', label: 'My Journey', icon: <FaRoute /> },
    { path: '/ats-ai', label: 'ATS AI', icon: <FaRobot /> },
    { path: '/settings', label: 'Settings', icon: <FaCog /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const authButton = isAuthenticated ? (
    <button
      onClick={handleLogout}
      className="flex items-center w-full px-4 py-3 text-sm rounded-lg text-slate-200 hover:bg-violet-600/20 transition-colors duration-200"
    >
      <svg
        className="w-5 h-5 text-violet-400"
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
      className="flex items-center px-4 py-3 text-sm rounded-lg text-slate-200 hover:bg-violet-600/20 transition-colors duration-200"
    >
      <svg
        className="w-5 h-5 text-violet-400"
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
      fixed top-0 left-0 h-screen
      transition-all duration-300 ease-in-out
      border-r border-violet-500/20
      ${isOpen ? 'w-64 md:w-64' : 'w-16 md:w-16'}
      z-[1040]
      bg-slate-900/90 backdrop-filter backdrop-blur-xl
      shadow-xl shadow-violet-900/10
    `}>
      <div className="h-full flex flex-col">
        <div className="p-4 overflow-hidden whitespace-nowrap flex items-center justify-between border-b border-violet-500/30">
          {isOpen && (
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">SynqTech</span>
          )}
          <button
            onClick={() => onToggleSidebar(!isOpen)}
            className="p-2 rounded-lg hover:bg-violet-600/20 focus:outline-none focus:ring-2 focus:ring-violet-500 z-[1050] transition-colors"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isOpen}
          >
            <FaBars className="w-5 h-5 text-violet-300" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <nav className="flex-1 space-y-1 px-2 py-4" aria-label="Main navigation">
            <Link to="/" className="flex items-center px-4 py-3 text-sm rounded-lg text-slate-200 hover:bg-gradient-to-r hover:from-violet-600/20 hover:to-purple-600/20 transition-colors duration-200">
              <FaHome className="text-violet-400" />
              {isOpen && <span className="ml-3">Home</span>}
            </Link>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-violet-600/30 to-purple-600/30 text-white shadow-sm' 
                      : 'text-slate-200 hover:bg-gradient-to-r hover:from-violet-600/20 hover:to-purple-600/20'}
                  `}
                >
                  <span className={isActive ? 'text-violet-300' : 'text-violet-400'}>
                    {item.icon}
                  </span>
                  {isOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-2 py-4 border-t border-violet-500/20">
          {authButton}
        </div>

        {isAuthenticated && (
          <div className="mt-auto border-t border-violet-500/20">
            <Profile isExpanded={isOpen} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
