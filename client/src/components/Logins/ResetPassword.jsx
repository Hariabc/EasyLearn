import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../axios';

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/api/auth/reset-password/${token}`, {
                newPassword,
            });
            setMessage(res.data.message);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 sm:p-10">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
                    Reset Your Password
                </h1>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Enter a new password for your EasyLearn account
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                    >
                        Reset Password
                    </button>
                </form>

                {message && (
                    <div
                        className={`mt-6 px-4 py-3 rounded-md text-center text-sm font-medium ${message.toLowerCase().includes("success")
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                            }`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );

}
