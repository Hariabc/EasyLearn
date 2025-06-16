// import React from "react";
// import { Typography, Card } from "@material-tailwind/react";

// export default function FeatureSection() {
//   return (
//     <section className="px-4 sm:px-6 lg:px-8 bg-slate-900 pb-20">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <div className="inline-block px-4 py-2 rounded-full bg-yellow-400 text-black text-sm font-medium mb-4">
//             Why Choose EasyLearn?
//           </div>
//           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
//             Features That Set Us Apart
//           </h2>
//         </div>

//         {/* Features Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {/* Feature 1 */}
//           <Card className="p-8 bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700">
//             <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
//               <span className="text-2xl">🎯</span>
//             </div>
//             <Typography variant="h5" className="mb-3 font-bold text-white">
//               Flexible Learning
//             </Typography>
//             <Typography className="text-slate-400">
//               Learn at your own pace with 24/7 access to all course materials and resources.
//             </Typography>
//           </Card>

//           {/* Feature 2 */}
//           <Card className="p-8 bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700">
//             <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
//               <span className="text-2xl">👨‍🏫</span>
//             </div>
//             <Typography variant="h5" className="mb-3 font-bold text-white">
//               Top-Quality Resources
//             </Typography>
//             <Typography className="text-slate-400">
//               Learn from top instructors and industry experts with years of hands-on experience.
//             </Typography>
//           </Card>

//           {/* Feature 3 */}
//           <Card className="p-8 bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700">
//             <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
//               <span className="text-2xl">🤝</span>
//             </div>
//             <Typography variant="h5" className="mb-3 font-bold text-white">
//               AI-Powered Doubt Solver
//             </Typography>
//             <Typography className="text-slate-400">
//               Get instant help with your questions through our intelligent AI doubt-solving system.
//             </Typography>
//           </Card>

//           {/* Feature 4 */}
//           <Card className="p-8 bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700">
//             <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
//               <span className="text-2xl">📝</span>
//             </div>
//             <Typography variant="h5" className="mb-3 font-bold text-white">
//               Interactive Quizzes
//             </Typography>
//             <Typography className="text-slate-400">
//               Test your understanding after each lesson with engaging quizzes and instant feedback.
//             </Typography>
//           </Card>

//           {/* Feature 5 */}
//           <Card className="p-8 bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700">
//             <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
//               <span className="text-2xl">🔥</span>
//             </div>
//             <Typography variant="h5" className="mb-3 font-bold text-white">
//               Streaks for Consistency
//             </Typography>
//             <Typography className="text-slate-400">
//               Stay motivated by building daily learning streaks and tracking your progress over time.
//             </Typography>
//           </Card>

//           {/* Feature 6 */}
//           <Card className="p-8 bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700">
//             <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
//               <span className="text-2xl">🏅</span>
//             </div>
//             <Typography variant="h5" className="mb-3 font-bold text-white">
//               Completion Badges
//             </Typography>
//             <Typography className="text-slate-400">
//               Earn digital badges upon completing each course to showcase your achievements.
//             </Typography>
//           </Card>
//         </div>
//       </div>
//     </section>
//   );
// }
import React from "react";
import { Typography, Card } from "@material-tailwind/react";

const features = [
  {
    icon: "📚",
    title: "Learn at Your Pace",
    desc: "Flexible learning with 24/7 access to all lessons and resources.",
  },
  {
    icon: "🧑‍🏫",
    title: "Expert Mentors",
    desc: "Top instructors with real-world experience to guide you.",
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
  return (
    <section className="bg-slate-900 py-20 px-6 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium bg-blue-500 text-white px-4 py-1 rounded-full tracking-wide">
            Why EasyLearn?
          </span>
          <h2 className="mt-6 text-4xl font-bold text-white">
            Powerful Features to Boost Your Learning
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Everything you need to upskill efficiently — built with care, clarity, and simplicity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white text-xl mb-4">
                {feature.icon}
              </div>
              <Typography variant="h6" className="text-white font-semibold mb-2">
                {feature.title}
              </Typography>
              <Typography className="text-slate-400 text-sm leading-relaxed">
                {feature.desc}
              </Typography>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
