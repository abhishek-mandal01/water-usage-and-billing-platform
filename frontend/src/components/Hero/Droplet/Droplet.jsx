import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DropletVisuals from './DropletVisuals';
import DropletShadow from './DropletShadow';

const SPRING = { stiffness: 100, damping: 30, mass: 1 };
const REFORM_SPRING = { stiffness: 80, damping: 20, mass: 1 };

const Droplet = ({ mousePos, onSplash }) => {
  const [dropletVisible, setDropletVisible] = useState(true);
  const containerRef = useRef(null);
  const visualsRef = useRef(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {// eslint-disable-next-line react-hooks/set-state-in-effect

    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isTouch || !dropletVisible) return;

    let animationFrameId;
    const updateProximity = () => {
      if (containerRef.current && visualsRef.current && mousePos?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = mousePos.current.x - centerX;
        const dy = mousePos.current.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let rotation = 0;
        if (distance < 200) {
          const strength = 1 - distance / 200;
          // Rotate slightly towards mouse based on dx. Range -5 to 5 deg
          rotation = (dx / 200) * 5 * strength; 
        }

        visualsRef.current.style.transform = `rotate(${rotation}deg)`;
        visualsRef.current.style.transition = distance < 200 ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out';
      }
      animationFrameId = requestAnimationFrame(updateProximity);
    };

    animationFrameId = requestAnimationFrame(updateProximity);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isTouch, dropletVisible, mousePos]);

  const handleClick = useCallback(() => {
    if (!dropletVisible) return;
    
    setDropletVisible(false);
    
    if (containerRef.current && onSplash) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      onSplash(centerX, centerY);
    }

    setTimeout(() => {
      setDropletVisible(true);
    }, 2000);
  }, [dropletVisible, onSplash]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <>
      <style>
        {`
          .hero-droplet-container {
            position: absolute;
            right: 18%;
            top: 28%;
            width: 80px;
            height: 96px;
            cursor: pointer;
            z-index: 40;
            outline: none;
          }
          .hero-droplet-inner {
            width: 100%;
            height: 100%;
            transform-origin: bottom center;
          }
          .hero-droplet-container:focus-visible .hero-droplet-inner {
            outline: 2px solid #5F8CFF;
            outline-offset: 4px;
            border-radius: 40px;
          }
          @media (max-width: 767px) {
            .hero-droplet-container {
              width: 56px;
              height: 68px;
              right: 10%;
              top: 22%;
            }
          }
          @keyframes hero-droplet-breathe {
            0% { transform: translateY(0) scaleX(1) scaleY(1); }
            50% { transform: translateY(-10px) scaleX(0.98) scaleY(1.02); }
            100% { transform: translateY(0) scaleX(1) scaleY(1); }
          }
          @media (prefers-reduced-motion: no-preference) {
            .hero-droplet-breathe-anim {
              animation: hero-droplet-breathe 6s ease-in-out infinite;
            }
          }
        `}
      </style>
      
      <div 
        className="hero-droplet-container"
        ref={containerRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Click to see a splash effect"
      >
        <AnimatePresence>
          {dropletVisible && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.05, 1], opacity: [0, 1, 1] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.4,
                ...SPRING,
                scale: {
                  type: 'spring',
                  ...REFORM_SPRING
                }
              }}
              style={{ width: '100%', height: '100%', position: 'relative' }}
            >
              <div className="hero-droplet-inner hero-droplet-breathe-anim" ref={visualsRef}>
                <DropletVisuals />
              </div>
              <DropletShadow breathing={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Droplet;

