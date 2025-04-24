import { useLocation, Navigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Sidebar from './layout/Sidebar';
import MainNav from './layout/MainNav';
import Home from './pages/Home';
import MyJourney from './components/MyJourney/MyJourney';
import Dashboard from './features/Dashboard/Dashboard';
import Settings from './features/Settings/Settings';
import ChatAI from './components/ChatAI/ChatAI';
import NotificationsPage from './features/Notifications/NotificationsPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import CourseView from './features/CourseView/CourseView';
import MaterialView from './features/MaterialView/MaterialView';
import TutorialView from './features/TutorialView/TutorialView';
import ProfilePage from './features/Profile/ProfilePage';
import LoginPage from './features/Auth/LoginPage';
import CompleteProfile from './features/Profile/CompleteProfile';
import ATSAI from './pages/ATS/ATSAI'; 
import NotificationPopup from './components/Notification/NotificationPopup';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const showChat = !location.pathname.includes('/login');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate app loading
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-300">
            SynqTech
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <SettingsProvider>
        <AuthProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-slate-950 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full 
                  bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.1),transparent_50%)]">
                </div>
                <div className="absolute bottom-0 right-0 w-full h-full 
                  bg-[radial-gradient(ellipse_at_bottom_left,rgba(124,58,237,0.05),transparent_50%)]">
                </div>
              </div>

              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <div className="flex min-h-screen animate-fadeIn">
                        <Sidebar 
                          isOpen={isSidebarOpen} 
                          onToggleSidebar={setIsSidebarOpen} 
                        />
                        <main className={`
                          flex-1 relative 
                          transition-all duration-300 
                          ${isSidebarOpen ? 'ml-64' : 'ml-16'}
                          pt-16
                        `}>
                          <MainNav />
                          <div className="container mx-auto px-4 py-6 max-w-7xl mt-10 animate-slideInUp">
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route path="/journey" element={<MyJourney />} />
                              <Route path="/settings" element={<Settings />} />
                              <Route path="/notifications" element={<NotificationsPage />} />
                              <Route 
                                path="/complete-profile" 
                                element={
                                  <ProtectedRoute>
                                    <CompleteProfile />
                                  </ProtectedRoute>
                                } 
                              />
                              <Route path="/ats-ai" element={<ATSAI />} />
                              <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                          </div>
                        </main>
                      </div>
                    </ProtectedRoute>
                  }
                />
              </Routes>
              {showChat && <ChatAI />}
              <NotificationPopup />
            </div>
          </NotificationProvider>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
