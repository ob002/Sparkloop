import React, { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-white border-t">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-3 rounded-xl border text-gray-800"
      />
      <button
        onClick={handleSend}
        className="px-4 py-3 bg-pink-500 text-white rounded-xl font-medium"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
