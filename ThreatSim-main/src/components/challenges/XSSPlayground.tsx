import React, { useState } from 'react';
import { Code, CheckCircle, Lightbulb } from 'lucide-react';

const XSSPlayground: React.FC<{ onComplete: (flag: string) => void; isCompleted: boolean; }> = ({ onComplete, isCompleted }) => {
  const [inputValue, setInputValue] = useState('');
  const [comments, setComments] = useState<Array<{ user: string, content: string }>>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');

  // --- Core Challenge Logic (Preserved) ---
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCompleted) return;

    // A naive filter that only blocks the <script> tag
    if (inputValue.toLowerCase().includes('<script')) {
      setErrorMessage('Error: Malicious script tags are not allowed!');
      return;
    }

    const newComment = { user: 'Guest', content: inputValue };
    setComments(prev => [newComment, ...prev].slice(0, 5)); // Keep last 5 comments
    
    // The success condition for the challenge
    if (inputValue.includes('xss_payload_executed')) {
      onComplete('flag{xss_payload_executed}');
    }

    setInputValue('');
    setErrorMessage('');
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
          <p className="text-green-300 mt-2">Stored XSS payload successfully executed!</p>
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">XSS Playground</h2>
        </div>

        <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> Bypass the simple filter and inject a JavaScript payload into the comment section to execute a Stored XSS attack.</p>

        {/* Hints Section */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold">Hints:</span>
          </div>
          <div className="text-yellow-200 text-sm space-y-1">
            {/* CORRECTED LINES: Using HTML entities to prevent JSX parsing errors */}
            <p>💡 The application blocks <code>&lt;script&gt;</code> tags, but are there other ways to run JavaScript?</p>
            <p>💡 Many HTML tags have event handlers like <code>onerror</code>, <code>onload</code>, or <code>onmouseover</code>.</p>
            <p>💡 An <code>&lt;img&gt;</code> tag with an invalid source will trigger its <code>onerror</code> event.</p>
            <p>💡 To pass the challenge, your payload must contain the string `xss_payload_executed`.</p>
          </div>
        </div>

        {/* Tutorial Dropdown */}
        <div className="mb-6">
          <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
            📚 XSS Attack Tutorial:
          </label>
          <select
            id="tutorial-select"
            className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={selectedTutorial}
            onChange={(e) => setSelectedTutorial(e.target.value)}
          >
            <option value="" disabled>Choose a tutorial topic...</option>
            <option value="basics">📚 XSS Basics</option>
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
                    <p><strong>📚 Basics:</strong> Stored Cross-Site Scripting (XSS) occurs when an application receives malicious data from a user and stores it in its database. When another user views the page with this data, the malicious script executes in their browser.</p>
                  </div>
                )}
                {selectedTutorial === 'goal' && (
                  <div>
                    <p><strong>🎯 Goal:</strong> Your goal is to find an XSS payload that bypasses the filter that blocks <code>&lt;script&gt;</code> tags. The payload needs to execute JavaScript to trigger the success condition.</p>
                  </div>
                )}
                {selectedTutorial === 'solution' && (
                  <div>
                    <p><strong>⚡ Solution:</strong> Use an HTML tag with an event handler. For example, an image tag with a broken source will trigger the `onerror` event.</p>
                    <p className="pl-4 mt-2">Payload:</p>
                    <code className="block bg-gray-800 p-2 rounded font-mono text-xs break-all">
                      &lt;img src="x" onerror="console.log('xss_payload_executed')"&gt;
                    </code>
                  </div>
                )}
                {selectedTutorial === 'explanation' && (
                  <div>
                    {/* CORRECTED LINE */}
                    <p><strong>🔍 Why It Works:</strong> The application's filter is too specific; it only looks for the exact string <code>&lt;script&gt;</code>. It doesn't account for the many other ways to execute JavaScript, such as event handlers on other tags. The `onerror` handler on an <code>&lt;img&gt;</code> tag is a classic and effective bypass technique.</p>
                  </div>
                )}
                {selectedTutorial === 'result' && (
                  <div>
                    <p><strong>🏆 Expected Result:</strong> Your malicious comment will be rendered, the script inside the `onerror` handler will execute, and you will receive the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{xss_payload_executed}'}</code></p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Interactive Elements */}
        <div className="border border-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Comment Section</h3>
          <form onSubmit={handleCommentSubmit} className="space-y-3">
             <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Write a comment... try to find the flaw!"
                disabled={isCompleted}
                rows={3}
                className="w-full p-2 bg-gray-900/50 rounded text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
            <button type="submit" disabled={isCompleted} className="w-full py-2 px-4 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition-colors disabled:bg-gray-600">Post Comment</button>
          </form>

          <div className="mt-6 space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="bg-gray-900/70 p-3 rounded-lg border border-gray-700">
                <p className="text-sm text-green-400 font-bold">{comment.user} says:</p>
                {/* The Vulnerability: Rendering user input directly as HTML */}
                <div className="mt-1 text-gray-300" dangerouslySetInnerHTML={{ __html: comment.content }} />
              </div>
            ))}
             {comments.length === 0 && <p className="text-center text-sm text-gray-500">No comments yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default XSSPlayground;
