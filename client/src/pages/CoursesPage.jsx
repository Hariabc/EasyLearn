import React, { useState, useEffect } from "react";
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
    description:
      "Quantitative Aptitude, Logical & Non-Verbal Reasoning, Verbal Ability"
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
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleEnroll = () => {
    navigate("/register");
  };

  // Course grid skeleton
  const CourseGridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {[...Array(6)].map((_, idx) => (
        <div key={idx} className="bg-slate-800 rounded-2xl p-6">
          <Skeleton height={28} width={160} className="mb-3" />
          <Skeleton count={2} height={18} className="mb-2" />
          <Skeleton height={40} width={"100%"} borderRadius={8} className="mt-4" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-slate-900 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700">
        <div className="absolute inset-0 opacity-70 bg-gradient-to-br from-black via-transparent to-black" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white">
            Master Your Skills
          </h1>
          <p className="mt-4 text-lg text-indigo-100 max-w-2xl mx-auto">
            Explore our comprehensive courses designed to help you excel in your career.
          </p>
        </div>
      </section>

      {/* Courses */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <CourseGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {sampleCourses.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </div>
        )}

        {/* CTA */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Join thousands of learners who've upgraded their careers with EasyLearn.
          </p>
          <button
            onClick={handleEnroll}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg rounded-lg shadow-md hover:shadow-xl transition-all"
          >
            🚀 Get Started Now
          </button>
        </section>
      </main>
    </div>
  );
}
