import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';

// Pages (match your src/pages folder)
import Landing from './pages/Landing.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Discover from './pages/Discover.jsx';
import ChatList from './pages/ChatList.jsx';
import Verify from './pages/Verify.jsx';

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
              <ChatList />
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

export default App;
