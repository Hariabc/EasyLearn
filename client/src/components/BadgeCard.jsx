import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import api from "../axios";

const BadgeCard = ({ badge, awardedAt }) => {
  const formattedDate = awardedAt ? new Date(awardedAt).toLocaleDateString() : "Unknown";

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md border border-white/20 shadow-md rounded-2xl p-5 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4 }}
    >
      <img
        src={badge.iconUrl}
        alt={badge.name}
        className="w-16 h-16 mb-4 rounded-full border border-white/40 shadow-lg"
      />
      <h3 className="text-lg font-semibold text-white">{badge.name}</h3>
      <p className="text-sm text-gray-300 mt-1">{badge.description}</p>
      <p className="text-xs text-gray-400 mt-2">🏅 Earned on: {formattedDate}</p>
    </motion.div>
  );
};

const BadgeComponent = () => {
  const [languageBadges, setLanguageBadges] = useState([]);
  const [courseBadges, setCourseBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchBadges = async () => {
      if (!authToken) {
        setError("You must be logged in to view badges.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/api/users/me/badges", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const badges = res.data.badges || [];

        // Separate into course and language badges
        const lang = [];
        const course = [];

        badges.forEach(entry => {
          if (entry?.badge?.type === "language") lang.push(entry);
          else if (entry?.badge?.type === "course") course.push(entry);
        });

        setLanguageBadges(lang);
        setCourseBadges(course);
      } catch (err) {
        setError("Failed to fetch badges.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [authToken]);

  const renderBadgeGrid = (badgeList) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {badgeList.map((entry, index) =>
          entry.badge ? (
            <BadgeCard
              key={entry.badge._id || index}
              badge={entry.badge}
              awardedAt={entry.awardedAt}
            />
          ) : null
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <h1 className="text-3xl font-bold mb-6 text-white">🏆 My Badges</h1>

      {loading && (
        <div className="text-blue-400 animate-pulse text-lg">Loading badges...</div>
      )}

      {error && <p className="text-red-400 font-medium">{error}</p>}

      {!loading && !error && languageBadges.length === 0 && courseBadges.length === 0 && (
        <p className="text-gray-400 italic">No badges earned yet. Start learning to collect them!</p>
      )}

      {/* 🎯 Course Badges */}
      {!loading && !error && courseBadges.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4">📘 Course Completion Badges</h2>
          {renderBadgeGrid(courseBadges)}
        </section>
      )}

      {/* 🧠 Language Badges */}
      {!loading && !error && languageBadges.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">🔤 Language Completion Badges</h2>
          {renderBadgeGrid(languageBadges)}
        </section>
      )}
    </div>
  );
};

export default BadgeComponent;
