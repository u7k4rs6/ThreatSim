# Enhanced Network Activity Graph

A comprehensive, interactive network monitoring component built for the ThreatSim Simulation Lab.

## 🚀 Features

### **Real-time Monitoring**
- Live data streaming with 3-second intervals
- Real-time anomaly detection
- Dynamic threat level indicators

### **Interactive Controls**
- **Time Range Selection**: Live, 24h, 7d views
- **Zoom Functionality**: Zoom in/out with reset capability
- **Metric Toggles**: Show/hide different data layers
- **Real-time Mode**: Toggle between live and static data

### **Advanced Visualization**
- **Multiple Data Layers**:
  - Normal Traffic (cyan line)
  - Suspicious Traffic (red area + line)
  - Bandwidth (green dashed line)
  - Active Connections (orange line)

- **Anomaly Highlighting**:
  - Reference lines for detected anomalies
  - Color-coded alerts (warning/critical)
  - Real-time anomaly counter

### **Professional UI/UX**
- **Custom Tooltips**: Detailed information on hover
- **Export Functionality**: Download data as CSV
- **Responsive Design**: Works on all screen sizes
- **Dark Theme**: Professional SOC-style appearance

### **Data Intelligence**
- **Realistic Patterns**: Business hours traffic simulation
- **Threat Simulation**: Random suspicious activity spikes
- **Smart Detection**: Automatic anomaly identification
- **Statistical Summary**: Live metrics display

## 📊 Data Structure

```typescript
interface NetworkDataPoint {
  timestamp: string;           // Time label (HH:MM)
  time: number;               // Unix timestamp
  normalTraffic: number;      // Normal network packets/s
  suspiciousTraffic: number;  // Suspicious activity packets/s
  bandwidth: number;          // Network bandwidth (Mbps)
  connections: number;        // Active connections count
  isAnomaly: boolean;        // Anomaly detection flag
  alertLevel: 'normal' | 'warning' | 'critical';
}
```

## 🎯 Usage

```jsx
import EnhancedNetworkGraph from './components/EnhancedNetworkGraph';

function Dashboard() {
  return (
    <div className="dashboard">
      <EnhancedNetworkGraph />
    </div>
  );
}
```

## 🔧 Technical Implementation

### **Libraries Used**
- **Recharts**: Professional charting library
- **Lucide React**: Modern icon library
- **React Hooks**: State management and effects

### **Key Components**
- **ComposedChart**: Combines multiple chart types
- **Brush**: Zoom and pan functionality
- **Custom Tooltip**: Enhanced data display
- **Reference Lines**: Anomaly markers

### **Performance Features**
- **Optimized Rendering**: Only re-renders on data changes
- **Memory Management**: Cleanup on unmount
- **Efficient Updates**: Smart data filtering

## 🎨 Styling

- **Tailwind CSS**: Utility-first styling
- **Dark Theme**: Professional security dashboard appearance
- **Responsive Grid**: Adapts to different screen sizes
- **Smooth Animations**: Hover effects and transitions

## 🔍 Educational Value

### **Learning Objectives**
- Network traffic analysis
- Anomaly detection techniques
- Security monitoring workflows
- Data visualization interpretation

### **Real-world Applications**
- SOC analyst training
- Network security monitoring
- Incident response practice
- Threat hunting exercises

## 📈 Data Patterns

### **Normal Traffic Simulation**
- Higher activity during business hours (8 AM - 6 PM)
- Sinusoidal patterns for realistic variation
- Base traffic levels with random variations

### **Suspicious Activity**
- Random spikes (15% probability)
- Configurable thresholds for alerts
- Different severity levels based on intensity

### **Anomaly Detection**
- Threshold-based detection
- Multi-level alert system
- Visual indicators and statistics

## 🚦 Alert Levels

- **Normal**: Green indicators, standard traffic
- **Warning**: Yellow indicators, elevated activity
- **Critical**: Red indicators, high threat level

## 💡 Key Innovations

1. **Educational Focus**: Designed specifically for cybersecurity training
2. **Realistic Simulation**: Business-hours traffic patterns
3. **Interactive Learning**: Hands-on exploration
4. **Professional UI**: Matches real SOC environments
5. **Export Capabilities**: Data analysis and reporting
6. **Real-time Updates**: Live monitoring simulation

## 🔧 Customization

The component is highly customizable:
- Modify data generation algorithms
- Adjust anomaly detection thresholds
- Customize color schemes and themes
- Add new metrics and data layers
- Configure time ranges and update intervals

## 📱 Responsive Design

- **Desktop**: Full-featured dashboard view
- **Tablet**: Optimized layout with touch controls
- **Mobile**: Simplified interface with essential features

## 🎓 Educational Impact

This enhanced network graph provides students and professionals with:
- **Hands-on Experience**: Interactive network monitoring
- **Pattern Recognition**: Learn to identify threats
- **Tool Familiarity**: Real SOC tool simulation
- **Data Analysis**: Statistical interpretation skills
- **Incident Response**: Alert investigation practice

The component successfully bridges the gap between theoretical knowledge and practical cybersecurity skills, making it an essential part of the ThreatSim learning ecosystem.
