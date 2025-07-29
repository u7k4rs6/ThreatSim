import React from 'react';

interface KnowledgeCardsProps {
  contextualMode: boolean;
  triggerKeywords: string[];
}

const KnowledgeCards: React.FC<KnowledgeCardsProps> = ({ contextualMode, triggerKeywords }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">Knowledge Cards</h3>
      <div className="space-y-4">
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <h4 className="font-semibold text-indigo-400 mb-2">Cybersecurity Documentation</h4>
          <p className="text-gray-300 text-sm">Access comprehensive guides and resources</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <h4 className="font-semibold text-purple-400 mb-2">Interactive Lab Exercises</h4>
          <p className="text-gray-300 text-sm">Engage with simulation-based learning</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <h4 className="font-semibold text-teal-400 mb-2">Gamified Challenges</h4>
          <p className="text-gray-300 text-sm">Participate in interactive scenarios</p>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeCards;
