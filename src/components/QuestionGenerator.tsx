import React, { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface QuestionGeneratorProps {
  question: {
    id: string;
    question: string;
    options: (string | number)[];
    correctOption: string;
    explanation: string;
    quantumState?: number[];
  };
  onAnswer: (isCorrect: boolean, timeTaken: number) => void;
  onNext: () => void;
  isLoading: boolean;
}

export const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({
  question,
  onAnswer,
  onNext,
  isLoading,
}) => {
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [userInput, setUserInput] = useState<string>('');
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  useEffect(() => {
    setStartTime(Date.now());
    setUserInput('');
    setAnswered(false);
  }, [question.id]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const timeTaken = (Date.now() - startTime) / 1000;
    const input = userInput.trim().toUpperCase();
    const correct = input === question.correctOption;
    setIsCorrect(correct);
    setAnswered(true);
    onAnswer(correct, timeTaken);
  };

  if (isLoading) {
    return <div className="text-white text-center">Loading question...</div>;
  }

  return (
    <div className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm p-6 rounded-lg">
      <h2 className="text-white text-xl mb-4">{question.question}</h2>

      {/* Multiple-choice options */}
      <div className="mb-4">
        {question.options.map((opt, idx) => {
          const label = String.fromCharCode(65 + idx);
          return (
            <p key={idx} className="text-purple-200">
              <strong>{label}.</strong> {opt}
            </p>
          );
        })}
      </div>

      {/* Input & Submit */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Type A, B, C..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={answered}
          className="flex-1 p-2 rounded bg-slate-700 text-white"
        />
        <Button type="submit" disabled={answered} className="bg-purple-600">
          Submit
        </Button>
      </form>

      {/* Feedback, Explanation & Next */}
      {answered && (
        <div className="mt-4">
          {isCorrect ? (
            <p className="text-green-400 font-semibold">✅ Correct!</p>
          ) : (
            <p className="text-red-400 font-semibold">
              ❌ Incorrect. Correct answer: {question.correctOption}.
            </p>
          )}
          <Badge variant="outline" className="text-sm text-purple-200 mt-2 block">
            {question.explanation}
          </Badge>
          <Button onClick={onNext} className="mt-4 bg-blue-600">
            Next Question
          </Button>
        </div>
      )}

      {/* Quantum state bar */}
      {question.quantumState && (
        <div className="mt-6 mb-4">
          <h3 className="text-white font-medium mb-2">Quantum State:</h3>
          <div className="flex space-x-2">
            {question.quantumState.map((amp, i) => (
              <div
                key={i}
                className="flex-1 h-2 bg-purple-400"
                style={{ width: `${amp * 100}%` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
