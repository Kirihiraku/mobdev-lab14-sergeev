import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  onClick,
  header,
  footer,
  ...props 
}) => {
  const classes = [
    'card',
    className
  ].filter(Boolean).join(' ');

  const cardProps = {
    className: classes,
    ...(onClick && { onClick, style: { cursor: 'pointer' } }),
    ...props
  };

  return (
    <div {...cardProps}>
      {header && (
        <div className="card-header">
          {header}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;