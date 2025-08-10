import React, { useState, useEffect } from "react";
import { Typography, Card } from "@material-tailwind/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const features = [
  {
    icon: "📚",
    title: "Learn at Your Pace",
    desc: "Flexible learning with 24/7 access to all lessons and resources.",
  },
  {
    icon: "📩",
    title: "Daily Email Lessons",
    desc: "Get daily emails with topics, quizzes, and key points to boost your learning.",
  },
  {
    icon: "⚡",
    title: "AI-Powered Support",
    desc: "Get instant answers with our smart doubt solver assistant.",
  },
  {
    icon: "✅",
    title: "Interactive Quizzes",
    desc: "Reinforce your learning with bite-sized quizzes after lessons.",
  },
  {
    icon: "📈",
    title: "Track Progress",
    desc: "Visual dashboards help you stay on track with goals and streaks.",
  },
  {
    icon: "🏆",
    title: "Achievements & Badges",
    desc: "Earn certifications and shareable badges on course completion.",
  },
];

export default function FeatureSection() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Skeleton for section header
  const HeaderSkeleton = () => (
    <div className="text-center mb-16">
      <Skeleton
        width={120}
        height={32}
        className="mx-auto mb-4"
        borderRadius={16}
      />
      <Skeleton width={320} height={40} className="mx-auto mb-4" />
      <Skeleton width={260} height={20} className="mx-auto" />
    </div>
  );

  // Skeleton for feature cards
  const FeaturesGridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {[...Array(6)].map((_, idx) => (
        <Card
          key={idx}
          className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-md"
        >
          <Skeleton circle height={48} width={48} className="mb-4" />
          <Skeleton width={120} height={24} className="mb-2" />
          <Skeleton width={180} height={16} count={2} />
        </Card>
      ))}
    </div>
  );

  return (
    <section className="bg-slate-900 py-20 px-6 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {loading ? (
          <HeaderSkeleton />
        ) : (
          <div className="text-center mb-18">
            <span className="text-2xl font-medium  bg-blue-500 text-white px-4 py-2 rounded-full tracking-wide mb-9">
              Why EasyLearn?
            </span>
            <h2 className="mt-6 text-4xl font-bold text-white">
              Powerful Features to Boost Your Learning
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              Everything you need to upskill efficiently — built with care,
              clarity, and simplicity.
            </p>
          </div>
        )}

        {/* Features Grid */}
        {loading ? (
          <FeaturesGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white text-xl mb-4">
                  {feature.icon}
                </div>
                <Typography
                  variant="h6"
                  className="text-white font-semibold mb-2"
                >
                  {feature.title}
                </Typography>
                <Typography className="text-slate-400 text-sm leading-relaxed">
                  {feature.desc}
                </Typography>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
