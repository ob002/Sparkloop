import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ChatList = ({ conversations, onChatClick }) => {
  return (
    <div className="space-y-4">
      {conversations.map((conversation) => {
        const otherUser = conversation.users.find(u => u.id !== conversation.currentUserUid);
        const lastMessage = conversation.lastMessage;

        return (
          <div
            key={conversation.id}
            onClick={() => onChatClick(conversation.id)}
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
          >
            {otherUser?.photoURL ? (
              <img
                src={otherUser.photoURL}
                alt={otherUser.displayName || 'User'}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <span className="text-gray-500">?</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold truncate">{otherUser?.displayName || 'Unknown'}</h3>
                {lastMessage?.timestamp && (
                  <span className="text-xs text-gray-500 ml-2">
                    {formatDistanceToNow(lastMessage.timestamp.toDate(), { addSuffix: true })}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm truncate">
                {lastMessage?.text || 'No messages yet'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;