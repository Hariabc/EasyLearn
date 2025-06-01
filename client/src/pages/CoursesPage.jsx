import React from "react";
import CourseCard from "../components/CourseCard";

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
  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              Master Your Skills
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Explore our comprehensive courses designed to help you excel in your career
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button className="px-6 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors">
            All Courses
          </button>
          <button className="px-6 py-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
            Development
          </button>
          <button className="px-6 py-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
            Programming
          </button>
          <button className="px-6 py-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
            Aptitude
          </button>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleCourses.map((course, index) => (
            <div 
              key={index} 
              className="group"
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already transformed their careers with EasyLearn
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-lg">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}
