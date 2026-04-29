import React from 'react';
import './Header.css';
import { getDisplayDate } from '../utils/menu.js';

export default function Header() {
  return (
    <header className="header">
      <h1 className="title">
        is there <em>broccoli cheddar soup</em>
        <br />
        at steast today?
      </h1>
      <div className="meta">
        <span className="meta-date">{getDisplayDate()}</span>
        <span className="meta-dot">·</span>
        <span className="meta-loc">Stetson East · Levine Marketplace</span>
      </div>
    </header>
  );
}
