import React from 'react';

const TextArea = ({
  value,
  onChange,
  placeholder,
  label,
  maxLength,
  rows = 4,
  error,
  required = false,
  className = '',
  ...props
}) => {
  const textareaClasses = [
    'textarea-field',
    error ? 'error' : '',
    className
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'input-label',
    required ? 'required' : ''
  ].filter(Boolean).join(' ');

  const characterCount = value ? value.length : 0;
  const remainingChars = maxLength ? maxLength - characterCount : null;
  const isNearLimit = maxLength && characterCount > maxLength * 0.8;

  const counterClasses = [
    'textarea-counter',
    isNearLimit ? 'warning' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className="input-group">
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={textareaClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id || 'textarea'}-error` : undefined}
        {...props}
      />
      {maxLength && (
        <div className={counterClasses}>
          {characterCount}/{maxLength}
          {remainingChars !== null && remainingChars < 50 && (
            <span> ({remainingChars} remaining)</span>
          )}
        </div>
      )}
      {error && (
        <span 
          className="input-error" 
          id={`${props.id || 'textarea'}-error`}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default TextArea;