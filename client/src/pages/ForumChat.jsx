import React, { useEffect, useRef, useState, useContext } from "react";
import io from "socket.io-client";
import api from "../axios";
import { AuthContext } from "../context/AuthContext";

const socket = io("https://easylearn-1-bt4h.onrender.com");

const ForumChat = () => {
  const { authToken } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to fetch messages", err);
        setLoading(false);
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

  const handleSend = async () => {
    if (!newMsg.trim() || !currentUser) return;

    const message = {
      senderId: currentUser._id,
      senderName: currentUser.fullName,
      content: newMsg,
    };

    try {
      const res = await api.post("/api/discussions", message, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // ✅ Immediately update UI
      setMessages((prev) => [...prev, res.data.data]);
      socket.emit("sendMessage", res.data.data);
      setNewMsg("");
    } catch (error) {
      console.error("❌ Failed to send message", error);
    }
  };

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-300 bg-slate-900">
        Loading user info...
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen py-4 px-2 sm:px-4">
      <div className="flex flex-col h-[90vh] w-full max-w-3xl mx-auto border border-slate-700 rounded-2xl shadow-lg bg-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-4 py-3 sm:px-5 sm:py-4 text-lg sm:text-xl font-semibold text-center shadow">
          EasyLearn Discussion Forum
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="animate-pulse space-y-2">
                <div className="h-3 w-20 sm:w-24 bg-slate-600 rounded"></div>
                <div className="h-4 w-40 sm:w-48 bg-slate-700 rounded"></div>
              </div>
            ))
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[80%] sm:max-w-[70%] text-sm ${
                    msg.senderId === currentUser._id
                      ? "ml-auto items-end"
                      : "items-start"
                  }`}
                >
                  <span className="text-xs text-slate-400 mb-1">
                    {msg.senderName}
                  </span>
                  <div
                    className={`px-4 py-2 rounded-xl break-words ${
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
            </>
          )}
        </div>

        {/* Input */}
        <div className="flex items-center p-3 sm:p-4 border-t border-slate-700 bg-slate-800">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-slate-700 text-white border border-slate-600 rounded-full px-4 py-2 mr-2 sm:mr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumChat;