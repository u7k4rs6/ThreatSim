import React, { useState, useEffect } from 'react';
import {
  Cpu, Shield, Lock, Upload, Cookie, Eye, Code, Key, UserX, FileText, Terminal, Star, Clock, Trophy, Lightbulb, FileCode, Puzzle, KeyRound, Timer, GanttChartSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  saveChallengeProgress, 
  getChallengeProgress, 
  ChallengeProgress 
} from '../utils/dataStorage';

// Import individual challenges
import HelloELF from './challenges/reverse_engineering/HelloELF';
import PasswordVault from './challenges/reverse_engineering/PasswordVault';
import CrackMeLite from './challenges/reverse_engineering/CrackMeLite';
import BypassMe from './challenges/reverse_engineering/BypassMe';
import VirtualMachine from './challenges/reverse_engineering/VirtualMachine';
import FlagMaze from './challenges/reverse_engineering/FlagMaze';
import PackedPayload from './challenges/reverse_engineering/PackedPayload';
import CryptoTrap from './challenges/reverse_engineering/CryptoTrap';
import SerialKeyValidator from './challenges/reverse_engineering/SerialKeyValidator';
import Timebomb from './challenges/reverse_engineering/Timebomb';

interface Challenge {
  id: string;
  title: string;
  description: string;
  vulnType: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  completed: boolean;
  flagFormat: string;
  tools: string[];
}

