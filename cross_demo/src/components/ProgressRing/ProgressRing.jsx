import React from 'react';
import './ProgressRing.css';

const ProgressRing = ({ 
  percentage = 0, 
  size = 120, 
  strokeWidth = 8,
  color = 'var(--salesforce-blue)',
  label = '',
  showPercentage = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="progress-ring-svg">
        <circle
          className="progress-ring-bg"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring-circle"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ stroke: color }}
        />
      </svg>
      <div className="progress-ring-content">
        {showPercentage && (
          <div className="progress-percentage">{percentage}%</div>
        )}
        {label && (
          <div className="progress-label">{label}</div>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;
