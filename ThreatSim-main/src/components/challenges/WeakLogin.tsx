import React, { useState } from 'react';
import { HelpCircle, Lightbulb, Database, Shield, CheckCircle } from 'lucide-react';

const WeakLogin: React.FC<{ onComplete: (flag: string) => void; isCompleted: boolean; }> = ({ onComplete, isCompleted }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [inputEnabled, setInputEnabled] = useState(true); // Always allow attempts
  const [selectedTutorial, setSelectedTutorial] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password.includes("' OR '1'='1")) {
      setMessage('Login successful! 🎉');
      onComplete('flag{sql_injection_master}');
    } else {
      setMessage('Invalid credentials! Try again.');
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
          <p className="text-green-300 mt-2">SQL injection successfully executed!</p>
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">SQL Injection - Weak Login</h2>
        </div>
        
        <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> Bypass the login form using SQL injection to gain unauthorized access.</p>
        
        {/* Hints Section */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Hints:</span>
          </div>
          <div className="text-yellow-200 text-sm space-y-1">
            <p>💡 Try using "admin" as the username</p>
            <p>💡 SQL injection payloads often use quotes and logical operators</p>
            <p>💡 Look for ways to make the password check always return true</p>
            <p>💡 Common payload: <code className="bg-gray-800 px-1 rounded font-mono">' OR '1'='1</code></p>
          </div>
        </div>
        
        {/* Tutorial Dropdown */}
        <div className="mb-6">
          <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
            📚 SQL Injection Tutorial:
          </label>
          <select 
            id="tutorial-select"
            className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={selectedTutorial}
            onChange={(e) => setSelectedTutorial(e.target.value)}
          >
            <option value="" disabled>Choose a tutorial topic...</option>
            <option value="basics">📚 SQL Injection Basics</option>
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
                    <p><strong>📚 SQL Injection Basics:</strong></p>
                    <p>• SQL injection occurs when user input is directly inserted into SQL queries without proper sanitization</p>
                    <p>• Attackers can manipulate the query logic by injecting malicious SQL code</p>
                    <p>• This can lead to unauthorized access, data theft, or database manipulation</p>
                  </div>
                )}
                
                {selectedTutorial === 'goal' && (
                  <div>
                    <p><strong>🎯 What's the Goal:</strong></p>
                    <p>• Bypass the login authentication system</p>
                    <p>• Make the password check always return true</p>
                    <p>• Gain unauthorized access without knowing the real password</p>
                    <p>• Understand how SQL injection works in practice</p>
                  </div>
                )}
                
                {selectedTutorial === 'solution' && (
                  <div>
                    <p><strong>⚡ Complete Solution:</strong></p>
                    <p>• <strong>Username:</strong> admin</p>
                    <p>• <strong>Password:</strong> <code className="bg-gray-800 px-2 py-1 rounded font-mono">' OR '1'='1</code></p>
                    <p>• Click Login to execute the attack</p>
                    <p>• You should see "Login successful!" message</p>
                  </div>
                )}
                
                {selectedTutorial === 'explanation' && (
                  <div>
                    <p><strong>🔍 Why It Works:</strong></p>
                    <p>• Normal query: <code className="bg-gray-800 px-1 rounded font-mono text-xs">SELECT * FROM users WHERE username='admin' AND password='userpassword'</code></p>
                    <p>• Injected query: <code className="bg-gray-800 px-1 rounded font-mono text-xs">SELECT * FROM users WHERE username='admin' AND password='' OR '1'='1'</code></p>
                    <p>• Since '1'='1' is always true, the OR condition makes the entire WHERE clause true</p>
                    <p>• This returns all users, bypassing the password check</p>
                  </div>
                )}
                
                {selectedTutorial === 'result' && (
                  <div>
                    <p><strong>🏆 Expected Result:</strong></p>
                    <p>• Authentication will be bypassed successfully</p>
                    <p>• You'll gain access as the 'admin' user</p>
                    <p>• The system will display "Login successful!" message</p>
                    <p>• You'll receive the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{sql_injection_master}</code></p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
        >
          Login
        </button>
        </form>
        {message && <p className="mt-4 text-center text-cyan-400">{message}</p>}
      </div>
    </div>
  );
};

export default WeakLogin;

