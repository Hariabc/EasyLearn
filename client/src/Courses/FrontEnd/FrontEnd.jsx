import React from 'react';
import { Card, CardHeader, CardBody, Typography } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

const frontendTopics = [
  { name: 'HTML', color: 'bg-orange-500' },
  { name: 'CSS', color: 'bg-blue-500' },
  { name: 'JavaScript', color: 'bg-yellow-400' },
  { name: 'DOM', color: 'bg-teal-500' },
  { name: 'React', color: 'bg-cyan-500' },
  { name: 'Tailwind', color: 'bg-indigo-500' },
];


const Frontend = () => {
  const navigate = useNavigate();

  const handleClick = (topic) => {
    const topicParam = topic.toLowerCase();
    navigate(`/courses/frontend/${topicParam}`);
  };

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {frontendTopics.map(({ name, color }) => (
        <Card
          key={name}
          className="shadow-lg cursor-pointer hover:shadow-xl transition"
          onClick={() => handleClick(name)}
        >
           <CardHeader className={`${color} text-white text-center py-6`}>
            <Typography variant="h5">{name}</Typography>
          </CardHeader>
          <CardBody>
            <Typography variant="small">
              Dive into {name} concepts and hands-on practice.
            </Typography>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default Frontend;
