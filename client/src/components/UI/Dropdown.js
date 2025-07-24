import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const Dropdown = ({
  trigger,
  children,
  position = 'bottom-left',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const positions = {
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2',
    'top-center': 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'bottom-center': 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    'left-top': 'right-full top-0 mr-2',
    'left-bottom': 'right-full bottom-0 mr-2',
    'right-top': 'left-full top-0 ml-2',
    'right-bottom': 'left-full bottom-0 ml-2'
  };

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <div ref={triggerRef} onClick={toggleDropdown}>
        {typeof trigger === 'function' ? trigger({ isOpen, disabled }) : trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={clsx(
            'absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-48',
            positions[position],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Dropdown Item Component
Dropdown.Item = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = '',
  icon,
  ...props 
}) => {
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={clsx(
        'w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2',
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="flex-1">{children}</span>
    </button>
  );
};

// Dropdown Divider Component
Dropdown.Divider = ({ className = '' }) => (
  <div className={clsx('border-t border-gray-200 dark:border-gray-700 my-1', className)} />
);

// Dropdown Header Component
Dropdown.Header = ({ children, className = '' }) => (
  <div className={clsx('px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider', className)}>
    {children}
  </div>
);

export default Dropdown; 