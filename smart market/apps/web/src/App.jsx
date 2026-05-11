import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import VegetableDetailPage from './pages/VegetableDetailPage.jsx';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/vegetable/:vegetableName"
              element={
                <ProtectedRoute requiredRole="user">
                  <VegetableDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4 text-foreground">404 - Page not found</h1>
                    <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist</p>
                    <a href="/" className="text-primary hover:underline">
                      Back to home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;