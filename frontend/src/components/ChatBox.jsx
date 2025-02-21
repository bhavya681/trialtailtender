import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { format } from "timeago.js";
import { IoSendSharp } from "react-icons/io5";
import { BsEmojiSmile, BsMoonFill, BsSunFill } from "react-icons/bs";
import { FiPaperclip } from "react-icons/fi";
import { v4 as uuidv4 } from 'uuid';

const socket = io("${import.meta.env.VITE_API_URL}");

const ChatBox = () => {
  const { usersitterid } = useParams();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editText, setEditText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [senderProfile, setSenderProfile] = useState("");
  const [receiverProfile, setReceiverProfile] = useState("");
  const [receiverName, setReceiverName] = useState("");

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  const getSenderAvatar = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSenderProfile(data.profile.profile);
    } catch (error) {
      console.error(error);
    }
  };

  const getReceiverAvatar = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile/${usersitterid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setReceiverProfile(data.profile.profile);
      setReceiverName(data.profile.name);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket.emit("joinChat", { senderId: userId, receiverId: usersitterid });

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/${userId}/${usersitterid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setMessages(data);
        } else {
          console.error("Error fetching messages:", data.message);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    getSenderAvatar();
    getReceiverAvatar();

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, usersitterid, token]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: userId,
      receiverId: usersitterid,
      message: newMessage,
      id: uuidv4()
    };

    socket.emit("sendMessage", messageData);
    setNewMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className={`h-screen flex flex-col mt-[80px] ${isDarkMode ? "bg-[#1a1a1a] text-gray-100" : "bg-[#f8fafc] text-gray-900"}`}>
      {/* Header */}
      <div className="px-6 py-4 shadow-md 
    shadow-[rgba(0, 0, 0, 0.1) 0px 2px 4px, rgba(0, 0, 0, 0.2) 0px 7px 13px -3px, rgba(0, 0, 0, 0.1) 0px -3px 0px inset] 
    dark:shadow-[rgba(239, 32, 32, 0.1) 0px 2px 4px, rgba(231, 33, 33, 0.2) 0px 7px 13px -3px, rgba(255, 255, 255, 0.1) 0px -3px 0px inset]">

        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={receiverProfile || "https://via.placeholder.com/40"} 
                alt="Receiver" 
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/50 ring-offset-2"
              />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div>
              <h2 className="font-semibold text-lg tracking-tight">{receiverName}</h2>
              <p className="text-sm text-emerald-500 dark:text-emerald-400 font-medium">Online</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out"
          >
            {isDarkMode ? <BsMoonFill size={20}/> : <BsSunFill size={20}  className="text-yellow-500"/>}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 
        scrollbar-thin scrollbar-track-transparent 
        scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400
        dark:scrollbar-thumb-gray-700 dark:hover:scrollbar-thumb-gray-600
        scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth'
        }}>
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id || uuidv4()} className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-end gap-3 max-w-[80%] ${msg.senderId === userId ? "flex-row-reverse" : "flex-row"}`}>
                <img 
                  src={msg.senderId === userId ? senderProfile : receiverProfile || "https://via.placeholder.com/32"} 
                  alt={msg.senderId === userId ? "Sender" : "Receiver"} 
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                />
                <div className="flex flex-col">
                  <div className={`px-4 py-2.5 rounded-2xl shadow-sm backdrop-blur-sm
                    ${msg.senderId === userId 
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none" 
                      : "bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 rounded-bl-none"
                    } transition-all duration-200`}
                  >
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>
                  <span className={`text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium
                    ${msg.senderId === userId ? "text-right mr-2" : "ml-2"}`}>
                    {format(msg.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="px-4 py-6">
  <div className="max-w-4xl mx-auto">
    <div className={`flex items-center gap-3 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-full px-5 py-3 border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} shadow-md dark:shadow-lg transition-all`}>
      
      {/* Emoji Icon */}
      <BsEmojiSmile className={`text-xl cursor-pointer transition-colors ${
        isDarkMode 
          ? 'text-gray-400 hover:text-gray-300' 
          : 'text-gray-500 hover:text-gray-700'
      }`} />

      {/* Input Field */}
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        className={`flex-1 border-none focus:outline-none outline-none text-[16px] transition-all ${
          isDarkMode
            ? 'bg-transparent text-gray-100 placeholder-gray-500'
            : 'bg-white text-gray-900 placeholder-gray-400'
        }`}
        placeholder="Type a message..."
      />

      {/* Attachment Icon */}
      <FiPaperclip className={`text-xl cursor-pointer transition-colors ${
        isDarkMode 
          ? 'text-gray-400 hover:text-gray-300' 
          : 'text-gray-500 hover:text-gray-700'
      }`} />

      {/* Send Button */}
      <button 
        onClick={handleSendMessage}
        disabled={!newMessage.trim()}
        className={`p-2 rounded-full text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          isDarkMode
            ? 'bg-blue-400 hover:bg-blue-500'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        <IoSendSharp size={'20px'}/>
      </button>
      
    </div>
  </div>
</div>


    </div>
  );
};

export default ChatBox;
