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

  const options = questionData.options.map((opt) => opt.trim());
  const correctLetter = questionData.correctAnswer?.trim().toUpperCase();

  let correctAnswerText = correctLetter;
  if (correctLetter.length === 1 && correctLetter >= 'A' && correctLetter <= 'Z') {
    const idx = correctLetter.charCodeAt(0) - 65;
    correctAnswerText = options[idx] || correctLetter;
  }
  correctAnswerText = correctAnswerText.toLowerCase();

  return (
    <Card className="p-6 mb-6 shadow-lg rounded-xl bg-white text-black">
      <Typography variant="h6" className="mb-4 font-semibold text-lg">
        {`${questionIndex + 1}. ${questionData.question}`}
      </Typography>

      <div className="flex flex-col gap-3">
        {options.map((opt, i) => {
          const optLower = opt.toLowerCase();
          const isSelected = optLower === selected;
          const isCorrectAnswer = optLower === correctAnswerText;
          const showGreen = isSubmitted && isCorrectAnswer;
          const showRed = isSubmitted && isSelected && !isCorrectAnswer;

          const baseClasses = `p-3 rounded-lg cursor-pointer transition-all duration-200 border`;
          const selectedClass = isSelected ? "border-blue-500 bg-blue-100" : "";
          const correctClass = showGreen ? "border-green-500 bg-green-100" : "";
          const wrongClass = showRed ? "border-red-500 bg-red-100" : "";

          return (
            <div
              key={i}
              onClick={() => !isSubmitted && handleOptionChange(questionIndex, opt)}
              className={`${baseClasses} ${selectedClass} ${correctClass} ${wrongClass}`}
            >
              <Radio
                name={`question-${questionIndex}`}
                label={
                  <span
                    className={`text-base ${
                      isCorrectAnswer && isSubmitted
                        ? "text-green-700 font-semibold"
                        : showRed
                        ? "text-red-700 font-semibold"
                        : isSelected
                        ? "text-blue-700 font-semibold"
                        : "text-gray-800"
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
              />
            </div>
          );
        })}
      </div>

      {isSubmitted && selected !== correctAnswerText && (
        <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-500">
          <Typography className="text-sm text-blue-800 font-medium">
            ✅ Correct Answer: {questionData.correctAnswer}
          </Typography>
        </div>
      )}
    </Card>
  );
};

export default QuizQuestion;
