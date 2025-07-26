import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Target,
  Clock,
  Trophy,
  Zap,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Award,
  TrendingUp,
  AlertTriangle,
  Shield,
  Activity,
  Eye
} from 'lucide-react';
import { generateChallenges, validateAnswer } from '../services/GeminiApiService';

interface Challenge {
  id: string;
  title: string;
  description: string;
  instruction: string;
  timeLimit: number;
  difficulty: 'Easy' | 'Medium' | 'Expert';
  threatType: string;
  pattern: {
    description: string;
    indicators: string[];
    correctAnswer: string;
  };
  points: number;
  hints: string[];
}

interface GameStats {
  totalScore: number;
  correctAnswers: number;
  totalAttempts: number;
  streak: number;
  bestStreak: number;
  averageTime: number;
}

const fetchChallenges = async (): Promise<Challenge[]> => {
  try {
    // Use the Gemini API service to generate new challenges
    const generatedChallenges = await generateChallenges(5); // Generate 5 new challenges
    return generatedChallenges || [];
  } catch (error) {
    console.error('Error generating challenges with Gemini API:', error);
    return [];
  }
};

// Fallback static challenges in case API fails
const fallbackChallenges: Challenge[] = [
  {
    id: 'ddos-basic',
    title: '🌊 DDoS Attack Detection',
    description: 'Identify suspicious traffic spikes that indicate a Distributed Denial of Service attack.',
    instruction: 'Look for unusually high traffic volume with repetitive patterns.',
    timeLimit: 45,
    difficulty: 'Easy',
    threatType: 'DDoS',
    pattern: {
      description: 'Sudden spike in traffic from multiple sources targeting a single endpoint.',
      indicators: ['High bandwidth usage', 'Repetitive requests', 'Multiple source IPs'],
      correctAnswer: 'DDoS'
    },
    points: 100,
    hints: [
      'Look for sudden traffic increases',
      'Check for repetitive patterns',
      'Multiple sources, single target'
    ]
  },
  {
    id: 'malware-c2',
    title: '🕸️ Malware C2 Communication',
    description: 'Detect Command and Control server communication patterns.',
    instruction: 'Find regular, small data transfers to external IPs during off-hours.',
    timeLimit: 60,
    difficulty: 'Medium',
    threatType: 'Malware',
    pattern: {
      description: 'Regular beaconing to external servers with encrypted payloads.',
      indicators: ['Regular intervals', 'External IPs', 'Encrypted traffic'],
      correctAnswer: 'Malware C2'
    },
    points: 150,
    hints: [
      'Check traffic timing patterns',
      'Look for external communications',
      'Notice encryption indicators'
    ]
  },
  {
    id: 'data-exfiltration',
    title: '📤 Data Exfiltration',
    description: 'Identify unusual outbound data transfers that may indicate data theft.',
    instruction: 'Look for large, unusual outbound transfers to suspicious destinations.',
    timeLimit: 50,
    difficulty: 'Medium',
    threatType: 'Data Exfiltration',
    pattern: {
      description: 'Large outbound data transfers to unusual destinations.',
      indicators: ['Large data volumes', 'Unusual destinations', 'Off-hours activity'],
      correctAnswer: 'Data Exfiltration'
    },
    points: 175,
    hints: [
      'Monitor outbound traffic',
      'Check data volume sizes',
      'Verify destination legitimacy'
    ]
  },
  {
    id: 'port-scan',
    title: '🔍 Port Scanning Activity',
    description: 'Detect reconnaissance activities through port scanning patterns.',
    instruction: 'Find sequential connection attempts across multiple ports.',
    timeLimit: 40,
    difficulty: 'Easy',
    threatType: 'Port Scan',
    pattern: {
      description: 'Sequential connection attempts across multiple ports from single source.',
      indicators: ['Multiple port attempts', 'Sequential patterns', 'Connection failures'],
      correctAnswer: 'Port Scan'
    },
    points: 125,
    hints: [
      'Look for multiple port attempts',
      'Check for sequential patterns',
      'Notice failed connections'
    ]
  },
  {
    id: 'brute-force',
    title: '🔨 Brute Force Attack',
    description: 'Identify repeated authentication attempts indicating password attacks.',
    instruction: 'Find multiple failed login attempts from same source.',
    timeLimit: 35,
    difficulty: 'Expert',
    threatType: 'Brute Force',
    pattern: {
      description: 'Repeated authentication failures from single source IP.',
      indicators: ['Multiple login failures', 'Same source IP', 'Short time intervals'],
      correctAnswer: 'Brute Force'
    },
    points: 200,
    hints: [
      'Monitor authentication logs',
      'Check failure frequencies',
      'Identify source patterns'
    ]
  }
];

const ThreatHuntingChallenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalScore: 0,
    correctAnswers: 0,
    totalAttempts: 0,
    streak: 0,
    bestStreak: 0,
    averageTime: 0
  });
  const [startTime, setStartTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load challenges on component mount
  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const fetchedChallenges = await fetchChallenges();
        if (fetchedChallenges.length > 0) {
          setChallenges(fetchedChallenges);
        } else {
          // Fallback to static challenges if API fails
          setChallenges(fallbackChallenges);
        }
      } catch (error) {
        console.error('Error loading challenges:', error);
        setChallenges(fallbackChallenges);
      } finally {
        setLoadingChallenges(false);
      }
    };

    loadChallenges();
  }, []);

  const currentChallenge = challenges[currentChallengeIndex];

  // Timer effect
  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            handleTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeLeft]);

  const startChallenge = () => {
    setTimeLeft(currentChallenge.timeLimit);
    setIsActive(true);
    setIsPaused(false);
    setUserAnswer('');
    setShowFeedback(false);
    setShowHints(false);
    setHintIndex(0);
    setStartTime(Date.now());
  };

  const pauseChallenge = () => {
    setIsPaused(!isPaused);
  };

  const handleTimeUp = () => {
    setIsActive(false);
    setShowFeedback(true);
    setIsCorrect(false);
    updateStats(false, currentChallenge.timeLimit);
  };

  const submitAnswer = async () => {
    if (!isActive || userAnswer.trim() === '') return;

    const timeTaken = currentChallenge.timeLimit - timeLeft;
    
    setIsActive(false);
    
    try {
      // Try to validate with Gemini API first
      const apiValidation = await validateAnswer(currentChallenge, userAnswer);
      const correct = apiValidation.isCorrect;
      
      setIsCorrect(correct);
      setShowFeedback(true);
      updateStats(correct, timeTaken);
      
      // You can optionally show additional feedback from API
      if (apiValidation.feedback) {
        console.log('API Feedback:', apiValidation.feedback);
      }
    } catch (error) {
      console.error('Error validating answer with API:', error);
      
      // Fallback to local validation if API fails
      const correct = userAnswer.toLowerCase().includes(currentChallenge.pattern.correctAnswer.toLowerCase());
      
      setIsCorrect(correct);
      setShowFeedback(true);
      updateStats(correct, timeTaken);
    }
  };

  const updateStats = (correct: boolean, timeTaken: number) => {
    setGameStats(prev => {
      const newStreak = correct ? prev.streak + 1 : 0;
      const newBestStreak = Math.max(prev.bestStreak, newStreak);
      const newTotalAttempts = prev.totalAttempts + 1;
      const newCorrectAnswers = correct ? prev.correctAnswers + 1 : prev.correctAnswers;
      const newTotalScore = correct ? prev.totalScore + currentChallenge.points : prev.totalScore;
      const newAverageTime = (prev.averageTime * prev.totalAttempts + timeTaken) / newTotalAttempts;

      return {
        totalScore: newTotalScore,
        correctAnswers: newCorrectAnswers,
        totalAttempts: newTotalAttempts,
        streak: newStreak,
        bestStreak: newBestStreak,
        averageTime: Math.round(newAverageTime)
      };
    });
  };

  const nextChallenge = () => {
    setCurrentChallengeIndex((prev) => (prev + 1) % challenges.length);
    setShowFeedback(false);
    setUserAnswer('');
    setTimeLeft(0);
    setIsActive(false);
  };

  const resetChallenge = () => {
    setUserAnswer('');
    setShowFeedback(false);
    setTimeLeft(0);
    setIsActive(false);
    setIsPaused(false);
    setShowHints(false);
    setHintIndex(0);
  };

  const getNextHint = () => {
    if (hintIndex < currentChallenge.hints.length - 1) {
      setHintIndex(prev => prev + 1);
    }
    setShowHints(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Easy': 'text-green-400 bg-green-400/20',
      'Medium': 'text-yellow-400 bg-yellow-400/20',
      'Expert': 'text-red-400 bg-red-400/20'
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-400 bg-gray-400/20';
  };

  const getThreatIcon = (threatType: string) => {
    const icons = {
      'DDoS': Activity,
      'Malware': AlertTriangle,
      'Data Exfiltration': TrendingUp,
      'Port Scan': Eye,
      'Brute Force': Shield
    };
    const IconComponent = icons[threatType as keyof typeof icons] || Target;
    return <IconComponent className="w-5 h-5" />;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / currentChallenge.timeLimit) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

if (loadingChallenges) {
    return <div className="text-center text-white">Loading Challenges...</div>;
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-orange-400" />
          <h3 className="text-xl font-semibold text-white">Threat Hunting Challenges</h3>
          <span className="text-sm text-gray-400">Sharpen your detection skills</span>
        </div>
        
        {/* Game Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-cyan-400">
            <Trophy className="w-4 h-4" />
            <span>{gameStats.totalScore}</span>
          </div>
          <div className="flex items-center gap-1 text-green-400">
            <Zap className="w-4 h-4" />
            <span>{gameStats.streak}</span>
          </div>
          <div className="text-gray-400">
            {gameStats.correctAnswers}/{gameStats.totalAttempts}
          </div>
        </div>
      </div>

      {/* Challenge Card */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-600/50 p-6 mb-6">
        {/* Challenge Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              {getThreatIcon(currentChallenge.threatType)}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">
                {currentChallenge.title}
              </h4>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentChallenge.difficulty)}`}>
                  {currentChallenge.difficulty}
                </span>
                <span className="text-gray-400 text-sm">
                  {currentChallenge.points} points
                </span>
              </div>
            </div>
          </div>
          
          {/* Timer */}
          <div className="text-right">
            <div className={`text-2xl font-mono font-bold ${getTimeColor()}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-gray-400">Time Remaining</div>
          </div>
        </div>

        {/* Challenge Description */}
        <div className="mb-4">
          <p className="text-gray-300 mb-2">{currentChallenge.description}</p>
          <p className="text-cyan-400 text-sm font-medium">
            📋 {currentChallenge.instruction}
          </p>
        </div>

        {/* Pattern Indicators */}
        <div className="mb-4">
          <h5 className="text-white font-medium mb-2">🔍 Look for these indicators:</h5>
          <div className="flex flex-wrap gap-2">
            {currentChallenge.pattern.indicators.map((indicator, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700/50 border border-gray-600 rounded-full text-sm text-gray-300"
              >
                {indicator}
              </span>
            ))}
          </div>
        </div>

        {/* Answer Input */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2">
            What type of threat do you detect?
          </label>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
            disabled={!isActive || showFeedback}
            placeholder="Enter threat type (e.g., DDoS, Malware, etc.)"
            className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:opacity-50"
          />
        </div>

        {/* Hints */}
        {showHints && (
          <div className="mb-4 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
            <h6 className="text-blue-400 font-medium mb-2">💡 Hint {hintIndex + 1}:</h6>
            <p className="text-blue-300 text-sm">{currentChallenge.hints[hintIndex]}</p>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div className={`mb-4 p-4 rounded-lg border ${
            isCorrect
              ? 'bg-green-900/20 border-green-600/30'
              : 'bg-red-900/20 border-red-600/30'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={`font-medium ${
                isCorrect ? 'text-green-400' : 'text-red-400'
              }`}>
                {isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again!'}
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-2">
              {currentChallenge.pattern.description}
            </p>
            {isCorrect && (
              <div className="text-green-400 text-sm">
                +{currentChallenge.points} points! 🎉
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isActive && !showFeedback && (
              <button
                onClick={startChallenge}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                Start Hunt
              </button>
            )}
            
            {isActive && !showFeedback && (
              <>
                <button
                  onClick={pauseChallenge}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  onClick={submitAnswer}
                  disabled={userAnswer.trim() === ''}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Submit
                </button>
              </>
            )}

            {showFeedback && (
              <button
                onClick={nextChallenge}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
              >
                Next Challenge
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isActive && !showFeedback && hintIndex < currentChallenge.hints.length && (
              <button
                onClick={getNextHint}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                Hint ({hintIndex + 1}/{currentChallenge.hints.length})
              </button>
            )}
            
            <button
              onClick={resetChallenge}
              className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              title="Reset Challenge"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Challenge Progress */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-800/30 p-3 rounded-lg text-center">
          <div className="text-cyan-400 font-semibold">{gameStats.totalScore}</div>
          <div className="text-gray-400 text-sm">Total Score</div>
        </div>
        <div className="bg-gray-800/30 p-3 rounded-lg text-center">
          <div className="text-green-400 font-semibold">{gameStats.streak}</div>
          <div className="text-gray-400 text-sm">Current Streak</div>
        </div>
        <div className="bg-gray-800/30 p-3 rounded-lg text-center">
          <div className="text-yellow-400 font-semibold">{gameStats.bestStreak}</div>
          <div className="text-gray-400 text-sm">Best Streak</div>
        </div>
        <div className="bg-gray-800/30 p-3 rounded-lg text-center">
          <div className="text-purple-400 font-semibold">
            {gameStats.totalAttempts > 0 ? Math.round((gameStats.correctAnswers / gameStats.totalAttempts) * 100) : 0}%
          </div>
          <div className="text-gray-400 text-sm">Accuracy</div>
        </div>
        <div className="bg-gray-800/30 p-3 rounded-lg text-center">
          <div className="text-orange-400 font-semibold">{gameStats.averageTime}s</div>
          <div className="text-gray-400 text-sm">Avg Time</div>
        </div>
      </div>
    </div>
  );
};

export default ThreatHuntingChallenges;

