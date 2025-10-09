import React from 'react';

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  required = false,
  className = '',
  ...props
}) => {
  const inputClasses = [
    'input-field',
    error ? 'error' : '',
    className
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'input-label',
    required ? 'required' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className="input-group">
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id || 'input'}-error` : undefined}
        {...props}
      />
      {error && (
        <span 
          className="input-error" 
          id={`${props.id || 'input'}-error`}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;