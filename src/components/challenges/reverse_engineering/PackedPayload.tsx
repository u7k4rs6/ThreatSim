import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Terminal, Download, Package } from 'lucide-react';

interface PackedPayloadProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const PackedPayload: React.FC<PackedPayloadProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');

  const correctFlag = 'flag{unpacked_successfully}';

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
                <p className="text-green-300 mt-2">Payload unpacked and flag captured!</p>
            </div>
        )}

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <Package className="w-8 h-8 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Packed Payload - Unpacking</h2>
            </div>

            <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> This ELF binary has been packed with UPX or a custom packer. Your task is to unpack it and analyze the original binary to find the flag.</p>

            {/* Hints Section */}
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Hints:</span>
                </div>
                <div className="text-yellow-200 text-sm space-y-1">
                    <p>💡 Use the `file` command or a tool like `Detect It Easy` to identify the packer.</p>
                    <p>💡 If it's a common packer like UPX, there's a standard command to unpack it.</p>
                    <p>💡 For manual unpacking, find the Original Entry Point (OEP) by looking for a large jump after the initial unpacking stub.</p>
                </div>
            </div>

            {/* Tutorial Dropdown */}
            <div className="mb-6">
                <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
                    📚 Unpacking Tutorial:
                </label>
                <select
                    id="tutorial-select"
                    className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={selectedTutorial}
                    onChange={(e) => setSelectedTutorial(e.target.value)}
                >
                    <option value="" disabled>Choose a tutorial topic...</option>
                    <option value="basics">📚 Packer Basics</option>
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
                                    <p><strong>📚 Basics:</strong> Packers are tools that compress or encrypt an executable. The packed program contains a "stub" that unpacks the original code into memory at runtime. This is used to make reverse engineering more difficult and to hide the true nature of the code.</p>
                                </div>
                            )}

                            {selectedTutorial === 'goal' && (
                                <div>
                                    <p><strong>🎯 Goal:</strong> Your goal is to bypass the packing layer to get to the original, readable code. For common packers, this can be done automatically. For custom ones, it requires debugging.</p>
                                </div>
                            )}

                            {selectedTutorial === 'solution' && (
                                <div>
                                    <p><strong>⚡ Solution (UPX):</strong></p>
                                    <p>• <strong>Step 1:</strong> Run `file packed_payload`. It will identify the file as being packed with UPX.</p>
                                    <p>• <strong>Step 2:</strong> Run `upx -d packed_payload -o unpacked_payload`.</p>
                                    <p>• <strong>Step 3:</strong> Run `strings unpacked_payload` to find the flag inside the now-unpacked binary.</p>
                                </div>
                            )}

                            {selectedTutorial === 'explanation' && (
                                <div>
                                    <p><strong>🔍 Why It Works:</strong> UPX is a well-known packer, and its authors provide the tool to both pack and unpack files. The `-d` flag tells the UPX tool to perform the decompression/decryption operation, restoring the binary to its original state and revealing the hidden code and data.</p>
                                </div>
                            )}

                            {selectedTutorial === 'result' && (
                                <div>
                                    <p><strong>🏆 Expected Result:</strong> After unpacking, you can analyze the binary normally and find the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{'}unpacked_successfully{'}'}</code></p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <a href="/challenges/reverse_engineering/packed_payload" download className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
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

export default PackedPayload;
