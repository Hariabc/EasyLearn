import { useState } from "react";

export default function EmailSubscription() {
  const API_BASE = "https://cn-learning-agent.onrender.com/api";
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const callAPI = async (endpoint, method = "GET", body = null) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Failed to connect to server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B1220] p-6">
      <div className="w-full max-w-2xl bg-[#101A2D] p-6 rounded-xl border border-white/10 shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          Daily Network Learning Bot
        </h2>
        <p className="text-gray-300 text-center mb-8">
          Manage your subscription and test the API directly from here.
        </p>

        {/* Email Input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-[#172642] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* API Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => callAPI("/subscribe", "POST", { email })}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Subscribe
          </button>
          <button
            onClick={() => callAPI("/unsubscribe", "POST", { email })}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Unsubscribe
          </button>
          <button
            onClick={() => callAPI(`/status/${email}`, "GET")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            Check Status
          </button>
          <button
            onClick={() => callAPI("/statistics", "GET")}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            View Statistics
          </button>
          <button
            onClick={() => callAPI("/test-email", "POST", { email })}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
          >
            Send Test Email
          </button>
          <button
            onClick={() => callAPI("/health", "GET")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            Health Check
          </button>
        </div>

        {/* API Response */}
        <div className="mt-6 bg-[#0B1220] p-4 rounded-lg border border-white/10 text-gray-300 text-sm overflow-auto max-h-60">
          {loading ? (
            <p className="text-blue-400">Loading...</p>
          ) : result ? (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          ) : (
            <p className="text-gray-500">No response yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
