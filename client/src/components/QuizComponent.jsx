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
    <Card className="p-6 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-xl">
      <Typography variant="h6" className="mb-4 text-gray-800 font-semibold">
        {`${questionIndex + 1}. ${questionData.question}`}
      </Typography>

      <div className="flex flex-col gap-3">
        {options.map((opt, i) => {
          const optLower = opt.toLowerCase();
          const isSelected = optLower === selected;
          const isCorrectAnswer = optLower === correctAnswerText;
          const showGreen = isSubmitted && isCorrectAnswer;
          const showRed = isSubmitted && isSelected && !isCorrectAnswer;

          return (
            <div
              key={i}
              onClick={() => !isSubmitted && handleOptionChange(questionIndex, opt)}
              className={`p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                isSelected ? 'bg-green-50 border-2 border-green-500' : 'hover:bg-gray-50'
              } ${
                showGreen
                  ? 'bg-green-50 border-2 border-green-500'
                  : showRed
                  ? 'bg-red-50 border-2 border-red-500'
                  : 'border border-gray-200'
              }`}
            >
              <Radio
                name={`question-${questionIndex}`}
                label={
                  <span
                    className={`text-base ${
                      isSelected
                        ? 'text-green-700 font-semibold'
                        : showGreen
                        ? 'text-green-700 font-semibold'
                        : showRed
                        ? 'text-red-700 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    {opt}
                  </span>
                }
                value={opt}
                checked={isSelected}
                onChange={() => handleOptionChange(questionIndex, opt)}
                disabled={isSubmitted}
                ripple={false}
                className="hover:bg-transparent"
                containerProps={{
                  className: "hover:bg-transparent",
                }}
                color="green"
              />
            </div>
          );
        })}
      </div>

      {isSubmitted && selected !== correctAnswerText && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <Typography className="text-sm text-green-700 font-medium flex items-center gap-2">
            <span className="text-lg">✅</span> Correct Answer: {questionData.correctAnswer}
          </Typography>
        </div>
      )}
    </Card>
  );
};

export default QuizQuestion;
