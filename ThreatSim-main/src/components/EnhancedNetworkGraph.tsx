import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Server, Smartphone, Laptop, Shield, AlertTriangle, Activity, Zap } from 'lucide-react';

interface NetworkNode {
  id: string;
  type: 'router' | 'server' | 'laptop' | 'phone' | 'firewall';
  label: string;
  x: number;
  y: number;
  status: 'normal' | 'warning' | 'critical' | 'secure';
  connections: string[];
  traffic: number;
  lastSeen: string;
}

interface TrafficData {
  timestamp: string;
  bytes: number;
  packets: number;
  suspicious: boolean;
}

const EnhancedNetworkGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high'>('medium');

  // Initialize network nodes
  useEffect(() => {
    const nodes: NetworkNode[] = [
      {
        id: 'router-1',
        type: 'router',
        label: 'Main Router',
        x: 400,
        y: 300,
        status: 'normal',
        connections: ['server-1', 'laptop-1', 'laptop-2', 'firewall-1'],
        traffic: Math.random() * 100,
        lastSeen: new Date().toISOString()
      },
      {
        id: 'server-1',
        type: 'server',
        label: 'Web Server',
        x: 200,
        y: 150,
        status: 'critical',
        connections: ['router-1'],
        traffic: Math.random() * 100,
        lastSeen: new Date().toISOString()
      },
      {
        id: 'firewall-1',
        type: 'firewall',
        label: 'Firewall',
        x: 600,
        y: 200,
        status: 'secure',
        connections: ['router-1', 'laptop-3'],
        traffic: Math.random() * 100,
        lastSeen: new Date().toISOString()
      },
      {
        id: 'laptop-1',
        type: 'laptop',
        label: 'Admin Laptop',
        x: 300,
        y: 450,
        status: 'warning',
        connections: ['router-1'],
        traffic: Math.random() * 100,
        lastSeen: new Date().toISOString()
      },
      {
        id: 'laptop-2',
        type: 'laptop',
        label: 'User Laptop',
        x: 500,
        y: 450,
        status: 'normal',
        connections: ['router-1'],
        traffic: Math.random() * 100,
        lastSeen: new Date().toISOString()
      },
      {
        id: 'laptop-3',
        type: 'laptop',
        label: 'Secured Laptop',
        x: 700,
        y: 350,
        status: 'secure',
        connections: ['firewall-1'],
        traffic: Math.random() * 100,
        lastSeen: new Date().toISOString()
      },
      {
        id: 'phone-1',
        type: 'phone',
        label: 'Mobile Device',
        x: 150,
        y: 350,
        status: 'normal',
        connections: ['router-1'],
        traffic: Math.random() * 100,
        lastSeen: new Date().toISOString()
      }
    ];
    setNetworkNodes(nodes);
  }, []);

  // Simulate real-time traffic data
  useEffect(() => {
    const interval = setInterval(() => {
      const newTrafficData: TrafficData = {
        timestamp: new Date().toISOString(),
        bytes: Math.floor(Math.random() * 1000000),
        packets: Math.floor(Math.random() * 10000),
        suspicious: Math.random() > 0.8
      };
      
      setTrafficData(prev => [...prev.slice(-19), newTrafficData]);
      
      // Update node traffic and status
      setNetworkNodes(prev => prev.map(node => ({
        ...node,
        traffic: Math.random() * 100,
        status: Math.random() > 0.85 ? 'critical' : 
                Math.random() > 0.7 ? 'warning' : 
                Math.random() > 0.3 ? 'normal' : 'secure'
      })));
      
      // Update threat level
      const suspiciousCount = trafficData.filter(t => t.suspicious).length;
      setThreatLevel(suspiciousCount > 3 ? 'high' : suspiciousCount > 1 ? 'medium' : 'low');
      
      setAnimationFrame(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [trafficData]);

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
          const progress = (animationFrame % 50) / 50;
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
        normal: '#64748b',
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

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Live Network Topology</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-gray-300">Threat Level:</span>
            <span className={`text-sm font-semibold uppercase ${getThreatColor(threatLevel)}`}>
              {threatLevel}
            </span>
          </div>
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
                  <span className="text-gray-400">Traffic:</span>
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

          {/* Real-time Traffic Stats */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h4 className="font-semibold text-white mb-3">Live Traffic</h4>
            <div className="space-y-2">
              {trafficData.slice(-5).map((traffic, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    {new Date(traffic.timestamp).toLocaleTimeString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono">
                      {(traffic.bytes / 1000).toFixed(1)}KB
                    </span>
                    {traffic.suspicious && (
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Legend */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h4 className="font-semibold text-white mb-3">Legend</h4>
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

