

const CausticLighting = () => {
  return (
    <>
      <style>
        {`
          .caustic-lighting-wrapper {
            position: absolute;
            inset: -20%; /* extend past boundaries for drifting */
            z-index: 10;
            pointer-events: none;
            opacity: 0.06;
            mix-blend-mode: soft-light;
            animation: causticDrift 30s infinite linear alternate;
          }

          @media (prefers-reduced-motion: reduce) {
            .caustic-lighting-wrapper {
              animation: none;
              opacity: 0.04;
            }
          }

          @keyframes causticDrift {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-2%, 2%) scale(1.05); }
            100% { transform: translate(2%, -1%) scale(1); }
          }
        `}
      </style>
      <div className="caustic-lighting-wrapper">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="hero-caustics">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.012 0.018" 
                numOctaves="3" 
                seed="8"
              >
                <animate 
                  attributeName="baseFrequency" 
                  dur="25s" 
                  values="0.012 0.018; 0.016 0.022; 0.012 0.018" 
                  repeatCount="indefinite" 
                />
              </feTurbulence>
              <feDisplacementMap 
                in="SourceGraphic" 
                scale="35" 
                xChannelSelector="R" 
                yChannelSelector="G" 
              />
            </filter>
            
            <pattern id="caustic-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="40" fill="rgba(95, 140, 255, 0.12)" filter="url(#hero-caustics)" />
              <circle cx="90" cy="80" r="50" fill="rgba(95, 140, 255, 0.12)" filter="url(#hero-caustics)" />
              <circle cx="20" cy="100" r="30" fill="rgba(95, 140, 255, 0.12)" filter="url(#hero-caustics)" />
              <circle cx="100" cy="20" r="45" fill="rgba(95, 140, 255, 0.12)" filter="url(#hero-caustics)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#caustic-pattern)" />
        </svg>
      </div>
    </>
  );
};

export default CausticLighting;
