import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { IconButton } from "@material-tailwind/react";
import {
  PowerIcon,
  Bars3Icon,
  XMarkIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  Squares2X2Icon,
  Cog6ToothIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeBracketIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import logo from "../assets/education_10353866.png";
import api from "../axios";
import StreakDisplay from "../components/StreakDisplay";

const navItems = [
  {
    icon: <Squares2X2Icon className="h-6 w-6" />,
    text: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <AcademicCapIcon className="h-6 w-6" />,
    text: "My Courses",
    path: "/my-courses",
  },
  {
    icon: <CodeBracketIcon className="h-6 w-6" />,
    text: "Code Playground",
    path: "/codeeditor",
  },
  {
    icon: <SparklesIcon className="h-6 w-6" />,
    text: "My Badges",
    path: "/my-badges",
  },
  {
    icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
    text: "Discussion Forum",
    path: "/forum",
  },
];

const Dashboard = () => {
  const { user, loading, logout, authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isDesktopSidebarExpanded, setIsDesktopSidebarExpanded] =
    useState(true);

  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  // Handle window resize to toggle mobile/desktop sidebar state
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileSidebarOpen(false);
      } else {
        if (!isDesktopSidebarExpanded) {
          setIsMobileSidebarOpen(true);
        }
        setIsDesktopSidebarExpanded(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [isDesktopSidebarExpanded]);

  // Redirect to login if no user
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchAllCourses = async () => {
        setCoursesLoading(true); // Start loading before fetching

        try {
          const [coursesResponse, userResponse] = await Promise.all([
            api.get("/api/courses"),
            user?._id && authToken
              ? api.get(`/api/users/${user._id}`, {
                headers: { Authorization: `Bearer ${authToken}` },
              })
              : Promise.resolve({ data: { enrolledCourses: [] } }),
          ]);

          setCourses(coursesResponse.data);

          const enrolled = userResponse.data.enrolledCourses;
          setEnrolledCourses(Array.isArray(enrolled) ? enrolled : []);
        } catch (error) {
          console.error("Error fetching data:", error);
          setCourses([]);
          setEnrolledCourses([]);
        } finally {
          setCoursesLoading(false); // End loading only after both complete
        }
      };

      if (user && authToken) {
        fetchAllCourses();
      } else {
        setCourses([]);
        setEnrolledCourses([]);
        setCoursesLoading(false);
      }
    }, 500); // Delay before fetching

    return () => clearTimeout(timeoutId);
  }, [user, authToken]);

  const handleEnroll = async (courseId) => {
    try {
      const response = await api.post(
        "/api/users/enroll",
        { userId: user._id, courseId },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (response.status === 200) {
        const newCourse = courses.find((course) => course._id === courseId);
        if (newCourse) {
          setEnrolledCourses((prev) => [
            ...prev,
            { course: newCourse, progress: 0 },
          ]);
        }
      } else {
        console.error(
          "Failed to enroll in course",
          response.status,
          response.data
        );
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const handleCourseView = (course) => {
    if (course?.slug && course?._id) {
      navigate(`/courses/${course.slug}?id=${course._id}`);
    } else if (course?.title) {
      const formattedTitle = course.title.toLowerCase().replace(/\s+/g, "");
      navigate(`/courses/${formattedTitle}?id=${course?._id || ""}`);
    } else {
      console.error(
        "Cannot navigate to course view, missing slug or title:",
        course
      );
    }
  };

  const toggleMobileSidebar = () => setIsMobileSidebarOpen((open) => !open);

  const availableCourses = courses.filter(
    (course) =>
      !enrolledCourses.some(
        (enrolled) => (enrolled.course?._id || enrolled._id) === course._id
      )
  );

  const handleNavigationClick = (path) => {
    navigate(path);
    if (isMobile) toggleMobileSidebar();
  };

  const handleProfileClick = () => handleNavigationClick("/profile");
  const handleSettingsClick = () => handleNavigationClick("/settings");
  const handleLogoutClick = () => {
    if (isMobile) toggleMobileSidebar();
    logout();
    navigate("/login");
  };
  const toggleDesktopSidebar = () =>
    setIsDesktopSidebarExpanded((expanded) => !expanded);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-800">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col ${isDesktopSidebarExpanded ? "w-64" : "w-20"
          } bg-slate-900 shadow-lg transition-all duration-300 ease-in-out flex-shrink-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={`flex items-center ${isDesktopSidebarExpanded
              ? "justify-between px-6"
              : "justify-center px-2"
              } py-5 border-b border-slate-700`}
          >
            <div
              className={`flex items-center ${isDesktopSidebarExpanded ? "gap-3" : ""
                }`}
            >
              {isDesktopSidebarExpanded && (
                <span className="text-xl font-semibold tracking-tight text-white">
                  EasyLearn
                </span>
              )}
            </div>
            <button
              onClick={toggleDesktopSidebar}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none ${!isDesktopSidebarExpanded ? "lg:mx-auto" : ""
                }`}
              aria-label="Toggle desktop sidebar"
            >
              {isDesktopSidebarExpanded ? (
                <ChevronLeftIcon className="h-6 w-6 text-gray-300" />
              ) : (
                <ChevronRightIcon className="h-6 w-6 text-gray-300" />
              )}
            </button>
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item, index) => (
              <a
                key={index}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigationClick(item.path);
                }}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 font-medium transition hover:bg-blue-50 hover:text-blue-600 ${!isDesktopSidebarExpanded ? "justify-center" : ""
                  }`}
              >
                <span className="flex-shrink-0 text-gray-300 group-hover:text-blue-500">
                  {item.icon}
                </span>
                {isDesktopSidebarExpanded && (
                  <span className="truncate">{item.text}</span>
                )}
              </a>
            ))}
          </nav>
          {/* User Section */}
          <div className="py-4 border-t border-slate-700">
            <div className="flex gap-2 flex-col">
              {isDesktopSidebarExpanded ? (
                <>
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 w-full text-gray-300 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    Profile
                  </button>
                  <button
                    onClick={handleSettingsClick}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 w-full text-gray-300 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Cog6ToothIcon className="h-5 w-5" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 w-full text-red-600 hover:bg-red-50"
                  >
                    <PowerIcon className="h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <IconButton
                    onClick={handleProfileClick}
                    variant="text"
                    color="blue"
                    aria-label="Profile"
                  >
                    <UserCircleIcon className="h-6 w-6" />
                  </IconButton>
                  <IconButton
                    onClick={handleSettingsClick}
                    variant="text"
                    color="blue"
                    aria-label="Settings"
                  >
                    <Cog6ToothIcon className="h-6 w-6" />
                  </IconButton>
                  <IconButton
                    onClick={handleLogoutClick}
                    variant="text"
                    color="red"
                    aria-label="Logout"
                  >
                    <PowerIcon className="h-6 w-6" />
                  </IconButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        aria-label="Mobile Sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <img src={logo} alt="EasyLearn Logo" className="h-8" />
              <span className="text-xl font-semibold tracking-tight text-white">
                EasyLearn
              </span>
            </div>
            <button
              onClick={toggleMobileSidebar}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              aria-label="Close mobile sidebar"
            >
              <XMarkIcon className="h-6 w-6 text-gray-300" />
            </button>
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item, index) => (
              <a
                key={index}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigationClick(item.path);
                }}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 font-medium hover:bg-blue-50 hover:text-blue-600"
              >
                <span className="flex-shrink-0 text-gray-300 group-hover:text-blue-500">
                  {item.icon}
                </span>
                <span>{item.text}</span>
              </a>
            ))}
          </nav>
          {/* User Section */}
          <div className="px-2 py-4 border-t border-slate-700">
            <div className="flex gap-2 flex-col justify-between">
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-1 rounded-lg px-3 py-2 w-full  text-gray-300 hover:bg-blue-50 hover:text-blue-600"
              >
                <UserCircleIcon className="h-5 w-5" />
                Profile
              </button>
              <button
                onClick={handleSettingsClick}
                className="flex items-center gap-1 rounded-lg px-3 py-2 w-full  text-gray-300 hover:bg-blue-50 hover:text-blue-600"
              >
                <Cog6ToothIcon className="h-5 w-5" />
                Settings
              </button>
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-1 rounded-lg px-3 py-2 w-full text-red-600 hover:bg-red-50"
              >
                <PowerIcon className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mb-5">
          <StreakDisplay />
        </div>
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden flex items-center mb-4">
          <button
            onClick={toggleMobileSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Open mobile menu"
          >
            <Bars3Icon className="h-6 w-6 text-gray-300" />
          </button>
          <div className="flex  gap-2">
            <img src={logo} alt="EasyLearn Logo" className="h-8" />
            <span className="text-xl font-semibold tracking-tight text-white">
              EasyLearn
            </span>
          </div>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 text-white">
          Welcome, {user.name || "User"}!
        </h1>

        {/* Ongoing Courses */}
        <section className="bg-slate-800 p-4 lg:p-8 rounded-xl lg:rounded-2xl shadow-lg mb-6 lg:mb-8">
          <h3 className=" lg:text-2xl lg:mb-6 flex items-center gap-2 text-2xl font-semibold text-blue-400 mb-6">
            <svg
              className="h-5 w-5 lg:h-6 lg:w-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2"
              />
              <circle cx={12} cy={12} r={10} />
            </svg>
            Ongoing Courses
          </h3>
          {coursesLoading ? (
            <div className="flex items-center justify-center py-8 lg:py-12">
              <div className="animate-spin rounded-full h-8 w-8 lg:h-10 lg:w-10 border-t-4 border-b-4 border-blue-500"></div>
              <span className="ml-3 lg:ml-4 text-gray-400 text-base lg:text-lg">
                Loading courses...
              </span>
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="flex flex-col items-center py-8 lg:py-12 text-gray-300">
              <svg
                className="h-10 w-10 lg:h-12 lg:w-12 mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3"
                />
                <circle cx={12} cy={12} r={10} />
              </svg>
              <p className="text-base lg:text-lg text-center">
                You have not enrolled in any courses yet.
              </p>
            </div>
          ) : (
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course, index) => (
                  <div
                    key={index}
                    className="border border-slate-700 bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    <h4 className="text-lg font-bold text-white mb-2">
                      {course.course?.title}
                    </h4>
                    <p className="text-sm text-gray-400 mb-4">
                      Includes videos, notes, quizzes, and coding challenges.
                    </p>

                    {/* Progress bar and percentage on the same line */}
                    <div className="flex items-center gap-3 mb-4">
                      {/* Progress bar container */}
                      <div className="flex-1 bg-white rounded-full h-2">
                        {/* Progress bar fill */}
                        <div
                          className="bg-gradient-to-r from-blue-600 to-orange-400 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.round(
                              course.completionPercent || 0
                            )}%`,
                          }}
                        />
                      </div>
                      {/* Percentage text */}
                      <span className="text-sm font-semibold text-blue-700 min-w-[36px] text-right">
                        {Math.round(course.completionPercent || 0)}%
                      </span>
                    </div>

                    <button
                      onClick={() => handleCourseView(course.course)}
                      className="mt-auto bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    >
                      Continue Course
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </section>

        {/* Available Courses */}
        <section className="bg-slate-800 p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-lg mb-6">
          <h3 className="text-lg lg:text-xl font-semibold mb-4 text-blue-400">
            Available Courses
          </h3>
          {coursesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500"></div>
              <span className="ml-3 text-gray-400">Loading courses...</span>
            </div>
          ) : availableCourses.length === 0 ? (
            <p className="text-center text-gray-300 py-8">
              No new courses available to enroll.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCourses.map((course) => (
                <div
                  key={course._id}
                  className="border border-slate-700 rounded-xl p-4 shadow hover:shadow-lg cursor-pointer flex flex-col justify-between bg-slate-800"
                >
                  <div onClick={() => handleCourseView(course)}>
                    <h4 className="text-base lg:text-lg font-semibold mb-2 text-white">
                      {course.title}
                    </h4>
                    <p className="text-xs lg:text-sm text-gray-400 mb-3">
                      {course.description || "No description available."}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="w-full rounded-lg bg-blue-600 text-white py-2 text-sm lg:text-base hover:bg-blue-700 transition"
                  >
                    Enroll
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
