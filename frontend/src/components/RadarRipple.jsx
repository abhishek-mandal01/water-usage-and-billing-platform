import React from 'react';
import './RadarRipple.css';

const RadarRipple = ({ x = '22vw', y = '50%' }) => {
  return (
    <div className="radar-ripple-container" style={{ '--ripple-x': x, '--ripple-y': y }}>
      <div className="radar-ripple ripple-1"></div>
      <div className="radar-ripple ripple-2"></div>
      <div className="radar-ripple ripple-3"></div>
      <div className="radar-ripple ripple-4"></div>
    </div>
  );
};

export default RadarRipple;
