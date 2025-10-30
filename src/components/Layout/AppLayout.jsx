import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  collection, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Heart, MessageCircle, User, LogOut, Menu, X } from 'lucide-react';

function AppLayout({ children, currentPage, onNavigate }) {
  const [matches, setMatches] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  // Listen to matches
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'matches'),
      where('active', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userMatches = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(match => 
          match.user1Id === user.uid || match.user2Id === user.uid
        );
      setMatches(userMatches);
    });

    return unsubscribe;
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      // After sign out, App.jsx will automatically navigate to login
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const activeMatches = matches.filter(match => {
    const now = new Date();
    const expiry = new Date(match.expiresAt);
    return expiry > now;
  });

  const handleNavigation = (page, data = null) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(page, data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => handleNavigation('discover')}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:inline">
                SparkLoop
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => handleNavigation('discover')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'discover'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-5 h-5" />
                Discover
              </button>

              <button
                onClick={() => handleNavigation('matches')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors relative ${
                  currentPage === 'matches' || currentPage === 'chat'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                Matches
                {activeMatches.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {activeMatches.length}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.displayName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden lg:inline">{user?.displayName}</span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={() => handleNavigation('profile')}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 space-y-2 border-t border-gray-200 pt-4">
              <button
                onClick={() => handleNavigation('discover')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentPage === 'discover'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-5 h-5" />
                Discover
              </button>

              <button
                onClick={() => handleNavigation('matches')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors relative ${
                  currentPage === 'matches' || currentPage === 'chat'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                Matches ({activeMatches.length})
              </button>

              <button
                onClick={() => handleNavigation('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentPage === 'profile'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                Profile
              </button>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Active Matches Sidebar (Desktop) */}
      {activeMatches.length > 0 && (
        <div className="hidden xl:block fixed right-4 top-24 w-80">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-pink-500" />
              Active Matches ({activeMatches.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activeMatches.map(match => {
                const otherUser = match.user1Id === user.uid
                  ? { name: match.user2Name, photo: match.user2Photo }
                  : { name: match.user1Name, photo: match.user1Photo };
                
                const expiry = new Date(match.expiresAt);
                const now = new Date();
                const hoursLeft = Math.floor((expiry - now) / (1000 * 60 * 60));

                return (
                  <button
                    key={match.id}
                    onClick={() => handleNavigation('chat', match)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    {otherUser.photo ? (
                      <img
                        src={otherUser.photo}
                        alt={otherUser.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold">
                        {otherUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {otherUser.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {hoursLeft}h remaining
                      </p>
                    </div>
                    {match.messageCount === 0 && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppLayout;