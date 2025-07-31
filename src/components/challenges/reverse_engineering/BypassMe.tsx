import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Terminal, Download, Shuffle, Play, Code, BookOpen, Shield, BrainCircuit, Eye } from 'lucide-react';

interface BypassMeProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const XORExplanation: React.FC = () => {
  return (
    <div className="prose prose-invert bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto text-gray-300">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center gap-3"><BookOpen /> XOR Encryption: The Foundation of Modern Cryptography</h2>
      
      <p className="text-lg">Welcome to the world of reverse engineering! Today we're exploring one of the most fundamental cryptographic operations: the XOR (Exclusive OR) cipher. XOR is not just a building block of many encryption algorithms, but also a common technique used by malware authors to obfuscate their code and evade detection.</p>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center gap-3"><Eye /> How Does XOR Work? A Bit-by-Bit Guide</h3>
        <p>XOR is a logical operation that compares two bits and returns 1 if they are different, and 0 if they are the same. This simple property makes it perfect for encryption because XOR is its own inverse operation.</p>
        <p>The magic of XOR encryption lies in this property: <code>(plaintext XOR key) XOR key = plaintext</code>. This means the same operation that encrypts data can also decrypt it!</p>
        
        <div className="bg-gray-900/50 p-4 rounded-lg my-4">
          <p><strong>XOR Truth Table:</strong></p>
          <ul className="list-disc list-inside space-y-2">
            <li>0 XOR 0 = <strong className="text-green-400">0</strong></li>
            <li>0 XOR 1 = <strong className="text-green-400">1</strong></li>
            <li>1 XOR 0 = <strong className="text-green-400">1</strong></li>
            <li>1 XOR 1 = <strong className="text-green-400">0</strong></li>
          </ul>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg my-4">
          <p><strong>Example:</strong> Let's encrypt the letter 'A' (ASCII 65, binary <code>01000001</code>) with key 121 (binary <code>01111001</code>):</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Plaintext 'A': <code>01000001</code></li>
            <li>Key 121:      <code>01111001</code></li>
            <li>XOR Result:   <code>00111000</code> (ASCII 56, character '8')</li>
          </ul>
          <p>To decrypt, we XOR the result with the same key:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Encrypted '8': <code>00111000</code></li>
            <li>Key 121:       <code>01111001</code></li>
            <li>XOR Result:    <code>01000001</code> (ASCII 65, back to 'A'!)</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center gap-3"><BrainCircuit /> Cryptanalysis: Breaking XOR Ciphers</h3>
        <p>While XOR can be secure when used properly (like in One-Time Pads), simple implementations are vulnerable to cryptanalysis. The most common weakness is key reuse, especially with short keys.</p>
        <p><strong>Known Plaintext Attack:</strong> If you know a portion of the plaintext (like knowing flags start with "flag{'{'}"), you can recover the key by XORing the known plaintext with the corresponding ciphertext.</p>
        <p><strong>Frequency Analysis:</strong> For longer messages encrypted with short keys, patterns emerge that can be exploited using statistical analysis.</p>
        
        <div className="bg-gray-900/50 p-4 rounded-lg my-4">
          <p><strong>Breaking Single-Byte XOR:</strong></p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Brute Force:</strong> Try all 256 possible key values (0-255)</li>
            <li><strong>Known Plaintext:</strong> If you know the first character is 'f', XOR it with the first encrypted byte</li>
            <li><strong>Frequency Analysis:</strong> Look for patterns that match English text statistics</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center gap-3"><Shield /> Real-World Applications and Security</h3>
        <p><strong>In Malware:</strong> Attackers often use XOR to obfuscate malicious payloads, configuration data, or network communications to evade antivirus detection.</p>
        <p><strong>In Legitimate Software:</strong> XOR is used in stream ciphers, block cipher modes, and as a component in more complex cryptographic algorithms like AES.</p>
        <p><strong>In CTF Challenges:</strong> XOR puzzles teach fundamental cryptographic concepts and reverse engineering skills essential for cybersecurity professionals.</p>
        
        <div className="bg-gray-900/50 p-4 rounded-lg my-4">
          <p><strong>Defense Strategies:</strong></p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Entropy Analysis:</strong> Encrypted data often has different statistical properties than normal data</li>
            <li><strong>Pattern Recognition:</strong> Look for repeating patterns that might indicate key reuse</li>
            <li><strong>Automated Tools:</strong> Use tools like xortool, xor-analyze, or custom scripts for analysis</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const BypassMe: React.FC<BypassMeProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [showBinary, setShowBinary] = useState(false);
  const [binaryOutput, setBinaryOutput] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');
  const [showLearn, setShowLearn] = useState(false);

  const correctFlag = 'flag{xor_decoded_master}';

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
    setBinaryOutput('Encoded flag: [0x1f, 0x01, 0x1c, 0x0e, 0x07, 0x1d, 0x0c, 0x01, 0x10, 0x07, 0x11, 0x00, 0x1b, 0x01, 0x0f, 0x0a]');
  };

