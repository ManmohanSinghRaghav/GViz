import React from 'react';

function Header({ onToggleSidebar }) {
  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </button>
        <h1 className="ml-3 text-xl font-bold">AI Job Mentor</h1>
      </div>
    </header>
  );
}

export default Header;
