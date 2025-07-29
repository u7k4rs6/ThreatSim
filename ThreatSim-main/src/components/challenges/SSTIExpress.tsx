import React, { useState } from 'react';
import { Terminal, CheckCircle, Lightbulb } from 'lucide-react';

interface SSTIExpressProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const SSTIExpress: React.FC<SSTIExpressProps> = ({ onComplete, isCompleted }) => {
  const [templateInput, setTemplateInput] = useState('');
  const [renderOutput, setRenderOutput] = useState<JSX.Element | null>(null);
  const [showHints, setShowHints] = useState(false);

  const renderTemplate = (input: string): JSX.Element => {
    const pattern = /\{\{(.*?)\}\}/g;
    const match = pattern.exec(input);

    if (match) {
      try {
        const expression = match[1].trim();

        // Block dangerous operations
        if (expression.includes('process') || expression.includes('require')) {
          throw new Error('Restricted access detected');
        }

        // Simple math operations for SSTI demo
        if (expression.match(/^[0-9+\-*/\s()]+$/)) {
          const result = eval(expression);
          
          // Flag trigger for successful SSTI
          if (result === 10 && expression.includes('*')) {
            setTimeout(() => onComplete('flag{template_injection_rce}'), 1000);
          }
          
          return (
            <div className="text-green-400 font-semibold">
              Template rendered: {result}
            </div>
          );
        } else {
          throw new Error('Invalid expression');
        }
      } catch (e: any) {
        return (
          <div className="text-red-400">
            Error: {e.message || 'Template processing failed'}
          </div>
        );
      }
    }

    return (
      <div className="text-gray-400">
        Output: {input}
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const output = renderTemplate(templateInput);
    setRenderOutput(output);
  };

  return (
    <div className="space-y-6">
      {isCompleted && (
        <div className="bg-green-900/50 border border-green-500 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Challenge Completed!</span>
          </div>
          <p className="text-green-300 mt-2">SSTI exploit executed successfully!</p>
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Terminal className="w-8 h-8 text-cyan-400" />
          SSTI Express - Template Injection
        </h2>

        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Exploit the Server-Side Template Injection vulnerability by injecting expressions into the template engine.
          </p>
          
          {/* Challenge Objectives */}
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-4">
            <h3 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Objective
            </h3>
            <p className="text-blue-200 text-sm">
              Exploit Server-Side Template Injection (SSTI) to achieve code execution. The template engine processes 
              expressions inside double curly braces. Your goal is to inject mathematical expressions that result in 
              the value 10 using multiplication to trigger the flag.
            </p>
          </div>

          {/* Attack Methodology */}
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-4">
            <h3 className="text-red-300 font-semibold mb-2">Attack Methodology</h3>
            <div className="text-red-200 text-sm space-y-2">
              <p><strong>1. Template Syntax Discovery:</strong> Identify template delimiters and syntax</p>
              <p><strong>2. Expression Testing:</strong> Test basic mathematical operations for code execution</p>
              <p><strong>3. Filter Bypass:</strong> Understand restrictions and attempt to bypass security controls</p>
              <p><strong>4. Payload Crafting:</strong> Create expressions that achieve the target result</p>
              <p><strong>5. Flag Extraction:</strong> Execute payload that triggers the flag mechanism</p>
            </div>
          </div>

          {/* How to Complete */}
          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 mb-4">
            <h3 className="text-green-300 font-semibold mb-2">How to Complete This Challenge:</h3>
            <div className="text-green-200 text-sm space-y-1">
              <p>✓ Template expressions use double curly braces: <code className="bg-gray-800 px-1 rounded">{`{{ expression }}`}</code></p>
              <p>✓ Test basic math operations: <code className="bg-gray-800 px-1 rounded">{`{{ 2 + 3 }}`}</code></p>
              <p>✓ The system only allows mathematical expressions (numbers, +, -, *, /, parentheses)</p>
              <p>✓ Create an expression that equals 10 and includes multiplication (*)</p>
              <p>✓ Examples that work: <code className="bg-gray-800 px-1 rounded">{`{{ 2 * 5 }}`}</code>, <code className="bg-gray-800 px-1 rounded">{`{{ 1 * 10 }}`}</code></p>
              <p>✓ Dangerous operations like 'process' and 'require' are blocked</p>
            </div>
          </div>

          {/* SSTI Concepts */}
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
            <h3 className="text-purple-300 font-semibold mb-2">SSTI Attack Concepts</h3>
            <div className="text-purple-200 text-sm space-y-1">
              <p>• <strong>Template Engines:</strong> Process templates with embedded expressions server-side</p>
              <p>• <strong>Injection Points:</strong> User input directly inserted into template without sanitization</p>
              <p>• <strong>Code Execution:</strong> Malicious expressions can lead to RCE in real scenarios</p>
              <p>• <strong>Common Targets:</strong> Jinja2, Handlebars, Twig, Freemarker, Velocity</p>
              <p>• <strong>Real Payloads:</strong> Access to system functions, file operations, network calls</p>
            </div>
          </div>
        </div>

        {/* Template Input Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Template Input:
            </label>
            <textarea
              value={templateInput}
              onChange={(e) => setTemplateInput(e.target.value)}
              placeholder="Enter template with expressions e.g., Hello {{ 2 * 5 }}!"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
              rows={4}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded text-white font-semibold"
          >
            Render Template
          </button>
        </form>

        {/* Rendered Output */}
        {renderOutput && (
          <div className="bg-black p-4 rounded font-mono text-sm border border-gray-600">
            <h3 className="text-cyan-400 mb-2">Template Output:</h3>
            {renderOutput}
          </div>
        )}
      </div>

      {/* Hints */}
      <div className="bg-gray-900/50 border border-gray-600 rounded p-4">
        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-3"
        >
          <Lightbulb className="w-4 h-4" />
          {showHints ? 'Hide Hints' : 'Show Hints'}
        </button>
        {showHints && (
          <div className="space-y-2 text-yellow-200">
            <p>💡 Template expressions are wrapped in double curly braces: {{ }}</p>
            <p>💡 Try mathematical expressions like {'{{ 2 * 5 }}'} or {'{{ 7 + 3 }}'}</p>
            <p>💡 The template engine evaluates expressions server-side</p>
            <p>💡 Look for ways to achieve code execution through template injection</p>
          </div>
        )}
      </div>

      {/* Tools & Resources */}
      <div className="bg-gray-900/50 border border-gray-600 rounded p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Real-World Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="text-cyan-400 font-semibold mb-2">Detection Tools</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Tplmap</li>
              <li>• Burp Suite</li>
              <li>• Manual Testing</li>
            </ul>
          </div>
          <div>
            <h4 className="text-cyan-400 font-semibold mb-2">Template Engines</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Jinja2 (Python)</li>
              <li>• Handlebars (Node.js)</li>
              <li>• Twig (PHP)</li>
              <li>• Freemarker (Java)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSTIExpress;
