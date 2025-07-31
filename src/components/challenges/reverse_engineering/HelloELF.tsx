import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Terminal, Download, FileCode, Play } from 'lucide-react';

interface HelloELFProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const HelloELF: React.FC<HelloELFProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [showBinary, setShowBinary] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [binaryOutput, setBinaryOutput] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');

  const correctFlag = 'flag{simple_elf_rev}';
  const correctInput = 'SecretKey123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flag === correctFlag) {
      setMessage('Correct flag! Well done.');
      onComplete(flag);
    } else {
      setMessage('Incorrect flag. Keep trying!');
    }
  };

  const handleBinaryRun = () => {
    if (inputValue === correctInput) {
      setBinaryOutput('Success! The flag is: flag{simple_elf_rev}');
    } else {
      setBinaryOutput('Access denied. Try again.');
    }
  };

  const downloadBinary = () => {
    const binaryCode = `#!/bin/bash
# Simulated ELF Binary - Hello ELF Challenge
# This represents the binary's behavior

echo "Enter the secret key:"
read input

if [ "$input" = "SecretKey123" ]; then
    echo "Success! The flag is: flag{simple_elf_rev}"
else
    echo "Access denied. Try again."
fi`;
    
    const blob = new Blob([binaryCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hello_elf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
        {isCompleted && (
            <div className="bg-green-900/50 border border-green-500 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Challenge Completed!</span>
                </div>
                <p className="text-green-300 mt-2">Simple ELF reversed successfully!</p>
            </div>
        )}

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <FileCode className="w-8 h-8 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Hello ELF - Basic Reversing</h2>
            </div>

            <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> This is a simple Linux binary. Your task is to reverse engineer it to find the correct input that will reveal the flag.</p>

            {/* Hints Section */}
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Hints:</span>
                </div>
                <div className="text-yellow-200 text-sm space-y-1">
                    <p>💡 The `strings` command is a great first step to find hardcoded text in a binary.</p>
                    <p>💡 Look for strings related to success, failure, or passwords.</p>
                    <p>💡 A disassembler will show you the exact logic that compares your input to the secret key.</p>
                </div>
            </div>

            {/* Tutorial Dropdown */}
            <div className="mb-6">
                <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
                    📚 Basic Reversing Tutorial:
                </label>
                <select
                    id="tutorial-select"
                    className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={selectedTutorial}
                    onChange={(e) => setSelectedTutorial(e.target.value)}
                >
                    <option value="" disabled>Choose a tutorial topic...</option>
                    <option value="basics">📚 Static Analysis Basics</option>
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
                                    <p><strong>📚 Basics:</strong> Static analysis involves examining a program's code without executing it. Tools like `strings` and disassemblers (Ghidra, IDA Pro, Radare2) are used to understand the program's structure, find important data, and map out its logic.</p>
                                </div>
                            )}

                            {selectedTutorial === 'goal' && (
                                <div>
                                    <p><strong>🎯 Goal:</strong> Your goal is to find the hardcoded secret key inside the binary. The program compares your input against this key to decide whether to grant access.</p>
                                </div>
                            )}

                            {selectedTutorial === 'solution' && (
                                <div>
                                    <p><strong>⚡ Solution:</strong></p>
                                    <p>• <strong>Step 1:</strong> Run `strings ./hello_elf` in your terminal. You will see the string "SecretKey123" among others.</p>
                                    <p>• <strong>Step 2:</strong> Use this string as the input in the simulator.</p>
                                    <p>• <strong>Step 3:</strong> The simulator will confirm it's correct and provide the flag.</p>
                                </div>
                            )}

                            {selectedTutorial === 'explanation' && (
                                <div>
                                    <p><strong>🔍 Why It Works:</strong> The program's logic directly compares the user's input with a string literal compiled into the binary. The `strings` utility simply scans the file for sequences of printable characters, making it easy to find such hardcoded secrets.</p>
                                </div>
                            )}

                            {selectedTutorial === 'result' && (
                                <div>
                                    <p><strong>🏆 Expected Result:</strong> You will find the secret key, get the success message, and receive the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{'}simple_elf_rev{'}'}</code></p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-4 mb-4">
                <button 
                    onClick={downloadBinary}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download Binary
                </button>
                <button 
                    onClick={() => setShowBinary(!showBinary)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                    <Play className="w-4 h-4" />
                    Simulate Binary
                </button>
            </div>

            {showBinary && (
                <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-600">
                    <h3 className="text-white font-semibold mb-2">Binary Simulator</h3>
                    <div className="bg-black p-3 rounded font-mono text-green-400 text-sm mb-3">
                        <div>$ ./hello_elf</div>
                        <div>Enter the secret key:</div>
                    </div>
                    <div className="flex gap-2 mb-2">
                        <input 
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter input"
                            className="flex-grow p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button 
                            onClick={handleBinaryRun}
                            className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
                        >
                            Run
                        </button>
                    </div>
                    {binaryOutput && (
                        <div className="bg-black p-3 rounded font-mono text-green-400 text-sm">
                            {binaryOutput}
                        </div>
                    )}
                </div>
            )}

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

export default HelloELF;

