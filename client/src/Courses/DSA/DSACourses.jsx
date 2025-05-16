import React from 'react';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

const dsaTopics = [
  { name: 'Recursion', color: 'bg-indigo-500' },
  { name: 'Sorting', color: 'bg-teal-500' },
  { name: 'Binary Search', color: 'bg-blue-500' },
  { name: 'Graphs', color: 'bg-green-500' },
  { name: 'Trees', color: 'bg-orange-500' },
  { name: 'Linked List', color: 'bg-pink-500' },
  { name: 'Stacks & Queues', color: 'bg-purple-500' },
  { name: 'Dynamic Programming', color: 'bg-red-500' },
];

const DSACourse = () => {
  const navigate = useNavigate();

  const handleClick = (topic) => {
    // Create URL-safe topic parameter
    const topicParam = topic
      .toLowerCase()
      .replace(/ & /g, '-and-')      // Replace " & " with "-and-"
      .replace(/[^a-z0-9]+/g, '-')   // Replace non-alphanumeric with "-"
      .replace(/^-+|-+$/g, '');      // Trim leading/trailing hyphens

    navigate(`/courses/dsa/${topicParam}`);
  };

  return (
    <div className="p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50 min-h-screen">
      {dsaTopics.map(({ name, color }) => (
        <Card
          key={name}
          className="shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 ease-in-out"
          onClick={() => handleClick(name)}
        >
          <CardHeader className={`${color} text-white text-center py-6`}>

            <Typography variant="h5" className="text-white">
              {name}
            </Typography>
          </CardHeader>
          <CardBody className="text-center">
            <Typography variant="small" className="text-gray-700">
              Master {name} with step-by-step tutorials, challenges, and AI help.
            </Typography>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default DSACourse;
