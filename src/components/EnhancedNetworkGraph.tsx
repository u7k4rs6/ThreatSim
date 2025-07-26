import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
  Area,
  ComposedChart
} from 'recharts';
import { Activity, AlertTriangle, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';

interface NetworkDataPoint {
  timestamp: string;
  time: number;
  normalTraffic: number;
  suspiciousTraffic: number;
  bandwidth: number;
  connections: number;
  isAnomaly: boolean;
  alertLevel: 'normal' | 'warning' | 'critical';
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const EnhancedNetworkGraph: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'live' | '24h' | '7d'>('24h');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showAnomalies, setShowAnomalies] = useState<boolean>(true);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['normalTraffic', 'suspiciousTraffic', 'bandwidth']);
  const [isRealTime, setIsRealTime] = useState<boolean>(false);
  const [data, setData] = useState<NetworkDataPoint[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate realistic network data
  const generateNetworkData = (hours: number = 24): NetworkDataPoint[] => {
    const dataPoints: NetworkDataPoint[] = [];
    const now = new Date();
    
    for (let i = hours; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = time.getHours();
      
      // Base traffic patterns (higher during business hours)
      const baseTraffic = hour >= 8 && hour <= 18 ? 60 + Math.random() * 40 : 20 + Math.random() * 20;
      const normalTraffic = baseTraffic + Math.sin(hour * 0.2) * 10;
      
      // Occasional suspicious spikes
      const suspiciousTraffic = Math.random() > 0.85 ? Math.random() * 50 + 10 : Math.random() * 5;
      
      const bandwidth = normalTraffic * 1.2 + Math.random() * 10;
      const connections = Math.floor(normalTraffic * 0.8 + Math.random() * 20);
      
      // Detect anomalies
      const isAnomaly = suspiciousTraffic > 30 || normalTraffic > 80;
      const alertLevel: 'normal' | 'warning' | 'critical' = 
        suspiciousTraffic > 40 ? 'critical' : 
        suspiciousTraffic > 20 ? 'warning' : 'normal';

      dataPoints.push({
        timestamp: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        time: time.getTime(),
        normalTraffic: Math.round(normalTraffic),
        suspiciousTraffic: Math.round(suspiciousTraffic),
        bandwidth: Math.round(bandwidth),
        connections,
        isAnomaly,
        alertLevel
      });
    }
    
    return dataPoints;
  };

  // Initialize data
  useEffect(() => {
    const hours = timeRange === 'live' ? 1 : timeRange === '24h' ? 24 : 168;
    setData(generateNetworkData(hours));
  }, [timeRange]);

  // Real-time data simulation
  useEffect(() => {
    if (isRealTime && timeRange === 'live') {
      intervalRef.current = setInterval(() => {
        setData(prevData => {
          const newPoint = generateNetworkData(1)[0];
          const updatedData = [...prevData.slice(1), newPoint];
          return updatedData;
        });
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRealTime, timeRange]);

  // Custom tooltip
  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload as NetworkDataPoint;
      return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 shadow-xl">
          <h4 className="text-white font-medium mb-2">{label}</h4>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-gray-300" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="text-white font-medium">
                {entry.value} {entry.dataKey === 'bandwidth' ? 'Mbps' : entry.dataKey === 'connections' ? '' : 'packets/s'}
              </span>
            </div>
          ))}
          {data?.isAnomaly && (
            <div className="mt-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-red-400 text-sm">Anomaly Detected</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Export data functionality
  const exportData = () => {
    const csvContent = [
      ['Timestamp', 'Normal Traffic', 'Suspicious Traffic', 'Bandwidth', 'Connections', 'Alert Level'],
      ...data.map(d => [
        d.timestamp,
        d.normalTraffic.toString(),
        d.suspiciousTraffic.toString(),
        d.bandwidth.toString(),
        d.connections.toString(),
        d.alertLevel
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `network-activity-${timeRange}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetZoom = () => setZoomLevel(1);
  
  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const anomalies = data.filter(d => d.isAnomaly);

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Activity className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-semibold text-white">Network Activity</h3>
          {anomalies.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/30 border border-red-600/30">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">{anomalies.length} anomalies detected</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRealTime(!isRealTime)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isRealTime 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {isRealTime ? 'Live' : 'Static'}
          </button>
          
          <button
            onClick={exportData}
            className="p-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            title="Export Data"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex bg-gray-800 rounded-lg p-1">
          {(['live', '24h', '7d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {range === 'live' ? 'Live' : range}
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev * 1.5, 5))}
            className="p-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev / 1.5, 0.5))}
            className="p-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetZoom}
            className="p-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Toggle */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: 'normalTraffic', label: 'Normal Traffic', color: '#06b6d4' },
          { key: 'suspiciousTraffic', label: 'Suspicious Traffic', color: '#ef4444' },
          { key: 'bandwidth', label: 'Bandwidth', color: '#10b981' },
          { key: 'connections', label: 'Connections', color: '#f59e0b' }
        ].map(metric => (
          <button
            key={metric.key}
            onClick={() => toggleMetric(metric.key)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              selectedMetrics.includes(metric.key)
                ? 'bg-opacity-20 border-opacity-50 text-white'
                : 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white'
            }`}
            style={{
              backgroundColor: selectedMetrics.includes(metric.key) ? metric.color + '33' : undefined,
              borderColor: selectedMetrics.includes(metric.key) ? metric.color : undefined,
            }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: metric.color }}
              />
              {metric.label}
            </div>
          </button>
        ))}
      </div>

      {/* Enhanced Chart */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#9ca3af"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Normal Traffic Line */}
            {selectedMetrics.includes('normalTraffic') && (
              <Line
                type="monotone"
                dataKey="normalTraffic"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
                name="Normal Traffic"
                connectNulls={false}
              />
            )}
            
            {/* Suspicious Traffic with Area */}
            {selectedMetrics.includes('suspiciousTraffic') && (
              <>
                <Area
                  type="monotone"
                  dataKey="suspiciousTraffic"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                  name="Suspicious Traffic"
                />
                <Line
                  type="monotone"
                  dataKey="suspiciousTraffic"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  name="Suspicious Traffic"
                />
              </>
            )}
            
            {/* Bandwidth */}
            {selectedMetrics.includes('bandwidth') && (
              <Line
                type="monotone"
                dataKey="bandwidth"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Bandwidth (Mbps)"
                strokeDasharray="5 5"
              />
            )}
            
            {/* Connections */}
            {selectedMetrics.includes('connections') && (
              <Line
                type="monotone"
                dataKey="connections"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="Active Connections"
              />
            )}
            
            {/* Anomaly Reference Lines */}
            {showAnomalies && anomalies.map((anomaly, index) => (
              <ReferenceLine
                key={index}
                x={anomaly.timestamp}
                stroke={anomaly.alertLevel === 'critical' ? '#ef4444' : '#f59e0b'}
                strokeDasharray="2 2"
                strokeWidth={1}
              />
            ))}
            
            {/* Zoom functionality via Brush */}
            {timeRange !== 'live' && (
              <Brush
                dataKey="timestamp"
                height={30}
                stroke="#06b6d4"
                fill="#1f2937"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-gray-400 text-sm">Peak Traffic</div>
          <div className="text-white font-semibold">
            {Math.max(...data.map(d => d.normalTraffic))} packets/s
          </div>
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-gray-400 text-sm">Avg Bandwidth</div>
          <div className="text-white font-semibold">
            {Math.round(data.reduce((acc, d) => acc + d.bandwidth, 0) / data.length)} Mbps
          </div>
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-gray-400 text-sm">Anomalies</div>
          <div className="text-red-400 font-semibold">{anomalies.length}</div>
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-gray-400 text-sm">Active Connections</div>
          <div className="text-white font-semibold">
            {data[data.length - 1]?.connections || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedNetworkGraph;
