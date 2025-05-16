import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, Typography } from '@material-tailwind/react';

const topicMap = {
  c: ['Basics', 'Loops', 'Functions'],
  cpp: ['OOP Concepts', 'STL', 'Inheritance'],
  java: ['Classes', 'Interfaces', 'Multithreading'],
  python: ['Data Types', 'Functions', 'Libraries'],
};

const LanguageTopics = () => {
  const { language } = useParams();
  const navigate = useNavigate();
  const topics = topicMap[language] || [];

  const handleTopicClick = (topic) => {
    const topicParam = topic.toLowerCase().replace(/\s+/g, '-');
    navigate(`/courses/computerlanguages/${language}/${topicParam}`);
  };

  return (
    <div className="p-8">
      <Typography variant="h4" className="mb-6 capitalize">
        {language} Topics
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Card key={topic} className="cursor-pointer hover:shadow-xl" onClick={() => handleTopicClick(topic)}>
            <CardBody>
              <Typography variant="h6">{topic}</Typography>
              <Typography variant="small">Click to explore {topic}</Typography>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LanguageTopics;
