import React, { useState, useEffect } from 'react';

interface KnowledgeCardsProps {
  contextualMode: boolean;
  triggerKeywords: string[];
}

const KnowledgeCards: React.FC<KnowledgeCardsProps> = ({ contextualMode, triggerKeywords }) => {
  const [facts, setFacts] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(120);

// Cybersecurity "Did you know?" facts
  const flashCards = [
    '🔥 A cyber attack is attempted every 39 seconds on average.',
    '🚨 95% of cybersecurity breaches are due to human error.',
    '📋 More than 77% of organizations do not have a cybersecurity incident response plan.',
    '🦠 The first computer virus "Elk Cloner" was created in 1983 by Rich Skrenta.',
    '💰 Cybercrime is expected to cost the world $10.5 trillion annually by 2025.',
    '🔒 Ransomware attacks have increased by 150% in the last two years.',
    '🎣 Phishing attacks account for more than 80% of reported security incidents.',
    '👨‍💻 The global cybersecurity workforce needs to grow by 145% to meet demand.',
    '📁 58% of organizations have more than 100,000 folders open to everyone.',
    '📈 The cybersecurity market is expected to exceed $300 billion by 2024.',
    '🔐 The average cost of a data breach is $4.35 million globally.',
    '⏱️ It takes an average of 287 days to identify and contain a data breach.',
    '🌐 Over 4 billion records were exposed in data breaches in 2019 alone.',
    '🔑 Weak or stolen passwords are responsible for 81% of data breaches.',
    '🏢 43% of cyberattacks target small businesses.',
    '📧 1 in every 99 emails is a phishing attack.',
    '🔍 Only 5% of company folders are properly protected.',
    '⚡ The WannaCry ransomware attack affected 300,000 computers in 150+ countries.',
    '🛡️ Multi-factor authentication can prevent 99.9% of account takeovers.',
    '💻 The first computer worm "Morris Worm" infected 10% of internet-connected computers in 1988.',
    '🎯 Social engineering attacks have a 98% success rate.',
    '🔧 Zero-day exploits are sold on the dark web for $1-3 million.',
    '📱 Mobile malware has increased by 54% in recent years.',
    '🌍 Cybercrime damages are predicted to reach $6 trillion annually worldwide.',
    '🕸️ The dark web marketplace accounts for only 4% of the entire internet.'
  ];

  useEffect(() => {
    const refreshFacts = () => {
      const shuffled = flashCards.sort(() => 0.5 - Math.random());
      setFacts(shuffled.slice(0, 3));
      setCountdown(120); // Reset countdown
    };

    const interval = setInterval(refreshFacts, 120000); // 2 minutes
    refreshFacts(); // immediately load facts

    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 120);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-600/30 rounded-xl p-8 shadow-2xl">
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl border border-purple-500/20 shadow-inner">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl animate-pulse">🛡️</span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Cybersecurity Insights
            </span>
          </h4>
          <div className="text-sm text-cyan-300 bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-400/30">
            ⏱️ {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {facts.map((fact, index) => (
            <div 
              key={index} 
              className="relative p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:rotate-1 border border-gray-700 hover:border-cyan-400/50 group"
              style={{
                background: `linear-gradient(135deg, 
                  ${index === 0 ? '#1e1b4b, #312e81' : index === 1 ? '#1f2937, #374151' : '#111827, #1f2937'})`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                  <p className="text-lg text-gray-100 leading-relaxed font-medium">{fact}</p>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <div className="w-8 h-8 border-2 border-cyan-400 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={() => {
              const shuffled = flashCards.sort(() => 0.5 - Math.random());
              setFacts(shuffled.slice(0, 3));
              setCountdown(120);
            }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-110 hover:shadow-2xl shadow-lg border border-cyan-400/30 hover:border-cyan-300/50"
          >
            <span className="flex items-center gap-2">
              🔄 <span>New Insights</span>
            </span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default KnowledgeCards;
