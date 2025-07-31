import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Terminal, Download, Lock } from 'lucide-react';

interface CryptoTrapProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const CryptoTrap: React.FC<CryptoTrapProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');

  const correctFlag = 'flag{aes_key_extracted}';

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
                <p className="text-green-300 mt-2">AES key successfully extracted and flag decrypted!</p>
            </div>
        )}

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <Lock className="w-8 h-8 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Crypto Trap - AES Decryption</h2>
            </div>
            
            <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> This binary contains a flag encrypted using AES. Your task is to reverse engineer the key derivation process and decrypt the flag.</p>

            {/* Hints Section */}
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Hints:</span>
                </div>
                <div className="text-yellow-200 text-sm space-y-1">
                    <p>💡 Look for standard cryptographic constants or magic numbers used in AES.</p>
                    <p>💡 The key or IV might be hardcoded in the binary. Use the `strings` command or a hex editor to find them.</p>
                    <p>💡 Pay attention to the AES mode of operation (e.g., CBC, ECB) as it affects how decryption is performed.</p>
                </div>
            </div>

            {/* Tutorial Dropdown */}
            <div className="mb-6">
                <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
                    📚 AES Reversing Tutorial:
                </label>
                <select
                    id="tutorial-select"
                    className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={selectedTutorial}
                    onChange={(e) => setSelectedTutorial(e.target.value)}
                >
                    <option value="" disabled>Choose a tutorial topic...</option>
                    <option value="basics">📚 Basics of AES</option>
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
                                    <p><strong>📚 Basics:</strong> AES (Advanced Encryption Standard) is a symmetric block cipher, meaning the same key is used for both encryption and decryption. To reverse it, you need to find the key, the ciphertext (encrypted data), and sometimes an Initialization Vector (IV).</p>
                                </div>
                            )}

                            {selectedTutorial === 'goal' && (
                                <div>
                                    <p><strong>🎯 Goal:</strong> Your goal is to analyze the binary to find the hardcoded AES key and the encrypted flag data. Then, use an external tool or script (like CyberChef) to perform the decryption.</p>
                                </div>
                            )}

                            {selectedTutorial === 'solution' && (
                                <div>
                                    <p><strong>⚡ Solution:</strong></p>
                                    <p>• <strong>Step 1:</strong> Open the binary in Ghidra/IDA and search for string literals. You should find what looks like a key or password.</p>
                                    <p>• <strong>Step 2:</strong> Look for a large block of static data, which is likely the encrypted flag.</p>
                                    <p>• <strong>Step 3:</strong> Identify the AES function calls to confirm the encryption type (e.g., AES-128 CBC).</p>
                                    <p>• <strong>Step 4:</strong> Use an AES decryption tool. Input the key, the ciphertext, and the IV (if any) to decrypt the flag.</p>
                                </div>
                            )}

                            {selectedTutorial === 'explanation' && (
                                <div>
                                    <p><strong>🔍 Why It Works:</strong> Developers often hardcode encryption keys directly in the binary. This is a major security flaw, as anyone with reverse engineering tools can extract these keys. By finding the key and the encrypted data, you have everything needed to reverse the encryption.</p>
                                </div>
                            )}

                            {selectedTutorial === 'result' && (
                                <div>
<p><strong>🏆 Expected Result:</strong> Successful decryption will reveal the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{'}aes_key_extracted{'}'}</code></p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <a href="/challenges/reverse_engineering/crypto_trap" download className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
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

export default CryptoTrap;
