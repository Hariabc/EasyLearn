import React from 'react';
import { Card, Typography, Radio } from '@material-tailwind/react';

const QuizQuestion = ({ questionData, questionIndex, selectedOptions, handleOptionChange , isSubmitted }) => {
  return (
    <Card className="p-4 mb-4">
      <Typography variant="h6" className="mb-2">{`${questionIndex + 1}. ${questionData.question}`}</Typography>
      <div className="flex flex-col gap-2">
        {questionData.options.map((opt, i) => {
  const isCorrect = isSubmitted && opt === questionData.correctAnswer;
  const isWrong = isSubmitted && selectedOptions[questionIndex] === opt && !isCorrect;

  return (
    <Radio
      key={i}
      name={`question-${questionIndex}`}
      label={
        <span className={`${isCorrect ? 'text-green-600' : isWrong ? 'text-red-600' : ''}`}>
          {opt}
        </span>
      }
      value={opt}
      checked={selectedOptions[questionIndex] === opt}
      onChange={() => handleOptionChange(questionIndex, opt)}
      disabled={isSubmitted}
      ripple={false}
      className="hover:bg-gray-100 rounded"
    />
  );
})}

      </div>
    </Card>
  );
};

export default QuizQuestion;
