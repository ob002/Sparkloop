import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import SocialLogin from './components/auth/SocialLogin';
import OnboardingForm from './components/auth/OnboardingForm';
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
  );
}

export default App;