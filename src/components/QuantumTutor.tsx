import React, { useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Target, TrendingUp } from 'lucide-react';
import { QuestionGenerator } from './QuestionGenerator';
import { generateTEBDQuestion, model } from '@/utils/questionUtils';
import { updateState } from '@/utils/reinforcementUtils';

interface UserState {
  masteryLevel: number;
  streak: number;
  totalQuestions: number;
  correctAnswers: number;
  weakTopics: string[];
  strongTopics: string[];
}

const QuantumTutor: React.FC = () => {
  const [userState, setUserState] = useState<UserState>({
    masteryLevel: 1,
    streak: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    weakTopics: [],
    strongTopics: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  const generateNewQuestion = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      (async () => {
        const q = await generateTEBDQuestion(userState);
        setCurrentQuestion(q);
        setIsLoading(false);
      })();
    }, 1000);
  }, [userState]);

  const handleAnswer = (isCorrect: boolean, timeTaken: number) => {
    if (!currentQuestion) return;

    // immediate UI update
    const nextUserState: UserState = {
      masteryLevel: userState.correctAnswers + (isCorrect ? 1 : 0),
      streak: isCorrect ? userState.streak + 1 : 0,
      totalQuestions: userState.totalQuestions + 1,
      correctAnswers: userState.correctAnswers + (isCorrect ? 1 : 0),
      weakTopics: userState.weakTopics,
      strongTopics: userState.strongTopics,
    };
    setUserState(nextUserState);

    // asynchronous RL update
    updateState(
      model,
      userState,
      isCorrect,
      timeTaken,
      currentQuestion.topicIndex,
      nextUserState
    ).catch(console.error);
  };

  const startSession = () => {
    setSessionActive(true);
    generateNewQuestion();
  };

  const accuracy =
    userState.totalQuestions > 0
      ? Math.round((userState.correctAnswers / userState.totalQuestions) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {!sessionActive ? (
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-center">
                Ready to Start Learning?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-purple-200 mb-6">
                Our quantum-inspired AI will adapt to your learning style using
                reinforcement learning.
              </p>
              <Button
                onClick={startSession}
                className="bg-gradient-to-r from-purple-600 to-blue-700 text-white px-8 py-3 text-lg"
              >
                Begin Adaptive Session
              </Button>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="text-center text-white text-xl mt-10">
            Generating question...
          </div>
        ) : currentQuestion ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <QuestionGenerator
                question={currentQuestion}
                onAnswer={handleAnswer}
                onNext={generateNewQuestion}
                isLoading={isLoading}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="w-5 h-5 text-green-400" /> Mastery Level
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-white">
                    {userState.masteryLevel}
                  </div>
                  <Progress value={userState.masteryLevel * 10} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-medium">Accuracy</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {accuracy}%
                  </div>
                  <Progress value={accuracy} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">Streak</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {userState.streak}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 font-medium">Questions</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {userState.totalQuestions}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QuantumTutor;
