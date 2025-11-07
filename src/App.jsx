// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // ✅ Add this
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Verify from './pages/Verify';
import Discover from './pages/Discover';
import Chat from './pages/ChatList.jsx';

function App() {
  return (
    <AuthProvider> {/* ✅ Wrap everything in AuthProvider */}
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Semi-Protected Routes */}
            <Route
              path="/verify"
              element={
                <ProtectedRoute>
                  <Verify />
                </ProtectedRoute>
              }
            />

            {/* Fully Protected Routes */}
            <Route
              path="/discover"
              element={
                <ProtectedRoute requireVerified={true}>
                  <Discover />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute requireVerified={true}>
                  <Chat />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;