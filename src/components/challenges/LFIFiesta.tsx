import React, { useState } from 'react';
import { FileText, CheckCircle, Lightbulb } from 'lucide-react';

const LFIFiesta: React.FC<{ onComplete: (flag: string) => void; isCompleted: boolean; }> = ({ onComplete, isCompleted }) => {
  const [path, setPath] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- Core Challenge Logic & Helpers (Preserved) ---
  const files = {
    '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000::/home/user:/bin/sh',
    '/etc/shadow': 'root:$6$rounds=...: (Permission Denied)',
    '/var/log/apache2/access.log': '127.0.0.1 - - [29/Jul/2025:19:01:41 +0530] "GET /page?file=... HTTP/1.1"',
    '/var/www/html/index.php': '<?php\n  $file = $_GET["file"];\n  include($file);\n?>',
    '/var/www/html/config.php': '<?php\n  // Flag is not here\n  $db_user = "webapp";\n?>',
    '/var/www/html/flag.txt': 'flag{file_inclusion_master}'
  };

  const readFile = () => {
    if (!path || isLoading || isCompleted) return;
    setIsLoading(true);
    setTimeout(() => {
      const content = files[path as keyof typeof files] || 'Error: File not found or permission denied.';
      setFileContent(content);
      if (path === '/var/www/html/flag.txt') {
        onComplete('flag{file_inclusion_master}');
      }
      setIsLoading(false);
    }, 500);
  };

  // --- Refactored JSX ---
  return (
    <div className="space-y-6">
      {isCompleted && (
        <div className="bg-green-900/50 border border-green-500 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Challenge Completed!</span>
          </div>
          <p className="text-green-300 mt-2">LFI vulnerability successfully exploited!</p>
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">LFI Fiesta</h2>
        </div>

        <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> Exploit a Local File Inclusion (LFI) vulnerability to read sensitive files on the server and find the hidden flag.</p>

        {/* Hints Section */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold">Hints:</span>
          </div>
          <div className="text-yellow-200 text-sm space-y-1">
            <p>💡 LFI lets you read files on the server. Start with a common one like `/etc/passwd` to test it.</p>
            <p>💡 Web server files are often located in `/var/www/html/`.</p>
            <p>💡 The flag is probably in a file named something obvious, like `flag.txt` or `config.php`.</p>
            <p>💡 Try combining directory paths with filenames to find the flag.</p>
          </div>
        </div>

        {/* Tutorial Dropdown */}
        <div className="mb-6">
          <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
            📚 LFI Attack Tutorial:
          </label>
          <select
            id="tutorial-select"
            className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={selectedTutorial}
            onChange={(e) => setSelectedTutorial(e.target.value)}
          >
            <option value="" disabled>Choose a tutorial topic...</option>
            <option value="basics">📚 LFI Basics</option>
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
                    <p><strong>📚 Basics:</strong> Local File Inclusion (LFI) is a vulnerability where an attacker can trick a web application into exposing or running files on the web server. It happens when the application uses user-supplied input to access files without proper validation.</p>
                  </div>
                )}
                {selectedTutorial === 'goal' && (
                  <div>
                    <p><strong>🎯 Goal:</strong> Your goal is to explore the server's file system by providing different file paths. You need to locate and read the contents of the file that contains the flag.</p>
                  </div>
                )}
                {selectedTutorial === 'solution' && (
                  <div>
                    <p><strong>⚡ Solution:</strong> Enter the following absolute path into the input box and click "Read File":</p>
                    <p className="pl-4 mt-2"><code className="bg-gray-800 px-2 py-1 rounded font-mono">/var/www/html/flag.txt</code></p>
                  </div>
                )}
                {selectedTutorial === 'explanation' && (
                  <div>
                    <p><strong>🔍 Why It Works:</strong> The application's backend code takes the path you provide and directly attempts to read that file from the server's disk. Because there is no input validation to restrict which directories you can access (a technique called "path traversal"), you can read any file the web server process has permissions for.</p>
                  </div>
                )}
                {selectedTutorial === 'result' && (
                  <div>
                    <p><strong>🏆 Expected Result:</strong> The content of the file will be displayed, revealing the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{file_inclusion_master}'}</code></p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Elements */}
        <div className="space-y-4">
          <div>
            <label htmlFor="path-input" className="block text-sm text-gray-300 mb-1">File to Include:</label>
            <div className="flex gap-2">
              <input
                id="path-input"
                type="text"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && readFile()}
                placeholder="/etc/passwd"
                disabled={isCompleted}
                className="w-full p-2 bg-gray-900/50 rounded text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button onClick={readFile} disabled={isLoading || isCompleted} className="px-6 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                {isLoading ? 'Reading...' : 'Read File'}
              </button>
            </div>
          </div>
          {fileContent && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">File Content:</label>
              <pre className="bg-black p-4 rounded font-mono text-sm text-gray-300 whitespace-pre-wrap border border-gray-700 max-h-48 overflow-y-auto">{fileContent}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LFIFiesta;