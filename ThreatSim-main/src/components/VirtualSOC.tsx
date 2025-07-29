import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ClipboardList, Cpu, FileText, Lock, Network, Server, Shield, Terminal } from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  sector: 'network' | 'endpoint' | 'application' | 'data';
  detectedAt: string;
  analyst: string;
}

const initialIncidents: Incident[] = [
  {
    id: 'incident-001',
    title: 'Unauthorized Access Attempt',
    description: 'Multiple failed login attempts detected on the main server.',
    status: 'open',
    priority: 'high',
    sector: 'network',
    detectedAt: new Date().toISOString(),
    analyst: 'John Doe'
  },
  {
    id: 'incident-002',
    title: 'Malware Infection',
    description: 'A workstation is suspected of being infected with malware.',
    status: 'in progress',
    priority: 'medium',
    sector: 'endpoint',
    detectedAt: new Date().toISOString(),
    analyst: 'Jane Smith'
  },
  {
    id: 'incident-003',
    title: 'Data Breach Alert',
    description: 'Unauthorized data access detected on database.',
    status: 'resolved',
    priority: 'high',
    sector: 'data',
    detectedAt: new Date().toISOString(),
    analyst: 'Alex Johnson'
  }
];

const VirtualSOC: React.FC = () => {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [newIncident, setNewIncident] = useState(false);

  useEffect(() => {
    if (newIncident) {
      const interval = setInterval(() => {
        const randomUpdate = Math.random();
        if (randomUpdate < 0.5) { // New incident detected
          const newIncident: Incident = 
            Math.random() < 0.5
              ? {
                  id: `incident-${incidents.length + 1}`,
                  title: 'Unexpected Network Traffic',
                  description: 'Unusual spike in outbound network traffic detected.',
                  status: 'open',
                  priority: 'medium',
                  sector: 'network',
                  detectedAt: new Date().toISOString(),
                  analyst: 'Chris Redfield'
                }
              : {
                  id: `incident-${incidents.length + 1}`,
                  title: 'Suspicious Activity Alert',
                  description: 'Anomalous access pattern detected on user account.',
                  status: 'open',
                  priority: 'low',
                  sector: 'application',
                  detectedAt: new Date().toISOString(),
                  analyst: 'Claire Redfield'
                };

          setIncidents(prev => [...prev, newIncident]);
        }

      }, 10000);

      return () => clearInterval(interval);
    }
  }, [newIncident, incidents.length]);

  const toggleIncidentSelection = (incident: Incident) => setSelectedIncident(selectedIncident?.id === incident.id ? null : incident);

  const incidentCardColor = (status: Incident['status']) => {
    switch (status) {
      case 'open': return 'border-red-600';
      case 'in progress': return 'border-yellow-600';
      case 'resolved': return 'border-green-600';
      default: return 'border-gray-600';
    }
  };

  const priorityColor = (priority: Incident['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getSectorIcon = (sector: Incident['sector']) => {
    switch (sector) {
      case 'network': return <Network className="w-5 h-5" />;
      case 'endpoint': return <Cpu className="w-5 h-5" />;
      case 'application': return <Terminal className="w-5 h-5" />;
      case 'data': return <FileText className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Virtual Security Operations Center</h2>
        </div>
        <button
          onClick={() => setNewIncident(!newIncident)}
          className={`px-6 py-2 rounded-lg font-mono text-sm ${
            newIncident ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          } hover:opacity-80 transition-opacity duration-300 focus:outline-none`}
        >
          {newIncident ? 'Stop Incidents' : 'Start Incidents'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {incidents.map(incident => (
            <div
              key={incident.id}
              onClick={() => toggleIncidentSelection(incident)}
              className={`p-4 rounded-lg border shadow cursor-pointer ${incidentCardColor(incident.status)} hover:shadow-lg transition-all`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getSectorIcon(incident.sector)}
                  <span className="text-lg font-bold text-white">{incident.title}</span>
                </div>
                {selectedIncident?.id === incident.id ? <Lock className="w-5 h-5 text-gray-500" /> : null}
              </div>
              <p className="text-gray-300 text-sm mb-2">Priority: <span className={priorityColor(incident.priority)}>{incident.priority}</span></p>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Server className="w-4 h-4 text-gray-400" />
                  {incident.analyst}
                </span>
                <span className="flex items-center gap-1">
                  <ClipboardList className="w-4 h-4 text-gray-400" />
                  {new Date(incident.detectedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedIncident ? (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="font-semibold text-white mb-3">Incident Details</h4>
              <p className="text-gray-300 text-sm">{selectedIncident.description}</p>
              <div className="text-sm mt-3">
                <div className="flex justify-between text-gray-400">
                  <span>Status:</span>
                  <span className={
                    selectedIncident.status === 'open'
                      ? 'text-red-400'
                      : selectedIncident.status === 'in progress'
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }>
                    {selectedIncident.status}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Sector:</span>
                  <span className="capitalize text-white">{selectedIncident.sector.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Detected At:</span>
                  <span className="text-white">{new Date(selectedIncident.detectedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 text-center">
            <ClipboardList className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">Select an incident to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualSOC;

