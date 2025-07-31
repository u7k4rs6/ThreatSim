import React, { useState } from 'react';
import { Shield, CheckCircle, Terminal, Lightbulb, Upload } from 'lucide-react';

const RCECarnival: React.FC<{ onComplete: (flag: string) => void; isCompleted: boolean; }> = ({ onComplete, isCompleted }) => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [command, setCommand] = useState('');
  const [commandOutput, setCommandOutput] = useState('');
  const [shellAccess, setShellAccess] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState('');

  // --- Core Challenge Logic (Preserved) ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isCompleted) return;
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.php') || file.name.endsWith('.phtml')) {
        setUploadStatus(`Success: '${file.name}' uploaded. Shell access granted!`);
        setShellAccess(true);
      } else {
        setUploadStatus(`Error: Invalid file type. The server rejected '${file.name}'.`);
        setShellAccess(false);
      }
    }
  };

  const executeCommand = () => {
    if (!shellAccess || isCompleted) return;
    let output = `> ${command}\n`;
    switch (command.toLowerCase().trim()) {
      case 'whoami':
        output += 'www-data';
        break;
      case 'ls':
      case 'ls -la':
        output += 'drwxr-xr-x 2 www-data www-data 4096 Jul 29 19:00 .\n-rw-r--r-- 1 www-data www-data  118 Jul 29 18:30 index.php\n-rw-r--r-- 1 www-data www-data   36 Jul 29 18:30 flag.txt';
        break;
      case 'cat flag.txt':
        const flag = 'flag{remote_code_execution_achieved}';
        output += flag;
        onComplete(flag);
        break;
      case 'pwd':
        output += '/var/www/html';
        break;
      default:
        output += `sh: command not found: ${command}`;
    }
    setCommandOutput(output);
    setCommand('');
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
          <p className="text-green-300 mt-2">Remote Code Execution achieved!</p>
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">RCE Carnival</h2>
        </div>

        <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> Exploit a file upload vulnerability to get a web shell, then execute commands to find and read the flag file.</p>

        {/* Hints Section */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Hints:</span>
          </div>
          <div className="text-yellow-200 text-sm space-y-1">
            <p>💡 The server claims to only want images, but is the filter effective? Try uploading a file with a `.php` extension.</p>
            <p>💡 You don't need to create a real file; the simulation only checks the filename.</p>
            <p>💡 Once you have a shell, use standard Linux commands like `ls` to list files.</p>
            <p>💡 After you find the flag file, use the `cat` command to read its contents.</p>
          </div>
        </div>

        {/* Tutorial Dropdown */}
        <div className="mb-6">
          <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
            📚 RCE Attack Tutorial:
          </label>
          <select
            id="tutorial-select"
            className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={selectedTutorial}
            onChange={(e) => setSelectedTutorial(e.target.value)}
          >
            <option value="" disabled>Choose a tutorial topic...</option>
            <option value="basics">📚 RCE Basics</option>
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
                    <p><strong>📚 Basics:</strong> Remote Code Execution (RCE) allows an attacker to run arbitrary commands on the server. A common way to achieve RCE is by exploiting an unrestricted file upload vulnerability to place a "web shell" (a malicious script) on the server.</p>
                  </div>
                )}
                {selectedTutorial === 'goal' && (
                  <div>
                    <p><strong>🎯 Goal:</strong> This is a two-step challenge. First, bypass the file filter to upload a PHP shell. Second, use the resulting command interface to explore the file system and find the flag.</p>
                  </div>
                )}
                {selectedTutorial === 'solution' && (
                  <div>
                    <p><strong>⚡ Solution:</strong></p>
                    <p>1. Create an empty file on your computer and name it `shell.php`.</p>
                    <p>2. Upload this file using the form.</p>
                    <p>3. In the web shell that appears, type `ls` and press Enter.</p>
                    <p>4. You will see `flag.txt`. Now type `cat flag.txt` and press Enter to get the flag.</p>
                  </div>
                )}
                {selectedTutorial === 'explanation' && (
                  <div>
                    <p><strong>🔍 Why It Works:</strong> The server has a weak security check that only inspects the file extension. By uploading a `.php` file, you bypass this filter. The server then treats this file as executable code, giving you a direct line to run commands on the system as the web server user (`www-data`).</p>
                  </div>
                )}
                {selectedTutorial === 'result' && (
                  <div>
                    <p><strong>🏆 Expected Result:</strong> You will gain command execution, find the flag file, read it, and obtain the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{remote_code_execution_achieved}'}</code></p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Elements */}
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            <h3 className="font-semibold text-white flex items-center gap-2"><Upload className="w-5 h-5 text-cyan-400" /> Step 1: Upload a Shell</h3>
            <label htmlFor="file-upload" className="w-full text-sm p-4 flex flex-col items-center justify-center bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700">
              <Upload className="w-8 h-8 text-gray-400 mb-2"/>
              <span className="text-gray-300">Click to select a file</span>
              <span className="text-xs text-gray-500">(e.g., shell.php)</span>
            </label>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} disabled={isCompleted} />
            {uploadStatus && <p className={`text-center text-sm p-2 rounded ${uploadStatus.includes('Success') ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>{uploadStatus}</p>}
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-white flex items-center gap-2"><Terminal className="w-5 h-5 text-cyan-400" /> Step 2: Execute Commands</h3>
            <div className={`bg-black p-4 rounded-lg font-mono text-sm border ${shellAccess ? 'border-cyan-500' : 'border-gray-600'}`}>
              <div className="flex items-center gap-2">
                <span className={shellAccess ? "text-green-400" : "text-gray-500"}>$</span>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                  placeholder={shellAccess ? "Enter command..." : "No shell access"}
                  className="flex-1 bg-transparent border-none outline-none text-white"
                  disabled={!shellAccess || isCompleted}
                />
              </div>
              {commandOutput && <pre className="text-gray-300 mt-2 whitespace-pre-wrap">{commandOutput}</pre>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RCECarnival;