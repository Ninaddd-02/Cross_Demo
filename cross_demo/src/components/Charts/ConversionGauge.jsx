import React from 'react';
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const ConversionGauge = ({ conversionRate }) => {
  const data = [
    {
      name: 'Conversion Rate',
      value: conversionRate,
      fill: '#0176d3'
    }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="60%"
        outerRadius="90%"
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          minAngle={15}
          background
          clockWise
          dataKey="value"
          cornerRadius={10}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '8px',
            color: '#ffffff'
          }}
          formatter={(value) => [`${value}%`, 'Conversion Rate']}
        />
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: '2.5rem', fontWeight: 700, fill: '#0176d3' }}
        >
          {conversionRate}%
        </text>
        <text
          x="50%"
          y="62%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: '0.875rem', fill: '#6b7280' }}
        >
          Conversion Rate
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default ConversionGauge;
