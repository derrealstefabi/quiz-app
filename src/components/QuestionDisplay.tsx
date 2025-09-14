import React from 'react';
import type { Question } from './play-game.tsx';

interface QuestionDisplayProps {
  question: Question;
}

export function QuestionDisplay({ question }: QuestionDisplayProps) {
  return (
    <div className="p-4 bg-white/15 rounded-lg shadow-xl text-white max-w-4xl w-full mx-auto flex flex-col" style={{maxHeight: '90vh'}}>
      {question.image && (
        <div className="my-2 flex-shrink-0">
          <img
            src={`data:image/png;base64, ${question.image}`}
            alt="Question image"
            className="max-w-full h-auto rounded-md mx-auto"
            style={{maxHeight: '40vh'}}
          />
        </div>
      )}

      <h2 className="text-2xl font-bold my-2 text-center flex-shrink-0">{question.question}</h2>

      {question.choices && question.choices.length > 0 && (
        <div className="my-2 grid grid-cols-2 gap-4 flex-grow">
          {question.choices.map((choice, index) => (
            <div key={index} className="p-2 bg-white/10 rounded-lg text-lg hover:bg-white/20 cursor-pointer flex items-center justify-center text-center">
              <span>{choice}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
