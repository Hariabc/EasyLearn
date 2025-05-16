import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, Typography } from '@material-tailwind/react';

const topicMap = {
  html: ['Basics', 'Forms', 'Semantic Tags'],
  css: ['Selectors', 'Flexbox', 'Grid'],
  javascript: ['Variables', 'Functions', 'ES6 Features'],
  dom: ['DOM Manipulation', 'Events', 'Traversing'],
  react: ['JSX', 'Hooks', 'Components'],
  tailwind: ['Utility Classes', 'Layouts', 'Responsive Design'],
};

const FrontEndTopics = () => {
  const { language } = useParams(); // `topic` here refers to the frontend language/tech like html, css, etc.
  const navigate = useNavigate();
  const topics = topicMap[language] || [];

  const handleTopicClick = (topic) => {
    const topicParam = topic.toLowerCase().replace(/\s+/g, '-');
    navigate(`/courses/frontend/${language}/${topicParam}`);
  };

  return (
    <div className="p-8">
      <Typography variant="h4" className="mb-6 capitalize">
        {language} Topics
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Card
            key={topic}
            className="cursor-pointer hover:shadow-xl"
            onClick={() => handleTopicClick(topic)}
          >
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

export default FrontEndTopics;
