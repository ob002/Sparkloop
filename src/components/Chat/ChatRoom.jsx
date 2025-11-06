import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { Send, Clock, Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';

function ChatRoom({ match, onBack }) {
  const { user } = useAuth();

  // State management
  const [matchData, setMatchData] = useState(match || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(!match);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch match details if not provided
  useEffect(() => {
    if (match) {
      setMatchData(match);
      setLoading(false);
      return;
    }

    // If match prop is not provided, you could fetch it here
    setError('No match data provided');
    setLoading(false);
  }, [match]);

  // Listen to messages in real-time
  useEffect(() => {
    if (!matchData?.id) return;

    const q = query(
      collection(db, 'messages'),
      where('matchId', '==', matchData.id),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(msgs);
      },
      (err) => {
        console.error('Error listening to messages:', err);
        setError('Failed to load messages');
      }
    );

    return () => unsubscribe();
  }, [matchData?.id]);

  // Calculate and update time remaining
  useEffect(() => {
    if (!matchData?.expiresAt) return;

    const calculateTime = () => {
      const now = new Date();
      const expiry = matchData.expiresAt.toDate ? matchData.expiresAt.toDate() : new Date(matchData.expiresAt);
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeRemaining(`${days}d ${hours % 24}h`);
      } else {
        setTimeRemaining(`${hours}h ${minutes}m`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);

    return () => clearInterval(interval);
  }, [matchData]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || sending || !matchData?.id) return;

    setSending(true);
    setError(null);

    try {
      const messageData = {
        matchId: matchData.id,
        senderId: user.uid,
        senderName: user.displayName || 'Anonymous',
        text: trimmedMessage,
        createdAt: serverTimestamp(),
        read: false
      };

      await addDoc(collection(db, 'messages'), messageData);

      // Update match metadata
      const matchRef = doc(db, 'matches', matchData.id);
      await updateDoc(matchRef, {
        messageCount: increment(1),
        lastMessageAt: serverTimestamp(),
        lastMessage: trimmedMessage.substring(0, 100)
      });

      setNewMessage('');
      inputRef.current?.focus();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  }, [newMessage, sending, matchData?.id, user.uid, user.displayName]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  }, [handleSendMessage]);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Sending...';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Get other user info
  const getOtherUser = () => {
    if (!matchData) return null;
    
    return matchData.user1Id === user.uid 
      ? { 
          name: matchData.user2Name || 'User', 
          photo: matchData.user2Photo, 
          id: matchData.user2Id 
        }
      : { 
          name: matchData.user1Name || 'User', 
          photo: matchData.user1Photo, 
          id: matchData.user1Id 
        };
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !matchData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops!</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  const otherUser = getOtherUser();

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col p-4">
      {/* Chat Header */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            {otherUser?.photo ? (
              <img
                src={otherUser.photo}
                alt={otherUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white text-xl font-semibold">
                {otherUser?.name.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div>
              <h2 className="font-semibold text-gray-900">{otherUser?.name}</h2>
              <p className="text-sm text-gray-500">Active now</p>
            </div>
          </div>

          {/* Timer */}
          {timeRemaining && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeRemaining === 'Expired' 
                ? 'bg-red-100' 
                : 'bg-purple-100'
            }`}>
              <Clock className={`w-4 h-4 ${
                timeRemaining === 'Expired' ? 'text-red-600' : 'text-purple-600'
              }`} />
              <span className="text-sm font-semibold text-gray-900">
                {timeRemaining}
              </span>
            </div>
          )}
        </div>

        {/* Icebreaker */}
        {messages.length === 0 && matchData?.icebreaker && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-start gap-3 bg-purple-50 p-4 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  AI-Generated Icebreaker
                </p>
                <p className="text-gray-700">{matchData.icebreaker}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && matchData && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Messages Container */}
      <div className="bg-white rounded-2xl shadow-lg p-4 flex-1 overflow-y-auto mb-4">
        <div className="space-y-4 min-h-full flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-gray-600 mb-2">Start the conversation!</p>
                <p className="text-sm text-gray-500">
                  Be the first to break the ice
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => {
                const isOwnMessage = message.senderId === user.uid;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isOwnMessage
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="break-words whitespace-pre-wrap">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-white text-opacity-70' : 'text-gray-500'
                        }`}
                      >
                        {formatTimestamp(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white rounded-2xl shadow-lg p-4 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
            disabled={sending || timeRemaining === 'Expired'}
            maxLength={500}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending || timeRemaining === 'Expired'}
            className="px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            aria-label="Send message"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </button>
        </form>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">
            {newMessage.length}/500 characters
          </p>
          {timeRemaining === 'Expired' && (
            <p className="text-xs text-red-600 font-medium">
              This chat has expired
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;