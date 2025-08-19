import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Eye, EyeOff, X, Loader2 } from 'lucide-react';
import { InputFieldProps, InputFieldRef } from './InputField.types';

const InputField = forwardRef<InputFieldRef, InputFieldProps>(({
  value = '',
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled = false,
  invalid = false,
  loading = false,
  variant = 'outlined',
  size = 'md',
  type = 'text',
  showClearButton = false,
  showPasswordToggle = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
  }));

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isError = invalid || !!errorMessage;
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Size classes
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-4 text-base',
  };

  // Variant classes
  const getVariantClasses = () => {
    const baseClasses = 'w-full rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';
    
    if (disabled) {
      return `${baseClasses} bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed`;
    }

    if (isError) {
      switch (variant) {
        case 'filled':
          return `${baseClasses} bg-red-50 border border-red-300 text-gray-900 focus:ring-red-500 focus:border-red-500`;
        case 'ghost':
          return `${baseClasses} bg-transparent border-0 border-b-2 border-red-300 rounded-none focus:ring-0 focus:border-red-500`;
        default:
          return `${baseClasses} bg-white border border-red-300 text-gray-900 focus:ring-red-500 focus:border-red-500`;
      }
    }

    switch (variant) {
      case 'filled':
        return `${baseClasses} bg-gray-50 border border-gray-300 text-gray-900 hover:bg-gray-100 focus:ring-blue-500 focus:border-blue-500 focus:bg-white`;
      case 'ghost':
        return `${baseClasses} bg-transparent border-0 border-b-2 border-gray-300 rounded-none hover:border-gray-400 focus:ring-0 focus:border-blue-500`;
      default:
        return `${baseClasses} bg-white border border-gray-300 text-gray-900 hover:border-gray-400 focus:ring-blue-500 focus:border-blue-500`;
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const showRightIcons = (showClearButton && value) || (showPasswordToggle && type === 'password') || loading;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className={`block text-sm font-medium mb-1 ${
            isError ? 'text-red-700' : disabled ? 'text-gray-400' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            ${getVariantClasses()}
            ${sizeClasses[size]}
            ${showRightIcons ? 'pr-12' : ''}
          `}
          aria-invalid={isError}
          aria-describedby={
            errorMessage ? `${inputId}-error` : 
            helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        
        {showRightIcons && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {loading && (
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
            )}
            
            {showClearButton && value && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Clear input"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            {showPasswordToggle && type === 'password' && !loading && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
          </div>
        )}
      </div>
      
      {errorMessage && (
        <p 
          id={`${inputId}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
      
      {helperText && !errorMessage && (
        <p 
          id={`${inputId}-helper`}
          className={`mt-1 text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;