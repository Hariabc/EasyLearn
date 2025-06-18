import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/login-bg-01.png';
import api from '../../axios';
import { motion } from 'framer-motion';

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token } = response.data;
      await login(token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email: forgotEmail });
      setSuccessMessage('Link sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center px-4 py-12">
      <motion.div
        className="max-w-4xl w-full bg-white shadow-xl rounded-lg flex flex-col md:flex-row overflow-hidden transition-all duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hidden md:flex w-1/2 bg-blue-50 items-center justify-center h-[36rem]">
          <img src={logo} alt="EasyLearn" className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 py-6 px-6 sm:px-10 flex flex-col justify-center md:h-[36rem]">
          <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-2">EasyLearn</h1>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
            </h2>
            {!showForgotPassword && (
              <p className="mt-2 text-base text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            )}
          </div>

          {!showForgotPassword ? (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-base"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-base"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </div>

              {error && <p className="text-sm font-medium text-red-800">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleForgotPassword}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-base"
                  placeholder="Enter your email"
                />
              </div>

              {error && <p className="text-sm font-medium text-red-800">{error}</p>}
              {successMessage && <p className="text-sm font-medium text-green-700">{successMessage}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Link'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setError('');
                  setSuccessMessage('');
                }}
                className="w-full mt-2 text-sm text-blue-600 hover:underline text-center"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
