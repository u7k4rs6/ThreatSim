import React, { useState } from 'react';
import { Eye, Search, Terminal, Lock, CheckCircle, Lightbulb } from 'lucide-react';

const HiddenPanel: React.FC<{ onComplete: (flag: string) => void; isCompleted: boolean; }> = ({ onComplete, isCompleted }) => {
  // --- STATE AND LOGIC (No changes needed here) ---
  const [currentPath, setCurrentPath] = useState('');
  const [explorationResults, setExplorationResults] = useState<string[]>([]);
  const [adminAccess, setAdminAccess] = useState(false);
  const [bruteforceAttempts, setBruteforceAttempts] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState('');

  const hiddenPaths = {
    '/admin': { status: 403, message: 'Forbidden' },
    '/administrator': { status: 403, message: 'Forbidden' },
    '/admin-panel': { status: 403, message: 'Forbidden' },
    '/dashboard': { status: 404, message: 'Not Found' },
    '/secret': { status: 404, message: 'Not Found' },
    '/admin_console_v2': { status: 200, message: 'OK - Authentication Required' },
    '/backup': { status: 403, message: 'Forbidden' },
  };

  const commonPaths = ['/admin', '/dashboard', '/backup', '/secret', '/administrator', '/admin-panel', '/admin_console_v2'];

  const handlePathExploration = (path: string) => {
    if (isCompleted) return;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    setCurrentPath(cleanPath);
    setBruteforceAttempts(prev => prev + 1);
    const pathInfo = hiddenPaths[cleanPath as keyof typeof hiddenPaths];
    const result = pathInfo ? `${cleanPath} - ${pathInfo.status} ${pathInfo.message}` : `${cleanPath} - 404 Not Found`;
    setExplorationResults(prev => [result, ...prev.slice(0, 9)]);
    if (cleanPath === '/admin_console_v2') {
      setAdminAccess(true);
    }
  };

  const runAutoBruteforce = async () => {
    if (isCompleted) return;
    setIsScanning(true);
    for (const path of commonPaths) {
      await new Promise(resolve => setTimeout(resolve, 200));
      handlePathExploration(path);
    }
    setIsScanning(false);
  };

  const handleAdminLogin = (username: string, password: string) => {
    if ((username === 'admin' && password === 'admin') || (username === 'admin' && password === 'password')) {
      onComplete('flag{admin_panel_discovered}');
      return true;
    }
    return false;
  };

  const AdminPanel = () => {
    // This sub-component is self-contained and works well
    const [loginAttempt, setLoginAttempt] = useState({ username: '', password: '' });
    const [loginFailed, setLoginFailed] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (!handleAdminLogin(loginAttempt.username, loginAttempt.password)) {
        setLoginFailed(true);
        setTimeout(() => setLoginFailed(false), 2000);
      }
    };

    return (
      <div className="bg-gray-900 border border-cyan-500 rounded-lg p-6 animate-fadeIn">
        <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" /> Admin Console v2.0
        </h3>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" placeholder="Username" value={loginAttempt.username} onChange={e => setLoginAttempt(p => ({ ...p, username: e.target.value }))} className="w-full p-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <input type="password" placeholder="Password" value={loginAttempt.password} onChange={e => setLoginAttempt(p => ({ ...p, password: e.target.value }))} className="w-full p-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <button type="submit" className="w-full py-2 px-4 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition-colors">Login</button>
        </form>
        {loginFailed && <p className="mt-3 text-center text-red-400">Invalid credentials.</p>}
      </div>
    );
  };

  // --- JSX STRUCTURE ---
  return (
    <div className="space-y-6">
      {isCompleted && (
        <div className="bg-green-900/50 border border-green-500 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Challenge Completed!</span>
          </div>
          <p className="text-green-300 mt-2">You discovered and accessed the hidden admin panel!</p>
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Directory Enumeration</h2>
        </div>
        
        <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> Discover a hidden administrative panel and log in using default credentials.</p>
        
        {/* Hints Section */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Hints:</span>
          </div>
          <div className="text-yellow-200 text-sm space-y-1">
            <p>💡 Websites often have unlinked pages. Try guessing common names.</p>
            <p>💡 A `403 Forbidden` response is interesting. It means the page exists, but you lack permission.</p>
            <p>💡 Developers sometimes add version numbers to paths, like `_v2` or `_new`.</p>
            <p>💡 Once the panel is found, try the most common default username/password combinations.</p>
          </div>
        </div>
        
        {/* Tutorial Dropdown */}
        <div className="mb-6">
          <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
            📚 Directory Enumeration Tutorial:
          </label>
          <select 
            id="tutorial-select"
            className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={selectedTutorial}
            onChange={(e) => setSelectedTutorial(e.target.value)}
          >
            <option value="" disabled>Choose a tutorial topic...</option>
            <option value="basics">📚 The Basics</option>
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
                    <p><strong>📚 Basics:</strong> Directory enumeration (or bruteforcing) is the process of guessing file and directory names on a web server. Attackers use this reconnaissance technique to find hidden login pages, configuration files, or other sensitive information not linked from the main site.</p>
                  </div>
                )}
                
                {selectedTutorial === 'goal' && (
                  <div>
                    <p><strong>🎯 Goal:</strong> This is a two-step challenge. First, you must find the correct path to the hidden admin console. Second, you must guess the weak, default credentials to log in and get the flag.</p>
                  </div>
                )}
                
                {selectedTutorial === 'solution' && (
                  <div>
                    <p><strong>⚡ Solution:</strong></p>
                    <p>• <strong>Step 1:</strong> Click the "Auto Directory Scan" button to find the hidden path, or manually enter <code className="bg-gray-800 px-1 rounded">/admin_console_v2</code>.</p>
                    <p>• <strong>Step 2:</strong> When the login panel appears, use the credentials Username: <code className="bg-gray-800 px-1 rounded">admin</code> and Password: <code className="bg-gray-800 px-1 rounded">admin</code>.</p>
                  </div>
                )}
                
                {selectedTutorial === 'explanation' && (
                  <div>
                    <p><strong>🔍 Why It Works:</strong> Developers often leave old or unlinked admin panels on servers and protect them with predictable names. Furthermore, they frequently forget to change default passwords (`admin`/`admin`) before deploying, leaving a critical security hole that enumeration and simple password guessing can exploit.</p>
                  </div>
                )}
                
                {selectedTutorial === 'result' && (
                  <div>
                    <p><strong>🏆 Expected Result:</strong> After finding the path and logging in, you will successfully complete the challenge and receive the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{admin_panel_discovered}'}</code></p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- INTERACTIVE ELEMENTS (No changes needed) --- */}
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">1. Find The Panel</h3>
            <div className="flex gap-2 mb-3">
              <input type="text" value={currentPath} onChange={(e) => setCurrentPath(e.target.value)} placeholder="/path" onKeyPress={(e) => e.key === 'Enter' && handlePathExploration(currentPath)} className="w-full p-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <button onClick={() => handlePathExploration(currentPath)} disabled={isScanning} className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2 transition-colors disabled:bg-gray-600"><Search className="w-4 h-4" /> Go</button>
            </div>
            <button onClick={runAutoBruteforce} disabled={isScanning} className="w-full px-4 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 transition-colors disabled:bg-gray-600"><Terminal className="w-4 h-4" />{isScanning ? 'Scanning...' : 'Auto Directory Scan'}</button>
            <p className="text-gray-400 text-xs mt-2 text-center">Attempts: {bruteforceAttempts}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">2. Access The Panel</h3>
            {adminAccess && !isCompleted ? <AdminPanel /> : <div className="bg-gray-900 border border-dashed border-gray-600 rounded-lg p-6 h-full flex items-center justify-center"><p className="text-gray-500">Find the panel to unlock this section...</p></div>}
            {isCompleted && <div className="bg-gray-900 border border-dashed border-green-600 rounded-lg p-6 h-full flex items-center justify-center"><p className="text-green-400">Panel Accessed!</p></div>}
          </div>
        </div>
        
        {explorationResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-2">Scan Results</h3>
            <div className="bg-black p-3 rounded font-mono text-sm max-h-40 overflow-y-auto">
              {explorationResults.map((result, index) => (
                <p key={index} className={`whitespace-pre-wrap ${result.includes('200') ? 'text-green-400' : result.includes('403') ? 'text-yellow-400' : 'text-gray-500'}`}>{`> ${result}`}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HiddenPanel;