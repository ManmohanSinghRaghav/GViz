import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Profile from '../components/Profile/Profile';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/visualizer', label: 'Visualizer', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { path: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <div className={`
      fixed md:static 
      transition-all duration-300 ease-in-out
      h-screen bg-gray-800 text-white flex flex-col
      ${isOpen ? 'w-64 translate-x-0' : 'w-0 md:w-16 -translate-x-full md:translate-x-0'}
    `}>
      <div className="p-4 overflow-hidden whitespace-nowrap">
        <img 
          src="/logo.svg" 
          alt="Logo" 
          className={`h-8 ${isOpen ? 'w-auto' : 'mx-auto'}`}
        />
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

      <div className="mt-auto border-t border-gray-700">
        <Profile isExpanded={isOpen} />
      </div>
    </div>
  );
};

export default Sidebar;
