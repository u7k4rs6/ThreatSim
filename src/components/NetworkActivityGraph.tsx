import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const data = [
  { name: '00:00', packets: 30, connections: 50 },
  { name: '01:00', packets: 45, connections: 70 },
  { name: '02:00', packets: 35, connections: 60 },
  // Add more data points for a 24-hour simulation
];

const NetworkActivityGraph = () => {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="packets" stroke="#8884d8" />
          <Line type="monotone" dataKey="connections" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NetworkActivityGraph;
