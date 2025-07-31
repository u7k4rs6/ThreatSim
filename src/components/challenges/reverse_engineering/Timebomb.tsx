import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Terminal, Download, Timer } from 'lucide-react';

interface TimebombProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const Timebomb: React.FC<TimebombProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');

  const correctFlag = 'flag{time_manipulation_expert}';

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
                <p className="text-green-300 mt-2">Timebomb defused successfully!</p>
            </div>
        )}

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <Timer className="w-8 h-8 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Timebomb - Time-Based Logic</h2>
            </div>

            <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> This binary only runs and reveals the flag at a specific time or date. Your task is to either patch the time check or find a way to emulate the correct time.</p>

            {/* Hints Section */}
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Hints:</span>
                </div>
                <div className="text-yellow-200 text-sm space-y-1">
                    <p>💡 Look for calls to system functions that get the current time, like `time()` or `gettimeofday()`.</p>
                    <p>💡 The target time might be a hardcoded Unix timestamp. Use an online converter to see what date it represents.</p>
                    <p>💡 You can patch the conditional jump after the time comparison to always go down the "correct" path.</p>
                </div>
            </div>

            {/* Tutorial Dropdown */}
            <div className="mb-6">
                <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
                    📚 Time-Based Cracking Tutorial:
                </label>
                <select
                    id="tutorial-select"
                    className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={selectedTutorial}
                    onChange={(e) => setSelectedTutorial(e.target.value)}
                >
                    <option value="" disabled>Choose a tutorial topic...</option>
                    <option value="basics">📚 Time-Lock Basics</option>
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
                                    <p><strong>📚 Basics:</strong> Time-based locks are a form of protection where a program will only execute a certain piece of code if the system clock is set to a specific time or date. This is often used in trial software or CTF challenges.</p>
                                </div>
                            )}

                            {selectedTutorial === 'goal' && (
                                <div>
                                    <p><strong>🎯 Goal:</strong> Your goal is to identify the time check in the code and bypass it. This can be done by patching the binary to ignore the check or by tricking the program into thinking it's running at the correct time.</p>
                                </div>
                            )}

                            {selectedTutorial === 'solution' && (
                                <div>
                                    <p><strong>⚡ Solution (Patching):</strong></p>
                                    <p>• <strong>Step 1:</strong> Find the call to `time()` and the subsequent comparison.</p>
                                    <p>• <strong>Step 2:</strong> In a debugger, locate the conditional jump instruction (e.g., `jne`, `jz`) that branches based on the time comparison.</p>
                                    <p>• <strong>Step 3:</strong> Overwrite the jump instruction with `nop` (No Operation) instructions, or change it to an unconditional `jmp` to force the correct execution path.</p>
                                </div>
                            )}

                            {selectedTutorial === 'explanation' && (
                                <div>
                                    <p><strong>🔍 Why It Works:</strong> By patching the conditional jump, we remove the time check from the program's logic entirely. The program no longer cares what the system time is and will always execute the code that was previously protected by the time-lock, revealing the flag.</p>
                                </div>
                            )}

                            {selectedTutorial === 'result' && (
                                <div>
                                    <p><strong>🏆 Expected Result:</strong> After bypassing the time check, the program will run successfully and print the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{'}time_manipulation_expert{'}'}</code></p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <a href="/challenges/reverse_engineering/timebomb" download className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
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

export default Timebomb;
