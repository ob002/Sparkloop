import React from 'react';
import { X, Heart } from 'lucide-react';

const SwipeActions = ({ onPass, onLike, disabled = false }) => {
  return (
    <div className="flex items-center justify-center gap-6 mt-8">
      {/* Pass Button */}
      <button
        onClick={onPass}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        title="Pass"
      >
        <X className="w-8 h-8 text-gray-500" />
      </button>

      {/* Like Button */}
      <button
        onClick={onLike}
        disabled={disabled}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center hover:from-primary-600 hover:to-pink-600 transition-all transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
        title="Like"
      >
        <Heart className="w-10 h-10 text-white" fill="white" />
      </button>
    </div>
  );
};

export default SwipeActions;