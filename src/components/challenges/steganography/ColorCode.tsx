
import React, { useState, useRef } from 'react';
import { CheckCircle, XCircle, Lightbulb, Download, Eye, BookOpen, UploadCloud, Shield, BrainCircuit, Palette } from 'lucide-react';

interface ColorCodeProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const ColorChannelExplanation: React.FC = () => {
  return (
    <div className="prose prose-invert bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto text-gray-300">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center gap-3"><BookOpen /> Color Channel Steganography</h2>
      <p className="text-lg">Color channel steganography is a technique where data is hidden in one or more of the color channels of an image. Each pixel in an image has a color value, typically represented as a combination of Red, Green, and Blue (RGB). By manipulating the values of these channels, we can embed a secret message.</p>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center gap-3"><Palette /> How It Works</h3>
        <p>In this challenge, the flag is hidden by encoding it as variations in the color channels. For example, a character can be hidden by setting the Red channel value to its ASCII code, while the Green and Blue channels are set to a neutral value like 0. When you view the individual color channels, the hidden message becomes visible.</p>
      </div>
    </div>
  );
};

const ColorChannelTool: React.FC = () => {
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');

    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        originalImageRef.current = img;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
    };
    reader.readAsDataURL(file);
  };

  const viewChannel = (channel: 'R' | 'G' | 'B' | 'Original') => {
    if (!originalImageRef.current) {
      setError('Please upload an image first.');
      return;
    }
    
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(originalImageRef.current, 0, 0);

    if (channel === 'Original') {
      return;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = channel === 'R' ? data[i] : 0;
      data[i + 1] = channel === 'G' ? data[i + 1] : 0;
      data[i + 2] = channel === 'B' ? data[i + 2] : 0;
    }
    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">Interactive Color Channel Viewer</h3>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"><UploadCloud className="w-4 h-4" /> Upload Image</button>
        <button onClick={() => viewChannel('R')} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">View Red</button>
        <button onClick={() => viewChannel('G')} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">View Green</button>
        <button onClick={() => viewChannel('B')} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">View Blue</button>
        <button onClick={() => viewChannel('Original')} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">Reset View</button>
      </div>
      {error && <p className="mt-4 text-red-400">{error}</p>}
      <canvas ref={canvasRef} width="500" height="100" className="bg-gray-900 rounded-lg w-full"></canvas>
    </div>
  );
};

const ColorCode: React.FC<ColorCodeProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('learn');

  const correctFlag = 'flag{rgb_stego_revealed}';

  const createChallengeImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 300;
    canvas.height = 100;
    
    const flagText = correctFlag;
    for (let i = 0; i < flagText.length; i++) {
      const charCode = flagText.charCodeAt(i);
      // Hide the character's ASCII value in the red channel
      ctx.fillStyle = `rgb(${charCode}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
      ctx.fillRect(i * 10, 0, 10, 100);
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'challenge_color_code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
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

      {activeTab === 'learn' && <ColorChannelExplanation />}
      
      {activeTab === 'challenge' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Challenge: Color Code</h2>
          <p className="text-gray-400 mb-4">The flag is hidden in the color channels of this image. Generate the image and use the tool to inspect the color channels.</p>
          
          <div className="flex gap-4 mb-4">
            <button onClick={createChallengeImage} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"><Download className="w-4 h-4" /> Generate & Download Challenge Image</button>
          </div>

          <ColorChannelTool />
          
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

export default ColorCode;
