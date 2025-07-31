import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Terminal, Download, Cpu, Play, Zap } from 'lucide-react';

interface VirtualMachineProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const VirtualMachine: React.FC<VirtualMachineProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [showBinary, setShowBinary] = useState(false);
  const [binaryOutput, setBinaryOutput] = useState('');
  const [vmStep, setVmStep] = useState(0);
  const [selectedTutorial, setSelectedTutorial] = useState('');

  const correctFlag = 'flag{vm_opcodes_cracked}';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flag === correctFlag) {
      setMessage('Correct flag! Well done.');
      onComplete(flag);
    } else {
      setMessage('Incorrect flag. Keep trying!');
    }
  };

  const opcodes = [
    { code: 0x01, desc: 'LOAD_CONST 102' },
    { code: 0x02, desc: 'LOAD_CONST 108' },
    { code: 0x03, desc: 'LOAD_CONST 97' },
    { code: 0x04, desc: 'LOAD_CONST 103' },
    { code: 0x05, desc: 'LOAD_CONST 123' },
    { code: 0x06, desc: 'LOAD_CONST 118' },
    { code: 0x07, desc: 'LOAD_CONST 109' },
    // More opcodes...
    { code: 0xFF, desc: 'PRINT_STACK' }
  ];

  const handleVmStep = () => {
    if (vmStep < opcodes.length) {
      setBinaryOutput(prev => prev + `\nExecuting: ${opcodes[vmStep].desc}`);
      setVmStep(vmStep + 1);
    } else {
      setBinaryOutput(prev => prev + '\nVM execution complete. Stack contents: flag{vm_opcodes_cracked}');
    }
  };

  const handleBinaryRun = () => {
    setBinaryOutput('Custom VM starting...\nLoading bytecode...\nInitializing stack...');
    setVmStep(0);
  };

  const downloadBinary = () => {
    const binaryCode = `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    unsigned char opcode;
    unsigned char operand;
} instruction_t;

// VM opcodes
#define LOAD_CONST 0x01
#define PRINT_CHAR 0x02
#define HALT 0xFF

// Bytecode that spells out the flag
instruction_t bytecode[] = {
    {LOAD_CONST, 102}, // 'f'
    {PRINT_CHAR, 0},
    {LOAD_CONST, 108}, // 'l'
    {PRINT_CHAR, 0},
    {LOAD_CONST, 97},  // 'a'
    {PRINT_CHAR, 0},
    {LOAD_CONST, 103}, // 'g'
    {PRINT_CHAR, 0},
    {LOAD_CONST, 123}, // '{'
    {PRINT_CHAR, 0},
    {LOAD_CONST, 118}, // 'v'
    {PRINT_CHAR, 0},
    {LOAD_CONST, 109}, // 'm'
    {PRINT_CHAR, 0},
    // ... rest of opcodes for full flag
    {HALT, 0}
};

void execute_vm() {
    int pc = 0; // program counter
    int stack_top = 0;
    
    while (bytecode[pc].opcode != HALT) {
        switch (bytecode[pc].opcode) {
            case LOAD_CONST:
                stack_top = bytecode[pc].operand;
                break;
            case PRINT_CHAR:
                printf("%c", stack_top);
                break;
        }
        pc++;
    }
    printf("\n");
}

int main() {
    printf("Custom VM Challenge\n");
    printf("Executing bytecode...\n");
    execute_vm();
    return 0;
}`;
    
    const blob = new Blob([binaryCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vm_challenge.c';
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
                <p className="text-green-300 mt-2">VM bytecode reversed and flag extracted!</p>
            </div>
        )}

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-8 h-8 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Virtual Machine Reversing</h2>
            </div>

            <p className="text-gray-300 mb-4">🎯 <strong>Objective:</strong> This binary implements a custom virtual machine. Analyze the opcodes and execution flow to extract the flag.</p>

            {/* Hints Section */}
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Hints:</span>
                </div>
                <div className="text-yellow-200 text-sm space-y-1">
                    <p>💡 Look for a main loop with a large `switch` statement or a series of `if/else if` blocks.</p>
                    <p>💡 The bytecode is likely stored as a global array of bytes or integers.</p>
                    <p>💡 Re-implementing the VM logic in a high-level language like Python can make it easier to trace and debug.</p>
                </div>
            </div>

            {/* Tutorial Dropdown */}
            <div className="mb-6">
                <label className="block text-purple-400 font-semibold mb-2" htmlFor="tutorial-select">
                    📚 VM Reversing Tutorial:
                </label>
                <select
                    id="tutorial-select"
                    className="w-full p-3 bg-gray-700 border border-purple-600/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={selectedTutorial}
                    onChange={(e) => setSelectedTutorial(e.target.value)}
                >
                    <option value="" disabled>Choose a tutorial topic...</option>
                    <option value="basics">📚 VM Obfuscation Basics</option>
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
                                    <p><strong>📚 Basics:</strong> VM-based obfuscation replaces standard machine code with custom bytecode interpreted by a virtual machine embedded in the binary. This is a powerful obfuscation technique because an analyst must first reverse engineer the VM itself before they can understand the bytecode it runs.</p>
                                </div>
                            )}

                            {selectedTutorial === 'goal' && (
                                <div>
                                    <p><strong>🎯 Goal:</strong> Your objective is to understand the VM's instruction set (the opcodes) and then trace the execution of the embedded bytecode to see what it does. The bytecode will ultimately reveal the flag.</p>
                                </div>
                            )}

                            {selectedTutorial === 'solution' && (
                                <div>
                                    <p><strong>⚡ Solution:</strong></p>
                                    <p>• <strong>Step 1:</strong> In a disassembler, locate the main VM loop, which reads and interprets bytecode.</p>
                                    <p>• <strong>Step 2:</strong> Document what each opcode does (e.g., `0x01` = LOAD, `0x02` = PRINT).</p>
                                    <p>• <strong>Step 3:</strong> Find the array of bytes that represents the bytecode program.</p>
                                    <p>• <strong>Step 4:</strong> Manually translate or write a simple disassembler for the bytecode. You'll see it's a simple program that loads characters one by one and prints them, spelling out the flag.</p>
                                </div>
                            )}

                            {selectedTutorial === 'explanation' && (
                                <div>
                                    <p><strong>🔍 Why It Works:</strong> Although the code looks complex, the underlying logic is simple. Once the custom instruction set is understood, the bytecode program becomes readable. The flag is hidden within this bytecode program, waiting to be interpreted by the VM.</p>
                                </div>
                            )}

                            {selectedTutorial === 'result' && (
                                <div>
                                    <p><strong>🏆 Expected Result:</strong> By correctly interpreting the bytecode, you will discover the flag: <code className="bg-gray-800 px-1 rounded font-mono">flag{'{'}vm_opcodes_cracked{'}'}</code></p>
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
                    Simulate VM
                </button>
            </div>

            {showBinary && (
                <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-600">
                    <h3 className="text-white font-semibold mb-2">VM Simulator</h3>
                    <div className="bg-black p-3 rounded font-mono text-green-400 text-sm mb-3">
                        <div>$ ./vm_challenge</div>
                        <div>Custom VM Challenge</div>
                    </div>
                    <div className="flex gap-2 mb-4">
                        <button 
                            onClick={handleBinaryRun}
                            className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
                        >
                            Start VM
                        </button>
                        <button 
                            onClick={handleVmStep}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                            disabled={vmStep === 0 && !binaryOutput}
                        >
                            <Zap className="w-4 h-4 inline mr-1" />
                            Step Execute
                        </button>
                    </div>
                    {binaryOutput && (
                        <div className="bg-black p-3 rounded font-mono text-green-400 text-sm whitespace-pre-line">
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

export default VirtualMachine;
