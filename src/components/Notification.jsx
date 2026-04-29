import React from 'react';
import './Notification.css';

/**
banner
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
