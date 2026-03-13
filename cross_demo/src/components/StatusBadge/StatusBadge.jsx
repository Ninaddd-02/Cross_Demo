import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status, label, icon = null, size = 'medium' }) => {
  return (
    <span className={`status-badge status-badge-${status} status-badge-${size}`}>
      {icon && <span className="badge-icon">{icon}</span>}
      {label}
    </span>
  );
};

export default StatusBadge;
