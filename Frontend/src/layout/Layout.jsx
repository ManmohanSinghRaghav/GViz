import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MainNav from '../components/MainNav/MainNav';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onToggleSidebar={setSidebarOpen} />
      <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'pl-64' : 'pl-16'}`}>
        <MainNav />
        <main className="min-h-screen p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
