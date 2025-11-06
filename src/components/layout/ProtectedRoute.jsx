import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

const ProtectedRoute = ({ children, requireVerification = false }) => {
  const { user, profile } = useAuth();

  // Not logged in → go to onboarding
  if (!user) {
    return <Navigate to="/onboarding" replace />;
  }

  // Requires verification but user not verified → go to verify page
  if (requireVerification && !profile?.isVerified) {
    return <Navigate to="/verify" replace />;
  }

  // All good → allow component to render
  return children;
};

export default ProtectedRoute;
