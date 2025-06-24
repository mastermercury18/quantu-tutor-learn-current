import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Brain, Zap } from 'lucide-react';

interface UserState {
  masteryLevel: number;
  streak: number;
  totalQuestions: number;
  correctAnswers: number;
  weakTopics: string[];
  strongTopics: string[];
}

interface MasteryTrackerProps {
  userState: UserState;
}

export const MasteryTracker: React.FC<MasteryTrackerProps> = ({ userState }) => {
  const masteryProgress = (userState.masteryLevel / 10) * 100;
  const accuracy = userState.totalQuestions > 0 ? 
    (userState.correctAnswers / userState.totalQuestions) * 100 : 0;

  return (
    <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          Mastery Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Mastery */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-200 text-sm">Overall Mastery</span>
            <span className="text-white font-medium">{userState.masteryLevel}/10</span>
          </div>
          <Progress value={masteryProgress} className="h-2" />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs">Accuracy</span>
            </div>
            <div className="text-white font-bold">{Math.round(accuracy)}%</div>
          </div>
          
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-xs">Streak</span>
            </div>
            <div className="text-white font-bold">{userState.streak}</div>
          </div>
        </div>

        {/* Topic Analysis */}
        <div>
          <h4 className="text-purple-200 text-sm font-medium mb-2">Quantum Topic States</h4>
          
          {userState.strongTopics.length > 0 && (
            <div className="mb-3">
              <span className="text-green-400 text-xs block mb-1">Strong Coherence</span>
              <div className="flex flex-wrap gap-1">
                {userState.strongTopics.map((topic, index) => (
                  <Badge key={index} variant="outline" className="border-green-400 text-green-300 text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {userState.weakTopics.length > 0 && (
            <div>
              <span className="text-orange-400 text-xs block mb-1">Needs Reinforcement</span>
              <div className="flex flex-wrap gap-1">
                {userState.weakTopics.map((topic, index) => (
                  <Badge key={index} variant="outline" className="border-orange-400 text-orange-300 text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Learning Velocity */}
        <div className="bg-slate-700/30 p-3 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm">Learning Velocity</span>
          </div>
          <div className="text-white text-lg font-bold">
            {userState.totalQuestions > 0 ? 
              `${(userState.correctAnswers / userState.totalQuestions * 100).toFixed(1)}%` : 
              'Initializing...'
            }
          </div>
          <p className="text-purple-300 text-xs mt-1">
            Quantum entanglement with knowledge graph
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
