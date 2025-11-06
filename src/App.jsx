<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import SocialLogin from './components/Auth/SocialLogin';
import OnboardingForm from './components/Auth/OnboardingForm';
import SelfieVerify from './components/Verify/SelfieVerify';
import Discover from './components/Discover/Discover';
import ChatRoom from './components/Chat/ChatRoom';
import AppLayout from './components/Layout/AppLayout';

function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedChat, setSelectedChat] = useState(null);

  // Auto-navigate based on auth state
  useEffect(() => {
    if (!loading) {
      if (!user) {
        setCurrentPage('login');
      } else if (!user.onboardingComplete) {
        setCurrentPage('onboarding');
      } else if (!user.selfieVerified) {
        setCurrentPage('verify');
      } else {
        setCurrentPage('discover');
      }
    }
  }, [user, loading]);

  // Navigation handler
  const navigate = (page, data = null) => {
    if (page === 'chat' && data) {
      setSelectedChat(data);
    }
    setCurrentPage(page);
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 to-purple-600">
        <div className="text-white text-2xl">Loading SparkLoop...</div>
      </div>
    );
  }

  // Page components mapping
  const pages = {
    login: <SocialLogin onSuccess={() => navigate('onboarding')} />,
    
    onboarding: (
      <OnboardingForm 
        onComplete={() => navigate('verify')} 
      />
    ),
    
    verify: (
      <SelfieVerify 
        onVerified={() => navigate('discover')} 
      />
    ),
    
    discover: (
      <AppLayout 
        currentPage="discover"
        onNavigate={(page, data) => navigate(page, data)}
      >
        <Discover 
          onChatOpen={(match) => navigate('chat', match)} 
        />
      </AppLayout>
    ),
    
    chat: (
      <AppLayout 
        currentPage="chat"
        onNavigate={(page, data) => navigate(page, data)}
      >
        <ChatRoom 
          match={selectedChat}
          onBack={() => navigate('discover')} 
        />
      </AppLayout>
    ),
    
    matches: (
      <AppLayout 
        currentPage="matches"
        onNavigate={(page, data) => navigate(page, data)}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Matches</h1>
          <p className="text-gray-600">Matches list coming soon...</p>
        </div>
      </AppLayout>
    ),
    
    profile: (
      <AppLayout 
        currentPage="profile"
        onNavigate={(page, data) => navigate(page, data)}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
          <p className="text-gray-600">Profile page coming soon...</p>
        </div>
      </AppLayout>
    ),
  };

  // Render current page
  return (
    <div className="min-h-screen bg-gray-50">
      {pages[currentPage] || pages.login}
    </div>
>>>>>>> origin/master
  );
}

export default App;
