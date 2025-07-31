import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Terminal, Download, Puzzle } from 'lucide-react';

interface FlagMazeProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const FlagMaze: React.FC<FlagMazeProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');

  const correctFlag = 'flag{control_flow_deobfuscated}';

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
                <p className="text-green-300 mt-2">Control flow successfully deobfuscated!</p>
            </div>
        )}

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <Puzzle className="w-8 h-8 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Flag Maze - Control Flow Obfuscation</h2>
            </div>

            <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> This binary contains heavily obfuscated logic with nested functions and confusing control flow. Your task is to navigate through the maze of functions to find the flag.</p>

            {/* Hints Section */}
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Hints:</span>
                </div>
                <div className="text-yellow-200 text-sm space-y-1">
                    <p>💡 Use a disassembler's graph view to visualize the function call relationships.</p>
                    <p>💡 Some functions might be "red herrings" designed to waste your time. Focus on functions that manipulate or compare data.</p>
                    <p>💡 Dynamic analysis can help you trace the actual execution path and skip irrelevant branches.</p>
                </div>
            </div>

            {/* Tutorial Dropdown */}
            <div className="mb-6">
                <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
                    📚 Deobfuscation Tutorial:
                </label>
                <select
                    id="tutorial-select"
                    className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={selectedTutorial}
                    onChange={(e) => setSelectedTutorial(e.target.value)}
                >
                    <option value="" disabled>Choose a tutorial topic...</option>
                    <option value="basics">📚 Obfuscation Basics</option>
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
                                    <p><strong>📚 Basics:</strong> Control flow obfuscation makes a program harder to analyze by creating a confusing and convoluted execution path. Techniques include inserting dead code, using indirect jumps, and creating complex conditional logic that is difficult to follow statically.</p>
                                </div>
                            )}

                            {selectedTutorial === 'goal' && (
                                <div>
                                    <p><strong>🎯 Goal:</strong> Your goal is to trace the program's execution, either statically by analyzing the code in a disassembler or dynamically with a debugger, to understand which sequence of function calls leads to the flag.</p>
                                </div>
                            )}

                            {selectedTutorial === 'solution' && (
                                <div>
                                    <p><strong>⚡ Solution:</strong></p>
                                    <p>• <strong>Step 1:</strong> Load the binary in Ghidra and view the function graph for `main`.</p>
                                    <p>• <strong>Step 2:</strong> Set breakpoints at the start of each function called from `main` in a debugger (like GDB).</p>
                                    <p>• <strong>Step 3:</strong> Step through the program, noting which functions are called and what data they return or modify.</p>
                                    <p>• <strong>Step 4:</strong> You will find that the flag is constructed piece by piece across several functions. Assemble the pieces in the correct order to get the full flag.</p>
                                </div>
                            )}

                            {selectedTutorial === 'explanation' && (
                                <div>
                                    <p><strong>🔍 Why It Works:</strong> Obfuscation makes static analysis difficult, but it cannot hide the true execution path from a debugger. By stepping through the code live, you can ignore the confusing, unexecuted branches and follow the one true path the program takes, revealing how the flag is assembled.</p>
                                </div>
                            )}

                            {selectedTutorial === 'result' && (
                                <div>
                    <p><strong>🏆 Expected Result:</strong> By correctly tracing the program flow, you will assemble the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{'}control_flow_deobfuscated{'}'}</code></p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <a href="/challenges/reverse_engineering/flag_maze" download className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
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

export default FlagMaze;
