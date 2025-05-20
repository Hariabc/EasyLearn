import React, { useState, useEffect, useContext } from 'react';
import { Card, CardHeader, CardBody, Typography, Progress } from '@material-tailwind/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

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
    const res = await fetch(`http://localhost:5000/api/languages/${courseId}`);
    if (!res.ok) throw new Error('Failed to fetch languages');
    return await res.json();
  };

  // Fetch user data with progress
  const fetchUserProgress = async () => {
    const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch user progress');
    const data = await res.json();
    // Find progress for the current course by matching course._id with courseId
    const progress = data.enrolledCourses.find(c => c.course._id === courseId);
    return progress || null;
  };

  // Combined fetch on mount and when courseId/user changes
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
    navigate(`/courses/frontend/${languageId}`);
  };

  if (loading) return <div>Loading frontend languages...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalLanguages = languages.length;
  // Calculate completed languages considering isCompleted flag or completionPercent
  const completedLanguages = userCourseProgress?.languages?.filter(lang =>
    lang.isCompleted || lang.completionPercent === 100
  )?.length || 0;

  return (
    <>
      <div className="px-8 pb-2">
        <Typography variant="h4" className="mb-1">Languages</Typography>
        <Typography variant="small" className="text-gray-700">
          {completedLanguages} of {totalLanguages} languages completed
        </Typography>
      </div>

      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {languages.map(({ _id, name }) => {
          // Handle language ID comparison for string or object form
          const progressEntry = userCourseProgress?.languages?.find(lang =>
            String(lang.language?._id || lang.language) === String(_id)
          );
          const percent = progressEntry?.completionPercent || 0;

          return (
            <Card
              key={_id}
              className="shadow-lg cursor-pointer hover:shadow-xl transition"
              onClick={() => handleClick(_id)}
            >
              <CardHeader color="blue" className="text-white text-center py-6">
                <Typography variant="h5">{name}</Typography>
              </CardHeader>
              <CardBody>
                <Typography variant="small" className="mb-2">
                  Explore {name} programming language tutorials and resources.
                </Typography>
                <div className="mt-2">
                  <Progress value={percent} color={percent === 100 ? "green" : "blue"} />
                  <Typography variant="small" className="text-right mt-1 text-gray-600">
                    {percent}% completed
                  </Typography>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default Frontend;
