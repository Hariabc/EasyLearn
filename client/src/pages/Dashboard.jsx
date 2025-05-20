import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { IconButton, Button } from '@material-tailwind/react';
import { SunIcon, PowerIcon } from '@heroicons/react/24/solid';
import api from "../axios";

const Dashboard = () => {
  const { user, loading, logout, authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/api/courses');
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setCoursesLoading(false);
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        const { data } = await api.get(`/api/users/${user._id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (Array.isArray(data.enrolledCourses)) {
          setEnrolledCourses(data.enrolledCourses);
        } else {
          setEnrolledCourses([]);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };

    if (user && authToken) {
      fetchCourses();
      fetchEnrolledCourses();
    }
  }, [user, authToken]);

  const handleEnroll = async (courseId) => {
    try {
      const response = await api.post('/api/users/enroll', {
        userId: user._id,
        courseId,
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        }
      });

      if (response.status === 200) {
        const newCourse = courses.find(course => course._id === courseId);
        setEnrolledCourses(prev => [...prev, { course: newCourse, progress: 0 }]);
      } else {
        console.error('Failed to enroll in course');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCourseView = (course) => {
    navigate(`/courses/${course.slug}?id=${course._id}`);
  };

  const availableCourses = courses.filter(course =>
    !enrolledCourses.some(enrolled => enrolled.course._id === course._id)
  );

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 font-bold text-lg border-b">EasyLearn</div>
        <nav className="p-4 space-y-4">
          <a href="#" className="block text-gray-700 hover:text-blue-600">Dashboard</a>
          <button className="block text-left w-full text-gray-700 hover:text-blue-600">My Courses</button>
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
            <IconButton className="p-2 text-gray-600">
              <SunIcon className="w-5 h-5" />
            </IconButton>
            <Button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded shadow"
            >
              <PowerIcon className="h-5 w-5" />
              Logout
            </Button>
            <img src="https://via.placeholder.com/32" alt="Profile" className="rounded-full w-8 h-8" />
          </div>
        </header>

        {/* Content */}
        <main className="p-6 overflow-y-auto">
          {/* Profile Section */}
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
              {enrolledCourses.map((course, index) => (
                <div key={index} className="border p-4 rounded shadow hover:shadow-lg transition">
                  <h4 className="text-md font-bold">{course.course.title}</h4>
                  <p className="text-sm text-gray-600">Includes videos, notes, quizzes, and coding challenges.</p>
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
                          strokeDashoffset={`${220 - (220 * (course.completionPercent || 0) / 100)}`}
                          className="transition-all duration-300 ease-out"
                        />
                      </svg>
                      <div className="absolute text-xl font-semibold text-gray-800">
                        {Math.round(course.completionPercent || 0)}%
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleCourseView(course.course)} className="mt-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Continue Course
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Available Courses */}
          <section className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Available Courses</h3>
            {coursesLoading ? (
              <p>Loading courses...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCourses.map((course, index) => (
                  <div key={index} className="border p-4 rounded shadow hover:shadow-lg transition">
                    <h4 className="text-md font-bold">{course.title}</h4>
                    <p className="text-sm text-gray-600">Includes videos, notes, quizzes, and coding challenges.</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleCourseView(course)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        View Course
                      </button>
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
