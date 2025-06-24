
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Cpu, Zap, ArrowUp, ArrowDown } from 'lucide-react';

interface UserState {
  masteryLevel: number;
  streak: number;
  totalQuestions: number;
  correctAnswers: number;
  weakTopics: string[];
  strongTopics: string[];
}

interface ReinforcementAgentProps {
  userState: UserState;
  onStateUpdate: (newState: UserState) => void;
}

interface QState {
  action: string;
  value: number;
  confidence: number;
}

export const ReinforcementAgent: React.FC<ReinforcementAgentProps> = ({
  userState,
  onStateUpdate
}) => {
  const [currentQStates, setCurrentQStates] = useState<QState[]>([]);
  const [agentRecommendation, setAgentRecommendation] = useState<string>('');
  const [learningRate, setLearningRate] = useState(0.1);

  useEffect(() => {
    // Simulate Deep Q-Learning state evaluation
    const qStates = [
      {
        action: 'increase_difficulty',
        value: userState.correctAnswers / Math.max(userState.totalQuestions, 1) > 0.8 ? 0.9 : 0.2,
        confidence: 0.85
      },
      {
        action: 'focus_weak_topics',
        value: userState.weakTopics.length > 0 ? 0.95 : 0.1,
        confidence: 0.92
      },
      {
        action: 'maintain_level',
        value: userState.streak > 3 ? 0.7 : 0.3,
        confidence: 0.75
      },
      {
        action: 'decrease_difficulty',
        value: userState.correctAnswers / Math.max(userState.totalQuestions, 1) < 0.5 ? 0.8 : 0.1,
        confidence: 0.88
      }
    ];

    setCurrentQStates(qStates.sort((a, b) => b.value - a.value));

    // Generate recommendation based on highest Q-value
    const bestAction = qStates.reduce((best, current) => 
      current.value > best.value ? current : best
    );

    const recommendations = {
      increase_difficulty: 'Agent recommends increasing difficulty - high performance detected',
      focus_weak_topics: 'Agent suggests targeting weak areas for optimal learning',
      maintain_level: 'Agent recommends maintaining current difficulty level',
      decrease_difficulty: 'Agent suggests reducing difficulty to build confidence'
    };

    setAgentRecommendation(recommendations[bestAction.action as keyof typeof recommendations]);
  }, [userState]);

  const applyRecommendation = () => {
    const bestAction = currentQStates[0];
    let newState = { ...userState };

    switch (bestAction.action) {
      case 'increase_difficulty':
        newState.masteryLevel = Math.min(newState.masteryLevel + 1, 10);
        break;
      case 'decrease_difficulty':
        newState.masteryLevel = Math.max(newState.masteryLevel - 1, 1);
        break;
      case 'focus_weak_topics':
        // This would trigger focusing on weak topics in next question generation
        break;
      default:
        break;
    }

    onStateUpdate(newState);
  };

  return (
    <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          Deep Q-Learning Agent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Agent Status */}
        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm">Neural Network Status</span>
          </div>
          <div className="text-white text-sm">
            Learning Rate: {learningRate.toFixed(3)}
          </div>
          <div className="text-purple-300 text-xs mt-1">
            Exploration vs Exploitation: Balanced
          </div>
        </div>

        {/* Q-Values Display */}
        <div>
          <h4 className="text-blue-200 text-sm font-medium mb-2">Current Q-Values</h4>
          <div className="space-y-2">
            {currentQStates.slice(0, 3).map((qState, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-700/30 p-2 rounded">
                <span className="text-purple-200 text-xs">{qState.action.replace('_', ' ')}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-blue-400 text-blue-300 text-xs">
                    {qState.value.toFixed(2)}
                  </Badge>
                  {index === 0 && <Zap className="w-3 h-3 text-yellow-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-3 rounded-lg border border-blue-500/30">
          <div className="flex items-start gap-2 mb-2">
            <Bot className="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <span className="text-blue-400 text-sm font-medium block">Agent Recommendation</span>
              <p className="text-white text-sm">{agentRecommendation}</p>
            </div>
          </div>
          <Button 
            onClick={applyRecommendation}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs mt-2"
          >
            Apply Recommendation
          </Button>
        </div>

        {/* TEBD Information */}
        <div className="bg-slate-700/30 p-3 rounded-lg border border-purple-500/20">
          <h4 className="text-purple-300 text-sm font-medium mb-1">TEBD Algorithm</h4>
          <p className="text-purple-200 text-xs leading-relaxed">
            Time-Evolving Block Decimation optimizes question selection through quantum state evolution,
            maintaining entanglement while minimizing computational complexity.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
