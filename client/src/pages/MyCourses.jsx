import React, { useContext , useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../axios';

const MyCourses = () => {
  const { user , authToken} = useContext(AuthContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

//   const enrolledCourses = [
//     { name: "DSA", progress: 60 },
//     { name: "Frontend", progress: 45 },
//     { name: "Backend", progress: 80 },
//   ];


useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await api.gey(`/api/users/enrolled-courses/${user._id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
        const data = await response.json();
        
        console.log(data);
        setEnrolledCourses(data);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };

    if (user) fetchEnrolledCourses();
  }, [user]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Enrolled Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course, index) => (
          <div key={index} className="border p-4 rounded shadow hover:shadow-lg">
            <h3 className="text-lg font-bold mb-2">{course.title}</h3>
            <p className="text-sm text-gray-600 mb-2">Progress</p>
            <div className="relative flex justify-center">
              <svg width="80" height="80" className="transform rotate-90">
                <circle cx="40" cy="40" r="35" stroke="#e0e0e0" strokeWidth="8" fill="none" />
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="#4CAF50"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="220"
                  strokeDashoffset={(220 * (100 - course.progress)) / 100}
                  className="transition-all duration-300 ease-out"
                />
              </svg>
              <div className="absolute text-xl font-semibold text-gray-800">{course.progress}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
