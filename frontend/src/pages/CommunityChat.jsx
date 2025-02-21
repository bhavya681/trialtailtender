import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import moment from "moment";

const SOCKET_URL = `${import.meta.env.VITE_API_URL}`;
const API_URL = `${import.meta.env.VITE_API_URL}/api/community-chat`;

const CommunityChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  const userProfile = localStorage.getItem("userDetails");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("joinCommunity", { communityId: "global-community" });

    socketRef.current.on("receiveCommunityMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    fetchMessages();

    return () => {
      socketRef.current.disconnect();
    };
  }, [token, navigate]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/global-community`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages);
        scrollToBottom();
      } else {
        console.error("Error fetching messages:", data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleTyping = () => {
    if (typingTimeout) clearTimeout(typingTimeout);

    socketRef.current.emit("userTyping", {
      communityId: "global-community", 
      user: userName,
    });

    const timeout = setTimeout(() => {
      socketRef.current.emit("stopTyping", {
        communityId: "global-community",
        user: userName,
      });
    }, 2000);

    setTypingTimeout(timeout);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      communityId: "global-community",
      senderId: userId,
      senderName: userName,
      message: newMessage,
      timestamp: new Date(),
      userProfile: userProfile
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();

      if (response.ok) {
        socketRef.current.emit("sendCommunityMessage", data.newMessage);
        setNewMessage("");
      } else {
        console.error("Error sending message:", data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

 
  useEffect(()=>{fetchMessages()},[messages]);

  return (
   <div className="min-h-screen pt-[17px] bg-gradient-to-br from-slate-900 to-slate-800 px-2 sm:px-6 lg:px-8">
  <div className="max-w-5xl mx-auto backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl overflow-hidden border border-white/20 mt-20">
    <div className="flex flex-col h-[85vh]">
      
      {/* Fixed Header */}
      <div className="p-4 sm:p-6 border-b border-white/10 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white/90">Anonymous Chat Room</h2>
            <p className="text-sm sm:text-base text-white/60 mt-1">Your identity is protected as Anonymous_{userId.slice(-4)}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-white/70">Live Chat</span>
          </div>
        </div>
      </div>

      {/* Scrollable Messages Container with Hidden & Smooth Scrollbar */}
      <div className="flex-1 overflow-y-auto relative 
          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500/30 
          hover:scrollbar-thumb-gray-500/60 transition-all duration-200"
          style={{
            scrollbarWidth: "thin", // Firefox
            scrollbarColor: "transparent transparent", // Hide scrollbar
            msOverflowStyle: "none", // Hide scrollbar in Edge/IE
          }}>
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg._id} 
              className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div className={`flex ${msg.senderId === userId ? "flex-row-reverse" : "flex-row"} items-end max-w-[85%] gap-2`}>
                <img 
                  src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${msg.senderId}`}
                  alt="Anonymous"
                  className="w-10 h-10 rounded-full border-2 border-white/20 hover:border-white/40 transition-all duration-200"
                />
                <div className={`flex flex-col ${msg.senderId === userId ? "items-end" : "items-start"}`}>
                  <div 
                    className={`p-3 rounded-2xl backdrop-blur-sm shadow-lg transform transition-all duration-200 hover:scale-[1.02] ${
                      msg.senderId === userId 
                        ? "bg-blue-600/90 rounded-br-none" 
                        : "bg-gray-700/90 rounded-bl-none"
                    }`}
                  >
                    <p className="text-xs font-semibold text-white/80 mb-1">Anonymous_{msg.senderId.slice(-4)}</p>
                    <p className="text-sm text-white leading-relaxed">{msg.message}</p>
                  </div>
                  <span className="text-xs text-white/50 mt-1 px-2">
                    {moment(msg.timestamp).format('LT')}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="border-t border-white/10 bg-slate-800/50 backdrop-blur-sm">
        <form onSubmit={sendMessage} className="p-4 sm:p-6">
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleTyping}
              className="flex-1 bg-slate-700/50 text-white placeholder-white/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder="Send an anonymous message..."
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
            >
              <span className="hidden sm:inline">Send</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
  );
};

export default CommunityChat;
