import React, { useState } from 'react';
import { Lightbulb, Upload, CheckCircle, Shield, AlertTriangle } from 'lucide-react';

const UploadInvasion: React.FC<{ onComplete: (flag: string) => void; isCompleted: boolean; }> = ({ onComplete, isCompleted }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setMessage(''); // Clear previous messages
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();
    
    // Simulate a vulnerable backend that checks for malicious extensions
    const isMalicious = [
        '.php', '.phtml', '.php3', '.php4', '.php5', '.php7',
        '.jsp', '.asp', '.aspx', '.sh'
    ].some(ext => fileName.includes(ext));

    if (isMalicious) {
      setMessage('Success! File uploaded and executed. 🎉');
      onComplete('flag{shell_upload_pwned}');
    } else {
      setMessage('Upload failed. The file filter rejected this file type.');
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
          <p className="text-green-300 mt-2">Malicious file successfully uploaded!</p>
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Unrestricted File Upload</h2>
        </div>
        
        <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> Bypass the file upload filter to upload and execute a web shell.</p>
        
        {/* Hints Section */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Hints:</span>
          </div>
          <div className="text-yellow-200 text-sm space-y-1">
            <p>💡 The server claims to only accept images, but is the filter strong enough?</p>
            <p>💡 Try extensions for older versions of languages, like <code className="bg-gray-800 px-1 rounded font-mono">.php5</code>.</p>
            <p>💡 Some servers misinterpret double extensions. What about <code className="bg-gray-800 px-1 rounded font-mono">shell.jpg.php</code>?</p>
            <p>💡 You don't need any actual malicious code in the file, just the right filename.</p>
          </div>
        </div>
        
        {/* Tutorial Dropdown */}
        <div className="mb-6">
          <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
            📚 File Upload Attack Tutorial:
          </label>
          <select 
            id="tutorial-select"
            className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={selectedTutorial}
            onChange={(e) => setSelectedTutorial(e.target.value)}
          >
            <option value="" disabled>Choose a tutorial topic...</option>
            <option value="basics">📚 File Upload Attack Basics</option>
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
                    <p><strong>📚 Basics:</strong> This vulnerability occurs when a server allows users to upload files without properly validating their name, type, or content. Attackers can upload malicious files (e.g., web shells) to execute code on the server.</p>
                  </div>
                )}
                
                {selectedTutorial === 'goal' && (
                  <div>
                    <p><strong>🎯 Goal:</strong> Your goal is to bypass the weak file filter. You need to create a file with a name that the filter misses, allowing it to be "uploaded" and "executed" to get the flag.</p>
                  </div>
                )}
                
                {selectedTutorial === 'solution' && (
                  <div>
                    <p><strong>⚡ Solution:</strong></p>
                    <p>• Create a new, empty file on your computer.</p>
                    <p>• Rename it to something like <code className="bg-gray-800 px-1 rounded">shell.php5</code> or <code className="bg-gray-800 px-1 rounded">image.jpg.php</code>.</p>
                    <p>• Upload this file using the form.</p>
                  </div>
                )}
                
                {selectedTutorial === 'explanation' && (
                  <div>
                    <p><strong>🔍 Why It Works:</strong> The application uses a weak blacklist that might block <code className="bg-gray-800 px-1 rounded">.php</code> but not less common executable extensions like <code className="bg-gray-800 px-1 rounded">.phtml</code> or <code className="bg-gray-800 px-1 rounded">.php5</code>. Alternatively, a double extension like <code className="bg-gray-800 px-1 rounded">.jpg.php</code> can trick a misconfigured server into executing the file based on its final extension.</p>
                  </div>
                )}
                
                {selectedTutorial === 'result' && (
                  <div>
                    <p><strong>🏆 Expected Result:</strong> You will bypass the filter, see a "Success!" message, and receive the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{shell_upload_pwned}</code></p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Upload Form */}
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700/80">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-400" />
                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                {selectedFile ? 
                  <p className="text-xs text-cyan-400">{selectedFile.name}</p> :
                  <p className="text-xs text-gray-500">Allowed: .JPG, .PNG, .GIF (or so it seems...)</p>
                }
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} disabled={isCompleted}/>
            </label>
          </div>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isCompleted}
            className="w-full py-2 px-4 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isCompleted ? 'Completed' : 'Upload'}
          </button>
        </div>
        
        {message && (
          <p className={`mt-4 text-center font-semibold ${message.includes('Success') ? 'text-green-400' : 'text-yellow-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadInvasion;