import React from 'react';
import { Card, CardHeader, CardBody, Typography } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

const aptitudeCategories = [
  { name: 'Quantitative', color: 'bg-blue-500' },
  { name: 'Logical Reasoning', color: 'bg-green-500' },
  { name: 'Verbal Ability', color: 'bg-red-500' },
  { name: 'Data Interpretation', color: 'bg-purple-500' },
];


const Aptitude = () => {
  const navigate = useNavigate();

  const handleClick = (category) => {
    const categoryParam = category.toLowerCase().replace(/\s+/g, '-');
    navigate(`/courses/aptitude/${categoryParam}`);
  };

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {aptitudeCategories.map(({ name, color }) => (
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
              Practice {name} questions and boost your problem-solving skills.
            </Typography>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default Aptitude;
