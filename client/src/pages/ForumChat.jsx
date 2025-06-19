import React, { useEffect, useRef, useState, useContext } from "react";
import io from "socket.io-client";
import api from "../axios";
import { AuthContext } from "../context/AuthContext";

const socket = io("http://localhost:5000");

const ForumChat = () => {
  const { authToken } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const chatEndRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/users", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setCurrentUser(res.data);
      } catch (err) {
        console.error("❌ Failed to load user", err);
      }
    };

    fetchUser();
  }, [authToken]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get("/api/discussions", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch messages", err);
      }
    };

    fetchMessages();

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("newMessage");
  }, [authToken]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMsg.trim() || !currentUser) return;

    const message = {
      senderId: currentUser._id,
      senderName: currentUser.name,
      content: newMsg,
    };

    socket.emit("sendMessage", message);
    setNewMsg("");
  };

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-300 bg-slate-900">
        Loading user info...
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen py-6 px-4">
      <div className="flex flex-col h-[90vh] max-w-3xl mx-auto border border-slate-700 rounded-2xl shadow-lg bg-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-5 py-4 text-xl font-semibold text-center shadow">
          EasyLearn Global Forum
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col max-w-[70%] ${
                msg.senderId === currentUser._id
                  ? "ml-auto items-end"
                  : "items-start"
              }`}
            >
              <span className="text-xs text-slate-400 mb-1">
                {msg.senderName}
              </span>
              <div
                className={`px-4 py-2 rounded-xl text-sm break-words ${
                  msg.senderId === currentUser._id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-white"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center p-4 border-t border-slate-700 bg-slate-800">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-slate-700 text-white border border-slate-600 rounded-full px-4 py-2 mr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumChat;
