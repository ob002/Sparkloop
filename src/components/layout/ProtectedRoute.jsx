<<<<<<< HEAD
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

const ProtectedRoute = ({ children, requireVerification = false }) => {
  const { user, profile } = useAuth();

  // Not logged in → go to onboarding
  if (!user) {
    return <Navigate to="/onboarding" replace />;
  }

  // ✅ NEW LOGIC:
  // Require verification → block ONLY if:
  //   - user is NOT verified
  //   - AND user did NOT skip verification
  if (
    requireVerification &&
    !profile?.verified &&
    !profile?.verificationSkipped
  ) {
    return <Navigate to="/verify" replace />;
  }

  // All good → allow component to render
  return children;
};

export default ProtectedRoute;

<<<<<<< HEAD
=======
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Discover from './pages/Discover';
import Chat from './pages/Chat';
import Verify from './pages/Verify';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/discover" 
          element={
            <ProtectedRoute requireVerification={true}>
              <Discover />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute requireVerification={true}>
              <Chat />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/verify" 
          element={
            <ProtectedRoute>
              <Verify />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
>>>>>>> f0ad6cfda9215423e9e6159d340c95e9e075098a
=======
>>>>>>> 81fdaea (update)
