import React, { useState, useEffect } from "react";
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const sampleCourses = [
  {
    title: "Frontend Development",
    description: "Includes videos, notes, quizzes, and coding challenges."
  },
  {
    title: "Backend Development",
    description: "Learn Flask, Node.js, Express.js, FastAPI, MongoDB, and SQL"
  },
  {
    title: "Computer Programming Languages",
    description: "Learn C, C++, Java, Python, TypeScript, Go, and more"
  },
  {
    title: "Aptitude",
    description: "Quantitative Aptitude, Logical & Non-Verbal Reasoning, Verbal Ability"
  },
  {
    title: "Data Structures & Algorithms",
    description: "Master DSA topics from basics through advanced"
  }
];

export default function CoursesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnroll = () => {
    navigate("/register");
  };
  
  // Skeleton for category filter
  const CategorySkeleton = () => (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {[...Array(4)].map((_, idx) => (
        <Skeleton key={idx} width={120} height={36} borderRadius={9999} />
      ))}
    </div>
  );

  // Skeleton for course cards
  const CourseGridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {[...Array(6)].map((_, idx) => (
        <div key={idx} className="transform transition-transform">
          <div className="bg-slate-800 shadow-xl rounded-2xl border border-slate-700 flex flex-col h-full p-8">
            <Skeleton height={32} width={180} className="mb-4" />
            <Skeleton count={2} height={20} className="mb-2" />
            <div className="mt-auto pt-4">
              <Skeleton height={48} width={"100%"} borderRadius={12} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-slate-900 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700">
        <div className="absolute inset-0 opacity-70 bg-gradient-to-br from-black via-transparent to-black" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Master Your Skills
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
            Explore our comprehensive courses designed to help you excel in your career.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Category Filter */}
        {loading ? <CategorySkeleton /> : (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {["All Courses", "Development", "Programming", "Aptitude"].map((cat, idx) => (
              <button
                key={idx}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  idx === 0
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Course Grid */}
        {loading ? <CourseGridSkeleton /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {sampleCourses.map((course, index) => (
              <div key={index} className="transform transition-transform hover:-translate-y-1">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <section className="mt-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who've upgraded their careers with EasyLearn.
          </p>
          <button onClick={handleEnroll} className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg rounded-xl shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all">
            🚀 Get Started Now
          </button>
        </section>
      </main>
    </div>
  );
}