  const downloadBinary = () => {
    const binaryCode = `#include <stdio.h>

int main() {
    char encoded_flag[] = {0x1f, 0x01, 0x1c, 0x0e, 0x07, 0x1d, 0x0c, 0x01, 0x10, 0x07, 0x11, 0x00, 0x1b, 0x01, 0x0f, 0x0a, 0x00};
    // The flag is XORed with a secret key. Find the key and decode it!
    printf("Encoded flag: %s\n", encoded_flag);
    return 0;
}`;
    
    const blob = new Blob([binaryCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bypass_me.c';
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
          <p className="text-green-300 mt-2">XOR decoding successful!</p>
        </div>
      )}

      {/* Learn Section Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowLearn(!showLearn)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          {showLearn ? 'Hide' : 'Learn'} XOR Encryption
        </button>
      </div>

      {/* Learn Section */}
      {showLearn && <XORExplanation />}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Bypass Me - XOR Decoding</h2>
        </div>
        
        <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> This binary contains a flag that has been XOR-encoded. Your task is to reverse the XOR operation to reveal the flag.</p>
        
        {/* Hints Section */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Hints:</span>
          </div>
          <div className="text-yellow-200 text-sm space-y-1">
            <p>💡 The flag is likely hidden inside the binary as an array of bytes.</p>
            <p>💡 XOR is its own inverse: <code className="bg-gray-800 px-1 rounded">(A XOR B) XOR B = A</code>.</p>
            <p>💡 The key might be a single byte. Try XORing the encoded bytes against common values (like 0-255).</p>
            <p>💡 The flag starts with <code className="bg-gray-800 px-1 rounded">flag{'{'}</code>. This is a powerful clue for finding the key!</p>
          </div>
        </div>

        {/* Tutorial Dropdown */}
        <div className="mb-6">
          <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
            📚 XOR Decoding Tutorial:
          </label>
          <select
            id="tutorial-select"
            className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={selectedTutorial}
            onChange={(e) => setSelectedTutorial(e.target.value)}
          >
            <option value="" disabled>Choose a tutorial topic...</option>
            <option value="basics">📚 The Basics of XOR Encryption</option>
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
                                    <p><strong>📚 Basics:</strong> XOR is a logical operation that outputs true only when inputs differ. In cryptography, it's used to combine plaintext with a key. Because (data XOR key) XOR key = data, it's a simple way to encrypt and decrypt information if you have the key.</p>
                                </div>
                            )}

                {selectedTutorial === 'goal' && (
                  <div>
                    <p><strong>🎯 Goal:</strong> Your goal is to find the single-byte key used to XOR-encrypt the flag. Since you know the flag starts with 'f', you can derive the key by calculating the result of 'f' XORed with the first encoded byte.</p>
                  </div>
                )}

                {selectedTutorial === 'solution' && (
                  <div>
                    <p><strong>⚡ Solution:</strong></p>
                    <p>• <strong>Step 1:</strong> The first encoded byte is <code className="bg-gray-800 px-1 rounded">0x1f</code>.</p>
                    <p>• <strong>Step 2:</strong> The first character of the flag is 'f', which is <code className="bg-gray-800 px-1 rounded">0x66</code> in ASCII.</p>
                    <p>• <strong>Step 3:</strong> Calculate the key: <code className="bg-gray-800 px-1 rounded">0x1f XOR 0x66 = 0x79</code>. The key is <code className="bg-gray-800 px-1 rounded">0x79</code>.</p>
                    <p>• <strong>Step 4:</strong> Write a script to XOR each byte in the encoded array with <code className="bg-gray-800 px-1 rounded">0x79</code> to get the full flag.</p>
                  </div>
                )}

                {selectedTutorial === 'explanation' && (
                  <div>
                    <p><strong>🔍 Why It Works:</strong> The challenge relies on a fixed, single-byte key for encryption. By knowing a piece of the original plaintext (the "crib" <code className="bg-gray-800 px-1 rounded">flag{'{'}</code>), we can reverse the operation on the corresponding ciphertext to find the key. Once the key is known, we can decrypt the entire message.</p>
                  </div>
                )}

                {selectedTutorial === 'result' && (
                  <div>
                    <p><strong>🏆 Expected Result:</strong> After decoding the byte array with the key, you will reveal the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{'}xor_decoded_master{'}'}</code></p>
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
              <div>$ ./bypass_me</div>
            </div>
            <div className="flex gap-2 mb-2">
              <button 
                onClick={handleBinaryRun}
                className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
              >
                Run Binary
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

export default BypassMe;
