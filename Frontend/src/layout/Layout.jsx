import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MainNav from './MainNav';
import '../styles/techTheme.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="tech-bg min-h-screen text-gray-100">
      <Sidebar isOpen={sidebarOpen} onToggleSidebar={setSidebarOpen} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-16'}`}>
        <MainNav />
        <main className="min-h-screen p-6">
          <div className="tech-card rounded-lg p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
