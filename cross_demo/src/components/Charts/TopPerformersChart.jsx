import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TopPerformersChart = ({ topRepRevenue, topRepConversion }) => {
  const data = [
    {
      name: topRepRevenue,
      category: 'By Revenue',
      value: 95, // Normalized score for visualization
      color: '#8b5cf6'
    },
    {
      name: topRepConversion,
      category: 'By Conversion',
      value: 88, // Normalized score
      color: '#0176d3'
    }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data} 
        layout="vertical" 
        margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" stroke="#6b7280" />
        <YAxis 
          type="category" 
          dataKey="name" 
          stroke="#6b7280" 
          width={90}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '8px',
            color: '#ffffff'
          }}
          formatter={(value, name, props) => [props.payload.category, props.payload.name]}
        />
        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopPerformersChart;
