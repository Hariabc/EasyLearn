import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import api from "../axios";

const BadgeCard = ({ badge }) => (
  <motion.div
    className="bg-white shadow-md rounded-xl p-4 flex items-center space-x-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.5 }}
  >
    <img src={badge.iconUrl} alt={badge.name} className="w-12 h-12 rounded-full" />
    <div>
      <h3 className="text-lg font-bold">{badge.name}</h3>
      <p className="text-sm text-gray-600">{badge.description}</p>
    </div>
  </motion.div>
);

const BadgeComponent = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = React.useContext(AuthContext);

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

        // API returns badges as an array of badge objects directly
        setBadges(res.data.badges || []);
      } catch (err) {
        setError("Failed to fetch badges.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [authToken]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Badges</h1>

      {loading && <p>Loading badges...</p>}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && badges.length === 0 && <p>No badges earned yet.</p>}

      {!loading && !error && badges.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {badges.map(badge => (
              <BadgeCard key={badge._id} badge={badge} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BadgeComponent;
