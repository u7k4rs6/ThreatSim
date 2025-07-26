import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  AlertTriangle, 
  Shield, 
  Activity, 
  Zap, 
  Target, 
  Eye, 
  Lock,
  TrendingUp,
  Info,
  X,
  ChevronRight,
  Lightbulb,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface KnowledgeCard {
  id: string;
  title: string;
  category: 'threat-detection' | 'network-analysis' | 'incident-response' | 'best-practices';
  icon: React.ElementType;
  shortDescription: string;
  detailedExplanation: string;
  whyImportant: string;
  realWorldExample: string;
  bestPractices: string[];
  relatedTerms: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: number;
}

const knowledgeCards: KnowledgeCard[] = [
  {
    id: 'network-anomaly',
    title: 'Network Traffic Anomaly Detection',
    category: 'threat-detection',
    icon: Activity,
    shortDescription: 'Identifying unusual patterns in network traffic that may indicate security threats.',
    detailedExplanation: 'Network anomaly detection involves monitoring network traffic patterns and identifying deviations from normal behavior. These deviations, or anomalies, can indicate various security threats including DDoS attacks, malware communication, data exfiltration, or unauthorized access attempts.',
    whyImportant: 'Early detection of network anomalies allows security teams to respond to threats before they cause significant damage. It\'s often the first indicator of a security incident and forms the backbone of proactive cybersecurity defense.',
    realWorldExample: 'In 2020, a major healthcare organization detected a ransomware attack early by noticing unusual network traffic patterns - a sudden spike in encrypted communications to external IPs during off-hours. This early detection allowed them to isolate affected systems before the attack spread.',
    bestPractices: [
      'Establish baseline network behavior patterns',
      'Monitor traffic 24/7 with automated alerts',
      'Correlate anomalies with other security events',
      'Regularly update detection algorithms',
      'Train staff to recognize anomaly indicators'
    ],
    relatedTerms: ['DDoS Attack', 'Data Exfiltration', 'Malware C2', 'Baseline Monitoring'],
    difficulty: 'Intermediate',
    readTime: 3
  },
  {
    id: 'suspicious-traffic',
    title: 'Suspicious Network Traffic Patterns',
    category: 'threat-detection',
    icon: AlertTriangle,
    shortDescription: 'Recognizing potentially malicious network activity through traffic pattern analysis.',
    detailedExplanation: 'Suspicious traffic patterns include unexpected communication protocols, unusual data volumes, connections to known malicious IPs, or traffic during unusual hours. These patterns often indicate malware, data breaches, or unauthorized network access.',
    whyImportant: 'Identifying suspicious traffic is crucial for preventing data breaches, stopping malware spread, and maintaining network integrity. It\'s a key skill for SOC analysts and network security professionals.',
    realWorldExample: 'The Target breach in 2013 involved malware that created unusual network traffic patterns - small, regular data transfers to external servers. Early detection of these patterns could have prevented the massive data breach.',
    bestPractices: [
      'Monitor for connections to suspicious domains',
      'Watch for unusual data transfer volumes',
      'Track failed connection attempts',
      'Analyze traffic timing patterns',
      'Use threat intelligence feeds'
    ],
    relatedTerms: ['Malware Communication', 'Command & Control', 'Data Leakage', 'IOCs'],
    difficulty: 'Intermediate',
    readTime: 4
  },
  {
    id: 'bandwidth-analysis',
    title: 'Bandwidth Utilization Analysis',
    category: 'network-analysis',
    icon: TrendingUp,
    shortDescription: 'Understanding network bandwidth patterns to detect performance issues and security threats.',
    detailedExplanation: 'Bandwidth analysis involves monitoring network capacity usage over time. Unusual bandwidth patterns can indicate DDoS attacks, data exfiltration, unauthorized streaming, or network infrastructure problems. Normal patterns typically follow business hours and user behavior.',
    whyImportant: 'Proper bandwidth analysis helps maintain network performance, detect security incidents early, and plan for capacity upgrades. It\'s essential for both security and network operations.',
    realWorldExample: 'A financial institution noticed unusual bandwidth spikes during lunch hours, which led to discovering an employee was streaming high-definition videos, consuming critical bandwidth during peak trading hours.',
    bestPractices: [
      'Monitor bandwidth utilization continuously',
      'Establish normal usage baselines',
      'Set up alerts for unusual spikes',
      'Correlate with security events',
      'Plan capacity based on trends'
    ],
    relatedTerms: ['Network Congestion', 'DDoS Attack', 'Quality of Service', 'Traffic Shaping'],
    difficulty: 'Beginner',
    readTime: 2
  },
  {
    id: 'incident-response',
    title: 'Security Incident Response Process',
    category: 'incident-response',
    icon: Shield,
    shortDescription: 'Systematic approach to handling and mitigating security incidents effectively.',
    detailedExplanation: 'Incident response is a structured approach to handling security breaches or attacks. It includes preparation, identification, containment, eradication, recovery, and lessons learned. Each phase has specific goals and procedures to minimize damage and restore normal operations.',
    whyImportant: 'A well-executed incident response can mean the difference between a minor security event and a major data breach. Quick, proper response reduces damage, costs, and recovery time while maintaining stakeholder trust.',
    realWorldExample: 'When Maersk was hit by NotPetya malware in 2017, their incident response plan helped them restore operations within 10 days, though the attack still cost them $300 million, highlighting the importance of both prevention and response.',
    bestPractices: [
      'Develop and regularly test incident response plans',
      'Maintain updated contact information',
      'Document all actions and decisions',
      'Preserve evidence for forensic analysis',
      'Conduct post-incident reviews'
    ],
    relatedTerms: ['NIST Framework', 'Forensic Analysis', 'Business Continuity', 'Threat Containment'],
    difficulty: 'Advanced',
    readTime: 5
  },
  {
    id: 'real-time-monitoring',
    title: 'Real-time Security Monitoring',
    category: 'best-practices',
    icon: Eye,
    shortDescription: 'Continuous monitoring of security events and network activity for immediate threat detection.',
    detailedExplanation: 'Real-time monitoring involves continuously watching network traffic, system logs, and security events as they happen. This approach enables immediate detection and response to security threats, reducing the window of opportunity for attackers.',
    whyImportant: 'The faster you detect a threat, the less damage it can cause. Real-time monitoring is essential for modern cybersecurity, especially with the increasing speed and sophistication of cyber attacks.',
    realWorldExample: 'CrowdStrike\'s real-time monitoring helped detect and stop the 2016 Democratic National Committee breach within hours of deployment, demonstrating the power of continuous monitoring.',
    bestPractices: [
      'Use automated monitoring tools',
      'Set up intelligent alerting systems',
      'Maintain 24/7 SOC coverage',
      'Integrate multiple data sources',
      'Regularly tune detection rules'
    ],
    relatedTerms: ['SOC Operations', 'SIEM Systems', 'Threat Hunting', 'Alert Fatigue'],
    difficulty: 'Intermediate',
    readTime: 3
  }
];

