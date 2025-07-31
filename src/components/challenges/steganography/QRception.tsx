
import React, { useState, useRef } from 'react';
import { CheckCircle, XCircle, Lightbulb, Download, Eye, BookOpen, UploadCloud, Shield, BrainCircuit, QrCode } from 'lucide-react';

interface QRceptionProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const QRExplanation: React.FC = () => {
  return (
    <div className="prose prose-invert bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto text-gray-300">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center gap-3"><BookOpen /> QR Code Steganography</h2>
      <p className="text-lg">QR code steganography involves hiding data within QR codes. This can be as simple as a QR code that decodes to a flag, or more complex, like a QR code that decodes to another QR code.</p>
    </div>
  );
};

const QRception: React.FC<QRceptionProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('learn');

  const correctFlag = 'flag{qr_in_qr_inception}';

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

      {activeTab === 'learn' && <QRExplanation />}
      
      {activeTab === 'challenge' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Challenge: QRception</h2>
          <p className="text-gray-400 mb-4">This challenge is currently under development. Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default QRception;