const ReverseEngineering: React.FC = () => {
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [userFlags, setUserFlags] = useState<Record<string, string>>({});
  const { user } = useAuth();

  const challenges: Challenge[] = [
    {
      id: 'hello-elf',
      title: 'Hello ELF',
      description: 'A simple Linux binary that prints a flag only with correct input',
      vulnType: 'Static Analysis',
      difficulty: 'Easy',
      icon: FileCode,
      component: HelloELF,
      completed: false,
      flagFormat: 'flag{simple_elf_rev}',
      tools: ['Ghidra', 'Radare2', 'Strings']
    },
    {
      id: 'password-vault',
      title: 'Password Vault',
      description: 'Reverse password check logic in C executable',
      vulnType: 'String Comparison Logic',
      difficulty: 'Easy',
      icon: KeyRound,
      component: PasswordVault,
      completed: false,
      flagFormat: 'flag{password_logic_reversed}',
      tools: ['Ghidra', 'IDA Pro', 'GDB']
    },
    {
      id: 'crackme-lite',
      title: 'CrackMe-Lite',
      description: 'Windows binary with anti-debugging protection',
      vulnType: 'Basic Anti-Debug Bypass',
      difficulty: 'Medium',
      icon: Shield,
      component: CrackMeLite,
      completed: false,
      flagFormat: 'flag{anti_debug_bypassed}',
      tools: ['x64dbg', 'ScyllaHide', 'IDA Pro']
    },
    {
      id: 'bypass-me',
      title: 'Bypass Me',
      description: 'XOR-encoded flag inside binary',
      vulnType: 'XOR Analysis + Ghidra',
      difficulty: 'Medium',
      icon: Code,
      component: BypassMe,
      completed: false,
      flagFormat: 'flag{xor_decoded_master}',
      tools: ['Ghidra', 'Python', 'Hex Editor']
    },
    {
      id: 'virtual-machine',
      title: 'Virtual Machine',
      description: 'Binary implements custom VM interpreter',
      vulnType: 'Reverse Custom Opcodes',
      difficulty: 'Hard',
      icon: Cpu,
      component: VirtualMachine,
      completed: false,
      flagFormat: 'flag{vm_opcodes_cracked}',
      tools: ['Ghidra', 'Python Scripting', 'Manual Analysis']
    },
    {
      id: 'flag-maze',
      title: 'Flag Maze',
      description: 'Obfuscated logic with nested functions',
      vulnType: 'Control Flow Deobfuscation',
      difficulty: 'Hard',
      icon: Puzzle,
      component: FlagMaze,
      completed: false,
      flagFormat: 'flag{control_flow_deobfuscated}',
      tools: ['Ghidra', 'IDA Pro', 'GDB Dynamic Analysis']
    },
    {
      id: 'packed-payload',
      title: 'Packed Payload',
      description: 'Packed ELF with UPX or custom packer',
      vulnType: 'Unpacking and Extraction',
      difficulty: 'Hard',
      icon: GanttChartSquare,
      component: PackedPayload,
      completed: false,
      flagFormat: 'flag{unpacked_successfully}',
      tools: ['UPX', 'x64dbg', 'Memory Dumping']
    },
    {
      id: 'crypto-trap',
      title: 'Crypto Trap',
      description: 'Flag encrypted using AES in binary',
      vulnType: 'Reverse Key Derivation',
      difficulty: 'Medium',
      icon: Lock,
      component: CryptoTrap,
      completed: false,
      flagFormat: 'flag{aes_key_extracted}',
      tools: ['Ghidra', 'OpenSSL', 'CyberChef']
    },
    {
      id: 'serial-key-validator',
      title: 'Serial Key Validator',
      description: 'Crack license key algorithm',
      vulnType: 'Algorithm Reconstruction',
      difficulty: 'Hard',
      icon: Key,
      component: SerialKeyValidator,
      completed: false,
      flagFormat: 'flag{keygen_algorithm_cracked}',
      tools: ['Ghidra', 'Python Keygen', 'Mathematical Analysis']
    },
    {
      id: 'timebomb',
      title: 'Timebomb',
      description: 'Binary runs only at specific time',
      vulnType: 'Patch or Emulate Time Check',
      difficulty: 'Expert',
      icon: Timer,
      component: Timebomb,
      completed: false,
      flagFormat: 'flag{time_manipulation_expert}',
      tools: ['Ghidra', 'Binary Patching', 'Faketime']
    }
  ];

  // Load user progress from localStorage on component mount
  useEffect(() => {
    if (user) {
      const progressData: Record<string, boolean> = {};
      const flagData: Record<string, string> = {};
      
      challenges.forEach(challenge => {
        const progress = getChallengeProgress(challenge.id, user.uid);
        if (progress) {
          progressData[challenge.id] = progress.completed;
          if (progress.completed) {
            flagData[challenge.id] = progress.answers.flag || challenge.flagFormat;
          }
        }
      });
      
      setUserProgress(progressData);
      setUserFlags(flagData);
    }
  }, [user]);

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
    if (challenge && flag === challenge.flagFormat && user) {
      // Update local state
      setUserProgress(prev => ({ ...prev, [challengeId]: true }));
      setUserFlags(prev => ({ ...prev, [challengeId]: flag }));
      
      // Save to persistent storage
      const challengeProgress: ChallengeProgress = {
        challengeId: challengeId,
        userId: user.uid,
        completed: true,
        score: getScoreForDifficulty(challenge.difficulty),
        completedAt: new Date(),
        attempts: 1,
        hints: 0,
        answers: { flag: flag },
        timeToComplete: undefined
      };
      
      saveChallengeProgress(challengeProgress);
    }
  };
  
  const getScoreForDifficulty = (difficulty: string): number => {
    switch (difficulty) {
      case 'Easy': return 150;
      case 'Medium': return 250;
      case 'Hard': return 400;
      case 'Expert': return 500;
      default: return 150;
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
                ← Back to Reverse Engineering
              </button>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <challenge.icon className="w-8 h-8 text-cyan-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">{challenge.title}</h1>
                  <p className="text-gray-400">{challenge.description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <span className={`px-3 py-1 rounded border ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className="px-3 py-1 rounded border border-purple-400 text-purple-400">
                  {challenge.vulnType}
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
            <Cpu className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Reverse Engineering</h1>
          </div>
          <p className="text-xl text-gray-400 mb-6">
            Dissect binaries, understand assembly, and uncover hidden flags.
          </p>
          
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white">{completedCount}/{totalChallenges} Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-cyan-400" />
              <span className="text-white">
                {Math.round((completedCount / totalChallenges) * 100)}% Progress
              </span>
            </div>
          </div>

          <div className="max-w-md mx-auto bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-indigo-500 h-2 rounded-full transition-all duration-500"
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
                  : 'border-gray-700 hover:border-purple-500'
              }`}
              onClick={() => setActiveChallenge(challenge.id)}
            >
              <div className="flex items-center gap-3 mb-4">
                <challenge.icon className={`w-8 h-8 ${userProgress[challenge.id] ? 'text-green-400' : 'text-purple-400'}`} />
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
                <span className="text-xs px-2 py-1 rounded border border-purple-400 text-purple-400">
                  {challenge.vulnType}
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
          <p>Analyze, patch, and pwn. The binary world is your playground.</p>
        </div>
      </div>
    </div>
  );
};

export default ReverseEngineering;

