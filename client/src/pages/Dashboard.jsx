import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@material-tailwind/react';
import { SunIcon, PowerIcon, Bars3Icon, XMarkIcon, AcademicCapIcon, ClipboardDocumentListIcon, TrophyIcon, StarIcon, ChatBubbleLeftRightIcon, Squares2X2Icon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import { theme } from '../theme/theme';
import logo from "../assets/education_10353866.png"

const navItems = [
  { icon: <Squares2X2Icon className="h-6 w-6" />, text: 'Dashboard' },
  { icon: <AcademicCapIcon className="h-6 w-6" />, text: 'My Courses' },
  { icon: <ClipboardDocumentListIcon className="h-6 w-6" />, text: 'Quizzes' },
  { icon: <TrophyIcon className="h-6 w-6" />, text: 'Contests' },
  { icon: <StarIcon className="h-6 w-6" />, text: 'Rewards' },
  { icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />, text: 'Discussion Forum' },
];

const Dashboard = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

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

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return null;
  }

  const handleCourseView = (course) => {
    const formattedCourse = course.toLowerCase().replace(/\s+/g, '');
    navigate(`/courses/${formattedCourse}`);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-20"
          onClick={toggleSidebar}
        />
      )}
      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-30 bg-white shadow-lg
          transition-all duration-300 ease-in-out
          flex flex-col
          ${isMobile 
            ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full')
            : (isSidebarOpen ? 'w-64' : 'w-20')
          }
        `}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <span className={`text-xl font-semibold tracking-tight text-gray-900 ${!isSidebarOpen && 'lg:hidden'}`}>EasyLearn</span>
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 bg-white">
          {navItems.map((item, index) => (
            <a 
              key={index}
              href="#" 
              className={`
                group flex items-center gap-4 rounded-lg px-3 py-3 my-1
                text-gray-700 font-medium transition
                hover:bg-blue-50 hover:text-blue-600
                ${!isSidebarOpen && 'lg:justify-center px-0'}
              `}
            >
              <span className="flex-shrink-0 text-gray-400 group-hover:text-blue-500">
                {item.icon}
              </span>
              <span className={`truncate ${!isSidebarOpen && 'lg:hidden'}`}>{item.text}</span>
            </a>
          ))}
        </nav>
        {/* Settings and Logout at the bottom */}
        <div className="px-2 pb-6 mt-auto flex flex-col gap-2">
          <button className={`flex items-center gap-3 w-full rounded-lg px-3 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium ${!isSidebarOpen && 'lg:justify-center px-0'}`}
            onClick={() => {}}>
            <Cog6ToothIcon className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
            <span className={`truncate ${!isSidebarOpen && 'lg:hidden'}`}>Settings</span>
          </button>
          <button className={`flex items-center gap-3 w-full rounded-lg px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition font-medium ${!isSidebarOpen && 'lg:justify-center px-0'}`}
            onClick={logout}>
            <PowerIcon className="h-6 w-6 text-gray-400 group-hover:text-red-500" />
            <span className={`truncate ${!isSidebarOpen && 'lg:hidden'}`}>Logout</span>
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between bg-white shadow px-4 lg:px-8 py-6 w-full">
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            </button>
            <img src={logo} alt="Logo" className="h-8" />
            <span className="text-xl font-semibold text-gray-900">EasyLearn</span>
          </div>
        </header>
        {/* Content Area */}
        <main className="p-4 lg:p-8 overflow-y-auto">
          {/* Ongoing Courses */}
          <section className="bg-white p-4 lg:p-8 rounded-xl shadow mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Ongoing Courses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {["DSA", "Frontend", "Backend", "Aptitude"].map((course, index) => (
                <div key={index} className="border border-gray-100 p-5 rounded-xl shadow hover:shadow-lg transition bg-gray-50 flex flex-col items-center">
                  <h4 className="text-md font-semibold text-gray-800 mb-2">{course} Course</h4>
                  <p className="text-sm text-gray-500 mb-4 text-center">Includes videos, notes, quizzes, and coding challenges.</p>
                  <div className="mt-2 mb-4 flex justify-center">
                    <div className="relative flex items-center justify-center">
                      <svg width="80" height="80" className="transform rotate-90">
                        <circle cx="40" cy="40" r="35" stroke="#e0e0e0" strokeWidth="8" fill="none" />
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          stroke="#3B82F6"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray="220"
                          strokeDashoffset="88"
                          className="transition-all duration-300 ease-out"
                        />
                      </svg>
                      <div className="absolute text-lg font-semibold text-blue-600">60%</div>
                    </div>
                  </div>
                  <button className="mt-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full font-medium">
                    View Course
                  </button>
                </div>
              ))}
            </div>
          </section>
          {/* Available Courses */}
          <section className="bg-white p-4 lg:p-8 rounded-xl shadow mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Available Courses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {["Computer Languages","DSA", "Frontend", "Backend", "Aptitude"].map((course, index) => (
                <div key={index} className="border border-gray-100 p-5 rounded-xl shadow hover:shadow-lg transition bg-gray-50 flex flex-col items-center">
                  <h4 className="text-md font-semibold text-gray-800 mb-2">{course} Course</h4>
                  <p className="text-sm text-gray-500 mb-4 text-center">Includes videos, notes, quizzes, and coding challenges.</p>
                  <button 
                    onClick={() => handleCourseView(course)} 
                    className="mt-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full font-medium"
                  >
                    View Course
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
