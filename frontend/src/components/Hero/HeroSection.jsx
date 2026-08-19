import { useRef, useEffect } from 'react';
import BaseGradient from './Background/BaseGradient';
import CausticLighting from './Background/CausticLighting';
import SurfaceRipples from './Surface/SurfaceRipples';
import Droplet from './Droplet/Droplet';
import HeroNav from './UI/HeroNav';
import HeroContent from './UI/HeroContent';

const HeroSection = () => {
  const containerRef = useRef(null);
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const ripplesRef = useRef(null);
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mediaQuery.matches;

    const handleChange = (e) => {
      prefersReducedMotionRef.current = e.matches;
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mousePosRef.current = { x, y };
  };

  const handleClick = (e) => {
    if (!containerRef.current || !ripplesRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Only in bottom 60%
    if (y / rect.height > 0.4) {
      ripplesRef.current.addRipple?.(x, y, 'click');
    }
  };

  const handleSplash = (x, y) => {
    if (ripplesRef.current?.addRipple) {
      ripplesRef.current.addRipple(x, y, 'splash');
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className="hero-section"
    >
      <style>{`
        .hero-section {
          position: relative;
          min-height: 92vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .hero-layout-container {
          position: relative;
          z-index: 50;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 5%;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          gap: 60px;
        }

        .hero-content-wrapper {
          flex: 1 1 55%;
          max-width: 640px;
        }

        .hero-spacer {
          flex: 1 1 40%;
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 80vh;
          }
          .hero-layout-container {
            flex-direction: column;
            gap: 40px;
            padding-top: 40px;
            padding-bottom: 40px;
          }
          .hero-content-wrapper {
            max-width: 100%;
          }
          .hero-spacer {
            display: none;
          }
        }
      `}</style>
      
      <BaseGradient mousePos={mousePosRef} />
      <CausticLighting />
      <SurfaceRipples ref={ripplesRef} containerRef={containerRef} />
      <Droplet mousePos={mousePosRef} onSplash={handleSplash} />
      
      <HeroNav />
      
      <div className="hero-layout-container">
        <div className="hero-content-wrapper">
          <HeroContent />
        </div>
        <div className="hero-spacer"></div>
      </div>
    </section>
  );
};

export default HeroSection;

