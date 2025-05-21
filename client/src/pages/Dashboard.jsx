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
  TrophyIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  Squares2X2Icon,
  Cog6ToothIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import logo from "../assets/education_10353866.png";
import api from "../axios";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
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
    icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
    text: "Quizzes",
    path: "/quizzes",
  },
  {
    icon: <TrophyIcon className="h-6 w-6" />,
    text: "Contests",
    path: "/contests",
  },
  { icon: <StarIcon className="h-6 w-6" />, text: "Rewards", path: "/rewards" },
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

  // Fetch courses and enrolled courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/api/courses");
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        if (!user?._id || !authToken) {
          setEnrolledCourses([]);
          return;
        }
        const { data } = await api.get(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setEnrolledCourses(
          Array.isArray(data.enrolledCourses) ? data.enrolledCourses : []
        );
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        setEnrolledCourses([]);
      }
    };

    if (user && authToken) {
      fetchCourses();
      fetchEnrolledCourses();
    } else {
      setCourses([]);
      setEnrolledCourses([]);
      setCoursesLoading(false);
    }
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
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col ${
          isDesktopSidebarExpanded ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300 ease-in-out flex-shrink-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={`flex items-center ${
              isDesktopSidebarExpanded
                ? "justify-between px-6"
                : "justify-center px-2"
            } py-5 border-b border-gray-200`}
          >
            <div
              className={`flex items-center ${
                isDesktopSidebarExpanded ? "gap-3" : ""
              }`}
            >
              <img
                src={logo}
                alt="EasyLearn Logo"
                className={`${isDesktopSidebarExpanded ? "h-8" : "h-0"}`}
              />
              {isDesktopSidebarExpanded && (
                <span className="text-xl font-semibold tracking-tight text-gray-900">
                  EasyLearn
                </span>
              )}
            </div>
            <button
              onClick={toggleDesktopSidebar}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none ${
                !isDesktopSidebarExpanded ? "lg:mx-auto" : ""
              }`}
              aria-label="Toggle desktop sidebar"
            >
              {isDesktopSidebarExpanded ? (
                <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
              ) : (
                <ChevronRightIcon className="h-6 w-6 text-gray-700" />
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
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 font-medium transition hover:bg-blue-50 hover:text-blue-600 ${
                  !isDesktopSidebarExpanded ? "justify-center" : ""
                }`}
              >
                <span className="flex-shrink-0 text-gray-400 group-hover:text-blue-500">
                  {item.icon}
                </span>
                {isDesktopSidebarExpanded && (
                  <span className="truncate">{item.text}</span>
                )}
              </a>
            ))}
          </nav>
          {/* User Section */}
          <div className="py-4 border-t border-gray-200">
            <div className="flex gap-2 flex-col">
              {isDesktopSidebarExpanded ? (
                <>
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center gap-1 rounded-lg px-6 py-2 w-full text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    Profile
                  </button>
                  <button
                    onClick={handleSettingsClick}
                    className="flex items-center gap-1 rounded-lg px-6 py-2 w-full text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Cog6ToothIcon className="h-5 w-5" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-1 rounded-lg px-6 py-2 w-full text-red-600 hover:bg-red-50"
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
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile Sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img src={logo} alt="EasyLearn Logo" className="h-8" />
              <span className="text-xl font-semibold tracking-tight text-gray-900">
                EasyLearn
              </span>
            </div>
            <button
              onClick={toggleMobileSidebar}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              aria-label="Close mobile sidebar"
            >
              <XMarkIcon className="h-6 w-6 text-gray-700" />
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
                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600"
              >
                <span className="flex-shrink-0 text-gray-400 group-hover:text-blue-500">
                  {item.icon}
                </span>
                <span>{item.text}</span>
              </a>
            ))}
          </nav>
          {/* User Section */}
          <div className="px-2 py-4 border-t border-gray-200">
            <div className="flex gap-2 flex-col justify-between">
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-1 rounded-lg px-6 py-2 w-full  text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                <UserCircleIcon className="h-5 w-5" />
                Profile
              </button>
              <button
                onClick={handleSettingsClick}
                className="flex items-center gap-1 rounded-lg px-6 py-2 w-full  text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                <Cog6ToothIcon className="h-5 w-5" />
                Settings
              </button>
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-1 rounded-lg px-6 py-2 w-full text-red-600 hover:bg-red-50"
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
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden flex items-center mb-4">
          <button
            onClick={toggleMobileSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Open mobile menu"
          >
            <Bars3Icon className="h-6 w-6 text-gray-700" />
          </button>
          <div className="flex  gap-2">
            <img src={logo} alt="EasyLearn Logo" className="h-8" />
            <span className="text-xl font-semibold tracking-tight text-gray-900">
              EasyLearn
            </span>
          </div>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
          Welcome, {user.name || "User"}!
        </h1>

        {/* Ongoing Courses */}
        <section className="bg-white p-4 lg:p-8 rounded-xl lg:rounded-2xl shadow-lg mb-6 lg:mb-8">
          <h3 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-gray-800 flex items-center gap-2">
            <svg
              className="h-5 w-5 lg:h-6 lg:w-6 text-blue-500"
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
              <span className="ml-3 lg:ml-4 text-gray-500 text-base lg:text-lg">
                Loading courses...
              </span>
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="flex flex-col items-center py-8 lg:py-12 text-gray-400">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {enrolledCourses.map(({ course, progress }, index) => (
                <div
                  key={course._id || index}
                  className="group border border-gray-200 rounded-xl lg:rounded-2xl bg-gradient-to-br from-white to-blue-50 p-4 lg:p-6 shadow transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer relative"
                  onClick={() => handleCourseView(course)}
                >
                  {/* Course image or placeholder */}
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-100 rounded-lg lg:rounded-xl flex items-center justify-center mb-3 lg:mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 lg:w-6 lg:h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                      />
                    </svg>
                  </div>
                  <h4 className="text-base lg:text-lg font-semibold mb-1 text-blue-900 truncate">
                    {course.title}
                  </h4>
                  <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4 line-clamp-2">
                    {course.description || "No description available."}
                  </p>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3 mb-1 lg:mb-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 lg:h-3 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {Number.isFinite(progress) ? Math.round(progress * 100) : 0}
                    % completed
                  </p>

                  {/* Arrow icon on hover */}
                  <div className="absolute top-4 right-4 lg:top-6 lg:right-6 opacity-0 group-hover:opacity-100 transition">
                    <svg
                      className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Available Courses */}
        <section className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-lg mb-6">
          <h3 className="text-lg lg:text-xl font-semibold mb-4">Available Courses</h3>
          {coursesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500"></div>
              <span className="ml-3 text-gray-500">Loading courses...</span>
            </div>
          ) : availableCourses.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No new courses available to enroll.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCourses.map((course) => (
                <div
                  key={course._id}
                  className="border rounded-xl p-4 shadow hover:shadow-lg cursor-pointer flex flex-col justify-between"
                >
                  <div onClick={() => handleCourseView(course)}>
                    <h4 className="text-base lg:text-lg font-semibold mb-2">
                      {course.title}
                    </h4>
                    <p className="text-xs lg:text-sm text-gray-600 mb-3">
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
