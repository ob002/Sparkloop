import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { useMessages } from '../../hooks/useMessages';
import MessageInput from './MessageInput';
import { sendMessage } from '../../services/firestore';
import { Loader, Clock } from 'lucide-react';

const ChatRoom = ({ match, currentUserId }) => {
  const messagesEndRef = useRef(null);
  const { messages, loading } = useMessages(match.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    await sendMessage(match.id, currentUserId, text);
  };

  const getTimeRemaining = () => {
    if (!match.expiresAt) return null;
    
    const expiryTime = match.expiresAt.toDate ? match.expiresAt.toDate() : new Date(match.expiresAt);
    const now = new Date();
    const hoursLeft = Math.max(0, (expiryTime - now) / (1000 * 60 * 60));
    
    return hoursLeft;
  };

  const hoursLeft = getTimeRemaining();
  const isExpiring = hoursLeft && hoursLeft < 6;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-pink-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={match.otherUser?.photoURL}
              alt={match.otherUser?.displayName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />
            <div>
              <h2 className="text-lg font-bold text-white">
                {match.otherUser?.displayName}
              </h2>
              {hoursLeft !== null && (
                <div className={`flex items-center gap-1 text-xs ${
                  isExpiring ? 'text-yellow-300 font-medium' : 'text-white/80'
                }`}>
                  <Clock className="w-3 h-3" />
                  <span>
                    {hoursLeft < 1
                      ? `Expires in ${Math.floor(hoursLeft * 60)} minutes`
                      : `Expires in ${Math.floor(hoursLeft)} hours`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="w-6 h-6 animate-spin text-primary-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Start the conversation!
              </h3>
              <p className="text-gray-600 mb-4">
                Break the ice with one of these:
              </p>
              <div className="space-y-2">
                {match.otherUser?.iceBreakers?.slice(0, 2).map((question, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-700 bg-primary-50 p-3 rounded-lg text-left"
                  >
                    "{question}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwn = message.senderId === currentUserId;
              const messageTime = message.createdAt?.toDate 
                ? message.createdAt.toDate()
                : new Date();

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="break-words">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      {format(messageTime, 'h:mm a')}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatRoom;