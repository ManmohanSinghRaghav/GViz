import { useLocation, Navigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';  // Updated path
import { SettingsProvider } from './contexts/SettingsContext';
import Sidebar from './layout/Sidebar';
import MainNav from './layout/MainNav'; // Import MainNav
import Home from './pages/Home';
import MyJourney from './components/MyJourney/MyJourney';
import Dashboard from './features/Dashboard/Dashboard';
import Settings from './features/Settings/Settings';
import ChatAI from './components/ChatAI/ChatAI';
import NotificationsPage from './features/Notifications/NotificationsPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; // Import ProtectedRoute
import CourseView from './features/CourseView/CourseView'; // Import CourseView
import MaterialView from './features/MaterialView/MaterialView'; // Import MaterialView
import TutorialView from './features/TutorialView/TutorialView'; // Import TutorialView
import ProfilePage from './features/Profile/ProfilePage'; // Import ProfilePage
import LoginPage from './features/Auth/LoginPage'; // Import LoginPage
import CompleteProfile from './features/Profile/CompleteProfile'; // Import CompleteProfile
import ATSAI from './pages/ATS/ATSAI'; // Import ATSAI

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // Changed to false
  const location = useLocation();
  const showChat = !location.pathname.includes('/login');

  return (
    <SettingsProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen bg-gradient-to-br 
                  from-slate-950 via-purple-950/30 to-slate-950
                  before:absolute before:inset-0 
                  before:bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_100%)]
                  before:animate-pulse"
                >
                  <Sidebar 
                    isOpen={isSidebarOpen} 
                    onToggleSidebar={setIsSidebarOpen} 
                  />
                  <main className={`
                    flex-1 relative 
                    transition-all duration-300 
                    ${isSidebarOpen ? 'ml-64' : 'ml-16'}
                    pt-16
                    bg-gradient-to-b from-slate-900/50 via-purple-900/30 to-slate-900/50
                  `}>
                    <MainNav />
                    <div className="container mx-auto px-4 py-6 max-w-7xl mt-16 bg-gradient-to-b from-slate-900/90 via-purple-900/80 to-slate-900/90 backdrop-blur-lg rounded-lg border border-violet-500/20">
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
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
