import React, { useState, useEffect, useCallback } from 'react';
import { 
  Globe, 
  Cpu, 
  Shield, 
  Key, 
  FileImage, 
  HardDrive, 
  Search, 
  MonitorSpeaker,
  ArrowLeft,
  Trophy,
  Star,
  Lock,
  AlertTriangle,
  Zap,
  TrendingUp
} from 'lucide-react';
import WebExploitation from './WebExploitation';
import ReverseEngineering from './ReverseEngineering';
import Steganography from './Steganography';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { getUserProgress, getAllChallengeProgress, saveChallengeProgress, ChallengeProgress } from '../utils/dataStorage';

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgGradient: string;
  challengeCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed';
  estimatedTime: string | null;
  skills: string[];
  component?: React.ComponentType<any>;
}

const ThreatHuntingChallenges: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [recentCompletions, setRecentCompletions] = useState<any[]>([]);
  const [trendingChallenges, setTrendingChallenges] = useState<any[]>([]);
  const { user } = useAuth();
  const { progressVersion } = useProgress();

  const categories: Category[] = [
    {
      id: 'web-exploitation',
      title: 'Web Exploitation',
      description: 'Master real-world web application vulnerabilities including SQL injection, XSS, file uploads, and authentication bypasses.',
      icon: Globe,
      color: 'text-cyan-400',
      bgGradient: 'from-cyan-900/50 to-blue-900/30',
      challengeCount: 10,
      difficulty: 'Mixed',
      estimatedTime: null,
      skills: ['SQL Injection', 'XSS', 'File Upload', 'Authentication Bypass', 'SSTI', 'JWT Manipulation'],
      component: WebExploitation
    },
    {
      id: 'reverse-engineering',
      title: 'Reverse Engineering',
      description: 'Analyze and reverse engineer binaries, understand assembly code, and uncover hidden functionality in compiled programs.',
      icon: Cpu,
      color: 'text-purple-400',
      bgGradient: 'from-purple-900/50 to-indigo-900/30',
      challengeCount: 10,
      difficulty: 'Advanced',
      estimatedTime: null,
      skills: ['Assembly Analysis', 'Debugging', 'Disassembly', 'Malware Analysis', 'Binary Patching', 'Packing/Unpacking'],
      component: ReverseEngineering
    },
    {
      id: 'pwn-binary',
      title: 'Pwn / Binary Exploitation',
      description: 'Exploit memory corruption vulnerabilities, buffer overflows, and advanced binary exploitation techniques.',
      icon: AlertTriangle,
      color: 'text-red-400',
      bgGradient: 'from-red-900/50 to-orange-900/30',
      challengeCount: 12,
      difficulty: 'Advanced',
      estimatedTime: null,
      skills: ['Buffer Overflow', 'ROP Chains', 'Heap Exploitation', 'Format String', 'Stack Canaries', 'ASLR Bypass']
    },
    {
      id: 'cryptography',
      title: 'Cryptography',
      description: 'Break weak encryption, analyze cryptographic protocols, and understand common cryptographic vulnerabilities.',
      icon: Key,
      color: 'text-green-400',
      bgGradient: 'from-green-900/50 to-emerald-900/30',
      challengeCount: 9,
      difficulty: 'Intermediate',
      estimatedTime: null,
      skills: ['Classical Ciphers', 'RSA Attacks', 'Hash Collisions', 'Block Ciphers', 'Digital Signatures', 'Key Exchange']
    },
    {
      id: 'forensics',
      title: 'Forensics',
      description: 'Investigate digital evidence, recover deleted files, analyze network traffic, and uncover hidden information.',
      icon: Search,
      color: 'text-yellow-400',
      bgGradient: 'from-yellow-900/50 to-amber-900/30',
      challengeCount: 11,
      difficulty: 'Intermediate',
      estimatedTime: null,
      skills: ['File Recovery', 'Network Analysis', 'Memory Forensics', 'Disk Imaging', 'Timeline Analysis', 'Artifact Analysis']
    },
    {
      id: 'steganography',
      title: 'Steganography',
      description: 'Discover hidden messages in images, audio files, and other media using various steganographic techniques.',
      icon: FileImage,
      color: 'text-pink-400',
      bgGradient: 'from-pink-900/50 to-rose-900/30',
      challengeCount: 10,
      difficulty: 'Beginner',
      estimatedTime: null,
      skills: ['LSB Extraction', 'Image Analysis', 'Audio Steganography', 'Text Hiding', 'Metadata Analysis', 'Tool Usage'],
      component: Steganography
    },
    {
      id: 'osint',
      title: 'OSINT (Open Source Intelligence)',
      description: 'Gather intelligence from publicly available sources and learn advanced reconnaissance techniques.',
      icon: MonitorSpeaker,
      color: 'text-blue-400',
      bgGradient: 'from-blue-900/50 to-sky-900/30',
      challengeCount: 8,
      difficulty: 'Beginner',
      estimatedTime: null,
      skills: ['Social Media Investigation', 'Domain Enumeration', 'Metadata Extraction', 'Geolocation', 'People Search', 'Digital Footprinting']
    },
    {
      id: 'realistic-boxes',
      title: 'Realistic Boxes (Full Machines)',
      description: 'Complete end-to-end penetration testing scenarios on realistic virtual machines and networks.',
      icon: HardDrive,
      color: 'text-orange-400',
      bgGradient: 'from-orange-900/50 to-red-900/30',
      challengeCount: 6,
      difficulty: 'Advanced',
      estimatedTime: null,
      skills: ['Full Pentest', 'Privilege Escalation', 'Lateral Movement', 'Persistence', 'Post-Exploitation', 'Reporting']
    }
  ];

  // Simulate live activity feed
  useEffect(() => {
    const usernames = ['CyberNinja', 'HackMaster', 'SecurityPro', 'CodeBreaker', 'ThreatHunter', 'CyberWarrior'];
    const challengeNames = [
      'SQL Injection Lab', 'XSS Challenge', 'Buffer Overflow', 'Crypto Puzzle',
      'Network Forensics', 'Steganography Hunt', 'Memory Analysis', 'Web Shell Detection'
    ];
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 3 seconds
        const newCompletion = {
          id: Date.now(),
          username: usernames[Math.floor(Math.random() * usernames.length)],
          challenge: challengeNames[Math.floor(Math.random() * challengeNames.length)],
          points: Math.floor(Math.random() * 500) + 100,
          timestamp: new Date().toISOString(),
          category: categories[Math.floor(Math.random() * categories.length)].title
        };
        
        setRecentCompletions(prev => [newCompletion, ...prev.slice(0, 9)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update trending challenges
  useEffect(() => {
    const trending = [
      { name: 'Advanced SQL Injection', category: 'Web Exploitation', completions: 1247, difficulty: 'Hard' },
      { name: 'Binary Analysis Challenge', category: 'Reverse Engineering', completions: 892, difficulty: 'Expert' },
      { name: 'Network Traffic Analysis', category: 'Forensics', completions: 1156, difficulty: 'Medium' },
      { name: 'Cryptographic Cipher Break', category: 'Cryptography', completions: 734, difficulty: 'Hard' },
      { name: 'Hidden Message Extraction', category: 'Steganography', completions: 956, difficulty: 'Easy' }
    ];
    setTrendingChallenges(trending);
  }, []);

  useEffect(() => {
    if (user) {
      const progress = getUserProgress(user.uid);
      const completedCounts: Record<string, number> = {};
      
      categories.forEach(category => {
        const completed = getAllChallengeProgress(user.uid).filter(
          c => c.challengeId.startsWith(category.id) && c.completed
        );
        completedCounts[category.id] = completed.length;
      });
      
      setUserProgress(completedCounts);
      console.log('📊 Progress refreshed:', completedCounts);
    }
  }, [user, progressVersion]);

  // Add a separate effect to refresh progress when component mounts or becomes visible
  useEffect(() => {
    const refreshProgress = () => {
      if (user) {
        const allChallenges = getAllChallengeProgress(user.uid);
        const completedCounts: Record<string, number> = {};
        
        console.log('🔍 All challenges for user:', allChallenges);
        
        categories.forEach(category => {
          const completed = allChallenges.filter(
            c => c.challengeId.startsWith(category.id) && c.completed
          );
          completedCounts[category.id] = completed.length;
          console.log(`📋 ${category.title}: ${completed.length} completed challenges`, completed.map(c => c.challengeId));
        });
        
        setUserProgress(completedCounts);
        console.log('🔄 Progress force refreshed:', completedCounts);
        
        // Calculate totals for debugging
        const totalCompleted = Object.values(completedCounts).reduce((sum, count) => sum + count, 0);
        console.log('📊 Total completed challenges:', totalCompleted);
      }
    };

    // Only refresh when we're on the categories page (activeCategory is null)
    if (activeCategory === null) {
      // Refresh immediately
      refreshProgress();

      // Set up an interval to refresh every 1 second when on the categories page
      const interval = setInterval(refreshProgress, 1000);

      return () => clearInterval(interval);
    }
  }, [user, activeCategory]); // Refresh when user changes or when returning to categories

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 border-green-400';
      case 'Intermediate': return 'text-yellow-400 border-yellow-400';
      case 'Advanced': return 'text-red-400 border-red-400';
      case 'Mixed': return 'text-blue-400 border-blue-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const handleChallengeComplete = (challengeId: string, flag: string) => {
    if (user) {
      // For web exploitation, we know the category prefix
      const prefixedChallengeId = `web-exploitation-${challengeId}`;
      const challengeProgress: ChallengeProgress = {
        challengeId: prefixedChallengeId,
        userId: user.uid,
        completed: true,
        score: 100,
        completedAt: new Date(),
        answers: { flag },
        attempts: 1,
        hints: 0
      };
      
      console.log('🎯 Saving challenge progress with ID:', prefixedChallengeId);
      saveChallengeProgress(challengeProgress);
      
      // Force an immediate refresh
      const completedCounts: Record<string, number> = {};
      const allChallenges = getAllChallengeProgress(user.uid);
      
      categories.forEach(category => {
        const completed = allChallenges.filter(
          c => c.challengeId.startsWith(category.id) && c.completed
        );
        completedCounts[category.id] = completed.length;
      });
      
      setUserProgress(completedCounts);
    }
  };

  // Calculate total progress
  const totalChallenges = categories.reduce((sum, cat) => sum + cat.challengeCount, 0);
  const completedChallenges = Object.values(userProgress).reduce((sum, count) => sum + count, 0);
  const overallProgress = Math.round((completedChallenges / totalChallenges) * 100);

  if (activeCategory) {
    const category = categories.find(c => c.id === activeCategory);
    if (category && category.component) {
      const CategoryComponent = category.component;
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <button
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Categories
              </button>
            </div>
            <CategoryComponent 
              completedChallenges={getAllChallengeProgress(user?.uid || '').filter(c => c.challengeId.startsWith(category.id) && c.completed).map(c => c.challengeId.replace(`${category.id}-`, ''))}
              onChallengeComplete={handleChallengeComplete} 
            />
          </div>
        </div>
      );
    } else {
      // For categories without components yet, show coming soon
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <button
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Categories
              </button>
            </div>
            
            <div className="text-center py-20">
              <div className="mb-8">
                {category && (
                  <category.icon className={`w-24 h-24 mx-auto mb-4 ${category.color}`} />
                )}
                <h1 className="text-4xl font-bold text-white mb-4">{category?.title}</h1>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                  {category?.description}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-8 max-w-2xl mx-auto">
                <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-300 mb-4">Coming Soon</h3>
                <p className="text-gray-400 mb-6">
                  This category is currently under development. We're working hard to bring you 
                  {category?.challengeCount} exciting challenges covering {category?.skills.join(', ')}.
                </p>
                <div className="flex justify-center gap-4 text-sm text-gray-500">
                  <span>• {category?.challengeCount} Challenges</span>
                  <span>• {category?.difficulty} Level</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Challenge Categories</h1>
          </div>
          <p className="text-xl text-gray-400 mb-6">
            Choose your cybersecurity specialization and master essential skills through hands-on challenges
          </p>
          
          {/* Overall Progress Stats */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white">{completedChallenges}/{totalChallenges} Challenges Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-cyan-400" />
              <span className="text-white">{overallProgress}% Overall Progress</span>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="max-w-md mx-auto bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const completedInCategory = userProgress[category.id] || 0;
            const categoryProgress = Math.round((completedInCategory / category.challengeCount) * 100);
            
            return (
              <div
                key={category.id}
                className={`bg-gradient-to-br ${category.bgGradient} border border-gray-700/50 rounded-lg p-6 cursor-pointer transition-all hover:scale-105 hover:border-cyan-500/50 group`}
                onClick={() => setActiveCategory(category.id)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <category.icon className={`w-8 h-8 ${category.color} group-hover:scale-110 transition-transform`} />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {category.title}
                    </h3>
                    {completedInCategory > 0 && (
                      <div className="flex items-center gap-1 text-green-400 text-sm">
                        <Trophy className="w-4 h-4" />
                        <span>{completedInCategory}/{category.challengeCount}</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {category.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(category.difficulty)}`}>
                    {category.difficulty}
                  </span>
                  <span className="text-xs px-2 py-1 rounded border border-gray-400 text-gray-400">
                    {category.challengeCount} Challenges
                  </span>
                </div>

                {/* Category Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{categoryProgress}%</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${categoryProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  <div className="truncate">🎯 {category.skills.slice(0, 3).join(', ')}{category.skills.length > 3 ? '...' : ''}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Activity Feed & Trending Challenges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Live Activity Feed */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Live Completions
            </h3>
            <div className="space-y-3">
              {recentCompletions.map(completion => (
                <div key={completion.id} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="text-sm text-white">{completion.username} completed {completion.challenge}</div>
                    <div className="text-xs text-gray-400">in {completion.category} • {new Date(completion.timestamp).toLocaleTimeString()}</div>
                  </div>
                  <div className="text-sm font-bold text-green-400">+{completion.points}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Challenges */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Trending Challenges
            </h3>
            <div className="space-y-3">
              {trendingChallenges.map((challenge, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <div className="text-sm font-semibold text-white">{challenge.name}</div>
                    <div className="text-xs text-gray-400">{challenge.category}</div>
                  </div>
                  <div className={`text-sm font-bold ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </div>
                  <div className="text-sm text-gray-300">
                    {challenge.completions} solves
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>🔐 Practice ethical hacking in a safe, controlled environment</p>
          <p>All challenges are designed for educational purposes only</p>
        </div>
      </div>
    </div>
  );
};

export default ThreatHuntingChallenges;
