import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Layout from './layout/Layout';

const AppContent = () => {
  const location = useLocation();
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.includes(location.pathname);

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/visualizer" element={
        <ProtectedRoute>
          <Layout>
            <Visualizer />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <Settings />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <AppContent />
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
