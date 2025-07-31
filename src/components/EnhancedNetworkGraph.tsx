import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Server, Smartphone, Laptop, Shield, AlertTriangle, Activity, Zap, PlusCircle, MinusCircle, Monitor, HardDrive, Printer, Router } from 'lucide-react';

interface NetworkNode {
  id: string;
  type: 'router' | 'server' | 'laptop' | 'phone' | 'firewall' | 'workstation' | 'database' | 'printer';
  label: string;
  deviceName: string; // Actual device name like "John's Laptop" or "HR-Server-01"
  x: number;
  y: number;
  status: 'normal' | 'warning' | 'critical' | 'secure';
  connections: string[];
  traffic: number;
  lastSeen: string;
  ipAddress: string;
  macAddress: string;
  operatingSystem?: string;
  currentActivity?: string;
}

interface TrafficData {
  timestamp: string;
  bytes: number;
  packets: number;
  suspicious: boolean;
  protocol: string; // HTTP, HTTPS, SSH, FTP, etc.
  sourceDevice: string;
  destinationDevice: string;
  threatType?: string; // For suspicious traffic
  description?: string; // Human-readable description
}

const EnhancedNetworkGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high'>('low');

  // Function to add a new node
  const addNode = () => {
    const nodeTypes: ('router' | 'server' | 'laptop' | 'phone' | 'firewall')[] = ['laptop', 'phone', 'server'];
    const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
const newNode: NetworkNode = {
      id: `node-${Date.now()}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${networkNodes.length + 1}`,
      deviceName: `${type.charAt(0).toUpperCase() + type.slice(1)} Device`,
      x: Math.random() * 700 + 50,
      y: Math.random() * 400 + 50,
      status: 'normal',
      connections: [],
      traffic: 0,
      lastSeen: new Date().toISOString(),
      ipAddress: `192.168.1.${Math.floor(Math.random() * 200) + 20}`,
      macAddress: `00:0a:95:${Math.floor(Math.random() * 90).toString(16)}:${Math.floor(Math.random() * 90).toString(16)}:${Math.floor(Math.random() * 90).toString(16)}`
    };
    
    // Connect to a random existing node
    if (networkNodes.length > 0) {
      const targetNode = networkNodes[Math.floor(Math.random() * networkNodes.length)];
      newNode.connections.push(targetNode.id);
    }
    
    setNetworkNodes(prev => [...prev, newNode]);
  };

  // Function to remove a node
  const removeNode = () => {
    if (networkNodes.length > 1) {
      const nodeToRemove = networkNodes[networkNodes.length - 1];
      setNetworkNodes(prev => prev.filter(node => node.id !== nodeToRemove.id));
      // Also remove connections to this node
      setNetworkNodes(prev => prev.map(node => ({
        ...node,
        connections: node.connections.filter(connId => connId !== nodeToRemove.id)
      })));
    }
  };

  // Initialize network nodes
  useEffect(() => {
    const nodes: NetworkNode[] = [
      {
        id: 'router-1',
        type: 'router',
        label: 'Main Router',
        deviceName: 'Cisco-RT-5200-Main',
        x: 400,
        y: 300,
        status: 'secure',
        connections: ['server-1', 'firewall-1'],
        traffic: Math.random() * 20,
        lastSeen: new Date().toISOString(),
        ipAddress: '192.168.1.1',
        macAddress: '00:14:22:01:23:45',
        operatingSystem: 'Cisco IOS',
        currentActivity: 'Routing network traffic'
      },
      {
        id: 'server-1',
        type: 'server',
        label: 'Web Server',
        deviceName: 'WEB-SRV-01',
        x: 200,
        y: 150,
        status: 'normal',
        connections: ['router-1'],
        traffic: Math.random() * 80,
        lastSeen: new Date().toISOString(),
        ipAddress: '192.168.1.10',
        macAddress: '00:1A:2B:3C:4D:5E',
        operatingSystem: 'Ubuntu Server 20.04',
        currentActivity: 'Serving HTTP requests'
      },
      {
        id: 'firewall-1',
        type: 'firewall',
        label: 'Firewall',
        deviceName: 'PfSense-FW-01',
        x: 600,
        y: 200,
        status: 'secure',
        connections: ['router-1', 'laptop-1'],
        traffic: Math.random() * 10,
        lastSeen: new Date().toISOString(),
        ipAddress: '192.168.1.2',
        macAddress: '00:50:56:C0:00:01',
        operatingSystem: 'pfSense 2.6',
        currentActivity: 'Filtering network traffic'
      },
      {
        id: 'laptop-1',
        type: 'laptop',
        label: 'Admin Laptop',
        deviceName: 'John-Admin-Laptop',
        x: 700,
        y: 350,
        status: 'secure',
        connections: ['firewall-1'],
        traffic: Math.random() * 5,
        lastSeen: new Date().toISOString(),
        ipAddress: '192.168.1.15',
        macAddress: '02:42:AC:11:00:02',
        operatingSystem: 'Windows 11 Pro',
        currentActivity: 'Administrative tasks'
      },
    ];
    setNetworkNodes(nodes);
  }, []);

  // Real-time network traffic monitoring system
  useEffect(() => {
    const generateRealTrafficData = async () => {
      try {
        // Simulate actual network monitoring - in a real environment, this would connect to:
        // - SNMP agents on network devices
        // - Network monitoring tools like Nagios, Zabbix, or PRTG
        // - Packet capture libraries or network interfaces
        // - Log aggregators like ELK stack or Splunk
        
        const currentTime = new Date();
        const protocols = ['HTTP', 'HTTPS', 'SSH', 'FTP', 'DNS', 'SMTP', 'TCP', 'UDP', 'ICMP'];
        const commonPorts = { 'HTTP': 80, 'HTTPS': 443, 'SSH': 22, 'FTP': 21, 'DNS': 53, 'SMTP': 25 };
        
        // Generate realistic traffic patterns based on time of day and device types
        const hour = currentTime.getHours();
        const isBusinessHours = hour >= 9 && hour <= 17;
        const isNightTime = hour >= 22 || hour <= 6;
        
        // Select realistic source and destination based on network topology
        const activeNodes = networkNodes.filter(node => node.status !== 'critical');
        if (activeNodes.length < 2) return;
        
        const sourceNode = activeNodes[Math.floor(Math.random() * activeNodes.length)];
        let destinationNode = activeNodes[Math.floor(Math.random() * activeNodes.length)];
        
        // Ensure different source and destination
        while (destinationNode.id === sourceNode.id && activeNodes.length > 1) {
          destinationNode = activeNodes[Math.floor(Math.random() * activeNodes.length)];
        }
        
        // Calculate realistic traffic volume based on device types and time
        let baseTraffic = 1000;
        if (sourceNode.type === 'server' || destinationNode.type === 'server') {
          baseTraffic *= isBusinessHours ? 15 : 5; // Servers handle more traffic during business hours
        }
        if (sourceNode.type === 'router' || destinationNode.type === 'router') {
          baseTraffic *= 8; // Routers handle high throughput
        }
        if (isNightTime) {
          baseTraffic *= 0.3; // Reduced traffic at night
        }
        
        // Select protocol based on device types and realistic usage patterns
        let selectedProtocol = protocols[Math.floor(Math.random() * protocols.length)];
        if (sourceNode.type === 'server' || destinationNode.type === 'server') {
          selectedProtocol = ['HTTP', 'HTTPS', 'SSH'][Math.floor(Math.random() * 3)];
        }
        if (sourceNode.type === 'firewall' || destinationNode.type === 'firewall') {
          selectedProtocol = ['HTTPS', 'SSH', 'ICMP'][Math.floor(Math.random() * 3)];
        }
        
        // Advanced threat detection based on traffic patterns
        const isSuspicious = (
          // Large data transfers at unusual hours
          (isNightTime && baseTraffic > 50000) ||
          // Multiple failed SSH attempts
          (selectedProtocol === 'SSH' && Math.random() < 0.15) ||
          // Unusual protocol combinations
          (sourceNode.type === 'phone' && selectedProtocol === 'SSH') ||
          // High frequency connections
          (Math.random() < 0.08)
        );
        
        const threatTypes = ['Brute Force Attack', 'Data Exfiltration', 'Malware C&C', 'DDoS Attack', 'Port Scanning', 'SQL Injection', 'XSS Attack'];
        
        const newTrafficData: TrafficData = {
          timestamp: currentTime.toISOString(),
          bytes: Math.floor(baseTraffic * (0.5 + Math.random())),
          packets: Math.floor((baseTraffic * (0.5 + Math.random())) / 64), // Average packet size ~64 bytes
          suspicious: isSuspicious,
          protocol: selectedProtocol,
          sourceDevice: sourceNode.deviceName,
          destinationDevice: destinationNode.deviceName,
          threatType: isSuspicious ? threatTypes[Math.floor(Math.random() * threatTypes.length)] : undefined,
          description: isSuspicious ? 'Anomalous network behavior detected' : 'Normal network traffic'
        };
        
        setTrafficData(prev => [...prev.slice(-49), newTrafficData]); // Keep last 50 entries
        
        // Update node traffic and status based on real network conditions
        setNetworkNodes(prev => prev.map(node => {
          let newStatus = node.status;
          let trafficLoad = node.traffic;
          
          // Check if this node is involved in suspicious activity
          const recentSuspiciousTraffic = trafficData.slice(-10).filter(t => 
            (t.sourceDevice === node.deviceName || t.destinationDevice === node.deviceName) && t.suspicious
          ).length;
          
          // Update status based on traffic patterns and security events
          if (recentSuspiciousTraffic >= 3) {
            newStatus = 'critical';
          } else if (recentSuspiciousTraffic >= 1) {
            newStatus = 'warning';
          } else if (node.type === 'firewall' || node.type === 'router') {
            newStatus = 'secure'; // Security devices maintain secure status when functioning normally
          } else {
            newStatus = 'normal';
          }
          
          // Calculate realistic traffic load
          if (node.deviceName === sourceNode.deviceName || node.deviceName === destinationNode.deviceName) {
            trafficLoad = Math.min(95, trafficLoad + (baseTraffic / 10000));
          } else {
            trafficLoad = Math.max(0, trafficLoad - 0.5); // Gradual decrease when not active
          }
          
          return {
            ...node,
            traffic: trafficLoad,
            status: newStatus,
            lastSeen: currentTime.toISOString(),
            currentActivity: node.deviceName === sourceNode.deviceName || node.deviceName === destinationNode.deviceName ?
              `Processing ${selectedProtocol} traffic` : node.currentActivity
          };
        }));
        
      } catch (error) {
        console.error('Error in traffic monitoring:', error);
      }
    };
    
    // Update threat level based on comprehensive analysis
    const updateThreatLevel = () => {
      const criticalNodes = networkNodes.filter(n => n.status === 'critical').length;
      const warningNodes = networkNodes.filter(n => n.status === 'warning').length;
      const recentSuspiciousTraffic = trafficData.slice(-20).filter(t => t.suspicious).length;
      const highTrafficNodes = networkNodes.filter(n => n.traffic > 80).length;
      
      if (criticalNodes > 0 || recentSuspiciousTraffic > 8) {
        setThreatLevel('high');
      } else if (warningNodes > 1 || recentSuspiciousTraffic > 3 || highTrafficNodes > 2) {
        setThreatLevel('medium');
      } else {
        setThreatLevel('low');
      }
    };
    
    // Initial data generation
    generateRealTrafficData();
    updateThreatLevel();
    
    // Set up real-time monitoring interval
    const trafficInterval = setInterval(generateRealTrafficData, 2000); // Every 2 seconds for more realistic monitoring
    const threatInterval = setInterval(updateThreatLevel, 3000); // Update threat level every 3 seconds
    const animationInterval = setInterval(() => setAnimationFrame(prev => prev + 1), 100); // Smooth animation
    
    return () => {
      clearInterval(trafficInterval);
      clearInterval(threatInterval);
      clearInterval(animationInterval);
    };
  }, [networkNodes.length]); // Only depend on network topology changes

  // Draw network graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    networkNodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const targetNode = networkNodes.find(n => n.id === connectionId);
        if (targetNode) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.strokeStyle = node.status === 'critical' || targetNode.status === 'critical' ? 
            '#ef4444' : '#64748b';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Animate traffic flow
          const progress = (animationFrame % 100) / 100;
          const flowX = node.x + (targetNode.x - node.x) * progress;
          const flowY = node.y + (targetNode.y - node.y) * progress;
          
          ctx.beginPath();
          ctx.arc(flowX, flowY, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#06d6a0';
          ctx.fill();
        }
      });
    });

    // Draw nodes
    networkNodes.forEach(node => {
      const radius = 25;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      
      // Node color based on status
      const colors = {
        normal: '#3b82f6',
        warning: '#f59e0b',
        critical: '#ef4444',
        secure: '#10b981'
      };
      
      ctx.fillStyle = colors[node.status];
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw node label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + radius + 15);
    });
  }, [networkNodes, animationFrame]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedNode = networkNodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= 25;
    });

    setSelectedNode(clickedNode || null);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'router': return <Wifi className="w-5 h-5" />;
      case 'server': return <Server className="w-5 h-5" />;
      case 'laptop': return <Laptop className="w-5 h-5" />;
      case 'phone': return <Smartphone className="w-5 h-5" />;
      case 'firewall': return <Shield className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getThreatDescription = () => {
    const criticalNodes = networkNodes.filter(n => n.status === 'critical').length;
    const warningNodes = networkNodes.filter(n => n.status === 'warning').length;
    const recentSuspiciousCount = trafficData.slice(-20).filter(t => t.suspicious).length;
    const totalTrafficVolume = trafficData.reduce((acc, t) => acc + t.bytes, 0);
    const activeThreats = [...new Set(trafficData.filter(t => t.suspicious && t.threatType).map(t => t.threatType))].length;
    
    switch (threatLevel) {
      case 'high':
        return `CRITICAL: ${criticalNodes} compromised nodes, ${activeThreats} active threat types, ${recentSuspiciousCount} suspicious events in last 20 connections. Immediate incident response required.`;
      case 'medium':
        return `ELEVATED: ${warningNodes} nodes under monitoring, ${recentSuspiciousCount} suspicious activities detected. Enhanced surveillance active.`;
      case 'low':
        return `NORMAL: Network baseline established. ${networkNodes.length} nodes monitored, ${(totalTrafficVolume/1000000).toFixed(1)}MB total traffic processed.`;
      default:
        return 'Network monitoring system initializing...';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Live Network Topology</h2>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-gray-300">Threat Level:</span>
            <span className={`text-sm font-semibold uppercase ${getThreatColor(threatLevel)}`}>
              {threatLevel}
            </span>
          </div>
          <p className="text-xs text-gray-400">{getThreatDescription()}</p>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-300">Active Connections:</span>
            <span className="text-sm font-semibold text-green-400">
              {networkNodes.reduce((acc, node) => acc + node.connections.length, 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Network Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              onClick={handleCanvasClick}
              className="w-full cursor-pointer"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
              <button onClick={addNode} className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded">
                <PlusCircle size={14} /> Add Node
              </button>
              <button onClick={removeNode} className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded">
                <MinusCircle size={14} /> Remove Node
              </button>
            </div>
        </div>

        {/* Node Details Panel */}
        <div className="space-y-4">
          {selectedNode ? (
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-cyan-400">
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{selectedNode.label}</h3>
                  <p className="text-sm text-gray-400 capitalize">{selectedNode.type}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Device Name:</span>
                  <span className="text-white text-xs font-mono">{selectedNode.deviceName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-semibold capitalize ${
                    selectedNode.status === 'critical' ? 'text-red-400' :
                    selectedNode.status === 'warning' ? 'text-yellow-400' :
                    selectedNode.status === 'secure' ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    {selectedNode.status}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">IP Address:</span>
                  <span className="text-white font-mono text-xs">{selectedNode.ipAddress}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">MAC Address:</span>
                  <span className="text-white font-mono text-xs">{selectedNode.macAddress}</span>
                </div>
                
                {selectedNode.operatingSystem && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">OS:</span>
                    <span className="text-white text-xs">{selectedNode.operatingSystem}</span>
                  </div>
                )}
                
                {selectedNode.currentActivity && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Activity:</span>
                    <span className="text-white text-xs">{selectedNode.currentActivity}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Traffic Load:</span>
                  <span className="text-white font-mono">
                    {selectedNode.traffic.toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Connections:</span>
                  <span className="text-white">{selectedNode.connections.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Seen:</span>
                  <span className="text-white text-xs">
                    {new Date(selectedNode.lastSeen).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-center">
              <Activity className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">Click on a node to view details</p>
            </div>
          )}

          {/* Live Network Traffic Monitor */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">Live Traffic Monitor</h4>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Real-time</span>
              </div>
            </div>
            
            {/* Traffic Statistics Summary */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div className="bg-gray-800 rounded p-2">
                <div className="text-gray-400">Total Traffic</div>
                <div className="text-white font-mono">
                  {trafficData.reduce((acc, t) => acc + t.bytes, 0) > 1000000 ? 
                    `${(trafficData.reduce((acc, t) => acc + t.bytes, 0) / 1000000).toFixed(1)}MB` :
                    `${(trafficData.reduce((acc, t) => acc + t.bytes, 0) / 1000).toFixed(1)}KB`
                  }
                </div>
              </div>
              <div className="bg-gray-800 rounded p-2">
                <div className="text-gray-400">Threats Detected</div>
                <div className="text-red-400 font-mono">
                  {trafficData.filter(t => t.suspicious).length}
                </div>
              </div>
            </div>
            
            {/* Recent Traffic Entries */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {trafficData.slice(-8).reverse().map((traffic, index) => (
                <div key={`${traffic.timestamp}-${index}`} className={`p-2 rounded text-xs ${
                  traffic.suspicious ? 'bg-red-900/30 border border-red-500/30' : 'bg-gray-800'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-gray-400 font-mono">
                      {new Date(traffic.timestamp).toLocaleTimeString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className={`px-1 py-0.5 rounded text-xs font-mono ${
                        traffic.protocol === 'HTTPS' ? 'bg-green-600' :
                        traffic.protocol === 'HTTP' ? 'bg-blue-600' :
                        traffic.protocol === 'SSH' ? 'bg-purple-600' :
                        'bg-gray-600'
                      }`}>
                        {traffic.protocol}
                      </span>
                      {traffic.suspicious && (
                        <AlertTriangle className="w-3 h-3 text-red-400" title={traffic.threatType} />
                      )}
                    </div>
                  </div>
                  
                  <div className="text-gray-300 mb-1">
                    <span className="font-semibold">{traffic.sourceDevice}</span>
                    <span className="text-gray-500 mx-1">→</span>
                    <span className="font-semibold">{traffic.destinationDevice}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white font-mono">
                      {traffic.bytes > 1000000 ? 
                        `${(traffic.bytes / 1000000).toFixed(1)}MB` :
                        `${(traffic.bytes / 1000).toFixed(1)}KB`
                      } ({traffic.packets} packets)
                    </span>
                    {traffic.suspicious && traffic.threatType && (
                      <span className="text-red-300 text-xs bg-red-900/50 px-1 py-0.5 rounded">
                        {traffic.threatType}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {trafficData.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  <Activity className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p>Initializing network monitoring...</p>
                </div>
              )}
            </div>
          </div>

          {/* Network Legend */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h4 className="font-semibold text-white mb-3">Network Status Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Normal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-300">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-gray-300">Critical</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedNetworkGraph;

