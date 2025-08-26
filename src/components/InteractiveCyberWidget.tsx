import React, { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Activity, Lock, Eye, Cpu } from 'lucide-react';

interface Node {
  id: number;
  x: number;
  y: number;
  type: 'firewall' | 'server' | 'endpoint' | 'scanner' | 'core' | 'monitor';
  status: 'secure' | 'scanning' | 'alert' | 'active';
  connections: number[];
  pulseDelay: number;
}

const InteractiveCyberWidget: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [activeConnections, setActiveConnections] = useState<Set<string>>(new Set());
  const [scanningMode, setScanningMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Initialize nodes in a 3x3 grid
  useEffect(() => {
    const nodeTypes: Node['type'][] = ['firewall', 'server', 'endpoint', 'scanner', 'core', 'monitor'];
    const initialNodes: Node[] = [];
    
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const id = row * 3 + col;
        const isCenter = row === 1 && col === 1;
        
        initialNodes.push({
          id,
          x: col * 120 + 60,
          y: row * 120 + 60,
          type: isCenter ? 'core' : nodeTypes[id % nodeTypes.length],
          status: isCenter ? 'active' : 'secure',
          connections: isCenter ? [0, 1, 2, 3, 5, 6, 7, 8] : [4], // Center connects to all, others to center
          pulseDelay: id * 200
        });
      }
    }
    
    setNodes(initialNodes);
  }, []);

  // Animation loop for connections
  useEffect(() => {
    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections with animated data flow
      nodes.forEach(node => {
        node.connections.forEach(targetId => {
          const target = nodes.find(n => n.id === targetId);
          if (!target) return;
          
          const connectionKey = `${Math.min(node.id, targetId)}-${Math.max(node.id, targetId)}`;
          const isActive = activeConnections.has(connectionKey) || hoveredNode === node.id || hoveredNode === targetId;
          
          // Draw connection line
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = isActive ? '#00C2A8' : '#374151';
          ctx.lineWidth = isActive ? 2 : 1;
          ctx.stroke();
          
          // Animated data packets
          if (isActive) {
            const time = Date.now() / 1000;
            const progress = (time + node.pulseDelay / 1000) % 2 / 2;
            const packetX = node.x + (target.x - node.x) * progress;
            const packetY = node.y + (target.y - node.y) * progress;
            
            ctx.beginPath();
            ctx.arc(packetX, packetY, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#00C2A8';
            ctx.fill();
          }
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, activeConnections, hoveredNode]);

  // Simulate network activity
  useEffect(() => {
    const interval = setInterval(() => {
      if (scanningMode) {
        // Random connection activation during scan
        const randomNode1 = Math.floor(Math.random() * 9);
        const randomNode2 = Math.floor(Math.random() * 9);
        if (randomNode1 !== randomNode2) {
          const connectionKey = `${Math.min(randomNode1, randomNode2)}-${Math.max(randomNode1, randomNode2)}`;
          setActiveConnections(prev => {
            const newSet = new Set(prev);
            newSet.add(connectionKey);
            setTimeout(() => {
              setActiveConnections(current => {
                const updated = new Set(current);
                updated.delete(connectionKey);
                return updated;
              });
            }, 1000);
            return newSet;
          });
        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, [scanningMode]);

  const getNodeIcon = (type: Node['type']) => {
    switch (type) {
      case 'firewall': return Shield;
      case 'server': return Cpu;
      case 'endpoint': return Activity;
      case 'scanner': return Eye;
      case 'core': return Zap;
      case 'monitor': return Lock;
      default: return Activity;
    }
  };

  const getNodeColor = (node: Node) => {
    if (hoveredNode === node.id) return 'border-[#00C2A8] bg-[#00C2A8]/20 shadow-lg shadow-[#00C2A8]/30';
    
    switch (node.status) {
      case 'secure': return 'border-green-500/50 bg-green-500/10';
      case 'scanning': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'alert': return 'border-red-500/50 bg-red-500/10';
      case 'active': return 'border-[#5B5FF7]/50 bg-[#5B5FF7]/20';
      default: return 'border-gray-600/50 bg-gray-600/10';
    }
  };

  const handleNodeClick = (nodeId: number) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    // Activate all connections for this node
    node.connections.forEach(targetId => {
      const connectionKey = `${Math.min(nodeId, targetId)}-${Math.max(nodeId, targetId)}`;
      setActiveConnections(prev => {
        const newSet = new Set(prev);
        newSet.add(connectionKey);
        return newSet;
      });
    });
    
    // Update node status
    setNodes(prev => prev.map(n => 
      n.id === nodeId 
        ? { ...n, status: n.status === 'active' ? 'secure' : 'active' }
        : n
    ));
    
    // Clear connections after animation
    setTimeout(() => {
      setActiveConnections(new Set());
    }, 2000);
  };

  const toggleScanMode = () => {
    setScanningMode(!scanningMode);
    if (!scanningMode) {
      // Start scan animation
      setNodes(prev => prev.map(n => ({ ...n, status: 'scanning' })));
    } else {
      // End scan
      setNodes(prev => prev.map(n => ({ 
        ...n, 
        status: n.type === 'core' ? 'active' : 'secure' 
      })));
      setActiveConnections(new Set());
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5B5FF7]/20 via-[#00C2A8]/20 to-[#FF6B6B]/20 rounded-3xl blur-3xl animate-pulse"></div>
      
      {/* Main Widget Container */}
      <div className="relative bg-gradient-to-br from-[#1A1B2E] to-[#0E0E1A] border border-gray-700/50 rounded-3xl p-8 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00C2A8] rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400 font-medium">Network Status</span>
          </div>
          <button
            onClick={toggleScanMode}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              scanningMode 
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                : 'bg-[#5B5FF7]/20 text-[#5B5FF7] border border-[#5B5FF7]/30 hover:bg-[#5B5FF7]/30'
            }`}
          >
            {scanningMode ? 'Scanning...' : 'Start Scan'}
          </button>
        </div>
        
        {/* Network Grid */}
        <div className="relative">
          {/* Canvas for connections */}
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="absolute inset-0 pointer-events-none"
          />
          
          {/* Nodes Grid */}
          <div className="grid grid-cols-3 gap-4 relative z-10">
            {nodes.map((node) => {
              const Icon = getNodeIcon(node.type);
              return (
                <div
                  key={node.id}
                  className={`
                    relative w-16 h-16 rounded-full border-2 flex items-center justify-center
                    cursor-pointer transition-all duration-300 transform hover:scale-110
                    ${getNodeColor(node)}
                    ${scanningMode ? 'animate-pulse' : ''}
                  `}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleNodeClick(node.id)}
                  style={{
                    animationDelay: `${node.pulseDelay}ms`
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                  
                  {/* Status indicator */}
                  <div className={`
                    absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#1A1B2E]
                    ${node.status === 'secure' ? 'bg-green-500' : 
                      node.status === 'scanning' ? 'bg-yellow-500 animate-ping' :
                      node.status === 'alert' ? 'bg-red-500 animate-pulse' :
                      'bg-[#5B5FF7] animate-pulse'}
                  `} />
                  
                  {/* Hover tooltip */}
                  {hoveredNode === node.id && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded border border-gray-600 whitespace-nowrap z-20">
                      {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Stats Footer */}
        <div className="mt-6 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#5B5FF7] rounded-full animate-pulse"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Scanning</span>
            </div>
          </div>
          <div className="text-[#00C2A8]">
            {activeConnections.size} active connections
          </div>
        </div>
        
        {/* Interactive hint */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Click nodes to activate • Hover to inspect
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCyberWidget;