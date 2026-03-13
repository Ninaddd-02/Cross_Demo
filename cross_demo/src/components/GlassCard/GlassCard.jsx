import React from 'react';
import './GlassCard.css';

const GlassCard = ({ children, className = '', hover = true, glow = false, glowColor = 'blue' }) => {
  return (
    <div className={`glass-card ${hover ? 'glass-card-hover' : ''} ${glow ? `glow-${glowColor}` : ''} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
