import React from 'react';
import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

const languages = [
  { name: 'C', color: 'blue' },
  { name: 'C++', color: 'green' },
  { name: 'Java', color: 'red' },
  { name: 'Python', color: 'purple' }
];

const ComputerLanguages = () => {
  const navigate = useNavigate();

  const handleClick = (language) => {
    const langParam = language.toLowerCase().replace(/\+\+/, 'pp');
    navigate(`/courses/computerlanguages/${langParam}`);
  };

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {languages.map(({ name, color }) => (
        <Card key={name} className="shadow-lg cursor-pointer hover:shadow-xl transition" onClick={() => handleClick(name)}>
          <CardHeader color={color} className="text-white text-center py-6">
            <Typography variant="h5">{name}</Typography>
          </CardHeader>
          <CardBody>
            <Typography variant="small">Explore {name} programming language tutorials and resources.</Typography>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default ComputerLanguages;
