
import React, { useState, useRef } from 'react';
import { CheckCircle, XCircle, Lightbulb, Download, Eye, BookOpen, UploadCloud, Shield, BrainCircuit, Info } from 'lucide-react';

interface MetadataMessProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const EXIFExplanation: React.FC = () => {
  return (
    <div className="prose prose-invert bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto text-gray-300">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center gap-3"><BookOpen /> EXIF Metadata: The Hidden Data in Your Photos</h2>
      <p className="text-lg">EXIF (Exchangeable Image File Format) is a standard that specifies the formats for images, sound, and ancillary tags used by digital cameras, scanners, and other systems handling image and sound files recorded by digital cameras.</p>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center gap-3"><Info /> What is EXIF Data?</h3>
        <p>EXIF data is a set of metadata embedded in image files. It can include:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Camera Information:</strong> Make, model, and serial number.</li>
          <li><strong>Image Settings:</strong> Aperture, shutter speed, ISO, and focal length.</li>
          <li><strong>Timestamps:</strong> Date and time the photo was taken.</li>
          <li><strong>GPS Coordinates:</strong> Location where the photo was taken.</li>
          <li><strong>Custom Fields:</strong> User comments, copyright information, or any other custom text.</li>
        </ul>
        <p>In steganography challenges, the flag is often hidden in one of these custom fields.</p>
      </div>
    </div>
  );
};

const EXIFTool: React.FC = () => {
  const [metadata, setMetadata] = useState<any>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');
    setMetadata(null);

    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        // In a real application, you would use a library to parse EXIF data.
        // For this challenge, we will simulate the extraction.
        if(file.name === 'challenge_metadata_mess.jpg') {
            setMetadata({ 'ImageDescription': 'A beautiful landscape', 'UserComment': 'flag{exif_data_hunter}' });
        } else {
            setError('This image does not contain the required metadata for this challenge.');
        }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">EXIF Metadata Viewer</h3>
      <div className="flex items-center gap-4 mb-4">
        <input type="file" accept="image/jpeg" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"><UploadCloud className="w-4 h-4" /> Upload JPG Image</button>
      </div>
      {error && <p className="mt-4 text-red-400">{error}</p>}
      {metadata && (
        <div className="mt-4">
          <h4 className="font-semibold text-cyan-400">Extracted Metadata:</h4>
          <pre className="bg-gray-900 p-4 rounded text-white whitespace-pre-wrap break-all text-sm">{JSON.stringify(metadata, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const MetadataMess: React.FC<MetadataMessProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('learn');

  const correctFlag = 'flag{exif_data_hunter}';

  const createChallengeImage = () => {
    // In a real scenario, the file would be pre-made with EXIF data.
    // We will simulate the download here.
    const link = document.createElement('a');
    link.href = '/challenges/steganography/metadata_mess.jpg'; // This should be a pre-made file
    link.download = 'challenge_metadata_mess.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {activeTab === 'learn' && <EXIFExplanation />}
      
      {activeTab === 'challenge' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Challenge: Metadata Mess</h2>
          <p className="text-gray-400 mb-4">The flag is hidden in the EXIF metadata of this image. Download the image and use the tool to find the flag.</p>
          
          <div className="flex gap-4 mb-4">
            <button onClick={createChallengeImage} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"><Download className="w-4 h-4" /> Download Challenge Image</button>
          </div>

          <EXIFTool />
          
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

export default MetadataMess;
