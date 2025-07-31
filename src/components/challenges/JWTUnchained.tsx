import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, Lightbulb } from 'lucide-react';

const JWTUnchained: React.FC<{ onComplete: (flag: string) => void; isCompleted: boolean; }> = ({ onComplete, isCompleted }) => {
  const [jwtToken, setJwtToken] = useState('');
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [validationStatus, setValidationStatus] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');

  // --- Core Challenge Logic & Helpers (Preserved) ---
  const base64UrlEncode = (str: string) => btoa(JSON.stringify(str)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const base64UrlDecode = (str: string) => {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) { str += '='; }
    return atob(str);
  };

  const decodeAndSet = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length < 2) throw new Error("Invalid token structure");
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      setDecodedToken({ header, payload });
    } catch (e) {
      setDecodedToken(null);
    }
  };

  useEffect(() => {
    const header = { "alg": "HS256", "typ": "JWT" };
    const payload = { "user": "guest", "admin": false, "iat": Math.floor(Date.now() / 1000) };
    const initialToken = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.fake_signature`;
    setJwtToken(initialToken);
    decodeAndSet(initialToken);
  }, []);

  const handleTokenChange = (token: string) => {
    setJwtToken(token);
    decodeAndSet(token);
  };

  const validateToken = () => {
    if (!decodedToken || isCompleted) return;
    // Vulnerability 1: alg:none
    if (String(decodedToken.header.alg).toLowerCase() === 'none') {
      if (decodedToken.payload.admin === true) {
        onComplete('flag{jwt_algorithm_bypassed}');
        setValidationStatus('Success! Admin access granted with alg:none.');
      } else {
        setValidationStatus('Error: alg:none token is valid, but payload is not admin.');
      }
      return;
    }
    // Simplified check for other attacks
    if (decodedToken.payload.admin === true) {
      onComplete('flag{jwt_payload_tampered}');
      setValidationStatus('Success! Admin access granted by payload tampering.');
      return;
    }
    setValidationStatus('Error: Token is valid but lacks admin privileges.');
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
          <p className="text-green-300 mt-2">JWT authentication successfully bypassed!</p>
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">JWT Unchained</h2>
        </div>

        <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> Exploit a JWT validation flaw to modify the token and escalate privileges to admin.</p>

        {/* Hints Section */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Hints:</span>
          </div>
          <div className="text-yellow-200 text-sm space-y-1">
            <p>💡 A JWT has three parts separated by dots: Header, Payload, Signature.</p>
            <p>💡 The signature verifies the payload's integrity. What if you could disable the signature check?</p>
            <p>💡 Look at the `alg` claim in the header. Some libraries treat an `alg` of `none` as "unsecured".</p>
            <p>💡 Your goal is to change the payload claim `"admin": false` to `"admin": true`.</p>
          </div>
        </div>

        {/* Tutorial Dropdown */}
        <div className="mb-6">
          <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
            📚 JWT Attack Tutorial:
          </label>
          <select
            id="tutorial-select"
            className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={selectedTutorial}
            onChange={(e) => setSelectedTutorial(e.target.value)}
          >
            <option value="" disabled>Choose a tutorial topic...</option>
            <option value="basics">📚 JWT Basics</option>
            <option value="goal">🎯 What's the Goal?</option>
            <option value="solution">⚡ Complete Solution (alg:none)</option>
            <option value="explanation">🔍 Why It Works</option>
            <option value="result">🏆 Expected Result</option>
          </select>

          {selectedTutorial && (
            <div className="mt-4 bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
              <div className="text-purple-200 text-sm space-y-2">
                {selectedTutorial === 'basics' && (
                  <div>
                    <p><strong>📚 Basics:</strong> JSON Web Tokens (JWTs) are a standard for creating access tokens. They consist of a Base64Url-encoded Header, Payload, and a Signature. The signature ensures that the token data hasn't been tampered with.</p>
                  </div>
                )}
                {selectedTutorial === 'goal' && (
                  <div>
                    <p><strong>🎯 Goal:</strong> Your goal is to craft a new JWT. You need to modify the header to disable signature validation and alter the payload to grant yourself admin rights. You can use an online tool like `jwt.io` or craft it manually.</p>
                  </div>
                )}
                {selectedTutorial === 'solution' && (
                  <div>
                    <p><strong>⚡ Solution (alg:none):</strong></p>
                    <p>1. Create a new header: <code className="bg-gray-800 px-1 rounded">{`{"alg":"none","typ":"JWT"}`}</code></p>
                    <p>2. Create a new payload: <code className="bg-gray-800 px-1 rounded">{`{"user":"admin","admin":true}`}</code></p>
                    <p>3. Base64Url encode both parts.</p>
                    <p>4. Combine them with a trailing dot for an empty signature, like so: <code className="bg-gray-800 px-1 rounded break-all">eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyIjoiYWRtaW4iLCJhZG1pbiI6dHJ1ZX0.</code></p>
                    <p>5. Paste this new token into the text area and validate.</p>
                  </div>
                )}
                {selectedTutorial === 'explanation' && (
                  <div>
                    <p><strong>🔍 Why It Works:</strong> The `alg:none` attack exploits a flaw in JWT libraries where developers might forget to restrict which algorithms are allowed. When a library receives a token with `"alg": "none"`, it may trust the payload without any signature verification, allowing an attacker to forge any payload they wish.</p>
                  </div>
                )}
                {selectedTutorial === 'result' && (
                  <div>
                    <p><strong>🏆 Expected Result:</strong> The server will accept your forged token, grant you admin access, and you'll receive the flag, such as <code className="bg-gray-800 px-1 rounded font-mono">flag{'{jwt_algorithm_bypassed}'}</code>.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Elements */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">JWT Token:</label>
            <textarea value={jwtToken} onChange={(e) => handleTokenChange(e.target.value)} disabled={isCompleted} className="w-full p-2 bg-gray-900/50 rounded text-white font-mono text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" rows={5} />
          </div>

          {decodedToken && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Decoded Token:</label>
              <div className="grid md:grid-cols-2 gap-2">
                <pre className="bg-black p-3 rounded text-sm text-yellow-300 overflow-x-auto">{"// Header\n" + JSON.stringify(decodedToken.header, null, 2)}</pre>
                <pre className="bg-black p-3 rounded text-sm text-cyan-300 overflow-x-auto">{"// Payload\n" + JSON.stringify(decodedToken.payload, null, 2)}</pre>
              </div>
            </div>
          )}

          <button onClick={validateToken} disabled={isCompleted} className="w-full py-2 px-4 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition-colors disabled:bg-gray-600">Validate Token</button>
        </div>

        {validationStatus && <p className={`mt-4 text-center text-sm p-2 rounded ${validationStatus.includes('Success') ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>{validationStatus}</p>}
      </div>
    </div>
  );
};

export default JWTUnchained;