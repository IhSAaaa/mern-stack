import React from 'react';
import { clsx } from 'clsx';

const Skeleton = ({ 
  variant = 'text', 
  width, 
  height, 
  className = '',
  lines = 1,
  ...props 
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
  
  const variants = {
    text: 'h-4',
    title: 'h-6',
    heading: 'h-8',
    avatar: 'w-10 h-10 rounded-full',
    image: 'w-full h-48',
    button: 'h-10 w-24',
    card: 'w-full h-64',
    circle: 'w-12 h-12 rounded-full',
    rectangle: 'w-full h-32'
  };

  const classes = clsx(
    baseClasses,
    variants[variant],
    className
  );

  const style = {
    width: width,
    height: height
  };

  if (lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              baseClasses,
              variants[variant],
              index === lines - 1 ? 'w-3/4' : 'w-full'
            )}
            style={index === lines - 1 ? { width: '75%' } : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={classes} 
      style={style}
      {...props}
    />
  );
};

// Specialized Skeleton Components
Skeleton.Card = ({ className = '', ...props }) => (
  <div className={clsx('bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6', className)} {...props}>
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton variant="avatar" />
      <div className="flex-1">
        <Skeleton variant="title" className="mb-2" />
        <Skeleton variant="text" className="w-3/4" />
      </div>
    </div>
    <Skeleton variant="image" className="mb-4" />
    <Skeleton lines={3} />
  </div>
);

Skeleton.PostCard = ({ className = '', ...props }) => (
  <div className={clsx('bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden', className)} {...props}>
    <Skeleton variant="image" className="w-full h-48" />
    <div className="p-6">
      <div className="flex items-center space-x-2 mb-3">
        <Skeleton variant="text" className="w-20" />
        <Skeleton variant="text" className="w-16" />
      </div>
      <Skeleton variant="heading" className="mb-3" />
      <Skeleton lines={3} className="mb-4" />
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <Skeleton variant="text" className="w-12" />
          <Skeleton variant="text" className="w-12" />
          <Skeleton variant="text" className="w-12" />
        </div>
        <Skeleton variant="button" />
      </div>
    </div>
  </div>
);

Skeleton.Profile = ({ className = '', ...props }) => (
  <div className={clsx('bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6', className)} {...props}>
    <div className="flex items-center space-x-6 mb-6">
      <Skeleton variant="avatar" className="w-32 h-32" />
      <div className="flex-1">
        <Skeleton variant="heading" className="mb-2" />
        <Skeleton variant="text" className="w-1/2 mb-4" />
        <div className="flex space-x-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="text-center">
              <Skeleton variant="title" className="mb-1" />
              <Skeleton variant="text" className="w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

Skeleton.Table = ({ rows = 5, columns = 4, className = '', ...props }) => (
  <div className={clsx('bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden', className)} {...props}>
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="text" className="flex-1" />
        ))}
      </div>
    </div>
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} variant="text" className="flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

Skeleton.List = ({ items = 5, className = '', ...props }) => (
  <div className={clsx('space-y-4', className)} {...props}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
        <Skeleton variant="avatar" />
        <div className="flex-1">
          <Skeleton variant="title" className="mb-2" />
          <Skeleton variant="text" className="w-3/4" />
        </div>
        <Skeleton variant="button" />
      </div>
    ))}
  </div>
);

Skeleton.Form = ({ fields = 4, className = '', ...props }) => (
  <div className={clsx('space-y-6', className)} {...props}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index}>
        <Skeleton variant="text" className="w-24 mb-2" />
        <Skeleton variant="rectangle" className="h-12" />
      </div>
    ))}
    <div className="flex space-x-4 pt-4">
      <Skeleton variant="button" />
      <Skeleton variant="button" />
    </div>
  </div>
);

export default Skeleton; 