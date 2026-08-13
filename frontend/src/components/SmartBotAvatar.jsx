import React, { useState } from 'react';
import './SmartBotAvatar.css';

/**
 * SmartBotAvatar — High-fidelity 3D claymorphic robot mascot
 * Features:
 * - 3D lighting gradients & specular glass reflections
 * - Animated cyan glowing eyes with natural blinking
 * - Continuous / interactive arm waving
 * - Floating levitation physics with dynamic floor shadow
 * - Online status beacon indicator
 * - Interactive hover speech tooltip
 */
const SmartBotAvatar = ({
  size = 'large', // 'large' | 'medium' | 'mini'
  isInteractive = true,
  showTooltip = true,
  tooltipText = 'Hi! How can I help with your water bills? 💧',
  isTyping = false,
  isSpeaking = false,
  onClick,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isMini = size === 'mini';

  return (
    <div 
      className={`smartbot-avatar-container size-${size} ${isInteractive ? 'interactive' : ''} ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={isInteractive ? 'button' : 'img'}
      tabIndex={isInteractive ? 0 : -1}
      aria-label="SmartBot AI Assistant"
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Interactive Speech Callout (Large mode only) */}
      {!isMini && showTooltip && (
        <div className={`smartbot-speech-bubble ${isHovered ? 'visible' : ''}`}>
          <span>{tooltipText}</span>
          <div className="smartbot-bubble-tail"></div>
        </div>
      )}

      {/* Online Status Beacon */}
      {!isMini && (
        <div className="smartbot-status-beacon" title="SmartBot is Online">
          <span className="smartbot-beacon-dot"></span>
          <span className="smartbot-beacon-ring"></span>
        </div>
      )}

      {/* 3D Bot Character SVG */}
      <div className={`smartbot-mascot-wrapper ${isTyping ? 'typing-bounce' : ''} ${isSpeaking ? 'speaking-bounce' : ''}`}>
        <svg
          viewBox="0 0 160 170"
          className="smartbot-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Visor & Eye Glow Filter */}
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="ambientShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.25" />
            </filter>

            <filter id="innerSoftGaze" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
              <feFlood floodColor="#00e5ff" floodOpacity="0.4" />
              <feComposite in2="shadowDiff" operator="in" />
              <feComposite in2="SourceGraphic" operator="over" />
            </filter>

            {/* Helmet 3D Shading */}
            <radialGradient id="helmetGrad" cx="38%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#f1f5f9" />
              <stop offset="80%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </radialGradient>

            {/* Visor Glass Gradient */}
            <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b1329" />
              <stop offset="50%" stopColor="#111827" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Visor Specular Reflection */}
            <linearGradient id="visorShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Body 3D Gradient */}
            <linearGradient id="bodyGrad" x1="25%" y1="10%" x2="80%" y2="90%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#f8fafc" />
              <stop offset="75%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            {/* Cyan Collar / Trim Glow */}
            <linearGradient id="cyanCollarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d2ff" />
              <stop offset="50%" stopColor="#00f5ff" />
              <stop offset="100%" stopColor="#00d2ff" />
            </linearGradient>

            {/* Arm 3D Gradient */}
            <linearGradient id="armGrad" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            {/* Headset Metallic Gradient */}
            <linearGradient id="headsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Ear Ring Glow */}
            <radialGradient id="earTrim" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f5ff" />
              <stop offset="70%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
          </defs>

          {/* ================= BODY & THRUSTER ================= */}
          <g className="smartbot-body-group">
            {/* Bottom Thruster Cyan Glow Drop */}
            <path
              d="M74 148 C74 148, 80 158, 80 158 C80 158, 86 148, 86 148 Z"
              fill="#00f5ff"
              filter="url(#cyanGlow)"
              opacity="0.9"
              className="smartbot-thruster-flame"
            />

            {/* Torso Capsule */}
            <path
              d="M52 94 C52 94, 46 112, 54 128 C60 140, 72 150, 80 152 C88 150, 100 140, 106 128 C114 112, 108 94, 108 94 C100 97, 80 98, 52 94 Z"
              fill="url(#bodyGrad)"
              filter="url(#ambientShadow)"
            />

            {/* Torso Inner Specular Highlight */}
            <path
              d="M58 98 C54 112, 60 126, 68 136 C64 126, 60 114, 62 100 C68 101, 74 102, 80 102 C70 102, 63 100, 58 98 Z"
              fill="#ffffff"
              opacity="0.6"
            />

            {/* Cyan Collar Light Ring */}
            <ellipse
              cx="80"
              cy="95"
              rx="28"
              ry="6.5"
              fill="none"
              stroke="url(#cyanCollarGrad)"
              strokeWidth="3.5"
              filter="url(#cyanGlow)"
            />
          </g>

          {/* ================= LEFT ARM (RESTING) ================= */}
          <g className="smartbot-left-arm">
            {/* Shoulder */}
            <circle cx="50" cy="104" r="7.5" fill="url(#armGrad)" />
            {/* Upper & Lower Arm */}
            <path
              d="M50 104 C40 114, 38 126, 44 138 C46 142, 50 142, 51 138 C52 130, 48 118, 54 108 Z"
              fill="url(#armGrad)"
              filter="url(#ambientShadow)"
            />
            {/* Hand */}
            <circle cx="45" cy="140" r="5" fill="url(#armGrad)" />
          </g>

          {/* ================= RIGHT ARM (WAVING) ================= */}
          <g className="smartbot-right-arm-pivot">
            {/* Shoulder Ball */}
            <circle cx="110" cy="104" r="7.5" fill="url(#armGrad)" />
            
            {/* Animated Waving Upper Arm + Forearm + Hand */}
            <g className="smartbot-waving-hand">
              {/* Forearm angled upwards */}
              <path
                d="M110 104 C118 100, 126 90, 134 76 C138 70, 144 74, 142 80 C134 94, 124 106, 114 110 Z"
                fill="url(#armGrad)"
                filter="url(#ambientShadow)"
              />
              {/* Elbow joint */}
              <circle cx="126" cy="90" r="5.5" fill="url(#armGrad)" />
              {/* Waving Hand Palm */}
              <ellipse cx="136" cy="74" rx="7" ry="6" fill="url(#armGrad)" transform="rotate(-15 136 74)" />
              {/* Waving Fingers */}
              <path
                d="M132 70 C132 64, 136 62, 138 65 C140 62, 144 64, 143 68 C145 66, 148 68, 146 72"
                stroke="url(#armGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>

          {/* ================= HEAD & HELMET ================= */}
          <g className="smartbot-head-group">
            {/* Ear Trim Rings & Pods */}
            <g className="smartbot-ears">
              {/* Left Ear Piece */}
              <ellipse cx="33" cy="56" rx="6" ry="10" fill="url(#earTrim)" filter="url(#cyanGlow)" />
              <ellipse cx="34" cy="56" rx="4.5" ry="8" fill="url(#headsetGrad)" />
              
              {/* Right Ear Piece */}
              <ellipse cx="127" cy="56" rx="6" ry="10" fill="url(#earTrim)" filter="url(#cyanGlow)" />
              <ellipse cx="126" cy="56" rx="4.5" ry="8" fill="url(#headsetGrad)" />
            </g>

            {/* Helmet Main Shell (3D Clay Sphere) */}
            <ellipse
              cx="80"
              cy="56"
              rx="49"
              ry="42"
              fill="url(#helmetGrad)"
              filter="url(#ambientShadow)"
            />

            {/* Helmet Top Specular Reflection */}
            <ellipse
              cx="72"
              cy="28"
              rx="24"
              ry="11"
              fill="#ffffff"
              opacity="0.65"
            />

            {/* ================= VISOR SCREEN ================= */}
            {/* Visor Bezel / Recess */}
            <ellipse cx="80" cy="58" rx="39" ry="30" fill="#090d16" />
            
            {/* Visor Screen Glass */}
            <ellipse cx="80" cy="58" rx="37" ry="28" fill="url(#visorGrad)" />

            {/* Visor Glass Top-Curved Shine Reflection */}
            <path
              d="M47 52 C52 38, 70 34, 88 34 C104 34, 114 40, 115 48 C100 42, 75 42, 47 52 Z"
              fill="url(#visorShine)"
            />

            {/* ================= GLOWING FACE EXPRESSION ================= */}
            <g className="smartbot-face" filter="url(#cyanGlow)">
              {/* Left Glowing Eye (With Blink Animation) */}
              <g className="smartbot-eye left-eye">
                <ellipse cx="64" cy="54" rx="7.5" ry="10.5" fill="#00f5ff" />
                <ellipse cx="63" cy="52" rx="4.5" ry="7" fill="#e0f7ff" />
                <circle cx="65" cy="50" r="2" fill="#ffffff" />
              </g>

              {/* Right Glowing Eye (With Blink Animation) */}
              <g className="smartbot-eye right-eye">
                <ellipse cx="96" cy="54" rx="7.5" ry="10.5" fill="#00f5ff" />
                <ellipse cx="95" cy="52" rx="4.5" ry="7" fill="#e0f7ff" />
                <circle cx="97" cy="50" r="2" fill="#ffffff" />
              </g>

              {/* Glowing Smile / Speaking Mouth */}
              <g className={`smartbot-mouth ${isSpeaking ? 'is-talking' : ''}`}>
                <path
                  d="M71 67 C74 74, 86 74, 89 67"
                  fill="none"
                  stroke="#00f5ff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="smartbot-mouth-stroke"
                />
                <path
                  d="M73 67 C76 72, 84 72, 87 67"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
            </g>

            {/* ================= HEADSET MICROPHONE ================= */}
            <g className="smartbot-headset">
              {/* Headset Arc */}
              <path
                d="M33 58 C30 76, 42 90, 68 90"
                fill="none"
                stroke="url(#headsetGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Microphone Tip */}
              <rect
                x="65"
                y="86.5"
                width="9"
                height="6.5"
                rx="3.2"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1"
              />
              {/* Mic Small Indicator Dot */}
              <circle cx="70" cy="89.5" r="1.2" fill="#00f5ff" filter="url(#cyanGlow)" />
            </g>
          </g>
        </svg>
      </div>

      {/* Floating Floor Shadow */}
      {!isMini && <div className="smartbot-floor-shadow"></div>}
    </div>
  );
};

export default SmartBotAvatar;
