import React, { forwardRef, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { FiEye, FiEyeOff, FiSearch, FiX } from 'react-icons/fi';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  disabled = false,
  required = false,
  fullWidth = false,
  size = 'md',
  variant = 'default',
  leftIcon,
  rightIcon,
  clearable = false,
  searchable = false,
  className = '',
  helperText,
  maxLength,
  minLength,
  pattern,
  autoComplete,
  autoFocus = false,
  readOnly = false,
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const variants = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-400 dark:focus:ring-red-400',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500 dark:border-green-600 dark:focus:border-green-400 dark:focus:ring-green-400'
  };

  const getVariantClass = () => {
    if (error) return variants.error;
    if (success) return variants.success;
    return variants.default;
  };

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (onChange) {
      onChange(e);
    }
  }, [onChange]);

  const handleFocus = useCallback((e) => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  }, [props]);

  const handleBlur = useCallback((e) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  }, [onBlur]);

  const handleClear = useCallback(() => {
    setInputValue('');
    if (onChange) {
      const event = {
        target: { value: '', name: props.name }
      };
      onChange(event);
    }
  }, [onChange, props.name]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const describedBy = [ariaDescribedBy, errorId, helperId].filter(Boolean).join(' ');

  return (
    <div className={clsx('relative', fullWidth && 'w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={clsx(
            'block text-sm font-medium mb-2',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={inputType}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          className={clsx(
            'block w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200',
            sizes[size],
            getVariantClass(),
            leftIcon && 'pl-10',
            (rightIcon || type === 'password' || clearable) && 'pr-10',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700',
            readOnly && 'bg-gray-50 dark:bg-gray-700 cursor-default',
            isFocused && 'ring-2 ring-offset-2',
            error && 'ring-red-500',
            success && 'ring-green-500'
          )}
          {...props}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {clearable && inputValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              aria-label="Clear input"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}

          {type === 'password' && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          )}

          {rightIcon && !clearable && type !== 'password' && (
            <div className="text-gray-400 dark:text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p
          id={errorId}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}

      {helperText && !error && (
        <p
          id={helperId}
          className="mt-1 text-sm text-gray-500 dark:text-gray-400"
        >
          {helperText}
        </p>
      )}

      {maxLength && (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 text-right">
          {inputValue.length}/{maxLength}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 