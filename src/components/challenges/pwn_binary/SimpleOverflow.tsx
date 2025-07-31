import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Terminal, Download, Play, AlertTriangle } from 'lucide-react';

interface SimpleOverflowProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const SimpleOverflow: React.FC<SimpleOverflowProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');

  const correctFlag = 'flag{stack_smashing_fun}';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flag === correctFlag) {
      setMessage('Correct flag! Well done.');
      onComplete(flag);
    } else {
      setMessage('Incorrect flag. Keep trying!');
    }
  };

  const downloadBinary = () => {
    const link = document.createElement('a');
    link.href = '/challenges/pwn_binary/simple_overflow';
    link.download = 'simple_overflow';
    link.click();
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Challenge: Simple Overflow</h2>
      <p className="text-gray-400 mb-4">This C binary has a simple buffer overflow vulnerability. Exploit it to get the flag!</p>
      
      <div className="flex gap-4 mb-4">
        <button 
          onClick={downloadBinary}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Binary
        </button>
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

      <div className="mt-6">
        <h3 className="text-xl font-bold text-white mb-2">Hints & Tutorial</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-cyan-400 flex items-center gap-2"><Lightbulb className="w-5 h-5" /> Hint 1</h4>
            <p className="text-gray-300">The vulnerability is in a function that reads user input into a small buffer.</p>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400 flex items-center gap-2"><Lightbulb className="w-5 h-5" /> Hint 2</h4>
            <p className="text-gray-300">Overwrite the return address on the stack to redirect execution to a `win` function.</p>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400 flex items-center gap-2"><Terminal className="w-5 h-5" /> Tutorial</h4>
            <p className="text-gray-300">1. Download the binary and analyze it with a disassembler.</p>
            <p className="text-gray-300">2. Find the buffer overflow vulnerability.</p>
            <p className="text-gray-300">3. Craft a payload that overwrites the return address with the address of the `win` function.</p>
            <p className="text-gray-300">4. Send the payload to the binary to get the flag.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleOverflow;
