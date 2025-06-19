import React, { useState, useEffect, useContext } from 'react';
import api from '../axios';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const { user, authToken } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setName(user.fullName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const showToast = (message, color) => {
    const toast = document.createElement("div");
    toast.innerText = message;

    let bgClass = "bg-blue-600";
    if (color === "green") {
      bgClass = "bg-green-600";
    } else if (color === "red") {
      bgClass = "bg-red-600";
    }

    toast.className = `
    fixed top-6 left-1/2 transform -translate-x-1/2
    px-6 py-4 rounded-2xl shadow-2xl text-white ${bgClass}
    z-50 text-base font-semibold tracking-wide text-center
    transition-all duration-300 max-w-md w-auto
  `;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 1000);
  };


  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(
        '/api/users/me/profile',
        { fullName: name, email },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      showToast(res.data.message || 'Profile updated successfully!', 'green');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to update profile.', 'red');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showToast("New passwords don't match!", 'red');
      return;
    }

    try {
      const res = await api.post(
        '/api/users/me/change-password',
        { currentPassword, newPassword, confirmPassword: confirmNewPassword },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      showToast(res.data.message || 'Password updated successfully!', 'green');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to update password.', 'red');
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen py-12 px-6 sm:px-10 lg:px-20">
      <h2 className="text-4xl font-bold text-white mb-10 text-center">Account Settings</h2>

      <div className="max-w-3xl mx-auto space-y-10">
        {/* Profile Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <h3 className="text-2xl font-semibold text-white mb-6 border-b border-slate-600 pb-2">Profile Information</h3>

          {!isEditing ? (
            <div className="text-slate-300 space-y-4">
              <p><strong>Full Name:</strong> {name}</p>
              <p><strong>Email:</strong> {email}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-slate-600 text-white py-2 rounded-xl hover:bg-slate-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Password Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <h3 className="text-2xl font-semibold text-white mb-6 border-b border-slate-600 pb-2">Change Password</h3>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-slate-400 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
