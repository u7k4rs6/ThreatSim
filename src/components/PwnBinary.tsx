import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Shield, Key, FileCode, Puzzle, GanttChartSquare, Lock, Timer, Star, Clock, Trophy, Lightbulb
} from 'lucide-react';

// Import individual challenges
import SimpleOverflow from './challenges/pwn_binary/SimpleOverflow';

interface Challenge {
  id: string;
  title: string;
  description: string;
  technique: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  completed: boolean;
  flagFormat: string;
  tools: string[];
}

const PwnBinary: React.FC = () => {
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [userFlags, setUserFlags] = useState<Record<string, string>>({});

  const challenges: Challenge[] = [
    {
      id: 'simple-overflow',
      title: 'Simple Overflow',
      description: 'Buffer overflow in a C binary',
      technique: 'Stack smashing',
      difficulty: 'Easy',
      icon: AlertTriangle,
      component: SimpleOverflow,
      completed: false,
      flagFormat: 'flag{stack_smashing_fun}',
      tools: ['gdb', 'pwntools', 'radare2']
    },
    // ... other challenges
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 border-green-400';
      case 'Medium': return 'text-yellow-400 border-yellow-400';
      case 'Hard': return 'text-red-400 border-red-400';
      case 'Expert': return 'text-purple-400 border-purple-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const handleChallengeComplete = (challengeId: string, flag: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && flag === challenge.flagFormat) {
      setUserProgress(prev => ({ ...prev, [challengeId]: true }));
      setUserFlags(prev => ({ ...prev, [challengeId]: flag }));
    }
  };

  const completedCount = Object.values(userProgress).filter(Boolean).length;
  const totalChallenges = challenges.length;

  if (activeChallenge) {
    const challenge = challenges.find(c => c.id === activeChallenge);
    if (challenge) {
      const ChallengeComponent = challenge.component;
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <button
                onClick={() => setActiveChallenge(null)}
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                ← Back to Pwn / Binary Exploitation
              </button>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <challenge.icon className="w-8 h-8 text-red-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">{challenge.title}</h1>
                  <p className="text-gray-400">{challenge.description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <span className={`px-3 py-1 rounded border ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className="px-3 py-1 rounded border border-red-400 text-red-400">
                  {challenge.technique}
                </span>
                <span className="text-gray-400">
                  Tools: {challenge.tools.join(', ')}
                </span>
              </div>
            </div>

            <ChallengeComponent
              onComplete={(flag: string) => handleChallengeComplete(challenge.id, flag)}
              isCompleted={userProgress[challenge.id]}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-12 h-12 text-red-400" />
            <h1 className="text-4xl font-bold text-white">Pwn / Binary Exploitation</h1>
          </div>
          <p className="text-xl text-gray-400 mb-6">
            Exploit memory corruption vulnerabilities and pwn binaries.
          </p>
          
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white">{completedCount}/{totalChallenges} Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-red-400" />
              <span className="text-white">
                {Math.round((completedCount / totalChallenges) * 100)}% Progress
              </span>
            </div>
          </div>

          <div className="max-w-md mx-auto bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / totalChallenges) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`bg-gray-800/50 border rounded-lg p-6 cursor-pointer transition-all hover:scale-105 ${
                userProgress[challenge.id] 
                  ? 'border-green-500 bg-green-900/20' 
                  : 'border-gray-700 hover:border-red-500'
              }`}
              onClick={() => setActiveChallenge(challenge.id)}
            >
              <div className="flex items-center gap-3 mb-4">
                <challenge.icon className={`w-8 h-8 ${userProgress[challenge.id] ? 'text-green-400' : 'text-red-400'}`} />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                  {userProgress[challenge.id] && (
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <Trophy className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className="text-xs px-2 py-1 rounded border border-red-400 text-red-400">
                  {challenge.technique}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" />
                  <span>Flag Format</span>
                </div>
                <span className="font-mono text-xs">flag{'{...}'}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Memory corruption is not a bug, it's a feature.</p>
        </div>
      </div>
    </div>
  );
};

export default PwnBinary;

