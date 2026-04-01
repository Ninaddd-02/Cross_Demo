import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CycleTimeTrendChart = ({ currentCycleTime, timePeriod = '6M' }) => {
  // Generate mock timeline data based on current cycle time
  const generateTimelineData = () => {
    const months = timePeriod === '3M' 
      ? ['Oct', 'Nov', 'Dec']
      : timePeriod === '6M'
      ? ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
      : ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

    return months.map((month, index) => {
      // Simulate improvement trend over time
      const variation = (Math.random() - 0.5) * 8; // ±4 days variation
      const trendImprovement = (months.length - index) * 1.5; // Gradual improvement
      const days = Math.max(25, currentCycleTime + trendImprovement + variation);
      
      return {
        month,
        days: parseFloat(days.toFixed(1)),
        target: 30
      };
    });
  };

  const data = generateTimelineData();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="cycleGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#6b7280" />
        <YAxis stroke="#6b7280" label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '8px',
            color: '#ffffff'
          }}
          formatter={(value) => `${value} days`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="days"
          name="Cycle Time"
          stroke="#8b5cf6"
          strokeWidth={3}
          fill="url(#cycleGradient)"
          dot={{ fill: '#8b5cf6', r: 5 }}
          activeDot={{ r: 7 }}
        />
        <Line
          type="monotone"
          dataKey="target"
          name="Target"
          stroke="#94a3b8"
          strokeWidth={2}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CycleTimeTrendChart;
