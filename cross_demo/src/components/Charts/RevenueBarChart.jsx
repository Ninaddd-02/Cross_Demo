import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const RevenueBarChart = ({ crossSellRevenue, upsellRevenue }) => {
  const data = [
    {
      name: 'Cross-Sell',
      revenue: crossSellRevenue / 10000000, // Convert to Crores
      fill: '#22c55e'
    },
    {
      name: 'Upsell',
      revenue: upsellRevenue / 10000000,
      fill: '#f59e0b'
    }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis stroke="#6b7280" label={{ value: '₹ Crores', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '8px',
            color: '#ffffff'
          }}
          formatter={(value) => `₹${value.toFixed(2)} Cr`}
        />
        <Legend />
        <Bar dataKey="revenue" name="Revenue" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueBarChart;
