import React from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaUserCircle, FaSearch } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const MainNav = () => {
  const { user } = useAuth();

  return (
    <header className="fixed w-full top-0 left-0 bg-slate-900/80 backdrop-blur-xl z-[1030] border-b border-violet-500/20 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex justify-start">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">
                SynqTech
              </Link>
            </div>
          </div>

          <div className="hidden md:block flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-violet-400 text-opacity-50" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 rounded-lg bg-slate-800/60 border border-violet-500/20 text-slate-200 
                  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm transition-all duration-200"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="flex-1 flex justify-end items-center space-x-4">
            <Link 
              to="/notifications" 
              className="relative p-2 rounded-full text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-colors duration-200"
            >
              <FaBell />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </Link>
            {user && (
              <Link 
                to="/settings" 
                className="flex items-center px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-violet-500/10 transition-colors duration-200"
              >
                <FaUserCircle className="text-violet-400 mr-2" size={20} />
                <span>{user.displayName || user.email}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNav;
