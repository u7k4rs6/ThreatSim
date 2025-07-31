import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Activity, AlertTriangle, Server, Wifi, Target, User, LogOut, Trophy, Clock, TrendingUp, Calendar, Zap, CheckCircle, XCircle, Award } from 'lucide-react';
import EnhancedNetworkGraph from '../components/EnhancedNetworkGraph';
import KnowledgeCards from '../components/KnowledgeCards';
import ThreatHuntingChallenges from '../components/ThreatHuntingChallenges';
import VirtualSOC from '../components/VirtualSOC';
import { useAuth } from '../contexts/AuthContext';
import { saveChallengeProgress, ChallengeProgress, getUserProgress, getAllChallengeProgress } from '../utils/dataStorage';

const SimulationLab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'network' | 'challenges' | 'tools' | 'soc'>('dashboard');
  const [userStats, setUserStats] = useState<any>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to journey page after logout
  };

  // Calculate real user statistics
  useEffect(() => {
    if (user) {
      const userProgress = getUserProgress(user.uid);
      const allChallenges = getAllChallengeProgress(user.uid);
      
      // Calculate completion rates by category
      const categoryStats = {
        'web-exploitation': allChallenges.filter(c => c.challengeId.startsWith('web-exploitation') && c.completed).length,
        'reverse-engineering': allChallenges.filter(c => c.challengeId.startsWith('reverse-engineering') && c.completed).length,
        'steganography': allChallenges.filter(c => c.challengeId.startsWith('steganography') && c.completed).length,
        'cryptography': allChallenges.filter(c => c.challengeId.startsWith('cryptography') && c.completed).length,
        'forensics': allChallenges.filter(c => c.challengeId.startsWith('forensics') && c.completed).length,
        'osint': allChallenges.filter(c => c.challengeId.startsWith('osint') && c.completed).length,
        'pwn-binary': allChallenges.filter(c => c.challengeId.startsWith('pwn-binary') && c.completed).length,
        'realistic-boxes': allChallenges.filter(c => c.challengeId.startsWith('realistic-boxes') && c.completed).length,
      };

      // Calculate recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentChallenges = allChallenges.filter(c => 
        c.completedAt && new Date(c.completedAt) > sevenDaysAgo
      );

      // Calculate average completion time
      const completedWithTime = allChallenges.filter(c => c.completed && c.timeToComplete);
      const avgCompletionTime = completedWithTime.length > 0 
        ? completedWithTime.reduce((sum, c) => sum + (c.timeToComplete || 0), 0) / completedWithTime.length
        : 0;

      // Define valid threat hunting challenge prefixes
      const validChallengeCategories = [
        'web-exploitation',
        'reverse-engineering', 
        'steganography',
        'cryptography',
        'forensics',
        'osint',
        'pwn-binary',
        'realistic-boxes'
      ];
      
      // Calculate total completed challenges from all categories (excluding test challenges)
      const totalCompletedChallenges = allChallenges.filter(c => 
        c.completed && validChallengeCategories.some(prefix => c.challengeId.startsWith(prefix))
      ).length;
      
      // Calculate security score based on achievements and progress
      const securityScore = Math.min(100, Math.round(
        (userProgress.totalScore / 10) + // Base score from points
        (totalCompletedChallenges * 2) + // Bonus for each challenge
        (userProgress.achievements.length * 5) + // Achievement bonus
        (userProgress.level * 3) // Level bonus
      ));

      // Determine threat level based on recent activity and skill level
      let threatLevel = 'Low';
      let threatColor = 'text-green-400';
      let threatBg = 'bg-green-500';
      let threatWidth = '30%';
      
      if (recentChallenges.length > 5) {
        threatLevel = 'High';
        threatColor = 'text-red-400';
        threatBg = 'bg-red-500';
        threatWidth = '85%';
      } else if (recentChallenges.length > 2) {
        threatLevel = 'Moderate';
        threatColor = 'text-yellow-400';
        threatBg = 'bg-yellow-500';
        threatWidth = '60%';
      }

      // Calculate streak
      const today = new Date();
      let currentStreak = 0;
      for (let i = 0; i < 30; i++) { // Check last 30 days
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dayStart = new Date(checkDate.setHours(0, 0, 0, 0));
        const dayEnd = new Date(checkDate.setHours(23, 59, 59, 999));
        
        const challengesOnDay = allChallenges.filter(c => {
          if (!c.completedAt) return false;
          const completedDate = new Date(c.completedAt);
          return completedDate >= dayStart && completedDate <= dayEnd;
        });
        
        if (challengesOnDay.length > 0) {
          currentStreak++;
        } else if (i === 0) {
          // If no challenges today, check yesterday
          continue;
        } else {
          break;
        }
      }

      setUserStats({
        userProgress,
        categoryStats,
        recentChallenges: recentChallenges.length,
        avgCompletionTime: Math.round(avgCompletionTime / 1000 / 60), // Convert to minutes
        securityScore,
        threatLevel,
        threatColor,
        threatBg,
        threatWidth,
        currentStreak,
        totalChallenges: allChallenges.length,
        totalCompletedChallenges,
        lastActive: userProgress.lastActive
      });
    }
  }, [user]);
  
  const testDataSaving = () => {
    if (!user) return;
    
    const testProgress: ChallengeProgress = {
      challengeId: `test-challenge-${Date.now()}`,
      userId: user.uid,
      completed: true,
      score: Math.floor(Math.random() * 100) + 1,
      timeToComplete: Math.floor(Math.random() * 60000) + 30000, // 30s to 90s
      completedAt: new Date(),
      attempts: 1,
      hints: 0,
      answers: { testAnswer: 'correct' }
    };
    
    try {
      saveChallengeProgress(testProgress);
      alert(`✅ Test challenge completed! Score: ${testProgress.score}. Check browser console for details.`);
    } catch (error) {
      alert('❌ Failed to save progress. Check browser console for details.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journey
              </Link>
              
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-cyan-400" />
                <div>
                  <h1 className="text-2xl font-bold">CyberSim Lab</h1>
                  <p className="text-gray-400 text-sm">Enhanced Network Analysis</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/30 border border-green-600/30">
                <User className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">{user?.displayName || user?.email?.split('@')[0] || 'Analyst'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/30 border border-red-600/30 text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-gray-800/30 border-r border-gray-700 min-h-screen">
          <div className="p-6">
            {/* Threat Level */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`w-5 h-5 ${userStats?.threatColor || 'text-yellow-500'}`} />
                <span className="text-sm font-medium">Activity Level</span>
              </div>
              <div className={`text-lg font-semibold ${userStats?.threatColor || 'text-yellow-500'}`}>
                {userStats?.threatLevel || 'Low'}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div className={`${userStats?.threatBg || 'bg-yellow-500'} h-2 rounded-full`} style={{ width: userStats?.threatWidth || '30%' }}></div>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {userStats?.recentChallenges || 0} challenges this week
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <div 
                onClick={() => setActiveSection('dashboard')}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors cursor-pointer ${
                  activeSection === 'dashboard' 
                    ? 'bg-cyan-600/20 border border-cyan-600/30 text-cyan-400' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span>Dashboard</span>
              </div>
              <div 
                onClick={() => setActiveSection('network')}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors cursor-pointer ${
                  activeSection === 'network' 
                    ? 'bg-cyan-600/20 border border-cyan-600/30 text-cyan-400' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Wifi className="w-5 h-5" />
                <span>Network Simulation</span>
              </div>
              <div 
                onClick={() => setActiveSection('challenges')}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors cursor-pointer ${
                  activeSection === 'challenges' 
                    ? 'bg-cyan-600/20 border border-cyan-600/30 text-cyan-400' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Target className="w-5 h-5" />
                <span>Challenges</span>
              </div>
              <div 
                onClick={() => setActiveSection('tools')}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors cursor-pointer ${
                  activeSection === 'tools' 
                    ? 'bg-cyan-600/20 border border-cyan-600/30 text-cyan-400' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Server className="w-5 h-5" />
                <span>Security Tools</span>
              </div>
              <div 
                onClick={() => setActiveSection('soc')}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors cursor-pointer ${
                  activeSection === 'soc' 
                    ? 'bg-cyan-600/20 border border-cyan-600/30 text-cyan-400' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span>Virtual SOC</span>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {activeSection === 'dashboard' && (
              <>
                {/* Page Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Security Operations Dashboard</h2>
                  <p className="text-gray-400">Monitor system status and respond to security incidents</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-blue-400">{userStats?.securityScore || 0}</div>
                        <div className="text-sm text-gray-400">Security Score</div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-700/50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-yellow-400">{userStats?.totalCompletedChallenges || 0}</div>
                        <div className="text-sm text-gray-400">Challenges Completed</div>
                      </div>
                      <Trophy className="w-8 h-8 text-yellow-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-green-400">{userStats?.avgCompletionTime || 0}m</div>
                        <div className="text-sm text-gray-400">Avg. Time</div>
                      </div>
                      <Clock className="w-8 h-8 text-green-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-purple-400">{userStats?.currentStreak || 0}</div>
                        <div className="text-sm text-gray-400">Current Streak</div>
                      </div>
                      <Calendar className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                </div>

                {/* Test Data Storage Button */}
                <div className="mb-8">
                  <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 border border-cyan-700/50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-cyan-400 mb-4">🧪 Test Data Storage</h3>
                    <p className="text-gray-300 mb-4">Click the button below to test if your progress data is being saved correctly.</p>
                    <button
                      onClick={testDataSaving}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all"
                    >
                      🎯 Complete Test Challenge
                    </button>
                  </div>
                </div>

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  {/* Knowledge Cards */}
                  <div className="lg:col-span-2">
                    <KnowledgeCards contextualMode={true} triggerKeywords={['dashboard', 'security', 'operations']} />
                  </div>
                  
                  {/* Live Activity Feed */}
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-cyan-400" />
                      Live Activity
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="text-sm text-white">Network scan completed</div>
                          <div className="text-xs text-gray-400">2 minutes ago</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="text-sm text-white">New security alert</div>
                          <div className="text-xs text-gray-400">5 minutes ago</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="text-sm text-white">Challenge completed</div>
                          <div className="text-xs text-gray-400">12 minutes ago</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm text-white">System backup verified</div>
                          <div className="text-xs text-gray-400">1 hour ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Progress Overview */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Challenge Progress by Category
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(userStats?.categoryStats || {}).map(([category, completed]) => {
                      const categoryNames = {
                        'web-exploitation': 'Web Exploitation',
                        'reverse-engineering': 'Reverse Engineering',
                        'steganography': 'Steganography',
                        'cryptography': 'Cryptography',
                        'forensics': 'Forensics',
                        'osint': 'OSINT',
                        'pwn-binary': 'Binary Exploitation',
                        'realistic-boxes': 'Realistic Boxes'
                      };
                      const displayName = categoryNames[category as keyof typeof categoryNames] || category;
                      return (
                        <div key={category} className="bg-gray-900/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-300">{displayName}</span>
                            <div className="flex items-center gap-1">
                              {completed > 0 ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-600" />
                              )}
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-white">{completed}</div>
                          <div className="text-xs text-gray-400">completed</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="text-center text-gray-500 text-sm">
                  CyberSim Lab © 2025 • Secure Environment
                </div>
              </>
            )}

            {activeSection === 'network' && (
              <>
                {/* Page Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Network Simulation</h2>
                  <p className="text-gray-400">Real-time network traffic analysis and monitoring</p>
                </div>

                {/* Enhanced Network Graph */}
                <div className="mb-8">
                  <EnhancedNetworkGraph />
                </div>

                {/* Knowledge Cards Section */}
                <div className="mb-8">
                  <KnowledgeCards contextualMode={true} triggerKeywords={['network', 'traffic', 'anomaly']} />
                </div>
              </>
            )}

            {activeSection === 'challenges' && (
              <>
                {/* Page Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Threat Hunting Challenges</h2>
                  <p className="text-gray-400">Interactive cybersecurity challenges to sharpen your threat detection skills</p>
                </div>

                {/* Threat Hunting Challenges Component */}
                <ThreatHuntingChallenges />
              </>
            )}

            {activeSection === 'tools' && (
              <>
                {/* Page Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Security Tools</h2>
                  <p className="text-gray-400">Advanced security analysis and forensic tools</p>
                </div>

                {/* Placeholder for Security Tools */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-8 text-center">
                  <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Security Tools Coming Soon</h3>
                  <p className="text-gray-500">Advanced security analysis tools and forensic capabilities will be available in this section.</p>
                </div>
              </>
            )}

            {activeSection === 'soc' && (
              <>
                {/* Page Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Virtual SOC Environment</h2>
                  <p className="text-gray-400">Simulated security operations center activities and exercises</p>
                </div>

                {/* Virtual SOC Component */}
                <VirtualSOC />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationLab;
