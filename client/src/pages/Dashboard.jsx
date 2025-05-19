import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@material-tailwind/react';
import { SunIcon, PowerIcon, Bars3Icon, XMarkIcon, AcademicCapIcon, ClipboardDocumentListIcon, TrophyIcon, StarIcon, ChatBubbleLeftRightIcon, Squares2X2Icon, Cog6ToothIcon } from '@heroicons/react/24/solid';
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
  const { user, loading , logout} = useContext(AuthContext);
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
    <div className="flex h-screen bg-gray-100">
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
