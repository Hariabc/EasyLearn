import React from 'react';
import { Card, CardHeader, CardBody, Typography } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

const backendTechnologies = [
  { name: 'Node.js', color: 'bg-green-500' },
  { name: 'Express.js', color: 'bg-blue-500' },
  { name: 'MongoDB', color: 'bg-amber-500' },
  { name: 'SQL', color: 'bg-teal-500' },
];


const BackEnd = () => {
  const navigate = useNavigate();

  const handleClick = (tech) => {
    const techParam = tech.toLowerCase().replace(/\./g, '').replace(/\s+/g, '');
    navigate(`/courses/backend/${techParam}`);
  };

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {backendTechnologies.map(({ name, color }) => (
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
              Explore {name} tutorials and backend development resources.
            </Typography>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default BackEnd;
