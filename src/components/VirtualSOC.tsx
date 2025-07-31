import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ClipboardList, Cpu, FileText, Lock, Network, Server, Shield, Terminal, PlusCircle } from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  sector: 'network' | 'endpoint' | 'application' | 'data';
  ip_address: string;
  timestamp: string;
  analyst: string;
  eventId?: number;
  source?: string;
}

const fetchWindowsEvents = async (): Promise<Incident[]> => {
  // Simulate API call to fetch Windows Event Logs
  // This would need actual implementation to query logs
  return [
    // Example event log data
    {
      id: 'EVT-001',
      title: 'Failed Login Attempt',
      description: 'There was a failed login attempt from IP 192.168.1.50',
      status: 'open',
      priority: 'high',
      sector: 'network',
      ip_address: '192.168.1.50',
      timestamp: new Date().toISOString(),
      analyst: 'System',
      eventId: 4625,
      source: 'Windows Security'
    }
  ];
};

const VirtualSOC: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Load incidents from Windows Event Logs on component mount
  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const fetchedIncidents = await fetchWindowsEvents();
        setIncidents(fetchedIncidents);
      } catch (error) {
        console.error('Failed to fetch incidents:', error);
        // Fallback to empty array if fetching fails
        setIncidents([]);
      }
    };
    
    loadIncidents();
  }, []);

  const createNewIncident = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newIncident: Incident = {
      id: `INC-${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: 'open',
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      sector: formData.get('sector') as 'network' | 'endpoint' | 'application' | 'data',
      ip_address: formData.get('ip_address') as string,
      timestamp: new Date().toISOString(),
      analyst: 'Manual Entry'
    };
    setIncidents(prev => [newIncident, ...prev]);
    setShowCreateForm(false);
  };

  const updateIncidentStatus = (id: string, status: 'open' | 'in progress' | 'resolved') => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
  };

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
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors text-white font-medium">
          <PlusCircle size={16} />
          {showCreateForm ? 'Cancel' : 'Create Incident'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={createNewIncident} className="bg-gray-900/50 p-4 rounded-lg mb-6 space-y-4">
          <h3 className="text-lg font-semibold">Create New Incident</h3>
          <input name="title" placeholder="Title" className="w-full p-2 bg-gray-800 rounded" required />
          <textarea name="description" placeholder="Description" className="w-full p-2 bg-gray-800 rounded" required />
          <input name="ip_address" placeholder="IP Address" className="w-full p-2 bg-gray-800 rounded" required />
          <select name="priority" className="w-full p-2 bg-gray-800 rounded">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select name="sector" className="w-full p-2 bg-gray-800 rounded">
            <option value="network">Network</option>
            <option value="endpoint">Endpoint</option>
            <option value="application">Application</option>
            <option value="data">Data</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">Submit</button>
        </form>
      )}

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
                  {new Date(incident.timestamp).toLocaleTimeString()}
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
                  <select value={selectedIncident.status} onChange={(e) => updateIncidentStatus(selectedIncident.id, e.target.value as any)} className="bg-gray-800 rounded">
                    <option value="open">Open</option>
                    <option value="in progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Sector:</span>
                  <span className="capitalize text-white">{selectedIncident.sector.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>IP Address:</span>
                  <span className="text-white">{selectedIncident.ip_address}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Detected At:</span>
                  <span className="text-white">{new Date(selectedIncident.timestamp).toLocaleString()}</span>
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

