import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Progress,
} from '@material-tailwind/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../axios';

// You can use a language icon library or fallback to emojis
const languageAvatars = {
  JavaScript: "🟨",
  Python: "🐍",
  HTML: "🌐",
  CSS: "🎨",
  Java: "☕",
  // Add more mappings as needed
};

const Frontend = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('id');

  const [languages, setLanguages] = useState([]);
  const [userCourseProgress, setUserCourseProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, authToken } = useContext(AuthContext);

  // Fetch languages for the course
  const fetchLanguages = async () => {
    const res = await api.get(`/api/languages/${courseId}`);
    return res.data;
  };

  // Fetch user data with progress
  const fetchUserProgress = async () => {
    const res = await api.get(`/api/users/${user._id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = res.data;
    const progress = data.enrolledCourses.find(
      (c) => c.course._id === courseId
    );
    return progress || null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [langs, progress] = await Promise.all([
          fetchLanguages(),
          fetchUserProgress(),
        ]);
        setLanguages(langs);
        setUserCourseProgress(progress);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && user && authToken) {
      fetchData();
    }
  }, [courseId, user, authToken]);

  const handleClick = (languageId) => {
    navigate(`/courses/frontend/${languageId}`);
  };

  if (!user) return <div>Loading user data...</div>;
  if (loading)
    return (
      <div className="p-8 text-center text-blue-400 font-semibold animate-pulse">
        Loading frontend languages...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-400 font-semibold">
        Error: {error}
      </div>
    );

  const totalLanguages = languages.length;
  const completedLanguages =
    userCourseProgress?.languages?.filter(
      (lang) => lang.isCompleted || lang.completionPercent === 100
    )?.length || 0;

  return (
    <div className="bg-slate-900 min-h-screen p-6">
      <div className="px-8 pb-2">
        <Typography variant="h3" className="mb-1 text-white font-bold">
          Languages
        </Typography>
        <Typography variant="small" className="text-gray-300">
          <span className="font-semibold text-blue-400">{completedLanguages}</span> of <span className="font-semibold text-white">{totalLanguages}</span> languages completed
        </Typography>
      </div>

      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {languages.map(({ _id, name, description }) => {
          const progressEntry = userCourseProgress?.languages?.find(
            (lang) =>
              String(lang.language?._id || lang.language) === String(_id)
          );
          // Ensure percent is always a valid number
          const percent = Number.isFinite(progressEntry?.completionPercent)
            ? progressEntry.completionPercent
            : 0;
          const isCompleted = percent === 100;

          return (
            <Card
              key={_id}
              className={`shadow-lg cursor-pointer hover:shadow-2xl transition-transform duration-200 hover:-translate-y-1 border-2 ${
                isCompleted ? "border-green-400" : "border-transparent"
              } bg-slate-800`}
              onClick={() => handleClick(_id)}
              style={{ minHeight: 230 }}
            >
              <CardHeader
                floated={false}
                className="flex flex-col items-center justify-center bg-blue-600 py-6 rounded-t-lg"
              >
                <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow mb-2 text-black">
                  {languageAvatars[name] || "📘"}
                </div>
                <Typography variant="h5" className="text-white font-bold mt-1">
                  {name}
                </Typography>
              </CardHeader>
              <CardBody>
                <Typography variant="small" className="mb-3 text-gray-400 min-h-[40px]">
                  {description || `Explore ${name} programming language tutorials and resources.`}
                </Typography>
                <div className="mt-2">
                  <Progress
                    value={percent}
                    color={isCompleted ? 'green-400' : 'blue-400'}
                    className="h-3 bg-white"
                  />
                  <Typography
                    variant="small"
                    className={`text-right mt-1 ${isCompleted ? "text-green-400 font-semibold" : "text-gray-400"}`}
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

export default Frontend;
