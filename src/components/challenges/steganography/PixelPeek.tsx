
import React, { useState, useRef } from 'react';
import { CheckCircle, XCircle, Lightbulb, Download, Eye, BookOpen, UploadCloud, Shield, BrainCircuit } from 'lucide-react';

interface PixelPeekProps {
  onComplete: (flag: string) => void;
  isCompleted: boolean;
}

const LSBExplanation: React.FC = () => {
  return (
    <div className="prose prose-invert bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto text-gray-300">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center gap-3"><BookOpen /> LSB Steganography: The Art of Hiding in Plain Sight</h2>
      
      <p className="text-lg">Welcome to the world of steganography! Steganography is the practice of concealing a message within another, non-secret message or object. In the digital realm, this often involves hiding data within files like images, audio, or video. Today, we're exploring one of the most common techniques: <strong>Least Significant Bit (LSB) Steganography</strong>.</p>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center gap-3"><Eye /> How Does It Work? A Bit-by-Bit Guide</h3>
        <p>Digital images are composed of pixels, and each pixel's color is typically represented by three values: Red, Green, and Blue (RGB). Each of these values is an 8-bit number, ranging from 0 to 255.</p>
        <p>The "Least Significant Bit" is the last bit (the right-most bit) in a binary number. Changing this bit has a minimal impact on the final value. For an 8-bit number, changing the LSB alters the total value by only 1. To the human eye, a change from a color value of 150 (<code>10010110</code>) to 151 (<code>10010111</code>) is practically imperceptible.</p>
        <p>LSB steganography exploits this by replacing the LSB of each color component (or a subset of them) with the bits of a secret message.</p>
        
        <div className="bg-gray-900/50 p-4 rounded-lg my-4">
          <p><strong>Example:</strong> Let's hide the letter 'C' (binary <code>01000011</code>) in three pixels.</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Original Pixel 1 (Red): <code>1100101<strong className="text-red-400">0</strong></code></li>
            <li>Original Pixel 2 (Green): <code>0101110<strong className="text-red-400">0</strong></code></li>
            <li>Original Pixel 3 (Blue): <code>1110011<strong className="text-red-400">1</strong></code></li>
          </ul>
          <p>We replace the LSBs with the bits of 'C':</p>
          <ul className="list-disc list-inside space-y-2">
            <li>New Pixel 1 (Red): <code>1100101<strong className="text-green-400">0</strong></code> (embeds the first bit of 'C')</li>
            <li>New Pixel 2 (Green): <code>0101110<strong className="text-green-400">1</strong></code> (embeds the second bit of 'C')</li>
            <li>...and so on, until all 8 bits of 'C' are hidden across 8 color channels.</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center gap-3"><BrainCircuit /> Detection and Real-World Implications</h3>
        <p>While subtle, LSB steganography is not undetectable. Security professionals use statistical analysis (a technique called <strong>steganalysis</strong>) to detect the slight statistical anomalies that embedding data introduces to an image. Tools can look for patterns in the LSBs that differ from those of a typical, unmodified image.</p>
        <p><strong>In the real world, steganography can be used for:</strong></p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Covert Communication:</strong> Journalists or activists in repressive regimes might use it to send information securely.</li>
          <li><strong>Malware:</strong> Attackers can hide malicious payloads or configuration files within seemingly benign images hosted on public websites to evade network detection systems.</li>
          <li><strong>Digital Watermarking:</strong> Artists and creators can embed invisible watermarks to prove ownership of their work.</li>
        </ul>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center gap-3"><Shield /> Prevention and Mitigation</h3>
        <p>To defend against malicious steganography, organizations can:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Re-encode Images:</strong> Re-compressing or resizing images upon upload to a website can strip out steganographic data.</li>
          <li><strong>Monitor for Steganalysis Tools:</strong> Use security tools capable of performing steganalysis on network traffic and files.</li>
          <li><strong>Limit File Uploads:</strong> Restrict the types and sizes of files that can be uploaded to a system.</li>
        </ul>
      </div>
    </div>
  );
};

