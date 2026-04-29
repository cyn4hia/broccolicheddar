import React from 'react';
import './Header.css';
import { getDisplayDate } from '../utils/menu.js';

export default function Header() {
  return (
    <header className="header">
      <h1 className="title">
        Is there <em>broccoli cheddar soup</em>
        <br />
        at Steast today?
      </h1>
      <div className="meta">
        <span className="meta-date">{getDisplayDate()}</span>
      </div>
    </header>
  );
}
