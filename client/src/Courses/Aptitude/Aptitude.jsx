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

const Aptitude = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('id');

  const [languages, setLanguages] = useState([]);
  const [userCourseProgress, setUserCourseProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, authToken } = useContext(AuthContext);

  const fetchLanguages = async () => {
    const res = await api.get(`/api/languages/${courseId}`);
    return res.data;
  };

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
    navigate(`/courses/aptitude/${languageId}`);
  };

  if (!user) return <div>Loading user data...</div>;
  if (loading)
    return (
      <div className="p-8 text-center text-blue-400 font-semibold animate-pulse">
        Loading aptitude sections...
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
    <div className="bg-slate-900 min-h-screen py-6 px-4 sm:px-10">
      <div className="mb-6">
        <Typography variant="h4" className="text-white font-bold">
          Aptitude Topics
        </Typography>
        <Typography variant="small" className="text-gray-300">
          <span className="text-blue-400 font-semibold">{completedLanguages}</span> of{' '}
          <span className="text-white font-semibold">{totalLanguages}</span> completed
        </Typography>
      </div>

      <div className="flex flex-wrap gap-6 justify-center">
        {languages.map(({ _id, name, description }, index) => {
          const progressEntry = userCourseProgress?.languages?.find(
            (lang) => String(lang.language?._id || lang.language) === String(_id)
          );
          const percent = Number.isFinite(progressEntry?.completionPercent)
            ? progressEntry.completionPercent
            : 0;
          const isCompleted = percent === 100;

          return (
            <div
              key={_id}
              className={`w-full sm:w-[47%] lg:w-[30%] ${index >= 3 ? 'mt-4' : ''}`}
              onClick={() => handleClick(_id)}
            >
              <Card
                className={`bg-slate-800 rounded-2xl border-2 hover:shadow-2xl hover:scale-[1.03] transition-transform duration-200 cursor-pointer ${
                  isCompleted ? 'border-green-400' : 'border-slate-700'
                }`}
              >
                <CardHeader
                  floated={false}
                  shadow={false}
                  className="flex items-center justify-center bg-blue-600 py-6 rounded-t-2xl"
                >
                  <Typography className="text-white text-xl font-bold">
                    {name}
                  </Typography>
                </CardHeader>
                <CardBody className="px-5 py-4">
                  <Typography className="text-gray-300 text-sm min-h-[48px] line-clamp-2">
                    {description || `Explore ${name} aptitude questions.`}
                  </Typography>
                  <div className="mt-4">
                    <Progress
                      value={Math.round(percent)}
                      color={isCompleted ? 'green' : 'blue'}
                      className="h-3 bg-white rounded-full"
                    />
                    <Typography
                      variant="small"
                      className={`text-right mt-1 text-xs ${
                        isCompleted ? 'text-green-400 font-semibold' : 'text-gray-400'
                      }`}
                    >
                      {Math.round(percent)}% completed
                    </Typography>
                  </div>
                </CardBody>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Aptitude;
