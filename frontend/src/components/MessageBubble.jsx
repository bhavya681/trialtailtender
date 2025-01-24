import React from "react";

const MessageBubble = ({ message, currentUser }) => {
  const isCurrentUser = message.user === currentUser;

  return (
    <div
      className={`flex ${
        isCurrentUser ? "justify-end" : "justify-start"
      } w-full`}
    >
      <div
        className={`${
          isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
        } max-w-xs px-4 py-2 rounded-lg shadow-lg`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default MessageBubble;
