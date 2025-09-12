import React, { useState } from 'react';
import type { Question } from './play-game.tsx';
import { Button } from './Button.tsx';

interface QuestionDisplayProps {
  question: Question;
}

export function QuestionDisplay({ question }: QuestionDisplayProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="p-8 bg-gray-800 text-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{question.question}</h2>

      {question.image && (
        <div className="my-4">
          <img
            src={`data:image/png;base64, ${question.image}`}
            alt="Question image"
            className="max-w-full h-auto rounded-md"
          />
        </div>
      )}

      {question.choices && question.choices.length > 0 && (
        <div className="my-4 space-y-2">
          <h3 className="text-xl font-semibold">Options:</h3>
          <ul className="list-disc list-inside">
            {question.choices.map((choice, index) => (
              <li key={index} className="text-lg">{choice}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="my-6">
        <Button onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </Button>
      </div>

      {showAnswer && (
        <div className="p-4 bg-gray-700 rounded-md">
          <h3 className="text-2xl font-bold text-green-400">{question.answer}</h3>
        </div>
      )}
    </div>
  );
}
