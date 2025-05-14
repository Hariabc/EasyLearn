import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { IconButton } from '@material-tailwind/react';
import { SunIcon } from '@heroicons/react/24/solid';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 font-bold text-lg border-b">EasyLearn</div>
        <nav className="p-4 space-y-4">
          <a href="#" className="block text-gray-700 hover:text-blue-600">Dashboard</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">My Courses</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">Quizzes</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">Contests</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">Rewards</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">Discussion Forum</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-4 w-full">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo" className="h-8" />
            <span className="text-xl font-semibold">EasyLearn</span>
          </div>

          <div className="flex items-center space-x-6">
            <input type="text" placeholder="Search..." className="border p-2 rounded w-64" />
            <button className="relative">
              <span className="material-icons text-gray-600">notifications</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</span>
            </button>
            {/* Theme Toggle Icon */}
            <IconButton className="p-2 text-gray-600">
              <SunIcon className="w-5 h-5" />
            </IconButton>
            <img src="https://via.placeholder.com/32" alt="Profile" className="rounded-full w-8 h-8" />
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6 overflow-y-auto">
          {/* User Profile */}
          <section className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex items-center space-x-6">
              <img src="https://via.placeholder.com/64" alt="User" className="rounded-full w-16 h-16" />
              <div>
                <h2 className="text-xl font-semibold">{user.email}</h2>
                <p className="text-gray-600">Learning Status: Intermediate</p>
              </div>
            </div>
          </section>

          {/* Ongoing Courses */}
          <section className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Ongoing Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["DSA", "Frontend", "Backend", "Aptitude"].map((course, index) => (
                <div key={index} className="border p-4 rounded shadow hover:shadow-lg transition">
                  <h4 className="text-md font-bold">{course} Course</h4>
                  <p className="text-sm text-gray-600">Includes videos, notes, quizzes, and coding challenges.</p>
                  {/* Progress Circle */}
                  <div className="mt-4 flex justify-center">
                    <div className="relative flex items-center justify-center">
                      <svg width="80" height="80" className="transform rotate-90">
                        <circle cx="40" cy="40" r="35" stroke="#e0e0e0" strokeWidth="8" fill="none" />
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          stroke="#4CAF50"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray="220"
                          strokeDashoffset="88"
                          className="transition-all duration-300 ease-out"
                        />
                      </svg>
                      <div className="absolute text-xl font-semibold text-gray-800">60%</div>
                    </div>
                  </div>
                  <button className="mt-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    View Course
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Available Courses */}
          <section className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Available Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["DSA", "Frontend", "Backend", "Aptitude"].map((course, index) => (
                <div key={index} className="border p-4 rounded shadow hover:shadow-lg transition">
                  <h4 className="text-md font-bold">{course} Course</h4>
                  <p className="text-sm text-gray-600">Includes videos, notes, quizzes, and coding challenges.</p>
                  <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    View Course
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-auto bg-gray-800 text-white p-4 text-center">
            <p>&copy; 2025 EasyLearn. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
