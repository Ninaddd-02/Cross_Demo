import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TeamConversionChart = ({ crossSellRate, upsellRate }) => {
  const data = [
    {
      category: 'Team Performance',
      crossSell: crossSellRate,
      upsell: upsellRate
    }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="category" stroke="#6b7280" />
        <YAxis stroke="#6b7280" label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '8px',
            color: '#ffffff'
          }}
          formatter={(value) => `${value}%`}
        />
        <Legend />
        <Bar dataKey="crossSell" name="Cross-Sell Rate" fill="#22c55e" radius={[8, 8, 0, 0]} />
        <Bar dataKey="upsell" name="Upsell Rate" fill="#f59e0b" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TeamConversionChart;
