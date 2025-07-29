import React, { useState } from 'react';
import { UserX, CheckCircle, Lightbulb, Mail, Key } from 'lucide-react';

const BrokenAuthFlow: React.FC<{ onComplete: (flag: string) => void; isCompleted: boolean; }> = ({ onComplete, isCompleted }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');

  // Simulated user database
  const users = { 'admin@company.com': { isAdmin: true }, 'user@company.com': { isAdmin: false } };

  // --- Core Challenge Logic (Preserved) ---
  const handlePasswordResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (users[email as keyof typeof users]) {
      const token = Math.random().toString(36).substring(2, 10);
      setGeneratedToken(token);
      setMessage(`A password reset email has been sent to ${email}.`);
      setCurrentStep(2);
    } else {
      setMessage('Error: Email not found in our system.');
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    // VULNERABILITY: A special, insecure check for the admin account.
    if (email === 'admin@company.com' && resetToken.length > 0) {
      onComplete('flag{auth_flow_manipulation}');
      setMessage('Success! Password for admin has been reset.');
    } else if (resetToken === generatedToken) {
      setMessage('Success! Password for the user has been reset.');
    } else {
      setMessage('Error: Invalid reset token.');
    }
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
          <p className="text-green-300 mt-2">Authentication flow bypassed successfully!</p>
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <UserX className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Broken Authentication Flow</h2>
        </div>

        <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> Exploit the logic flaw in the password reset mechanism to gain unauthorized access to the admin account.</p>

        {/* Hints Section */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Hints:</span>
          </div>
          <div className="text-yellow-200 text-sm space-y-1">
            <p>💡 The goal is to reset the password for `admin@company.com`.</p>
            <p>💡 Is the validation for the admin's reset token as strong as for a regular user?</p>
            <p>💡 The server might only be checking if a token is present, not what its value is.</p>
            <p>💡 Try entering *any* value for the admin's reset token.</p>
          </div>
        </div>

        {/* Tutorial Dropdown */}
        <div className="mb-6">
          <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
            📚 Broken Authentication Tutorial:
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
                    <p><strong>📚 Basics:</strong> Broken Authentication vulnerabilities occur when functions related to login, password reset, or session management are implemented insecurely. This can allow attackers to bypass security controls by exploiting logical flaws in the application's code.</p>
                  </div>
                )}

                {selectedTutorial === 'goal' && (
                  <div>
                    <p><strong>🎯 Goal:</strong> Your goal is to trigger the password reset for the `admin@company.com` account and exploit a weakness in the token validation step to successfully reset the password without knowing the real token.</p>
                  </div>
                )}

                {selectedTutorial === 'solution' && (
                  <div>
                    <p><strong>⚡ Solution:</strong></p>
                    <p>• <strong>Step 1:</strong> Enter `admin@company.com` and request a reset.</p>
                    <p>• <strong>Step 2:</strong> In the next form, enter *any* non-empty text (e.g., `1234`) as the reset token and choose a new password.</p>
                    <p>• <strong>Step 3:</strong> Submit the form to capture the flag.</p>
                  </div>
                )}

                {selectedTutorial === 'explanation' && (
                  <div>
                    {/* THIS IS THE CORRECTED LINE */}
                    <p><strong>🔍 Why It Works:</strong> The application's code contains a critical logic flaw. For a normal user, it correctly checks `if (resetToken === generatedToken)`. However, for the admin, it uses a separate, insecure check: {`\`if (email === 'admin@company.com' && resetToken.length > 0)\``}. This condition only verifies that *some* token was submitted, not that it's the *correct* one, allowing any input to succeed.</p>
                  </div>
                )}

                {selectedTutorial === 'result' && (
                  <div>
                    <p><strong>🏆 Expected Result:</strong> You will successfully reset the admin password, see a success message, and receive the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{auth_flow_manipulation}'}</code></p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Multi-Step Forms */}
        <div className="border border-gray-700 p-4 rounded-lg">
          {currentStep === 1 && (
            <form onSubmit={handlePasswordResetRequest} className="space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2"><Mail className="w-5 h-5 text-cyan-400" /> Step 1: Request Reset</h3>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter target email" className="w-full p-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
              <button type="submit" disabled={isCompleted} className="w-full py-2 px-4 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition-colors disabled:bg-gray-600">Send Reset Link</button>
            </form>
          )}

          {currentStep === 2 && (
            <form onSubmit={handlePasswordReset} className="space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2"><Key className="w-5 h-5 text-cyan-400" /> Step 2: Set New Password</h3>
              <p className="text-sm text-gray-400">Resetting password for: <strong className="text-white">{email}</strong></p>
              <input type="text" value={resetToken} onChange={(e) => setResetToken(e.target.value)} placeholder="Enter reset token" className="w-full p-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="w-full p-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
              <button type="submit" disabled={isCompleted} className="w-full py-2 px-4 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition-colors disabled:bg-gray-600">Reset Password</button>
            </form>
          )}
        </div>
        
        {message && <p className={`mt-4 text-center text-sm p-2 rounded ${message.includes('Success') || message.includes('sent') ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>{message}</p>}
      </div>
    </div>
  );
};

export default BrokenAuthFlow;