const LSBTool: React.FC = () => {
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');
    setExtractedText('');
    setIsProcessing(false);

    if (!file) {
      setError('Please select a file.');
      return;
    }

    // Accept both PNG and other image formats for testing
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, etc.).');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (!result) {
        setError('Could not read file data.');
        setIsProcessing(false);
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        try {
          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setError('Could not create canvas context.');
            setIsProcessing(false);
            return;
          }

          // Draw image to canvas
          ctx.drawImage(img, 0, 0);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const pixels = imageData.data;
          
          // Extract LSBs from RGB channels only
          let binaryString = '';
          for (let i = 0; i < pixels.length; i += 4) {
            binaryString += (pixels[i] & 1).toString();     // Red
            binaryString += (pixels[i + 1] & 1).toString(); // Green
            binaryString += (pixels[i + 2] & 1).toString(); // Blue
          }

          // Convert binary to text
          let extractedMessage = '';
          for (let i = 0; i < binaryString.length; i += 8) {
            const byte = binaryString.slice(i, i + 8);
            if (byte.length === 8) {
              const charCode = parseInt(byte, 2);
              // Stop at null terminator or non-printable characters below 32 (except newline, tab)
              if (charCode === 0 || (charCode < 32 && charCode !== 10 && charCode !== 9)) {
                break;
              }
              // Only add printable characters
              if (charCode >= 32 && charCode <= 126) {
                extractedMessage += String.fromCharCode(charCode);
              } else if (charCode === 10 || charCode === 9) { // newline or tab
                extractedMessage += String.fromCharCode(charCode);
              }
            }
          }

          setIsProcessing(false);
          
          if (extractedMessage.trim()) {
            setExtractedText(extractedMessage);
          } else {
            // Try a simpler approach - just first few bytes
            let simpleMessage = '';
            for (let i = 0; i < Math.min(1000, binaryString.length); i += 8) {
              const byte = binaryString.slice(i, i + 8);
              if (byte.length === 8) {
                const charCode = parseInt(byte, 2);
                if (charCode >= 32 && charCode <= 126) {
                  simpleMessage += String.fromCharCode(charCode);
                }
              }
            }
            
            if (simpleMessage.trim()) {
              setExtractedText(simpleMessage);
            } else {
              setError('No readable message found in the image. The image may not contain LSB steganography or uses a different encoding method.');
            }
          }
        } catch (err) {
          setError('An error occurred during processing: ' + (err as Error).message);
          setIsProcessing(false);
          console.error('LSB extraction error:', err);
        }
      };
      
      img.onerror = (err) => {
        setError('Could not load the image. Please make sure it\'s a valid image file.');
        setIsProcessing(false);
        console.error('Image loading error:', err);
      };
      
      // Set the image source
      img.src = result as string;
    };
    
    reader.onerror = (err) => {
      setError('Could not read the selected file.');
      setIsProcessing(false);
      console.error('File reading error:', err);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">Interactive LSB Extractor Tool</h3>
      <div className="flex items-center gap-4">
        <input type="file" accept="image/png" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          <UploadCloud className="w-4 h-4" />
          Upload PNG Image
        </button>
      </div>
      
      {error && <p className="mt-4 text-red-400">{error}</p>}

      {extractedText && (
        <div className="mt-4">
          <h4 className="font-semibold text-cyan-400">Extracted Hidden Data:</h4>
          <pre className="bg-gray-900 p-4 rounded text-white whitespace-pre-wrap break-all text-sm">{extractedText}</pre>
        </div>
      )}
    </div>
  );
};

const PixelPeek: React.FC<PixelPeekProps> = ({ onComplete, isCompleted }) => {
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('learn');

  const correctFlag = 'flag{lsb_stego_master}';


  const createTestImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 300;
    canvas.height = 300;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(1, '#3b0764');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const decoyData = "system.log.info:user_auth_success;session_id=xY9s-..-AUTH-OK-..-sS(2)f..-..-payload:user_data_stream..-..-9s2j.sys.update.check..-..-BEGIN-FLAG--" + correctFlag + "--END-FLAG--..-..-net.core.ping_reply..-..-end_of_stream;db_conn_close();";

    let binaryMessage = '';
    for (let i = 0; i < decoyData.length; i++) {
      binaryMessage += decoyData.charCodeAt(i).toString(2).padStart(8, '0');
    }
    binaryMessage += '00000000'; // Null terminator

    let bitIndex = 0;
    for (let i = 0; i < data.length && bitIndex < binaryMessage.length; i++) {
      if ((i + 1) % 4 === 0) continue; // Skip alpha channel
      data[i] = (data[i] & 0xFE) | parseInt(binaryMessage[bitIndex], 2);
      bitIndex++;
    }

    ctx.putImageData(imageData, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'challenge_pixel_peek.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flag.trim() === correctFlag) {
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

      {activeTab === 'learn' && <LSBExplanation />}
      
      {activeTab === 'challenge' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Challenge: Pixel Peek</h2>
          <p className="text-gray-400 mb-4">The flag is hidden inside what looks like system log data. Analyze the extracted text to find the markers that reveal the flag.</p>
          
          <div className="flex gap-4 mb-4">
            <button onClick={createTestImage} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Generate & Download Test Image
            </button>
          </div>

          <LSBTool />

          <div className="mt-6 bg-gray-900/50 border border-gray-600 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" /> Analysis Hints
            </h4>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Look for patterns in the extracted data that might indicate the start and end of the flag</li>
              <li>• System logs often contain structured data with specific markers or delimiters</li>
              <li>• The flag follows the standard format: flag{'{...}'}</li>
              <li>• Real-world steganography often hides data within legitimate-looking content</li>
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

export default PixelPeek;
