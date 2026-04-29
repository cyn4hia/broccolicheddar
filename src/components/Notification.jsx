import React from 'react';
import './Notification.css';

/**
 * Banner shown after the bowl is clicked.
 *
 * Props:
 *   - found: boolean
 *   - meal: string | null  ("Lunch" or "Dinner")
 */
export default function Notification({ found, meal }) {
  if (found) {
    return (
      <div className="notification notification-yes">
        <span className="notification-mark">yes!</span>
        <span className="notification-detail">at {meal?.toLowerCase()}</span>
      </div>
    );
  }
  return (
    <div className="notification notification-no">
      <span className="notification-mark">no</span>
      <span className="notification-detail">:(</span>
    </div>
  );
}
