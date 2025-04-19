import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './layout/Navbar';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import Home from './pages/Home';
import Dashboard from './components/Dashboard/Dashboard';
import Visualizer from './components/Visualizer/Visualizer';
import Settings from './components/Settings/Settings';
import LoginPage from './features/Login/LoginPage';
import SignupPage from './features/Signup/SignupPage';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SettingsProvider>
      <Router>
        <div className="flex h-screen">
          <Sidebar isOpen={sidebarOpen} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/visualizer" element={<Visualizer />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/signup" element={<SignupPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
