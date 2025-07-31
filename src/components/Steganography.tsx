import React, { useState, useEffect } from 'react';
import {
  FileImage, Eye, Camera, Palette, Archive, FileText, QrCode, Volume2, FileVolume, FileSpreadsheet, Star, Clock, Trophy, Lightbulb, Zap, FileCheck
} from 'lucide-react';

// Import individual challenges
import PixelPeek from './challenges/steganography/PixelPeek';
import AudioSecrets from './challenges/steganography/AudioSecrets';
import ColorCode from './challenges/steganography/ColorCode';
import HiddenInPlainSight from './challenges/steganography/HiddenInPlainSight';
import StegoNote from './challenges/steganography/StegoNote';
import MetadataMess from './challenges/steganography/MetadataMess';
import QRception from './challenges/steganography/QRception';
import NoisyPixels from './challenges/steganography/NoisyPixels';
import AudioShift from './challenges/steganography/AudioShift';
import PDFception from './challenges/steganography/PDFception';

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

const Steganography: React.FC = () => {
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [userFlags, setUserFlags] = useState<Record<string, string>>({});

  const challenges: Challenge[] = [
    {
      id: 'pixel-peek',
      title: 'Pixel Peek',
      description: 'Flag hidden in LSB of PNG image',
      technique: 'LSB (Least Significant Bit)',
      difficulty: 'Easy',
      icon: Eye,
      component: PixelPeek,
      completed: false,
      flagFormat: 'flag{lsb_stego_master}',
      tools: ['zsteg', 'stegsolve', 'Python PIL']
    },
    {
      id: 'audio-secrets',
      title: 'Audio Secrets',
      description: 'WAV file contains hidden Morse code',
      technique: 'Audio spectrogram analysis',
      difficulty: 'Easy',
      icon: Volume2,
      component: AudioSecrets,
      completed: false,
      flagFormat: 'flag{morse_code_in_audio}',
      tools: ['Audacity', 'SoX', 'FFmpeg']
    },
    {
      id: 'color-code',
      title: 'Color Code',
      description: 'Color channels encode hidden ASCII',
      technique: 'RGB manipulation',
      difficulty: 'Medium',
      icon: Palette,
      component: ColorCode,
      completed: false,
      flagFormat: 'flag{rgb_stego_revealed}',
      tools: ['GIMP', 'StegSolve', 'Python']
    },
    {
      id: 'hidden-in-plain-sight',
      title: 'Hidden in Plain Sight',
      description: 'Image looks normal but contains zip file',
      technique: 'File carving / appended data',
      difficulty: 'Medium',
      icon: Archive,
      component: HiddenInPlainSight,
      completed: false,
      flagFormat: 'flag{file_carving_expert}',
      tools: ['binwalk', 'foremost', 'unzip']
    },
    {
      id: 'stego-note',
      title: 'StegoNote',
      description: 'Text file with invisible characters',
      technique: 'Zero-width steganography',
      difficulty: 'Medium',
      icon: FileText,
      component: StegoNote,
      completed: false,
      flagFormat: 'flag{zero_width_ninja}',
      tools: ['Hex Editor', 'Unicode Analyzer', 'Python']
    },
    {
      id: 'metadata-mess',
      title: 'Metadata Mess',
      description: 'Flag hidden in image metadata',
      technique: 'EXIF inspection',
      difficulty: 'Easy',
      icon: FileText,
      component: MetadataMess,
      completed: false,
      flagFormat: 'flag{exif_data_hunter}',
      tools: ['exiftool', 'identify', 'strings']
    },
    {
      id: 'qrception',
      title: 'QRception',
      description: 'Image inside QR inside QR',
      technique: 'Multi-layer stego',
      difficulty: 'Hard',
      icon: QrCode,
      component: QRception,
      completed: false,
      flagFormat: 'flag{qr_in_qr_inception}',
      tools: ['zbarimg', 'QR readers', 'Python']
    },
    {
      id: 'noisy-pixels',
      title: 'Noisy Pixels',
      description: 'Flag encoded in color noise',
      technique: 'Noise frequency analysis',
      difficulty: 'Hard',
      icon: Zap,
      component: NoisyPixels,
      completed: false,
      flagFormat: 'flag{noise_analyzed}',
      tools: ['MATLAB', 'Python + NumPy', 'ImageJ']
    },
    {
      id: 'audio-shift',
      title: 'Audio Shift',
      description: 'Frequency-modulated flag in MP3',
      technique: 'Frequency domain',
      difficulty: 'Hard',
      icon: Volume2,
      component: AudioShift,
      completed: false,
      flagFormat: 'flag{frequency_shifted}',
      tools: ['Audacity', 'SoX', 'Python + librosa']
    },
    {
      id: 'pdfception',
      title: 'PDFception',
      description: 'PDF file with layers + embedded image',
      technique: 'Stego in multi-object PDF',
      difficulty: 'Expert',
      icon: FileCheck,
      component: PDFception,
      completed: false,
      flagFormat: 'flag{pdf_layers_expert}',
      tools: ['PDFtk', 'binwalk', 'pdfimages']
    }
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
                ← Back to Steganography
              </button>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <challenge.icon className="w-8 h-8 text-pink-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">{challenge.title}</h1>
                  <p className="text-gray-400">{challenge.description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <span className={`px-3 py-1 rounded border ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className="px-3 py-1 rounded border border-pink-400 text-pink-400">
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
            <FileImage className="w-12 h-12 text-pink-400" />
            <h1 className="text-4xl font-bold text-white">Steganography</h1>
          </div>
          <p className="text-xl text-gray-400 mb-6">
            Discover hidden messages in images, audio files, and other media.
          </p>
          
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white">{completedCount}/{totalChallenges} Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-pink-400" />
              <span className="text-white">
                {Math.round((completedCount / totalChallenges) * 100)}% Progress
              </span>
            </div>
          </div>

          <div className="max-w-md mx-auto bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-400 to-rose-500 h-2 rounded-full transition-all duration-500"
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
                  : 'border-gray-700 hover:border-pink-500'
              }`}
              onClick={() => setActiveChallenge(challenge.id)}
            >
              <div className="flex items-center gap-3 mb-4">
                <challenge.icon className={`w-8 h-8 ${userProgress[challenge.id] ? 'text-green-400' : 'text-pink-400'}`} />
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
                <span className="text-xs px-2 py-1 rounded border border-pink-400 text-pink-400">
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
          <p>Hidden in plain sight. Every pixel tells a story.</p>
        </div>
      </div>
    </div>
  );
};

export default Steganography;

