import React from 'react';
import {
  BookOpen,
  GamepadIcon,
  FlaskRound as Flask,
  Shield,
  Activity,
  Users,
  ExternalLink,
  LogOut,
  User,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    title: 'Cybersecurity Documentation',
    description: 'Comprehensive guides and resources to master cybersecurity fundamentals and advanced techniques.',
    icon: BookOpen,
    action: 'Browse Docs',
    link: 'https://cyberdocs.netlify.app/',
    highlight: false
  },
  {
    title: 'Gamified Learning',
    description: 'Interactive challenges, quizzes, and hands-on labs that make cybersecurity education engaging.',
    icon: GamepadIcon,
    action: 'Start Playing',
    link: 'https://hack-os.onrender.com/',
    highlight: true
  },
  {
    title: 'Simulation Lab',
    description: 'Practice in realistic scenarios with our enhanced virtual lab environment and tools.',
    icon: Flask,
    action: 'Enter Lab',
    link: '/simulation-lab',
    highlight: false
  },
  {
    title: 'Threat Map',
    description: 'Monitor global cyber threats in real-time with our interactive threat intelligence dashboard.',
    icon: Shield,
    action: 'View Dashboard',
    link: 'https://threatmap.checkpoint.com/',
    highlight: false
  },
  {
    title: 'Security Intelligence',
    description: 'Essential tools and resources for security testing, analysis, and threat hunting.',
    icon: Activity,
    action: 'Explore Tools',
    link: 'https://threat-bot.vercel.app/',
    highlight: false
  },
  {
    title: 'Community',
    description: 'Join our vibrant community of cybersecurity enthusiasts, experts, and learners.',
    icon: Users,
    action: 'Join Now',
    link: 'https://join.slack.com/t/threatsimworkspace/shared_invite/zt-343rmoydf-wh8qJnLu96ETbkZ9ehEk_Q',
    highlight: false
  }
];

