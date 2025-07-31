import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Terminal, Download, KeyRound, Play } from 'lucide-react';

interface PasswordVaultProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const PasswordVault: React.FC<PasswordVaultProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [showBinary, setShowBinary] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [binaryOutput, setBinaryOutput] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');

  const correctFlag = 'flag{password_logic_reversed}';
  const correctPassword = 'R3v3rs3M3!';

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
    // Simulate password validation logic
    const encoded = inputValue.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ 42)).join('');
    const target = 'R3v3rs3M3!'.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ 42)).join('');
    
    if (encoded === target) {
      setBinaryOutput('Password correct! Flag: flag{password_logic_reversed}');
    } else {
      setBinaryOutput('Invalid password. Access denied.');
    }
  };

  const downloadBinary = () => {
    const binaryCode = `#include <stdio.h>
#include <string.h>

int validate_password(char* input) {
    char encoded[20];
    char target[] = {0x78, 0x11, 0x72, 0x11, 0x66, 0x73, 0x11, 0x5F, 0x11, 0x53, 0x00};
    
    for(int i = 0; i < strlen(input); i++) {
        encoded[i] = input[i] ^ 42;
    }
    encoded[strlen(input)] = 0;
    
    return strcmp(encoded, target) == 0;
}

int main() {
    char password[50];
    printf("Enter vault password: ");
    scanf("%s", password);
    
    if(validate_password(password)) {
        printf("Password correct! Flag: flag{password_logic_reversed}\n");
    } else {
        printf("Invalid password. Access denied.\n");
    }
    
    return 0;
}`;
    
    const blob = new Blob([binaryCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'password_vault.c';
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
                <p className="text-green-300 mt-2">Password logic reversed and vault unlocked!</p>
            </div>
        )}

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <KeyRound className="w-8 h-8 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Password Vault - Logic Reversing</h2>
            </div>

            <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> This C executable checks for a password. Your task is to reverse engineer the password check logic to find the flag.</p>

            {/* Hints Section */}
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Hints:</span>
                </div>
                <div className="text-yellow-200 text-sm space-y-1">
                    <p>💡 The password is not stored in plain text. Look for the function that transforms the user's input.</p>
                    <p>💡 The program compares the transformed input to a hardcoded byte array.</p>
                    <p>💡 Reverse the transformation to discover the original password.</p>
                </div>
            </div>

            {/* Tutorial Dropdown */}
            <div className="mb-6">
                <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
                    📚 Password Reversing Tutorial:
                </label>
                <select
                    id="tutorial-select"
                    className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={selectedTutorial}
                    onChange={(e) => setSelectedTutorial(e.target.value)}
                >
                    <option value="" disabled>Choose a tutorial topic...</option>
                    <option value="basics">📚 CrackMe Basics</option>
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
                                    <p><strong>📚 Basics:</strong> CrackMes are programs designed to be reverse engineered. They often involve finding a password, serial key, or bypassing a check. This one focuses on reversing a simple data transformation algorithm.</p>
                                </div>
                            )}

                            {selectedTutorial === 'goal' && (
                                <div>
                                    <p><strong>🎯 Goal:</strong> Your goal is to understand the `validate_password` function. You need to figure out how it modifies your input and what it compares the result to. Once you know that, you can deduce the correct password.</p>
                                </div>
                            )}

                            {selectedTutorial === 'solution' && (
                                <div>
                                    <p><strong>⚡ Solution:</strong></p>
                                    <p>• <strong>Step 1:</strong> Analyze the `validate_password` function. You'll see it XORs each character of your input with the number `42`.</p>
                                    <p>• <strong>Step 2:</strong> It then compares this XORed string to a hardcoded byte array: {`{0x78, 0x11, ...}`}.</p>
                                    <p>• <strong>Step 3:</strong> To find the original password, XOR each byte of the target array with `42`.</p>
                                    <p>• <strong>Step 4:</strong> For example, `0x78 ^ 42 = 82`, which is the ASCII code for 'R'. Do this for all bytes to get the password.</p>
                                </div>
                            )}

                            {selectedTutorial === 'explanation' && (
                                <div>
                                    <p><strong>🔍 Why It Works:</strong> The program doesn't store the password directly. Instead, it stores a transformed version of it. By reversing the transformation (XORing with the same key), you can recover the original secret password from the stored data.</p>
                                </div>
                            )}

                            {selectedTutorial === 'result' && (
                                <div>
                                    <p><strong>🏆 Expected Result:</strong> You will find the password is "R3v3rs3M3!", which then gives you the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{'}password_logic_reversed{'}'}</code></p>
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
                    Download Source Code
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
                        <div>$ ./password_vault</div>
                        <div>Enter vault password:</div>
                    </div>
                    <div className="flex gap-2 mb-2">
                        <input 
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter password"
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

export default PasswordVault;

