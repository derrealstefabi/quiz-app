import React from 'react';
import type { Question } from './PlayGame.tsx';

interface QuestionDisplayProps {
  question: Question;
}

export function QuestionDisplay({ question }: QuestionDisplayProps) {
    console.log("question",question)
  return (
    <div className="w-full max-w-7xl mx-auto p-8 flex flex-col items-center text-black rounded-lg shadow-2xl bg-white/15">
      <h2 className="text-3xl font-bold">{question.question}</h2>

      {question.image && (
        <div className="my-8 h-[50vh]">
          <img
            src={question.image}
            alt="Question image"
            className="max-w-full max-h-full rounded-md"
          />
        </div>
      )}

      {question.choices && question.choices.length > 0 && (
        <div className="w-[90%] flex flex-wrap gap-2 justify-center items-center">
            {question.choices.map((choice, index) => (
              <div key={index} className={"basis-1/3 grow shrink-0 flex justify-center items-center font-bold rounded-lg px-4 py-3 text-black  bg-white/25 " +
                  "hover:bg-white/35 active:bg-white/90"}>
                  <div>{choice}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
