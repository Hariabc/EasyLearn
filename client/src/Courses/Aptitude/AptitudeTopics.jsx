import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, Typography, Progress } from '@material-tailwind/react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../axios';

const AptitudeTopics = () => {
  const { languageId } = useParams();
  const navigate = useNavigate();
  const { user, authToken } = useContext(AuthContext);

  const [topics, setTopics] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !authToken) return;

    const fetchTopicsAndProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        const [topicsRes, userRes] = await Promise.all([
          api.get(`/api/topics/${languageId}`),
          api.get(`/api/users/${user._id}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        setTopics(topicsRes.data);

        const course = userRes.data.enrolledCourses.find((c) =>
          c.languages?.some((lang) =>
            typeof lang.language === 'string'
              ? lang.language === languageId
              : lang.language?._id === languageId
          )
        );

        const progress = course?.languages.find((lang) =>
          typeof lang.language === 'string'
            ? lang.language === languageId
            : lang.language?._id === languageId
        );

        setUserProgress(progress || null);
      } catch (err) {
        console.error('Error fetching aptitude topics:', err);
        setError('Unable to load aptitude topics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopicsAndProgress();
  }, [user, authToken, languageId]);

  const handleTopicClick = (topic) => {
    const topicSlug = topic.title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/courses/aptitude/${languageId}/${topicSlug}?topicId=${topic._id}`);
  };

  const totalTopics = topics.length;
  const completedCount = userProgress?.completedTopics?.length || 0;

  if (loading) {
    return (
      <div className="p-8 text-blue-400 font-medium animate-pulse">
        Loading aptitude topics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-400 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen p-8">
      <Typography variant="h4" className="text-white font-bold mb-1">
        Aptitude Topics
      </Typography>
      <Typography variant="small" className="text-gray-300 mb-6">
        Progress: <span className="text-blue-400 font-semibold">{completedCount}</span> / <span className="text-white font-semibold">{totalTopics}</span> topics completed
      </Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const isCompleted = userProgress?.completedTopics?.includes(topic._id);
          const percent = isCompleted ? 100 : 0;

          return (
            <Card
              key={topic._id}
              className="cursor-pointer hover:shadow-xl transition border border-slate-700 bg-slate-800"
              onClick={() => handleTopicClick(topic)}
            >
              <CardBody>
                <Typography variant="h6" className="text-white mb-1">
                  {topic.title}
                </Typography>
                <Typography variant="small" className="text-gray-400 mb-2">
                  Click to explore this topic
                </Typography>

                {/* ✅ Custom Progress Bar */}
                <div className="w-full bg-white h-3 rounded-full">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${percent === 100 ? "bg-blue-600" : "bg-blue-500"}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <Typography
                  variant="small"
                  className={`text-right mt-1 ${isCompleted ? 'text-blue-100 font-semibold' : 'text-gray-400'}`}
                >
                  {Math.round(percent)}% completed
                </Typography>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AptitudeTopics;
