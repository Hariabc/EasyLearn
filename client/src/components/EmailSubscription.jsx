import { useState } from "react";

export default function EmailSubscription() {
  const API_BASE = "https://cn-learning-agent.onrender.com/api";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const callAPI = async (endpoint, method = "GET", body = null) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(data.message || "Action completed successfully ✅");
      } else {
        setMessage(data.message || "Something went wrong ❌");
      }
    } catch (err) {
      setMessage("Failed to connect to server ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0F1F] p-6 relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-800/10 to-transparent" />

      <div className="relative w-full max-w-2xl bg-[#101A2D]/90 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-blue-400 to-teal-300 bg-clip-text text-transparent mb-3">
          Daily Network Learning Bot
        </h2>
        <p className="text-gray-300 text-center mb-8 text-lg">
          Get a daily Computer Networks topic with a quiz, key points, and clear
          explanations — right in your inbox.
        </p>

        {/* Email Input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-[#172642] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        {/* API Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => callAPI("/subscribe", "POST", { email })}
            className="px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
          >
            Subscribe
          </button>
          <button
            onClick={() => callAPI("/unsubscribe", "POST", { email })}
            className="px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
          >
            Unsubscribe
          </button>
          <button
            onClick={() => callAPI("/test-email", "POST", { email })}
            className="px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
          >
            Send Test Email
          </button>
        </div>

        {/* Status Message */}
        <div className="mt-8 p-4 rounded-lg border border-white/10 bg-[#0F1A2E]/50 text-center">
          {loading ? (
            <p className="text-blue-400 animate-pulse">Loading...</p>
          ) : message ? (
            <p
              className={
                message.includes("✅")
                  ? "text-green-400 font-medium"
                  : "text-red-400 font-medium"
              }
            >
              {message}
            </p>
          ) : (
            <p className="text-gray-500">No action taken yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
