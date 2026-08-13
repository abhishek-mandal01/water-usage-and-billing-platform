import React from 'react';

const DropletVisuals = () => {
  return (
    <svg 
      viewBox="0 0 80 96" 
      style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 8px 24px rgba(95, 140, 255, 0.25))' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hero-drop-grad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#EDF8FF" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#C7E6FF" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#7AA6FF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#5F8CFF" stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id="hero-drop-highlight" cx="35%" cy="28%" r="30%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-drop-edge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#5F8CFF" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path 
        d="M40 4 C40 4, 12 42, 12 60 C12 75.5 24.5 88 40 88 C55.5 88 68 75.5 68 60 C68 42, 40 4, 40 4Z" 
        fill="url(#hero-drop-grad)" 
        stroke="url(#hero-drop-edge)" 
        strokeWidth="1.5"
      />
      <ellipse cx="33" cy="42" rx="14" ry="18" fill="url(#hero-drop-highlight)" />
      <ellipse cx="30" cy="36" rx="5" ry="7" fill="white" opacity="0.6" />
    </svg>
  );
};

export default DropletVisuals;
