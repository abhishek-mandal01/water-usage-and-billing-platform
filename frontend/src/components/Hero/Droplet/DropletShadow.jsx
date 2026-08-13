import React from 'react';

const DropletShadow = ({ breathing }) => {
  return (
    <>
      <style>
        {`
          @keyframes hero-shadow-breathe {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 0.3; }
          }
          .hero-droplet-shadow {
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 12px;
            border-radius: 50%;
            background: radial-gradient(ellipse, rgba(95, 140, 255, 0.15) 0%, transparent 70%);
            opacity: 0.5;
            pointer-events: none;
          }
          @media (prefers-reduced-motion: no-preference) {
            .hero-droplet-shadow.breathing {
              animation: hero-shadow-breathe 6s ease-in-out infinite;
            }
          }
        `}
      </style>
      <div className={\`hero-droplet-shadow \${breathing ? 'breathing' : ''}\`} />
    </>
  );
};

export default DropletShadow;
