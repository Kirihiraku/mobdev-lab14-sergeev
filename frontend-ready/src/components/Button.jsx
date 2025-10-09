import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false, 
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClass = 'button';
  const variantClass = `button-${variant}`;
  const sizeClass = size !== 'md' ? `button-${size}` : '';
  
  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;