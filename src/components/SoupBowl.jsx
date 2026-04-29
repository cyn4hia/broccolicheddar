import React from 'react';
import './SoupBowl.css';

export default function SoupBowl({ filled, onClick, disabled }) {
  return (
    <button
      className={`bowl-button ${filled ? 'filled' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={
        filled
          ? 'Bowl with broccoli cheddar soup'
          : 'Empty red bowl, click to check'
      }
    >
      <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Clip path */}
          <clipPath id="soup-surface-clip">
            <ellipse cx="160" cy="110" rx="112" ry="18" />
          </clipPath>

          {/* Soup color */}
          <radialGradient id="soup-gradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#f9c84d" />
            <stop offset="70%" stopColor="#e89829" />
            <stop offset="100%" stopColor="#c47820" />
          </radialGradient>

          {/* Bowl rim */}
          <linearGradient id="rim-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a01818" />
            <stop offset="100%" stopColor="#7a1212" />
          </linearGradient>

          {/* Red bowl body */}
          <linearGradient id="bowl-body" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d62828" />
            <stop offset="100%" stopColor="#9b1c1c" />
          </linearGradient>

          <radialGradient id="steam-grad">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* steam */}
        {filled && (
          <g className="steam">
            <ellipse cx="120" cy="80" rx="14" ry="22" fill="url(#steam-grad)" />
            <ellipse cx="160" cy="65" rx="16" ry="26" fill="url(#steam-grad)" />
            <ellipse cx="200" cy="80" rx="14" ry="22" fill="url(#steam-grad)" />
          </g>
        )}

        {/* bowl body */}
        <path
          d="M 48 110 Q 48 205 160 205 Q 272 205 272 110 Z"
          fill="#6f1b1bff"
        />
        {/* Inner curve shadow for depth */}
        <path
          d="M 52 110 Q 52 200 160 200 Q 268 200 268 110"
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="2"
        />

        {/* Outer red rim band */}
        <ellipse cx="160" cy="110" rx="120" ry="22" fill="url(#rim-gradient)" />

        {/* Inner dark rim hole (the "opening") */}
        <ellipse cx="160" cy="110" rx="112" ry="18" fill="#3a1010" />

        {/* Soup surface — only inside the rim opening */}
        {filled && (
          <g className="soup-layer" clipPath="url(#soup-surface-clip)">
            {/* Soup fill */}
            <ellipse cx="160" cy="110" rx="112" ry="18" fill="url(#soup-gradient)" />

            {/* Subtle highlight on the surface */}
            <ellipse cx="145" cy="105" rx="50" ry="5" fill="#ffd97a" opacity="0.5" />

            {/* Broccoli florets */}
            <g className="broccoli broccoli-1">
              <circle cx="105" cy="108" r="9" fill="#3d6b2c" />
              <circle cx="100" cy="105" r="6" fill="#4f8536" />
              <circle cx="110" cy="106" r="5" fill="#558d3a" />
            </g>
            <g className="broccoli broccoli-2">
              <circle cx="160" cy="112" r="11" fill="#3d6b2c" />
              <circle cx="156" cy="108" r="7" fill="#4f8536" />
              <circle cx="166" cy="109" r="6" fill="#558d3a" />
            </g>
            <g className="broccoli broccoli-3">
              <circle cx="215" cy="109" r="9" fill="#3d6b2c" />
              <circle cx="210" cy="106" r="6" fill="#4f8536" />
              <circle cx="220" cy="107" r="5" fill="#558d3a" />
            </g>

            {/* Cheese specks */}
            <circle cx="130" cy="115" r="2" fill="#fff3a0" />
            <circle cx="180" cy="113" r="2.5" fill="#fff3a0" />
            <circle cx="195" cy="116" r="1.8" fill="#fff3a0" />
            <circle cx="140" cy="117" r="1.5" fill="#fff3a0" />
          </g>
        )}

        {/* highlight */}
        <path
          d="M 65 130 Q 75 170 105 192"
          fill="none"
          stroke="#f4a4a4"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.2"
        />
      </svg>
    </button>
  );
}