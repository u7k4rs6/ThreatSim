import React, { useState } from 'react';
import { Lightbulb, Cookie, CheckCircle, Shield } from 'lucide-react';

const CookieMonster: React.FC<{ onComplete: (flag: string) => void; isCompleted: boolean; }> = ({ onComplete, isCompleted }) => {
  const [cookieValue, setCookieValue] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate insecure cookie handling that trusts client-side values
    if (cookieValue.toLowerCase().includes('admin=true')) {
      setMessage('Access Granted! Welcome, admin. 🎉');
      onComplete('flag{cookie_manipulation_expert}');
    } else {
      setMessage('Access Denied. Your permissions are insufficient.');
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
          <p className="text-green-300 mt-2">Cookie manipulation successful!</p>
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Cookie className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Cookie Monster - Auth Bypass</h2>
        </div>
        
        <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> Manipulate the application's cookie to bypass authentication and gain admin access.</p>
        
        {/* Hints Section */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Hints:</span>
          </div>
          <div className="text-yellow-200 text-sm space-y-1">
            <p>💡 Cookies are stored on your machine. What if you change them?</p>
            <p>💡 The application might be checking for a parameter like `admin`.</p>
            <p>💡 Boolean flags are common in permissions. Think `true` or `false`.</p>
            <p>💡 The required format is a simple key-value pair: <code className="bg-gray-800 px-1 rounded font-mono">key=value</code>.</p>
          </div>
        </div>
        
        {/* Tutorial Dropdown */}
        <div className="mb-6">
          <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
            📚 Cookie Manipulation Tutorial:
          </label>
          <select 
            id="tutorial-select"
            className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={selectedTutorial}
            onChange={(e) => setSelectedTutorial(e.target.value)}
          >
            <option value="" disabled>Choose a tutorial topic...</option>
            <option value="basics">📚 Cookie Manipulation Basics</option>
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
                    <p><strong>📚 Basics:</strong> Cookies are small pieces of data stored by the browser. Websites use them to remember user information, like login status. If a site trusts cookie data without proper verification, an attacker can modify it to gain unauthorized access.</p>
                  </div>
                )}
                
                {selectedTutorial === 'goal' && (
                  <div>
                    <p><strong>🎯 Goal:</strong> Your goal is to identify and modify the cookie value that controls user permissions. You need to craft a new cookie string that tricks the application into granting you admin privileges.</p>
                  </div>
                )}
                
                {selectedTutorial === 'solution' && (
                  <div>
                    <p><strong>⚡ Solution:</strong></p>
                    <p>• In the input box below, enter the following text:</p>
                    <p className="pl-4"><code className="bg-gray-800 px-2 py-1 rounded font-mono">admin=true</code></p>
                    <p>• Click "Submit" to apply the tampered cookie.</p>
                  </div>
                )}
                
                {selectedTutorial === 'explanation' && (
                  <div>
                    <p><strong>🔍 Why It Works:</strong> The application's backend code insecurely checks for the presence of `admin=true` in the cookie string. It trusts this client-side data completely. By manually setting this value, you satisfy the condition and the server grants you admin access, believing you are a legitimate administrator.</p>
                  </div>
                )}
                
                {selectedTutorial === 'result' && (
                  <div>
                    <p><strong>🏆 Expected Result:</strong> The server will grant you access, you will see the "Welcome, admin" message, and you will receive the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{cookie_manipulation_expert}'}</code></p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Cookie Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cookie-input" className="block text-sm text-gray-300 mb-1">Your Current Cookie String</label>
            <input
              id="cookie-input"
              type="text"
              placeholder="e.g., sessionID=...; user=guest"
              value={cookieValue}
              onChange={e => setCookieValue(e.target.value)}
              disabled={isCompleted}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <button
            type="submit"
            disabled={isCompleted}
            className="w-full py-2 px-4 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Submit Modified Cookie
          </button>
        </form>
        
        {message && (
          <p className={`mt-4 text-center font-semibold ${message.includes('Welcome, admin') ? 'text-green-400' : 'text-yellow-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CookieMonster;