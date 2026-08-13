import React from 'react';
import './WaterBackground.css';

export const WaterBackground = ({ darkMode }) => {
  const modeClass = darkMode ? 'dark' : 'light';

  return (
    <div className="water-bg-container">
      {/* Base gradient background */}
      <div className={`water-bg-base ${modeClass}`} />

      {/* Realistic Photo Background Layer */}
      <div 
        className={`water-bg-photo ${modeClass}`}
        style={{ backgroundImage: `url('/assets/light_water_bg.png')` }}
      />

      {/* Soft gradient overlay for smooth text contrast */}
      <div className={`water-bg-overlay ${modeClass}`} />

      {/* Concentric Water Droplet Ripple Effect in Center Hero Area */}
      <div className="water-bg-ripple-area">
        {/* Animated Ripple Ring 1 */}
        <div className="water-bg-ripple-1" />
        {/* Animated Ripple Ring 2 */}
        <div className="water-bg-ripple-2" />
      </div>

      {/* Ambient Lighting Orbs */}
      <div className="water-bg-orb-1" />
      <div className="water-bg-orb-2" />
      <div className="water-bg-orb-3" />
    </div>
  );
};
