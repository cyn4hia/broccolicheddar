import React from 'react';
import './SoupBowl.css';

/**
 * Interactive bowl. Renders empty by default; when `filled` is true,
 * soup + broccoli + steam appear inside the bowl.
 *
 * Props:
 *   - filled: boolean — show soup or not
 *   - onClick: () => void — click handler
 *   - disabled: boolean — disable interaction (e.g. while loading)
 */
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
          <clipPath id="bowl-interior">
            <path d="M 50 110 Q 50 200 160 200 Q 270 200 270 110 Z" />
          </clipPath>

          <linearGradient id="soup-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f4b942" />
            <stop offset="60%" stopColor="#e89829" />
            <stop offset="100%" stopColor="#c47820" />
          </linearGradient>

          <linearGradient id="rim-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a01818" />
            <stop offset="100%" stopColor="#7a1212" />
          </linearGradient>

          <linearGradient id="bowl-body" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d62828" />
            <stop offset="100%" stopColor="#9b1c1c" />
          </linearGradient>

          <radialGradient id="steam-grad">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Steam wisps — only when filled */}
        {filled && (
          <g className="steam">
            <ellipse cx="120" cy="80" rx="14" ry="22" fill="url(#steam-grad)" />
            <ellipse cx="160" cy="65" rx="16" ry="26" fill="url(#steam-grad)" />
            <ellipse cx="200" cy="80" rx="14" ry="22" fill="url(#steam-grad)" />
          </g>
        )}

        {/* Bowl rim (back) — always visible */}
        <ellipse cx="160" cy="110" rx="115" ry="22" fill="url(#rim-shadow)" />
        <ellipse cx="160" cy="108" rx="112" ry="18" fill="#1a0808" opacity="0.4" />

        {/* Soup — only rendered when filled */}
        {filled && (
          <g clipPath="url(#bowl-interior)" className="soup-layer">
            <rect x="50" y="100" width="220" height="120" fill="url(#soup-gradient)" />

            {/* Soup surface highlight */}
            <ellipse cx="160" cy="108" rx="108" ry="10" fill="#f9c84d" opacity="0.6" />

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

        {/* Bowl body (front) — always visible */}
        <path
          d="M 45 110 Q 45 205 160 205 Q 275 205 275 110 L 270 110 Q 270 200 160 200 Q 50 200 50 110 Z"
          fill="url(#bowl-body)"
        />
        <path
          d="M 50 110 Q 50 200 160 200 Q 270 200 270 110"
          fill="none"
          stroke="#7a1212"
          strokeWidth="2"
        />

        {/* Subtle shine on bowl */}
        <path
          d="M 65 130 Q 75 170 105 190"
          fill="none"
          stroke="#f4a4a4"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    </button>
  );
}