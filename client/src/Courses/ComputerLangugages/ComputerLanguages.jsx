import React, { useState, useEffect, useContext } from 'react';
import { Card, CardHeader, CardBody, Typography, Progress } from '@material-tailwind/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../axios';

const ComputerLanguages = () => {
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
    const data = await res.data;
    const progress = data.enrolledCourses.find(c => c.course._id === courseId);
    return progress || null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [langs, progress] = await Promise.all([fetchLanguages(), fetchUserProgress()]);
        setLanguages(langs);
        setUserCourseProgress(progress);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (courseId && user && authToken) {
      fetchData();
    }
  }, [courseId, user, authToken]);

  const handleClick = (languageId) => {
    navigate(`/courses/computerlanguages/${languageId}`);
  };

  const totalLanguages = languages.length;
  const completedLanguages = userCourseProgress?.languages?.filter(lang =>
    lang.isCompleted || lang.completionPercent === 100
  )?.length || 0;

  return (
    <div className="bg-slate-900 min-h-screen py-6 px-4 sm:px-10">
      <div className="mb-6">
        <Typography variant="h4" className="text-white font-bold">
          Languages
        </Typography>
        <Typography variant="small" className="text-gray-300">
          <span className="text-blue-400 font-semibold">{completedLanguages}</span> of{' '}
          <span className="text-white font-semibold">{totalLanguages}</span> languages completed
        </Typography>
      </div>

      {/* ✅ Skeleton Loader */}
      {loading ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="w-full sm:w-[47%] lg:w-[30%] animate-pulse">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
                <div className="h-6 w-1/2 bg-slate-600 rounded mb-4 mx-auto" />
                <div className="h-4 bg-slate-700 rounded w-full mb-2" />
                <div className="h-4 bg-slate-700 rounded w-5/6 mb-4" />
                <div className="h-3 bg-slate-600 rounded-full w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-400 font-semibold">Error: {error}</div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {languages.map(({ _id, name }, index) => {
            const progressEntry = userCourseProgress?.languages?.find(lang =>
              String(lang.language?._id || lang.language) === String(_id)
            );
            const percent = progressEntry?.completionPercent || 0;
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
                      Explore {name} programming language tutorials and resources.
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
      )}
    </div>
  );
};

export default ComputerLanguages;