function Journey() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0E1A] via-[#1A1B2E] to-[#0E0E1A] text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-[#1A1B2E]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#5B5FF7]" />
              <span className="text-xl font-bold">ThreatSim</span>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#00C2A8]/10 border border-[#00C2A8]/30 rounded-lg">
                    <User className="w-4 h-4 text-[#00C2A8]" />
                    <span className="text-[#00C2A8] font-medium text-sm">
                      {user.displayName || user.email?.split('@')[0] || 'Analyst'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 hover:bg-[#FF6B6B]/20 transition-all text-[#FF6B6B] hover:text-[#FF6B6B] text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-lg bg-[#5B5FF7] hover:bg-[#4B4FE7] hover:shadow-lg hover:shadow-[#5B5FF7]/25 transition-all text-white font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-[#5B5FF7] via-[#00C2A8] to-[#5B5FF7] bg-clip-text text-transparent">
                    ThreatSim
                  </span>
                </h1>
                <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Your Cybersecurity Adventure Starts Here
                </h2>
                <p className="text-xl text-[#A0A0B2] leading-relaxed max-w-lg">
                  Master cybersecurity through gamified learning, hands-on labs, and real-world simulations. 
                  Build the skills to protect digital assets and advance your career.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/simulation-lab"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#5B5FF7] hover:bg-[#4B4FE7] hover:shadow-xl hover:shadow-[#5B5FF7]/30 rounded-lg text-white font-semibold text-lg transition-all transform hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="https://cyberdocs.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#5B5FF7] text-[#5B5FF7] hover:bg-[#5B5FF7]/10 hover:shadow-lg rounded-lg font-semibold text-lg transition-all"
                >
                  Browse Docs
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#5B5FF7]/20 via-[#00C2A8]/20 to-[#FF6B6B]/20 rounded-3xl blur-3xl animate-pulse"></div>
                
                {/* Tech Illustration Placeholder */}
                <div className="relative bg-gradient-to-br from-[#1A1B2E] to-[#0E0E1A] border border-gray-700/50 rounded-3xl p-12 backdrop-blur-sm">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Cyber nodes */}
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                          i === 4 
                            ? 'border-[#5B5FF7] bg-[#5B5FF7]/20 animate-pulse' 
                            : 'border-gray-600 bg-gray-800/50'
                        }`}
                        style={{
                          animationDelay: `${i * 0.2}s`
                        }}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          i === 4 ? 'bg-[#5B5FF7]' : 'bg-gray-500'
                        }`}></div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Connecting lines */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#5B5FF7" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#00C2A8" stopOpacity="0.6" />
                        </linearGradient>
                      </defs>
                      <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="url(#lineGradient)" strokeWidth="2" className="animate-pulse" />
                      <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" className="animate-pulse" style={{animationDelay: '0.5s'}} />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#1A1B2E]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Everything You Need to Master Cybersecurity
            </h3>
            <p className="text-xl text-[#A0A0B2] max-w-3xl mx-auto">
              From beginner-friendly tutorials to advanced threat hunting, our platform provides 
              comprehensive tools for every stage of your cybersecurity journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const isInternalLink = feature.link.startsWith('/');
              const CardComponent = isInternalLink ? Link : 'a';
              const linkProps = isInternalLink 
                ? { to: feature.link }
                : { href: feature.link, target: '_blank', rel: 'noopener noreferrer' };
              const Icon = feature.icon;

              return (
                <CardComponent
                  key={index}
                  {...linkProps}
                  className={`group block p-8 rounded-2xl border transition-all duration-300 hover:transform hover:scale-105 ${
                    feature.highlight
                      ? 'bg-gradient-to-br from-[#5B5FF7]/10 to-[#00C2A8]/10 border-[#5B5FF7]/50 hover:border-[#5B5FF7] hover:shadow-2xl hover:shadow-[#5B5FF7]/25'
                      : 'bg-[#1A1B2E]/80 border-gray-700/50 hover:border-gray-600 hover:shadow-xl hover:shadow-black/25'
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-6">
                      <div className={`p-3 rounded-xl ${
                        feature.highlight 
                          ? 'bg-[#5B5FF7]/20 text-[#5B5FF7]' 
                          : 'bg-gray-700/50 text-[#00C2A8]'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {feature.highlight && (
                        <span className="ml-auto px-3 py-1 bg-[#5B5FF7] text-white text-xs font-semibold rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#5B5FF7] transition-colors">
                      {feature.title}
                    </h4>
                    
                    <p className="text-[#A0A0B2] mb-6 flex-grow leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className={`flex items-center font-semibold transition-colors ${
                      feature.highlight 
                        ? 'text-[#5B5FF7] group-hover:text-white' 
                        : 'text-[#00C2A8] group-hover:text-white'
                    }`}>
                      <span>{feature.action}</span>
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </CardComponent>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1B2E]/80 border-t border-gray-800/50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-[#5B5FF7]" />
                <span className="text-2xl font-bold">ThreatSim</span>
              </div>
              <p className="text-[#A0A0B2] leading-relaxed max-w-md">
                Empowering the next generation of cybersecurity professionals through 
                innovative learning experiences and hands-on practice.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="#"
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-[#5B5FF7]/20 hover:text-[#5B5FF7] transition-all"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-[#00C2A8]/20 hover:text-[#00C2A8] transition-all"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-[#5B5FF7]/20 hover:text-[#5B5FF7] transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-[#FF6B6B]/20 hover:text-[#FF6B6B] transition-all"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* About */}
            <div>
              <h5 className="text-white font-semibold mb-4">About</h5>
              <ul className="space-y-3 text-[#A0A0B2]">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Our Mission
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            {/* Docs */}
            <div>
              <h5 className="text-white font-semibold mb-4">Documentation</h5>
              <ul className="space-y-3 text-[#A0A0B2]">
                <li>
                  <a 
                    href="https://cyberdocs.netlify.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Getting Started
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Best Practices
                  </a>
                </li>
              </ul>
            </div>

            {/* Community & Contact */}
            <div>
              <h5 className="text-white font-semibold mb-4">Community</h5>
              <ul className="space-y-3 text-[#A0A0B2]">
                <li>
                  <a 
                    href="https://join.slack.com/t/threatsimworkspace/shared_invite/zt-343rmoydf-wh8qJnLu96ETbkZ9ehEk_Q" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Slack Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800/50 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#A0A0B2] text-sm">
              © 2025 ThreatSim. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-[#A0A0B2]">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Journey;