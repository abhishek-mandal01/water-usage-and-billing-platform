import { useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';

const SurfaceRipples = forwardRef(({ containerRef }, ref) => {
  const [ripples, setRipples] = useState([]);
  
  // Auto-clean ripples
  useEffect(() => {
    if (ripples.length === 0) return;
    const timeout = setTimeout(() => {
      setRipples((prev) => prev.filter(r => Date.now() - r.id < 2500));
    }, 2500);
    return () => clearTimeout(timeout);
  }, [ripples]);

  const addRipple = useCallback((x, y, type = 'click') => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;
    
    setRipples(prev => [...prev, { id: Date.now() + Math.random(), x, y, type }]);
  }, []);

  useImperativeHandle(ref, () => ({
    addRipple
  }));

  // Auto-generate ambient ripples
  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const interval = setInterval(() => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.random() * rect.width;
        // bottom 55% of container => from 45% to 100% height
        const y = rect.height * 0.45 + Math.random() * (rect.height * 0.55);
        addRipple(x, y, 'ambient');
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [containerRef, addRipple]);

  return (
    <>
      <style>
        {`
          .surface-ripples-wrapper {
            position: absolute;
            inset: 0;
            z-index: 20;
            pointer-events: none;
            overflow: hidden;
          }

          @keyframes ripple-expand {
            0% {
              r: 0;
              opacity: 1;
            }
            100% {
              r: var(--max-r);
              opacity: 0;
            }
          }

          .ripple-click {
            animation: ripple-expand 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
            stroke: rgba(95, 140, 255, 0.18);
          }
          
          .ripple-ambient {
            animation: ripple-expand 2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
            stroke: rgba(95, 140, 255, 0.1);
          }
          
          .ripple-splash {
            animation: ripple-expand 1.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
            stroke: rgba(95, 140, 255, 0.25);
            stroke-width: 2;
          }
        `}
      </style>
      <div className="surface-ripples-wrapper">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          {ripples.map((ripple) => {
            const maxRadius = ripple.type === 'click' ? 80 : ripple.type === 'splash' ? 100 : 50;
            return (
              <circle
                key={ripple.id}
                cx={ripple.x}
                cy={ripple.y}
                fill="none"
                strokeWidth={ripple.type === 'splash' ? 2 : 1}
                className={`ripple-${ripple.type}`}
                style={{ '--max-r': `${maxRadius}px` }}
              />
            );
          })}
        </svg>
      </div>
    </>
  );
});

SurfaceRipples.displayName = 'SurfaceRipples';

export default SurfaceRipples;