interface KnowledgeCardsProps {
  triggerKeywords?: string[];
  contextualMode?: boolean;
}

const KnowledgeCards: React.FC<KnowledgeCardsProps> = ({ 
  triggerKeywords = [], 
  contextualMode = false 
}) => {
  const [selectedCard, setSelectedCard] = useState<KnowledgeCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [readCards, setReadCards] = useState<Set<string>>(new Set());
  const [showFloatingTips, setShowFloatingTips] = useState(false);

  // Filter cards based on category
  const filteredCards = knowledgeCards.filter(card => 
    selectedCategory === 'all' || card.category === selectedCategory
  );

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors = {
      'threat-detection': 'bg-red-500',
      'network-analysis': 'bg-blue-500',
      'incident-response': 'bg-orange-500',
      'best-practices': 'bg-green-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Beginner': 'text-green-400',
      'Intermediate': 'text-yellow-400',
      'Advanced': 'text-red-400'
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-400';
  };

  // Open knowledge card modal
  const openCard = (card: KnowledgeCard) => {
    setSelectedCard(card);
    setIsModalOpen(true);
    setReadCards(prev => new Set(prev.add(card.id)));
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  // Show contextual tips
  useEffect(() => {
    if (contextualMode && triggerKeywords.length > 0) {
      setShowFloatingTips(true);
      const timer = setTimeout(() => setShowFloatingTips(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [triggerKeywords, contextualMode]);

  return (
    <div className="knowledge-cards-container">
      {/* Main Knowledge Cards Grid */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">Knowledge Center</h3>
            <span className="text-sm text-gray-400">Learn as you explore</span>
          </div>
          
          {/* Category Filter */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'threat-detection', label: 'Threats' },
              { key: 'network-analysis', label: 'Analysis' },
              { key: 'incident-response', label: 'Response' },
              { key: 'best-practices', label: 'Best Practices' }
            ].map(category => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedCategory === category.key
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Knowledge Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              onClick={() => openCard(card)}
              className="group relative bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-cyan-500/50 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getCategoryColor(card.category)}/20`}>
                    <card.icon className={`w-5 h-5 ${getCategoryColor(card.category).replace('bg-', 'text-')}`} />
                  </div>
                  {readCards.has(card.id) && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </div>

              {/* Card Content */}
              <h4 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                {card.title}
              </h4>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {card.shortDescription}
              </p>

              {/* Card Footer */}
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${getDifficultyColor(card.difficulty)}`}>
                  {card.difficulty}
                </span>
                <span className="text-gray-500">
                  {card.readTime} min read
                </span>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Card Modal */}
      {isModalOpen && selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${getCategoryColor(selectedCard.category)}/20`}>
                  <selectedCard.icon className={`w-6 h-6 ${getCategoryColor(selectedCard.category).replace('bg-', 'text-')}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedCard.title}</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`text-sm font-medium ${getDifficultyColor(selectedCard.difficulty)}`}>
                      {selectedCard.difficulty} Level
                    </span>
                    <span className="text-sm text-gray-400">
                      {selectedCard.readTime} min read
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Overview */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-cyan-400" />
                  Overview
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {selectedCard.detailedExplanation}
                </p>
              </div>

              {/* Why Important */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Why This Matters
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {selectedCard.whyImportant}
                </p>
              </div>

              {/* Real World Example */}
              <div className="mb-6 bg-gray-800/50 rounded-lg p-4 border-l-4 border-orange-500">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-400" />
                  Real-World Example
                </h3>
                <p className="text-gray-300 leading-relaxed italic">
                  {selectedCard.realWorldExample}
                </p>
              </div>

              {/* Best Practices */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Best Practices
                </h3>
                <ul className="space-y-2">
                  {selectedCard.bestPractices.map((practice, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related Terms */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  Related Terms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCard.relatedTerms.map((term, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700/50 border border-gray-600 rounded-full text-sm text-gray-300 hover:bg-gray-600/50 transition-colors cursor-pointer"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-700 bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Keep learning to become a cybersecurity expert! 🚀
                </div>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Learning Tips (Contextual Mode) */}
      {showFloatingTips && contextualMode && (
        <div className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg shadow-2xl p-4 max-w-sm border border-cyan-500/30">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-medium mb-1">💡 Learning Tip</h4>
              <p className="text-cyan-100 text-sm">
                Click on knowledge cards to learn more about the concepts you're seeing in the dashboard!
              </p>
            </div>
            <button
              onClick={() => setShowFloatingTips(false)}
              className="text-cyan-200 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #06b6d4;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0891b2;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default KnowledgeCards;
