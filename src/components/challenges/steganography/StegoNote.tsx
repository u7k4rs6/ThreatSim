import React, { useState, useRef } from 'react';
import { CheckCircle, XCircle, Lightbulb, Download, Eye, BookOpen, UploadCloud, Shield, BrainCircuit, FileText } from 'lucide-react';

interface StegoNoteProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const ZeroWidthExplanation: React.FC = () => {
  return (
    <div className="prose prose-invert bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto text-gray-300">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center gap-3"><BookOpen /> Zero-Width Steganography</h2>
      <p className="text-lg">Zero-width characters are non-printing characters in Unicode that can be used to hide data in plain text. Because they are invisible, they can be inserted into a text document without altering its appearance.</p>
    </div>
  );
};

const StegoNote: React.FC<StegoNoteProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('learn');

  const correctFlag = 'flag{zero_width_ninja}';

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
    // This is the main container div for the StegoNote component's content
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <div className="flex border-b border-gray-700 mb-6">
        <button onClick={() => setActiveTab('learn')} className={`flex items-center gap-2 px-4 py-2 transition-colors ${activeTab === 'learn' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
          <BookOpen size={18} /> Learn
        </button>
        <button onClick={() => setActiveTab('challenge')} className={`flex items-center gap-2 px-4 py-2 transition-colors ${activeTab === 'challenge' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
          <Eye size={18} /> Challenge
        </button>
      </div>

      {activeTab === 'learn' && <ZeroWidthExplanation />}
      
      {activeTab === 'challenge' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Challenge: StegoNote</h2>
          <p className="text-gray-400 mb-4">This challenge is currently under development. Please check back later.</p>
          {/* You would typically add your flag submission form here for the challenge */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
            <input
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="Enter flag here (e.g., flag{...})"
              className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
              disabled={isCompleted}
            />
            <button
              type="submit"
              className={`py-2 px-4 rounded font-semibold transition-colors ${
                isCompleted
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : 'bg-pink-600 hover:bg-pink-700 text-white'
              }`}
              disabled={isCompleted}
            >
              {isCompleted ? 'Completed!' : 'Submit Flag'}
            </button>
            {message && (
              <p className={`mt-2 text-sm ${isCompleted ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      )}
    </div> // This is the single, correct closing div for the main container.
  );
};

export default StegoNote;