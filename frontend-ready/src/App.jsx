import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import MyMessagesPage from './pages/MyMessagesPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner-large"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to home if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner-large"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes (redirect to home if authenticated) */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />
      
      {/* Protected routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-messages" 
        element={
          <ProtectedRoute>
            <MyMessagesPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all route for 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
