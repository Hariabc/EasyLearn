import React from 'react';
import { Card, Typography, Radio } from '@material-tailwind/react';

const QuizQuestion = ({
  questionData,
  questionIndex,
  selectedOptions,
  handleOptionChange,
  isSubmitted,
}) => {
  const selectedRaw = selectedOptions[questionIndex];
  const selected = selectedRaw?.trim().toLowerCase();

  // Normalize options and map letter answer to actual option text
  const options = questionData.options.map((opt) => opt.trim());
  const correctLetter = questionData.correctAnswer?.trim().toUpperCase();

  let correctAnswerText = correctLetter;
  if (
    correctLetter &&
    correctLetter.length === 1 &&
    correctLetter >= 'A' &&
    correctLetter <= 'Z'
  ) {
    const idx = correctLetter.charCodeAt(0) - 65;
    correctAnswerText = options[idx] || correctLetter;
  }
  correctAnswerText = correctAnswerText.toLowerCase();

  return (
    <Card className="p-4 mb-4">
      <Typography variant="h6" className="mb-2">
        {`${questionIndex + 1}. ${questionData.question}`}
      </Typography>

      <div className="flex flex-col gap-2">
        {options.map((opt, i) => {
          const optLower = opt.toLowerCase();

          const isSelected = optLower === selected;
          const isCorrectAnswer = optLower === correctAnswerText;

          const showGreen = isSubmitted && isCorrectAnswer;
          const showRed = isSubmitted && isSelected && !isCorrectAnswer;

          return (
            <Radio
              key={i}
              name={`question-${questionIndex}`}
              label={
                <span
                  className={
                    showGreen
                      ? 'text-green-600 font-semibold'
                      : showRed
                      ? 'text-red-600 font-semibold'
                      : ''
                  }
                >
                  {opt}
                </span>
              }
              value={opt}
              checked={isSelected}
              onChange={() => handleOptionChange(questionIndex, opt)}
              disabled={isSubmitted}
              ripple={false}
              className="hover:bg-gray-100 rounded"
            />
          );
        })}
      </div>

      {isSubmitted && selected !== correctAnswerText && (
        <Typography className="mt-2 text-sm text-green-700">
          ✅ Correct Answer: {questionData.correctAnswer}
        </Typography>
      )}
    </Card>
  );
};

export default QuizQuestion;
