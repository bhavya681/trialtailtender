import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ChatBox = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const role=localStorage.getItem('user');
  
  // Toggle between dark and light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  // Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/messages/${chatId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        if (data.success) {
          setMessages(data.messages);
        } else {
          console.error('Error fetching messages:', data.message);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [chatId]);

  // Handle sending a message
  const handleSendMessage = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          chatRoomId: chatId,
          user: 'user1',
          receiverId: 'user2',
          message: newMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className={`chat-box flex flex-col h-screen p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="header flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Chat</h2>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} hover:${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`}
        >
          {isDarkMode ? '🌙' : '🌞'}
        </button>
      </div>
      <div className="messages flex-grow overflow-y-auto bg-white rounded-lg p-4 shadow-md">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message p-3 my-2 rounded-lg ${msg.senderId === userId ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-200 text-gray-700'}`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div className="input-bar flex items-center mt-2 space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-3 rounded-lg border border-gray-300 shadow-md"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
