import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMatches } from '../hooks/useMatches';
import ChatList from '../components/chat/ChatList';
import ChatRoom from '../components/chat/ChatRoom';
import { Loader, MessageSquare } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const { matches, loading } = useMatches(user?.uid);
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">
            {matches.length} active {matches.length === 1 ? 'match' : 'matches'}
          </p>
        </div>

        {/* Chat Interface */}
        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Matches List */}
          <div className="md:col-span-1">
            <ChatList
              matches={matches}
              onSelectMatch={setSelectedMatch}
              selectedMatchId={selectedMatch?.id}
            />
          </div>

          {/* Chat Room */}
          <div className="md:col-span-2">
            {selectedMatch ? (
              <ChatRoom match={selectedMatch} currentUserId={user.uid} />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg h-full flex items-center justify-center">
                <div className="text-center text-gray-500 p-8">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Select a match to start chatting
                  </h3>
                  <p className="text-sm">
                    Remember: You have 24 hours to send a message or the match expires!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;