import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import FeatureSection from "./Sample";
import CoursesPage from "../pages/CoursesPage";

function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-3xl font-bold text-blue-500">
                EasyLearn
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <button className="px-4 py-2 text-gray-700 hover:text-blue-500">
                  Log in
                </button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Sign Up
                </button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-500 focus:outline-none"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              <Link to="/login">
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-500">
                  Log in
                </button>
              </Link>
              <Link to="/register">
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-500">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="bg-white px-4 pt-50 pb-20 h-auto lg:h-screen">
        <div className="container mx-auto text-center">
          <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-lg border border-blue-100 bg-white px-4 py-1 text-xs font-medium">
            Exciting News! Start your learning journey today
          </div>
          <h1 className="mx-auto mb-6 max-w-3xl text-3xl font-bold leading-tight lg:text-5xl">
            Unlock your potential with{" "}
            <span className="text-blue-500">knowledge</span> and{" "}
            <span className="text-blue-500">skills</span> you can use.
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-gray-600 text-lg">
            The time to learn is now. Explore, grow, and transform your future.
          </p>

          <button className="px-6 py-3 bg-amber-50 text-black rounded-md hover:bg-amber-100 transition-colors">
            Explore Courses
          </button>
        </div>
      </header>

      {/* Other sections */}
      <FeatureSection />
      <CoursesPage />
    </>
  );
}

export default HeroSection;
