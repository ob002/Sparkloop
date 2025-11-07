import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../services/auth';
import { Heart, Compass, MessageCircle, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Don't show navbar on landing or onboarding
  if (!user || location.pathname === '/' || location.pathname === '/onboarding' || location.pathname === '/verify') {
    return null;
  }

  const navItems = [
    { path: '/discover', icon: Compass, label: 'Discover' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/discover" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary-500" fill="currentColor" />
            <span className="text-2xl font-bold text-gray-900">SparkLoop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Profile Dropdown */}
            <div className="ml-4 flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {profile?.displayName}
                </p>
                {profile?.verified && (
                  <p className="text-xs text-blue-500">✓ Verified</p>
                )}
              </div>
              <img
                src={profile?.photoURL}
                alt={profile?.displayName}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
              />
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <img
              src={profile?.photoURL}
              alt={profile?.displayName}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
            />
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-around z-40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 ${
                  isActive ? 'text-primary-500' : 'text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;