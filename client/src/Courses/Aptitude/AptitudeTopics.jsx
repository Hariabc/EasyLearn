import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, Typography } from '@material-tailwind/react';

const topicMap = {
  quantitative: ['Percentages', 'Profit and Loss', 'Time and Work', 'Averages'],
  'logical-reasoning': ['Series', 'Coding-Decoding', 'Blood Relations'],
  'verbal-ability': ['Reading Comprehension', 'Synonyms', 'Antonyms'],
  'data-interpretation': ['Pie Charts', 'Bar Graphs', 'Tables'],
};

const AptitudeTopics = () => {
  const { language } = useParams();
  const navigate = useNavigate();
  const topics = topicMap[language] || [];

  const handleTopicClick = (topic) => {
    const topicParam = topic.toLowerCase().replace(/\s+/g, '-');
    navigate(`/courses/aptitude/${language}/${topicParam}`);
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

export default AptitudeTopics;
