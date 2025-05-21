import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Progress,
} from '@material-tailwind/react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../axios';

const FrontEndTopics = () => {
  const { languageId } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [userLanguageProgress, setUserLanguageProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, authToken } = useContext(AuthContext);

  useEffect(() => {
    if (!user || !authToken) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Fetch topics
        const topicsRes = await api.get(`/api/topics/${languageId}`);
        setTopics(topicsRes.data);

        // ✅ Fetch user progress
        const userRes = await api.get(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const userData = userRes.data;

        // ✅ Match language progress
        const course = userData.enrolledCourses.find((c) =>
          c.languages?.some((lang) =>
            typeof lang.language === 'string'
              ? lang.language === languageId
              : lang.language?._id === languageId
          )
        );

        const languageProgress = course?.languages.find((lang) =>
          typeof lang.language === 'string'
            ? lang.language === languageId
            : lang.language?._id === languageId
        );

        setUserLanguageProgress(languageProgress || null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id, authToken, languageId]);

  const handleTopicClick = (topic) => {
    const topicParam = topic.title.toLowerCase().replace(/\s+/g, '-');
    navigate(
      `/courses/frontend/${languageId}/${topicParam}?topicId=${topic._id}`
    );
  };

  if (loading)
    return (
      <div className="p-8 text-blue-500 font-medium animate-pulse">
        Loading topics...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-red-600 font-medium">Error: {error}</div>
    );

  const totalTopics = topics.length;
  const completedTopicsCount =
    userLanguageProgress?.completedTopics?.length || 0;

  return (
    <div className="p-8">
      <Typography variant="h4" className="mb-1">
        Topics
      </Typography>
      <Typography variant="small" className="text-gray-700 mb-4">
        {completedTopicsCount} of {totalTopics} topics completed
      </Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const isCompleted =
            userLanguageProgress?.completedTopics?.includes(topic._id);
          const percent = isCompleted ? 100 : 0;

          return (
            <Card
              key={topic._id}
              className="cursor-pointer hover:shadow-xl transition"
              onClick={() => handleTopicClick(topic)}
            >
              <CardBody>
                <Typography variant="h6">{topic.title}</Typography>
                <Typography variant="small">
                  Click to explore {topic.title}
                </Typography>

                <div className="mt-2">
                  <Progress
                    value={percent}
                    color={percent === 100 ? 'green' : 'blue'}
                  />
                  <Typography
                    variant="small"
                    className="text-right mt-1 text-gray-600"
                  >
                    {percent}% completed
                  </Typography>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FrontEndTopics;
