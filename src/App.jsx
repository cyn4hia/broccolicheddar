import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import SoupBowl from './components/SoupBowl.jsx';
import Notification from './components/Notification.jsx';
import { fetchTodaysMenu, findBroccoliCheddar } from './utils/menu.js';
import './App.css';

export default function App() {
  // status: 'loading' | 'ready' | 'error'
  const [status, setStatus] = useState('loading');
  const [result, setResult] = useState(null); // { found, meal }
  const [errorMsg, setErrorMsg] = useState('');
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const menu = await fetchTodaysMenu();
        if (cancelled) return;
        setResult(findBroccoliCheddar(menu));
        setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        setErrorMsg(err.message);
        setStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBowlClick = () => {
    if (status !== 'ready') return;
    setRevealed(true);
  };

  return (
    <main className="app">
      <Header />

      <div className="bowl-stage">
        <SoupBowl
          filled={revealed && result?.found}
          onClick={handleBowlClick}
          disabled={status !== 'ready'}
        />

        <div className="hint-row">
          {status === 'loading' && (
            <p className="hint">checking the menu...</p>
          )}
          {status === 'error' && (
            <p className="hint hint-error">
              couldn't reach the menu :( <br />
              <small>{errorMsg}</small>
            </p>
          )}
          {status === 'ready' && !revealed && (
            <p className="hint">tap the bowl</p>
          )}
          {status === 'ready' && revealed && (
            <Notification found={result.found} meal={result.meal} />
          )}
        </div>
      </div>

      <footer className="footer">
        <p>not affiliated with northeastern dining · made with love & soup</p>
      </footer>
    </main>
  );
}
