
import React, { useState, useRef } from 'react';
import { CheckCircle, XCircle, Lightbulb, Download, Eye, BookOpen, UploadCloud, Shield, BrainCircuit, Archive } from 'lucide-react';

interface HiddenInPlainSightProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const FileCarvingExplanation: React.FC = () => {
  return (
    <div className="prose prose-invert bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto text-gray-300">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center gap-3"><BookOpen /> File Carving: Uncovering Hidden Files</h2>
      <p className="text-lg">File carving is the process of extracting a collection of data from a larger data set. In steganography, this often means finding and extracting a file that has been hidden inside another file. A common technique is to append one file to another, such as a ZIP archive to a JPG image.</p>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center gap-3"><Archive /> How It Works</h3>
        <p>Most file formats have specific headers (magic numbers) that identify the file type. For example, a JPG image starts with <code>FF D8 FF E0</code>, and a ZIP file starts with <code>PK</code> (<code>50 4B</code>). By appending a ZIP file to a JPG, the image viewer will ignore the extra data at the end, but a file carving tool can detect the ZIP header and extract it.</p>
      </div>
    </div>
  );
};

const FileCarvingTool: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');
    setAnalysisResult('');

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      const uint8 = new Uint8Array(arrayBuffer);
      let headers = '';
      if (uint8[0] === 0xFF && uint8[1] === 0xD8) headers += 'JPG Header Found!\n';
      
      const pkOffset = uint8.findIndex((val, i) => uint8[i] === 0x50 && uint8[i+1] === 0x4B);
      if (pkOffset !== -1) headers += `ZIP Header (PK) Found at offset ${pkOffset}!`;

      setAnalysisResult(headers || 'No common headers found.');
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">File Analysis Tool</h3>
      <div className="flex items-center gap-4 mb-4">
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
        <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"><UploadCloud className="w-4 h-4" /> Upload File</button>
      </div>
      {error && <p className="mt-4 text-red-400">{error}</p>}
      {analysisResult && <pre className="bg-gray-900 p-4 rounded text-white whitespace-pre-wrap break-all text-sm">{analysisResult}</pre>}
    </div>
  );
};

const HiddenInPlainSight: React.FC<HiddenInPlainSightProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('learn');

  const correctFlag = 'flag{file_carving_expert}';

  const createChallengeFile = () => {
    // This is a simplified client-side creation. In a real scenario, the file would be pre-made.
    const a = document.createElement('a');
    a.href = '/challenges/steganography/hidden_plain.jpg'; // This should be a pre-made file
    a.download = 'challenge_hidden_plain.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flag.trim().toLowerCase() === correctFlag) {
      setMessage('Correct flag! Well done.');
      onComplete(flag.trim());
    } else {
      setMessage('Incorrect flag. Keep trying!');
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <div className="flex border-b border-gray-700 mb-6">
        <button onClick={() => setActiveTab('learn')} className={`flex items-center gap-2 px-4 py-2 transition-colors ${activeTab === 'learn' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
          <BookOpen size={18} /> Learn
        </button>
        <button onClick={() => setActiveTab('challenge')} className={`flex items-center gap-2 px-4 py-2 transition-colors ${activeTab === 'challenge' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
          <Eye size={18} /> Challenge
        </button>
      </div>

      {activeTab === 'learn' && <FileCarvingExplanation />}
      
      {activeTab === 'challenge' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Challenge: Hidden In Plain Sight</h2>
          <p className="text-gray-400 mb-4">This JPG image has a ZIP file appended to it. Use the provided tool to find the hidden archive, then use an external tool to extract it and find the flag.</p>
          
          <div className="flex gap-4 mb-4">
            <button onClick={createChallengeFile} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"><Download className="w-4 h-4" /> Download Challenge File</button>
          </div>

          <FileCarvingTool />
          
          <form onSubmit={handleSubmit} className="flex gap-4 items-center mt-6">
            <input 
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="Enter flag here..."
              className="flex-grow p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Flag input"
            />
            <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors">Submit</button>
          </form>

          {message && (
            <div className={`mt-4 flex items-center gap-2 font-semibold ${isCompleted ? 'text-green-400' : 'text-red-400'}`}>
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              <span>{message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HiddenInPlainSight;
