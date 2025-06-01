import React from "react";
import { Typography, Card } from "@material-tailwind/react";

export default function FeatureSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 bg-slate-900 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium mb-4">
            Why Choose EasyLearn?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Features That Set Us Apart
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="p-8 bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            <Typography variant="h5" className="mb-3 font-bold text-white">
              Flexible Learning
            </Typography>
            <Typography className="text-slate-400">
              Learn at your own pace with 24/7 access to all course materials and resources.
            </Typography>
          </Card>

          {/* Feature 2 */}
          <Card className="p-8 bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <Typography variant="h5" className="mb-3 font-bold text-white">
              Top-Quality Resources
            </Typography>
            <Typography className="text-slate-400">
              Learn from top instructors and industry experts with years of hands-on experience.
            </Typography>
          </Card>

          {/* Feature 3 */}
          <Card className="p-8 bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🤝</span>
            </div>
            <Typography variant="h5" className="mb-3 font-bold text-white">
              AI-Powered Doubt Solver
            </Typography>
            <Typography className="text-slate-400">
              Get instant help with your questions through our intelligent AI doubt-solving system.
            </Typography>
          </Card>

          {/* Feature 4 */}
          <Card className="p-8 bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">📝</span>
            </div>
            <Typography variant="h5" className="mb-3 font-bold text-white">
              Interactive Quizzes
            </Typography>
            <Typography className="text-slate-400">
              Test your understanding after each lesson with engaging quizzes and instant feedback.
            </Typography>
          </Card>

          {/* Feature 5 */}
          <Card className="p-8 bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🔥</span>
            </div>
            <Typography variant="h5" className="mb-3 font-bold text-white">
              Streaks for Consistency
            </Typography>
            <Typography className="text-slate-400">
              Stay motivated by building daily learning streaks and tracking your progress over time.
            </Typography>
          </Card>

          {/* Feature 6 */}
          <Card className="p-8 bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🏅</span>
            </div>
            <Typography variant="h5" className="mb-3 font-bold text-white">
              Completion Badges
            </Typography>
            <Typography className="text-slate-400">
              Earn digital badges upon completing each course to showcase your achievements.
            </Typography>
          </Card>
        </div>
      </div>
    </section>
  );
}
