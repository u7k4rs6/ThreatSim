import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Activity, 
  TrendingUp, 
  Eye, 
  PlayCircle,
  FileText,
  Server,
  Wifi,
  Database,
  Lock,
  Unlock,
  XCircle,
  ArrowRight,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  timestamp: string;
  source: string;
  description: string;
  affectedAssets: string[];
  assignedTo?: string;
}

interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  estimatedTime: string;
}

interface Playbook {
  id: string;
  name: string;
  category: string;
  description: string;
  steps: PlaybookStep[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

const VirtualSOC: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'alerts' | 'playbooks' | 'metrics'>('dashboard');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [expandedPlaybook, setExpandedPlaybook] = useState<string | null>(null);

  // Mock data for alerts
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'Suspicious Login Attempt from Unknown Location',
      severity: 'high',
      status: 'open',
      timestamp: '2025-01-11 14:32:15',
      source: 'Authentication System',
      description: 'Multiple failed login attempts detected from IP 203.45.67.89 (Russia) targeting admin accounts.',
      affectedAssets: ['AD Controller', 'VPN Gateway'],
      assignedTo: 'Sarah Chen'
    },
    {
      id: '2',
      title: 'Malware Detection on Endpoint',
      severity: 'critical',
      status: 'investigating',
      timestamp: '2025-01-11 14:28:42',
      source: 'EDR System',
      description: 'Trojan.GenKrypt detected on LAPTOP-USER01. Quarantine action initiated.',
      affectedAssets: ['LAPTOP-USER01'],
      assignedTo: 'Mike Rodriguez'
    },
    {
      id: '3',
      title: 'Unusual Network Traffic Pattern',
      severity: 'medium',
      status: 'open',
      timestamp: '2025-01-11 14:15:33',
      source: 'Network Monitor',
      description: 'Abnormal data exfiltration pattern detected from internal server to external IP.',
      affectedAssets: ['DB-SERVER-01', 'Firewall'],
    },
    {
      id: '4',
      title: 'Privilege Escalation Attempt',
      severity: 'high',
      status: 'resolved',
      timestamp: '2025-01-11 13:45:18',
      source: 'SIEM',
      description: 'User account attempted to access admin privileges without authorization.',
      affectedAssets: ['Domain Controller'],
      assignedTo: 'Alex Johnson'
    }
  ]);

  // Mock playbooks
  const playbooks: Playbook[] = [
    {
      id: '1',
      name: 'Malware Incident Response',
      category: 'Endpoint Security',
      description: 'Standard response procedure for malware detection on endpoints',
      priority: 'critical',
      steps: [
        { id: '1', title: 'Isolate Affected System', description: 'Immediately disconnect the infected system from the network', completed: false, required: true, estimatedTime: '5 min' },
        { id: '2', title: 'Preserve Evidence', description: 'Create forensic image of the affected system', completed: false, required: true, estimatedTime: '30 min' },
        { id: '3', title: 'Analyze Malware', description: 'Conduct malware analysis to understand impact and behavior', completed: false, required: true, estimatedTime: '60 min' },
        { id: '4', title: 'Check for Lateral Movement', description: 'Scan network for signs of lateral movement', completed: false, required: true, estimatedTime: '45 min' },
        { id: '5', title: 'Clean and Restore', description: 'Remove malware and restore system from clean backup', completed: false, required: false, estimatedTime: '90 min' },
        { id: '6', title: 'Post-Incident Review', description: 'Document lessons learned and update security controls', completed: false, required: false, estimatedTime: '30 min' }
      ]
    },
    {
      id: '2',
      name: 'Suspicious Login Investigation',
      category: 'Identity & Access',
      description: 'Investigation procedure for suspicious authentication activities',
      priority: 'high',
      steps: [
        { id: '1', title: 'Verify User Activity', description: 'Contact user to verify legitimate login attempts', completed: false, required: true, estimatedTime: '10 min' },
        { id: '2', title: 'Analyze Login Logs', description: 'Review authentication logs for anomalies', completed: false, required: true, estimatedTime: '20 min' },
        { id: '3', title: 'Check Account Status', description: 'Verify account has not been compromised', completed: false, required: true, estimatedTime: '15 min' },
        { id: '4', title: 'Implement Containment', description: 'Reset passwords and revoke active sessions if needed', completed: false, required: false, estimatedTime: '10 min' }
      ]
    },
    {
      id: '3',
      name: 'Data Exfiltration Response',
      category: 'Data Protection',
      description: 'Response procedure for potential data exfiltration incidents',
      priority: 'critical',
      steps: [
        { id: '1', title: 'Block Suspicious Traffic', description: 'Immediately block identified exfiltration channels', completed: false, required: true, estimatedTime: '5 min' },
        { id: '2', title: 'Identify Data at Risk', description: 'Determine what data may have been compromised', completed: false, required: true, estimatedTime: '30 min' },
        { id: '3', title: 'Notify Stakeholders', description: 'Alert management and legal teams', completed: false, required: true, estimatedTime: '15 min' },
        { id: '4', title: 'Forensic Analysis', description: 'Conduct detailed forensic investigation', completed: false, required: true, estimatedTime: '120 min' }
      ]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-600/30';
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-600/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-600/30';
      case 'low': return 'text-blue-400 bg-blue-900/20 border-blue-600/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-600/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-400 bg-red-900/20';
      case 'investigating': return 'text-yellow-400 bg-yellow-900/20';
      case 'resolved': return 'text-green-400 bg-green-900/20';
      case 'false_positive': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const handleAlertStatusChange = (alertId: string, newStatus: Alert['status']) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: newStatus } : alert
    ));
  };

  const togglePlaybookStep = (playbookId: string, stepId: string) => {
    if (selectedPlaybook && selectedPlaybook.id === playbookId) {
      const updatedPlaybook = {
        ...selectedPlaybook,
        steps: selectedPlaybook.steps.map(step =>
          step.id === stepId ? { ...step, completed: !step.completed } : step
        )
      };
      setSelectedPlaybook(updatedPlaybook);
    }
  };

  return (
    <div className="space-y-6">
      {/* SOC Header */}
      <div className="bg-gradient-to-r from-slate-800/50 to-gray-800/50 border border-gray-700/50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10 text-cyan-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Security Operations Center</h2>
              <p className="text-gray-400">Real-time security monitoring and incident response</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">Operational</div>
              <div className="text-sm text-gray-400">SOC Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">24/7</div>
              <div className="text-sm text-gray-400">Coverage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'alerts', label: 'Alert Triage', icon: AlertTriangle },
            { id: 'playbooks', label: 'Playbooks', icon: FileText },
            { id: 'metrics', label: 'Metrics', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-700/50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-red-400">{alerts.filter(a => a.status === 'open').length}</div>
                  <div className="text-sm text-gray-400">Open Alerts</div>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-700/50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-yellow-400">{alerts.filter(a => a.status === 'investigating').length}</div>
                  <div className="text-sm text-gray-400">Under Investigation</div>
                </div>
                <Eye className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-400">{alerts.filter(a => a.status === 'resolved').length}</div>
                  <div className="text-sm text-gray-400">Resolved Today</div>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-400">4.2m</div>
                  <div className="text-sm text-gray-400">Events/Hour</div>
                </div>
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Recent Alerts Summary */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Critical Alerts</h3>
            <div className="space-y-3">
              {alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high').slice(0, 3).map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded border border-gray-600/30">
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-white">{alert.title}</div>
                      <div className="text-sm text-gray-400">{alert.timestamp}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${getStatusColor(alert.status)}`}>
                    {alert.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Security Alerts</h3>
              <div className="flex gap-2">
                <select className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white">
                  <option>All Severities</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <select className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white">
                  <option>All Statuses</option>
                  <option>Open</option>
                  <option>Investigating</option>
                  <option>Resolved</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              {alerts.map(alert => (
                <div 
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg cursor-pointer transition-colors hover:bg-gray-700/30 ${
                    selectedAlert?.id === alert.id ? 'ring-2 ring-cyan-400/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${getStatusColor(alert.status)}`}>
                          {alert.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                      <h4 className="font-medium text-white mb-1">{alert.title}</h4>
                      <p className="text-sm text-gray-400 mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{alert.timestamp}</span>
                        <span>{alert.source}</span>
                        {alert.assignedTo && <span>Assigned: {alert.assignedTo}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Details Panel */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
            {selectedAlert ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(selectedAlert.severity)}`}>
                    {selectedAlert.severity.toUpperCase()}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedAlert.status)}`}>
                    {selectedAlert.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white">{selectedAlert.title}</h3>
                <p className="text-gray-400">{selectedAlert.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Timestamp</h4>
                    <p className="text-sm text-gray-400">{selectedAlert.timestamp}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Source</h4>
                    <p className="text-sm text-gray-400">{selectedAlert.source}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Affected Assets</h4>
                    <div className="space-y-1">
                      {selectedAlert.affectedAssets.map(asset => (
                        <div key={asset} className="text-sm text-gray-400 flex items-center gap-2">
                          <Server className="w-4 h-4" />
                          {asset}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {selectedAlert.assignedTo && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Assigned To</h4>
                      <p className="text-sm text-gray-400">{selectedAlert.assignedTo}</p>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Actions</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleAlertStatusChange(selectedAlert.id, 'investigating')}
                      className="w-full px-3 py-2 bg-yellow-600/20 border border-yellow-600/30 text-yellow-400 rounded text-sm hover:bg-yellow-600/30 transition-colors"
                    >
                      Start Investigation
                    </button>
                    <button 
                      onClick={() => handleAlertStatusChange(selectedAlert.id, 'resolved')}
                      className="w-full px-3 py-2 bg-green-600/20 border border-green-600/30 text-green-400 rounded text-sm hover:bg-green-600/30 transition-colors"
                    >
                      Mark Resolved
                    </button>
                    <button 
                      onClick={() => handleAlertStatusChange(selectedAlert.id, 'false_positive')}
                      className="w-full px-3 py-2 bg-gray-600/20 border border-gray-600/30 text-gray-400 rounded text-sm hover:bg-gray-600/30 transition-colors"
                    >
                      Mark False Positive
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select an alert to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Playbooks Tab */}
      {activeTab === 'playbooks' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Playbooks List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Incident Response Playbooks</h3>
            
            <div className="space-y-3">
              {playbooks.map(playbook => (
                <div key={playbook.id} className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-white">{playbook.name}</h4>
                        <div className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(playbook.priority)}`}>
                          {playbook.priority.toUpperCase()}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{playbook.description}</p>
                      <div className="text-xs text-gray-500">Category: {playbook.category}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      {playbook.steps.length} steps • {playbook.steps.filter(s => s.required).length} required
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setExpandedPlaybook(expandedPlaybook === playbook.id ? null : playbook.id)}
                        className="px-3 py-1 bg-blue-600/20 border border-blue-600/30 text-blue-400 rounded text-sm hover:bg-blue-600/30 transition-colors flex items-center gap-1"
                      >
                        {expandedPlaybook === playbook.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        Preview
                      </button>
                      <button
                        onClick={() => setSelectedPlaybook(playbook)}
                        className="px-3 py-1 bg-cyan-600/20 border border-cyan-600/30 text-cyan-400 rounded text-sm hover:bg-cyan-600/30 transition-colors flex items-center gap-1"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Execute
                      </button>
                    </div>
                  </div>
                  
                  {expandedPlaybook === playbook.id && (
                    <div className="mt-4 pt-4 border-t border-gray-600/50">
                      <div className="space-y-2">
                        {playbook.steps.map(step => (
                          <div key={step.id} className="flex items-center gap-3 p-2 bg-gray-700/30 rounded">
                            <div className={`w-2 h-2 rounded-full ${step.required ? 'bg-red-400' : 'bg-gray-500'}`}></div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-white">{step.title}</div>
                              <div className="text-xs text-gray-400">{step.estimatedTime}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Playbook Execution Panel */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
            {selectedPlaybook ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">{selectedPlaybook.name}</h3>
                  <div className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(selectedPlaybook.priority)}`}>
                    {selectedPlaybook.priority.toUpperCase()}
                  </div>
                </div>
                
                <p className="text-gray-400">{selectedPlaybook.description}</p>
                
                <div className="bg-gray-700/30 rounded p-3">
                  <div className="text-sm text-gray-300 mb-2">Progress</div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-cyan-400 h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${(selectedPlaybook.steps.filter(s => s.completed).length / selectedPlaybook.steps.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {selectedPlaybook.steps.filter(s => s.completed).length} of {selectedPlaybook.steps.length} steps completed
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-300">Steps</h4>
                  {selectedPlaybook.steps.map(step => (
                    <div key={step.id} className={`p-3 rounded border transition-colors ${
                      step.completed 
                        ? 'bg-green-900/20 border-green-600/30' 
                        : 'bg-gray-700/30 border-gray-600/30'
                    }`}>
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => togglePlaybookStep(selectedPlaybook.id, step.id)}
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            step.completed
                              ? 'bg-green-600 border-green-600 text-white'
                              : 'border-gray-500 hover:border-gray-400'
                          }`}
                        >
                          {step.completed && <CheckCircle className="w-3 h-3" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className={`font-medium ${step.completed ? 'text-green-400' : 'text-white'}`}>
                              {step.title}
                            </h5>
                            {step.required && (
                              <div className="px-1 py-0.5 bg-red-900/30 border border-red-600/30 text-red-400 text-xs rounded">
                                Required
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              ~{step.estimatedTime}
                            </div>
                          </div>
                          <p className="text-sm text-gray-400">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-gray-600/50">
                  <button className="w-full px-4 py-2 bg-cyan-600/20 border border-cyan-600/30 text-cyan-400 rounded hover:bg-cyan-600/30 transition-colors">
                    Generate Incident Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a playbook to begin execution</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          {/* SOC Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Mean Time to Detection</h3>
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">8.5 min</div>
              <div className="text-sm text-green-400">↓ 15% from last week</div>
            </div>
            
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Mean Time to Response</h3>
                <Activity className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">22 min</div>
              <div className="text-sm text-green-400">↓ 8% from last week</div>
            </div>
            
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">False Positive Rate</h3>
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">2.8%</div>
              <div className="text-sm text-green-400">↓ 12% from last week</div>
            </div>
          </div>

          {/* Team Performance */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Analyst Performance</h3>
            <div className="space-y-4">
              {[
                { name: 'Sarah Chen', resolved: 23, investigating: 3, avgTime: '18 min' },
                { name: 'Mike Rodriguez', resolved: 19, investigating: 2, avgTime: '22 min' },
                { name: 'Alex Johnson', resolved: 21, investigating: 1, avgTime: '20 min' },
                { name: 'Jessica Park', resolved: 17, investigating: 4, avgTime: '25 min' }
              ].map(analyst => (
                <div key={analyst.name} className="flex items-center justify-between p-3 bg-gray-700/30 rounded">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-white">{analyst.name}</div>
                      <div className="text-sm text-gray-400">Avg Response: {analyst.avgTime}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-green-400">{analyst.resolved} resolved</div>
                    <div className="text-yellow-400">{analyst.investigating} active</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualSOC;
