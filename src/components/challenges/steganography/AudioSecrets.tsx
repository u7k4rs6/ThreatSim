
import React, { useState, useRef } from 'react';
import { CheckCircle, XCircle, Lightbulb, Download, Eye, BookOpen, UploadCloud, Shield, BrainCircuit, Radio } from 'lucide-react';

interface AudioSecretsProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const SpectrogramExplanation: React.FC = () => {
  return (
    <div className="prose prose-invert bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto text-gray-300">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center gap-3"><BookOpen /> Audio Steganography: Hiding Secrets in Sound</h2>
      <p className="text-lg">Audio steganography involves concealing information within audio files. One of the most fascinating methods is creating a <strong>visual representation</strong> of data within the sound itself, which can be seen using a spectrogram.</p>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center gap-3"><Radio /> What is a Spectrogram?</h3>
        <p>A spectrogram is a visual way to represent the strength of a signal's frequency content over time. In simpler terms, it's a graph where:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>The <strong>horizontal axis</strong> represents time.</li>
          <li>The <strong>vertical axis</strong> represents frequency (pitch).</li>
          <li>The <strong>color or intensity</strong> of a point represents the amplitude (loudness) of a frequency at a specific time.</li>
        </ul>
        <p>By precisely controlling the frequencies in an audio file, one can "draw" images or patterns in the spectrogram. This is a common technique in CTFs and has even been used by artists to hide Easter eggs in music tracks.</p>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center gap-3"><BrainCircuit /> Detecting Spectrogram Steganography</h3>
        <p>The secret message is invisible to the naked ear because the frequencies used might be very high, very low, or masked by other sounds. However, when the audio is analyzed with a spectrogram tool, the hidden visual pattern emerges clearly.</p>
        <p>In this challenge, the flag is encoded as <strong>Morse code</strong>. You will see a series of dots and dashes appear as horizontal lines in the spectrogram. Your task is to decode this visual Morse code back into text.</p>
      </div>
    </div>
  );
};

const SpectrogramTool: React.FC = () => {
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');
    setIsProcessing(true);
    if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')!;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    if (!file || !file.type.startsWith('audio/')) {
      setError('Please upload a valid audio file (WAV, MP3, etc.).');
      setIsProcessing(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(event.target?.result as ArrayBuffer);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const width = canvas.width;
        const height = canvas.height;
        let x = 0;

        const draw = () => {
            if (x >= width) return;
            analyser.getByteFrequencyData(dataArray);
            ctx.fillStyle = '#0d1117';
            ctx.fillRect(x, 0, 1, height);

            for (let i = 0; i < dataArray.length; i++) {
                const v = dataArray[i] / 255.0;
                if (v > 0) {
                    const y = height - (i / dataArray.length) * height;
                    ctx.fillStyle = `rgba(59, 130, 246, ${v})`;
                    ctx.fillRect(x, y, 1, 1);
                }
            }
            x++;
            requestAnimationFrame(draw);
        };
        
        source.start();
        draw();
        setIsProcessing(false);
      } catch (err) {
        setError('Could not process audio file. Make sure it is a valid format.');
        console.error(err);
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">Interactive Spectrogram Viewer</h3>
      <div className="flex items-center gap-4 mb-4">
        <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleAudioUpload} className="hidden" />
        <button onClick={() => fileInputRef.current?.click()} disabled={isProcessing} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-500 transition-colors">
          <UploadCloud className="w-4 h-4" />
          {isProcessing ? 'Processing...' : 'Upload Audio File'}
        </button>
      </div>
      {error && <p className="mt-4 text-red-400">{error}</p>}
      <canvas ref={canvasRef} width="800" height="300" className="bg-gray-900 rounded-lg w-full"></canvas>
    </div>
  );
};

