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

      {/* Telemetry Dot Matrix Grid Texture */}
      <div className={`water-texture-grid ${modeClass}`} />

      {/* Fluid Caustics Wave Texture Layer */}
      <div className={`water-texture-waves ${modeClass}`} />

      {/* Concentric Water Droplet Ripple Effect in Center Hero Area */}
      <div className="water-bg-ripple-area">
        {/* Animated Ripple Ring 1 */}
        <div className="water-bg-ripple-1" />
        {/* Animated Ripple Ring 2 */}
        <div className="water-bg-ripple-2" />
        {/* Animated Ripple Ring 3 */}
        <div className="water-bg-ripple-3" />
      </div>

      {/* Floating Animated Water Bubbles */}
      <div className="hydro-bubbles" aria-hidden="true">
        <span className="hb hb-1" /><span className="hb hb-2" /><span className="hb hb-3" />
        <span className="hb hb-4" /><span className="hb hb-5" /><span className="hb hb-6" />
        <span className="hb hb-7" /><span className="hb hb-8" /><span className="hb hb-9" />
        <span className="hb hb-10" /><span className="hb hb-11" /><span className="hb hb-12" />
        <span className="hb hb-13" /><span className="hb hb-14" /><span className="hb hb-15" />
        <span className="hb hb-16" /><span className="hb hb-17" /><span className="hb hb-18" />
      </div>

      {/* Dynamic Animated Ambient Lighting Orbs */}
      <div className={`water-bg-orb-1 ${modeClass}`} />
      <div className={`water-bg-orb-2 ${modeClass}`} />
      <div className={`water-bg-orb-3 ${modeClass}`} />
    </div>
  );
};

