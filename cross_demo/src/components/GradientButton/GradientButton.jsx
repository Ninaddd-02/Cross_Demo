import React from 'react';
import './GradientButton.css';

const GradientButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  icon = null,
  disabled = false,
  type = 'button'
}) => {
  return (
    <button
      type={type}
      className={`gradient-button gradient-button-${variant} gradient-button-${size} ${fullWidth ? 'gradient-button-full' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default GradientButton;
