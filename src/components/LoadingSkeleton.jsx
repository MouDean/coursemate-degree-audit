import React from 'react';

const LoadingSkeleton = ({ lines = 3, className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="flex space-x-4 mb-4">
          <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
