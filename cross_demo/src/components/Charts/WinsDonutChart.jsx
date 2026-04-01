import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WinsDonutChart = ({ crossSellWins, upsellWins }) => {
  const data = [
    { name: 'Cross-Sell Wins', value: crossSellWins, color: '#22c55e' },
    { name: 'Upsell Wins', value: upsellWins, color: '#f59e0b' }
  ];

  const total = crossSellWins + upsellWins;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '8px',
            color: '#ffffff'
          }}
          formatter={(value) => [`${value} wins (${((value / total) * 100).toFixed(1)}%)`, '']}
        />
        <Legend verticalAlign="bottom" height={36} />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: '1.5rem', fontWeight: 700, fill: '#1f2937' }}
        >
          {total}
        </text>
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: '0.875rem', fill: '#6b7280' }}
        >
          Total Wins
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default WinsDonutChart;
