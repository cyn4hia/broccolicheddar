import React from 'react';
import './Counter.css';

export default function Counter({ days }) {
  const display = days === null || days === undefined ? '?' : days;
  return (
    <div className="counter">
      <span className="counter-label">days since broccoli cheddar</span>
      <span className="counter-number">{display}</span>
    </div>
  );
}