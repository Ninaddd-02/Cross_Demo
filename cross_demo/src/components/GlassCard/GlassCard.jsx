import React from 'react';
import './GlassCard.css';

const GlassCard = ({ children, className = '', hover = true, glow = false, glowColor = 'blue', ...props }) => {
  return (
    <div className={`glass-card ${hover ? 'glass-card-hover' : ''} ${glow ? `glow-${glowColor}` : ''} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default GlassCard;
