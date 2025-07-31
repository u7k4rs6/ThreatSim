import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Terminal, Download, KeyRound } from 'lucide-react';

interface SerialKeyValidatorProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const SerialKeyValidator: React.FC<SerialKeyValidatorProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');

  const correctFlag = 'flag{keygen_algorithm_cracked}';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flag === correctFlag) {
      setMessage('Correct flag! Well done.');
      onComplete(flag);
    } else {
      setMessage('Incorrect flag. Keep trying!');
    }
  };

  return (
    <div className="space-y-6">
        {isCompleted && (
            <div className="bg-green-900/50 border border-green-500 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Challenge Completed!</span>
                </div>
                <p className="text-green-300 mt-2">Serial key validation algorithm cracked!</p>
            </div>
        )}

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <KeyRound className="w-8 h-8 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Serial Key Validator - Keygenning</h2>
            </div>

            <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> This software has a license key validation system. Your task is to reverse engineer the validation algorithm and understand how valid keys are generated.</p>

            {/* Hints Section */}
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Hints:</span>
                </div>
                <div className="text-yellow-200 text-sm space-y-1">
                    <p>💡 The validation function likely involves loops and mathematical operations.</p>
                    <p>💡 Look for how the length of the serial key is checked.</p>
                    <p>💡 The algorithm might use checksums or hash-like functions on parts of the key.</p>
                </div>
            </div>

            {/* Tutorial Dropdown */}
            <div className="mb-6">
                <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
                    📚 Keygenning Tutorial:
                </label>
                <select
                    id="tutorial-select"
                    className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={selectedTutorial}
                    onChange={(e) => setSelectedTutorial(e.target.value)}
                >
                    <option value="" disabled>Choose a tutorial topic...</option>
                    <option value="basics">📚 Keygenning Basics</option>
                    <option value="goal">🎯 What's the Goal?</option>
                    <option value="solution">⚡ Complete Solution</option>
                    <option value="explanation">🔍 Why It Works</option>
                    <option value="result">🏆 Expected Result</option>
                </select>

                {selectedTutorial && (
                    <div className="mt-4 bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
                        <div className="text-purple-200 text-sm space-y-2">
                            {selectedTutorial === 'basics' && (
                                <div>
                                    <p><strong>📚 Basics:</strong> Keygenning (key generation) is the process of reversing a software's serial key algorithm to create a tool that can generate valid keys on demand. It requires a deep understanding of the program's internal logic.</p>
                                </div>
                            )}

                            {selectedTutorial === 'goal' && (
                                <div>
                                    <p><strong>🎯 Goal:</strong> Your goal is to dissect the function that validates the serial key. You need to understand the mathematical constraints and relationships between the different parts of the key to be able to generate a valid one.</p>
                                </div>
                            )}

                            {selectedTutorial === 'solution' && (
                                <div>
                                    <p><strong>⚡ Solution:</strong></p>
                                    <p>• <strong>Step 1:</strong> Identify the key validation function in a disassembler.</p>
                                    <p>• <strong>Step 2:</strong> Analyze the algorithm. You will notice it likely sums parts of the serial key or performs other mathematical checks.</p>
                                    <p>• <strong>Step 3:</strong> Write a small script (e.g., in Python) that implements this logic to generate a serial key that satisfies the conditions.</p>
                                    <p>• <strong>Step 4:</strong> Use your generated key to get the flag.</p>
                                </div>
                            )}

                            {selectedTutorial === 'explanation' && (
                                <div>
                                    <p><strong>🔍 Why It Works:</strong> The protection scheme is based on a deterministic mathematical algorithm. By understanding the algorithm's rules (e.g., "the sum of the first four digits must equal the last two digits"), you can write your own code to produce a key that the algorithm will always accept.</p>
                                </div>
                            )}

                            {selectedTutorial === 'result' && (
                                <div>
                                    <p><strong>🏆 Expected Result:</strong> You will successfully generate a valid key, bypass the check, and receive the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{'}keygen_algorithm_cracked{'}'}</code></p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <a href="/challenges/reverse_engineering/serial_validator" download className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Download Binary
                </a>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-4 items-center">
                <input 
                    type="text"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="Enter flag"
                    className="flex-grow p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors">Submit</button>
            </form>

            {message && (
                <div className={`mt-4 flex items-center gap-2 ${isCompleted ? 'text-green-400' : 'text-red-400'}`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    <span>{message}</span>
                </div>
            )}
        </div>
    </div>
  );
};

export default SerialKeyValidator;
