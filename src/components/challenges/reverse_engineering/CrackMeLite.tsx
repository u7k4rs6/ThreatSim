import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Terminal, Download, Shield, Play, BookOpen, BrainCircuit, Eye } from 'lucide-react';

const AntiDebugExplanation: React.FC = () => {
  return (
    <div className="prose prose-invert bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto text-gray-300">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center gap-3"><BookOpen /> Anti-Debugging: The Art of Evasion</h2>
      
      <p className="text-lg">Welcome to the world of anti-debugging! Anti-debugging techniques are methods used by software developers (and malware authors) to detect when their programs are being analyzed in a debugger. Understanding these techniques is crucial for reverse engineers and security researchers.</p>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center gap-3"><Eye /> Common Anti-Debugging Techniques</h3>
        <p>Anti-debugging techniques fall into several categories, each targeting different aspects of the debugging process:</p>
        
        <div className="bg-gray-900/50 p-4 rounded-lg my-4">
          <p><strong>API-Based Detection:</strong></p>
          <ul className="list-disc list-inside space-y-2">
            <li><code>IsDebuggerPresent()</code>: Checks the PEB (Process Environment Block) flag</li>
            <li><code>CheckRemoteDebuggerPresent()</code>: Detects remote debugging</li>
            <li><code>NtQueryInformationProcess()</code>: Advanced process information queries</li>
          </ul>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg my-4">
          <p><strong>Timing-Based Detection:</strong></p>
          <ul className="list-disc list-inside space-y-2">
            <li>Measuring execution time between instructions</li>
            <li>Using <code>rdtsc</code> (Read Time-Stamp Counter) instruction</li>
            <li>Detecting the slowdown caused by single-stepping</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center gap-3"><BrainCircuit /> Bypassing Anti-Debugging</h3>
        <p>There are several approaches to bypassing anti-debugging mechanisms:</p>
        
        <div className="bg-gray-900/50 p-4 rounded-lg my-4">
          <p><strong>Static Patching:</strong></p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>NOP out calls:</strong> Replace the call instruction with NOPs (0x90)</li>
            <li><strong>Patch conditional jumps:</strong> Change JNZ to JMP or vice versa</li>
            <li><strong>Modify return values:</strong> Change the function to always return 0</li>
          </ul>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg my-4">
          <p><strong>Dynamic Patching:</strong></p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Register manipulation:</strong> Change EAX/RAX after API calls</li>
            <li><strong>Flag manipulation:</strong> Set/clear the Zero Flag before conditional jumps</li>
            <li><strong>Runtime hooking:</strong> Intercept API calls and return fake results</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center gap-3"><Shield /> Real-World Applications</h3>
        <p><strong>In Malware Analysis:</strong> Understanding anti-debugging is essential when analyzing malicious software that attempts to evade sandbox analysis.</p>
        <p><strong>In Software Protection:</strong> Legitimate software uses these techniques to protect intellectual property and prevent reverse engineering.</p>
        <p><strong>In Penetration Testing:</strong> Custom payloads often include anti-debugging to avoid detection during security assessments.</p>
        
        <div className="bg-gray-900/50 p-4 rounded-lg my-4">
          <p><strong>Professional Tools:</strong></p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>x64dbg:</strong> Popular Windows debugger with plugins for anti-anti-debugging</li>
            <li><strong>OllyDbg:</strong> Classic 32-bit debugger with extensive plugin ecosystem</li>
            <li><strong>IDA Pro:</strong> Industry-standard disassembler with debugging capabilities</li>
            <li><strong>Cheat Engine:</strong> Game hacking tool that can bypass many anti-debugging checks</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

interface CrackMeLiteProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const CrackMeLite: React.FC<CrackMeLiteProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [showBinary, setShowBinary] = useState(false);
  const [debuggerDetected, setDebuggerDetected] = useState(false);
  const [bypassMode, setBypassMode] = useState(false);
  const [binaryOutput, setBinaryOutput] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');
  const [showLearn, setShowLearn] = useState(false);

  const correctFlag = 'flag{anti_debug_bypassed}';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flag === correctFlag) {
      setMessage('Correct flag! Well done.');
      onComplete(flag);
    } else {
      setMessage('Incorrect flag. Keep trying!');
    }
  };

  const handleBinaryRun = () => {
    if (!bypassMode) {
      setDebuggerDetected(true);
      setBinaryOutput('Debugger detected! Exiting...');
    } else {
      setBinaryOutput('Anti-debug bypassed! Flag: flag{anti_debug_bypassed}');
    }
  };

  const downloadBinary = () => {
    const binaryCode = `#include <windows.h>
#include <stdio.h>

int is_debugger_present() {
    // Simple anti-debug check
    return IsDebuggerPresent();
}

int check_remote_debugger() {
    BOOL isRemoteDebuggerPresent = FALSE;
    CheckRemoteDebuggerPresent(GetCurrentProcess(), &isRemoteDebuggerPresent);
    return isRemoteDebuggerPresent;
}

int main() {
    printf("CrackMe Lite v1.0\n");
    printf("Checking for debuggers...\n");
    
    // Anti-debug checks
    if(is_debugger_present() || check_remote_debugger()) {
        printf("Debugger detected! Exiting...\n");
        return 1;
    }
    
    printf("No debugger found.\n");
    
    // Hidden flag (would be obfuscated in real binary)
    char flag[] = {'f','l','a','g','{','a','n','t','i','_','d','e','b','u','g','_','b','y','p','a','s','s','e','d','}','\0'};
    printf("Flag: %s\n", flag);
    
    return 0;
}`;
    
    const blob = new Blob([binaryCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crackme_lite.c';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {isCompleted && (
        <div className="bg-green-900/50 border border-green-500 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Challenge Completed!</span>
          </div>
          <p className="text-green-300 mt-2">Anti-debugging successfully bypassed!</p>
        </div>
      )}

      {/* Learn Section Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowLearn(!showLearn)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          {showLearn ? 'Hide' : 'Learn'} Anti-Debugging
        </button>
      </div>

      {/* Learn Section */}
      {showLearn && <AntiDebugExplanation />}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">CrackMe Lite - Anti-Debug</h2>
        </div>

        <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> This Windows executable has basic anti-debugging mechanisms. Bypass them to reveal the flag.</p>

        {/* Hints Section */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Hints:</span>
          </div>
          <div className="text-yellow-200 text-sm space-y-1">
            <p>💡 The program uses a common Windows API function to check if a debugger is attached.</p>
            <p>💡 You can either patch the instruction that calls the anti-debug function or patch the conditional jump that occurs after the check.</p>
            <p>💡 In a debugger, you can often modify the program's execution flow by changing register values (like EAX) or flipping the Zero Flag.</p>
          </div>
        </div>

        {/* Tutorial Dropdown */}
        <div className="mb-6">
          <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
            📚 Anti-Debugging Tutorial:
          </label>
          <select
            id="tutorial-select"
            className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={selectedTutorial}
            onChange={(e) => setSelectedTutorial(e.target.value)}
          >
            <option value="" disabled>Choose a tutorial topic...</option>
            <option value="basics">📚 Anti-Debugging Basics</option>
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
                    <p><strong>📚 Basics:</strong> Anti-debugging techniques are methods used by software to detect if it is being analyzed by a debugger. If a debugger is found, the program might crash, display a fake error, or change its behavior to mislead the analyst.</p>
                  </div>
                )}

                {selectedTutorial === 'goal' && (
                  <div>
                    <p><strong>🎯 Goal:</strong> Your goal is to load the binary into a debugger (like x64dbg), find the anti-debugging check, and neutralize it so the program continues its normal execution path to reveal the flag.</p>
                  </div>
                )}

                {selectedTutorial === 'solution' && (
                  <div>
                    <p><strong>⚡ Solution:</strong></p>
                    <p>• <strong>Step 1:</strong> Open the binary in x64dbg.</p>
                    <p>• <strong>Step 2:</strong> Search for calls to the `IsDebuggerPresent` function.</p>
                    <p>• <strong>Step 3:</strong> Set a breakpoint on the `call IsDebuggerPresent` instruction.</p>
                    <p>• <strong>Step 4:</strong> After the function returns, the `EAX` register will be 1. Manually change it to `0` before the next instruction (a `test eax, eax`) is executed.</p>
                    <p>• <strong>Step 5:</strong> Resume execution. The program will now follow the path for when no debugger is detected and print the flag.</p>
                  </div>
                )}

                {selectedTutorial === 'explanation' && (
                  <div>
                    <p><strong>🔍 Why It Works:</strong> The `IsDebuggerPresent` function returns `1` if a debugger is attached and `0` otherwise. The program checks this return value. By intercepting the program flow right after this check and manually changing the result from `1` to `0`, we fool the program into thinking it's running without a debugger.</p>
                  </div>
                )}

                {selectedTutorial === 'result' && (
                  <div>
                    <p><strong>🏆 Expected Result:</strong> The program will no longer terminate prematurely. Instead, it will print the success message and the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{'}anti_debug_bypassed{'}'}</code></p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 mb-4">
          <button 
            onClick={downloadBinary}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Source Code
          </button>
          <button 
            onClick={() => setShowBinary(!showBinary)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Play className="w-4 h-4" />
            Simulate Binary
          </button>
        </div>

        {showBinary && (
          <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-600">
            <h3 className="text-white font-semibold mb-2">Binary Simulator</h3>
            <div className="bg-black p-3 rounded font-mono text-green-400 text-sm mb-3">
              <div>$ ./crackme_lite.exe</div>
              <div>CrackMe Lite v1.0</div>
              <div>Checking for debuggers...</div>
            </div>
            <div className="flex gap-2 mb-4">
              <label className="flex items-center gap-2 text-white">
                <input 
                  type="checkbox"
                  checked={bypassMode}
                  onChange={(e) => setBypassMode(e.target.checked)}
                  className="rounded"
                />
                Bypass Anti-Debug
              </label>
            </div>
            <div className="flex gap-2 mb-2">
              <button 
                onClick={handleBinaryRun}
                className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
              >
                Run Binary
              </button>
            </div>
            {binaryOutput && (
              <div className={`bg-black p-3 rounded font-mono text-sm ${
                debuggerDetected && !bypassMode ? 'text-red-400' : 'text-green-400'
              }`}>
                {binaryOutput}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <input 
            type="text"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            placeholder="Enter flag"
            className="flex-grow p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors">Submit</button>
        </form>

        {message && (
          <div className={`mt-4 flex items-center gap-2 ${isCompleted ? 'text-green-400' : 'text-red-400'}`}>
            {isCompleted ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrackMeLite;
