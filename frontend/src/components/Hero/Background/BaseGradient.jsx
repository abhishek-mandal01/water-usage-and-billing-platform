import { useEffect, useRef } from 'react';

const BaseGradient = ({ mousePos }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion || !mousePos) return;

    let animationFrameId;
    
    const updateParallax = () => {
      if (containerRef.current && mousePos.current) {
        // Map 0..1 to -1..1, max parallax 8px
        const xOffset = (mousePos.current.x - 0.5) * 16;
        const yOffset = (mousePos.current.y - 0.5) * 16;
        containerRef.current.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [mousePos]);

  return (
    <>
      <style>
        {`
          .base-gradient-container {
            position: absolute;
            inset: -20px;
            z-index: 0;
            pointer-events: none;
            background: linear-gradient(
              180deg, 
              var(--hero-bg-start), 
              var(--hero-bg-mid) 35%, 
              var(--hero-bg-end) 65%, 
              var(--hero-bg-deep)
            );
            transition: transform 600ms var(--ease-smooth);
            overflow: hidden;
          }
          
          .base-gradient-pools {
            position: absolute;
            inset: 0;
            background: 
              radial-gradient(circle at 20% 30%, var(--hero-accent-light) 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, var(--hero-accent) 0%, transparent 45%),
              radial-gradient(circle at 50% 90%, var(--hero-bg-deep) 0%, transparent 50%);
            opacity: 0.15;
            mix-blend-mode: overlay;
          }

          .base-gradient-shimmer {
            position: absolute;
            inset: 0;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.1),
              transparent
            );
            transform: translateX(-100%);
            animation: shimmerSweep 10s infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .base-gradient-shimmer {
              animation: none;
            }
            .base-gradient-container {
              transform: none !important;
            }
          }

          @keyframes shimmerSweep {
            0% { transform: translateX(-100%) skewX(-15deg); }
            30%, 100% { transform: translateX(200%) skewX(-15deg); }
          }
        `}
      </style>
      <div className="base-gradient-container" ref={containerRef}>
        <div className="base-gradient-pools" />
        <div className="base-gradient-shimmer" />
      </div>
    </>
  );
};

export default BaseGradient;
