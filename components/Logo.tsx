
import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ size = 40, className = "", variant = 'dark' }) => {
  const strokeColor = "#064e3b"; // Deep emerald
  const goldColor = "#fbbf24";   // Gold/Amber
  const emeraldColor = "#10b981"; // Emerald

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Handle */}
      <rect 
        x="80" 
        y="80" 
        width="18" 
        height="45" 
        rx="9" 
        transform="rotate(-45 80 80)" 
        fill={emeraldColor} 
        stroke={strokeColor} 
        strokeWidth="5"
      />
      {/* Magnifying Glass Head */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill={goldColor} 
        stroke={strokeColor} 
        strokeWidth="5"
      />
      {/* Inner White Circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="28" 
        fill="white" 
        stroke={strokeColor} 
        strokeWidth="5"
      />
      {/* Dollar Sign */}
      <text 
        x="50" 
        y="62" 
        textAnchor="middle" 
        fill={strokeColor} 
        style={{ 
          fontSize: '42px', 
          fontWeight: '900', 
          fontFamily: 'Outfit, sans-serif' 
        }}
      >
        ₱
      </text>
    </svg>
  );
};

export default Logo;
