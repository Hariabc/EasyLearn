import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import FeatureSection from "./Sample";
import CoursesPage from "../pages/CoursesPage";
import logo from '../assets/logo.png';
import graduateImg from '../assets/bg-2.png';
import Footer from "./Footer";

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
      <nav className={`bg-[var(--color-background-paper)] shadow-sm fixed w-full top-0 z-50 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className={`text-3xl font-bold text-[var(--color-primary-main)] hover:opacity-80 transition-opacity`}>
                <img src={logo} alt="EasyLearn Logo" className="h-30 w-auto"/>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/login">
                <button className={`px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary-main)] transition-colors`}>
                  Log in
                </button>
              </Link>
              <Link to="/register">
                <button className={`px-4 py-2 bg-[var(--color-primary-main)] text-white rounded-md hover:bg-[var(--color-primary-dark)] transition-colors shadow-md hover:shadow-lg`}>
                  Sign Up
                </button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md text-[var(--color-text-primary)] hover:text-[var(--color-primary-main)] focus:outline-none transition-colors`}
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
            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[var(--color-background-paper)] shadow-lg`}>
              <Link to="/login">
                <button className={`w-full text-left px-3 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary-main)] transition-colors`}>
                  Log in
                </button>
              </Link>
              <Link to="/register">
                <button className={`w-full text-left px-3 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary-main)] transition-colors`}>
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen bg-slate-900">
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center lg:justify-start px-4 py-1.5 rounded-full bg-[var(--color-primary-main)]/10 text-white text-sm font-medium mb-6">
                🚀 Start Your Learning Journey Today
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Learn Without Limits using {" "}
                <span className="text-[var(--color-primary-main)]">EasyLearn</span>
              </h1>
              <p className="text-lg sm:text-xl text-white mb-8 max-w-2xl mx-auto lg:mx-0">
                Discover a world of knowledge with our expert-led courses. Learn at your own pace, earn certificates, and transform your career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/courses">
                  <button className="px-8 py-3 bg-[var(--color-primary-main)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Explore Courses
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-8 py-3 border-2 border-[var(--color-primary-main)] text-[var(--color-primary-main)] rounded-lg hover:bg-[var(--color-primary-main)] hover:text-white transition-colors">
                    Get Started Free
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="hidden lg:block">
              <img
                src={graduateImg}
                alt="Student Learning"
                className="w-full scale-90 max-w-lg mx-auto"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-0 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-[var(--color-background-paper)] rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-[var(--color-primary-main)] mb-2">10K+</div>
              <div className="text-[var(--color-text-secondary)]">Active Students</div>
            </div>
            <div className="p-6 bg-[var(--color-background-paper)] rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-[var(--color-primary-main)] mb-2">10+</div>
              <div className="text-[var(--color-text-secondary)]">Courses</div>
            </div>
            <div className="p-6 bg-[var(--color-background-paper)] rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-[var(--color-primary-main)] mb-2">AI</div>
              <div className="text-[var(--color-text-secondary)]">Doubt Solver</div>
            </div>
            <div className="p-6 bg-[var(--color-background-paper)] rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-[var(--color-primary-main)] mb-2">Daily</div>
              <div className="text-[var(--color-text-secondary)]">Streaks</div>
            </div>
          </div>
        </div>
      </header>

      
      <FeatureSection />
      <CoursesPage />
      <Footer/>
    </>
  );
}

export default HeroSection;
