
import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Download, Eye, BookOpen, UploadCloud, Shield, BrainCircuit, File, Layers } from 'lucide-react';

interface PDFceptionProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const PDFSteganographyExplanation: React.FC = () => {
  return (
    <div className="prose prose-invert bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto text-gray-300">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center gap-3"><BookOpen /> PDF Steganography: Hiding Data in Documents</h2>
      <p className="text-lg">PDF steganography involves hiding data within the structure of a PDF file. This can be done in various ways, such as using layers, embedding files, or manipulating metadata.</p>
    </div>
  );
};

const PDFception: React.FC<PDFceptionProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('learn');

  const correctFlag = 'flag{pdf_layers_expert}';

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

      {activeTab === 'learn' && <PDFSteganographyExplanation />}
      
      {activeTab === 'challenge' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Challenge: PDFception</h2>
          <p className="text-gray-400 mb-4">This challenge is currently under development. Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default PDFception;

