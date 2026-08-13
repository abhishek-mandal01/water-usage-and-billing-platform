import React from 'react';
import { useTheme } from '../context/ThemeContext';

const SkeletonLoader = ({ type = 'dashboard' }) => {
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  const baseBg = isDark ? 'bg-gray-800' : 'bg-gray-200';
  const pulseClass = 'animate-pulse rounded-xl';

  if (type === 'dashboard') {
    return (
      <div className="p-8 w-full h-full">
        {/* Header Skeleton */}
        <div className={`h-10 w-48 mb-8 ${baseBg} ${pulseClass}`}></div>
        
        {/* Top Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-36 w-full ${baseBg} ${pulseClass}`}></div>
          ))}
        </div>
        
        {/* Main Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 h-96 w-full ${baseBg} ${pulseClass}`}></div>
          <div className={`h-96 w-full ${baseBg} ${pulseClass}`}></div>
        </div>
      </div>
    );
  }

  // Default block skeleton
  return <div className={`w-full h-full min-h-[200px] ${baseBg} ${pulseClass}`}></div>;
};

export default SkeletonLoader;
