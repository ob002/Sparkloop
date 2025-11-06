import React from 'react';
<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';

// Pages (match your src/pages folder)
import Landing from './pages/Landing.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Discover from './pages/Discover.jsx';
import ChatList from './pages/ChatList.jsx';
import Verify from './pages/Verify.jsx';
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Verify from './pages/Verify';
import Discover from './pages/Discover';
import Chat from './pages/ChatList.jsx';
>>>>>>> f0ad6cfda9215423e9e6159d340c95e9e075098a

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