const AudioSecrets: React.FC<AudioSecretsProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('learn');

  const correctFlag = 'flag{morse_code_in_audio}';

  const createChallengeAudio = () => {
    const morseMap: { [key: string]: string } = {
      'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--', 'z': '--..',
      '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
      '{': '-.--.', '}': '.--.-', '_': '..--.-'
    };
    const flagText = correctFlag.replace('flag','').toLowerCase();
    let morseString = '';
    for (const char of flagText) {
      morseString += (morseMap[char] || '') + ' ';
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = 44100;
    const dotDuration = 0.1;
    const freq = 1000;
    let duration = 2; // Initial silence
    for(const char of morseString) {
        duration += (char === '.' ? dotDuration : char === '-' ? 3 * dotDuration : 7 * dotDuration);
    }

    const frameCount = sampleRate * duration;
    const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);
    let currentPos = 2 * sampleRate;

    for (const char of morseString) {
      const toneDuration = char === '.' ? dotDuration : 3 * dotDuration;
      if (char === '.' || char === '-') {
        for (let i = 0; i < sampleRate * toneDuration; i++) {
          data[currentPos + i] = Math.sin(2 * Math.PI * freq * i / sampleRate);
        }
        currentPos += sampleRate * (toneDuration + dotDuration); // Add inter-element gap
      }
       else if (char === ' ') { 
        currentPos += sampleRate * (3 * dotDuration); // Gap between letters
      }
    }

    // WAV export logic
    const wavData = new DataView(new ArrayBuffer(44 + buffer.length * 2));
    // ... (rest of the WAV creation logic as before)
    // RIFF chunk descriptor
    writeString(wavData, 0, 'RIFF');
    wavData.setUint32(4, 36 + buffer.length * 2, true);
    writeString(wavData, 8, 'WAVE');
    // fmt sub-chunk
    writeString(wavData, 12, 'fmt ');
    wavData.setUint32(16, 16, true);
    wavData.setUint16(20, 1, true);
    wavData.setUint16(22, 1, true);
    wavData.setUint32(24, sampleRate, true);
    wavData.setUint32(28, sampleRate * 2, true);
    wavData.setUint16(32, 2, true);
    wavData.setUint16(34, 16, true);
    // data sub-chunk
    writeString(wavData, 36, 'data');
    wavData.setUint32(40, buffer.length * 2, true);

    let offset = 44;
    for (let i = 0; i < buffer.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, data[i]));
        wavData.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    const blob = new Blob([wavData], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'challenge_audio_secrets.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

 function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flag.trim().toLowerCase() === correctFlag) {
      setMessage('Correct flag! Well done.');
      onComplete(flag.trim());
    } else {
      setMessage('Incorrect flag. Keep trying!');
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <div className="flex border-b border-gray-700 mb-6">
        <button onClick={() => setActiveTab('learn')} className={`flex items-center gap-2 px-4 py-2 transition-colors ${activeTab === 'learn' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
          <BookOpen size={18} /> Learn
        </button>
        <button onClick={() => setActiveTab('challenge')} className={`flex items-center gap-2 px-4 py-2 transition-colors ${activeTab === 'challenge' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
          <Eye size={18} /> Challenge
        </button>
      </div>

      {activeTab === 'learn' && <SpectrogramExplanation />}
      
      {activeTab === 'challenge' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Challenge: Audio Secrets</h2>
          <p className="text-gray-400 mb-4">A secret message is hidden in this audio file as Morse code. Generate the file, view its spectrogram, and decode the message to find the flag.</p>
          
          <div className="flex gap-4 mb-4">
            <button onClick={createChallengeAudio} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Generate & Download Challenge WAV
            </button>
          </div>

          <SpectrogramTool />
          
          <div className="mt-6 bg-gray-900/50 border border-gray-600 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" /> Analysis Hints
              </h4>
              <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• The Morse code will appear as distinct horizontal lines in the spectrogram.</li>
                  <li>• A short line is a dot ('.') and a longer line is a dash ('-').</li>
                  <li>• Pay attention to the gaps: a short gap separates letters, and a longer gap separates words.</li>
                  <li>• You might need an online Morse code translator to convert the dots and dashes to text.</li>
              </ul>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-4 items-center mt-6">
            <input 
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="Enter flag here..."
              className="flex-grow p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Flag input"
            />
            <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors">Submit</button>
          </form>

          {message && (
            <div className={`mt-4 flex items-center gap-2 font-semibold ${isCompleted ? 'text-green-400' : 'text-red-400'}`}>
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              <span>{message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioSecrets;
