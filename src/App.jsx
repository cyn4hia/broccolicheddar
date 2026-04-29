import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import SoupBowl from './components/SoupBowl.jsx';
import Notification from './components/Notification.jsx';
import Counter from './components/Counter.jsx';
import {
  fetchTodayResult,
  fetchHistory,
  daysSinceBroccoliCheddar,
} from './utils/menu.js';
import './App.css';

export default function App() {
  // status: 'loading' | 'ready' | 'error'
  const [status, setStatus] = useState('loading');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [todayData, historyData] = await Promise.all([
          fetchTodayResult(),
          fetchHistory(),
        ]);
        if (cancelled) return;
        setResult(todayData);
        setHistory(historyData);
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

  const days = daysSinceBroccoliCheddar(result, history);

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
              couldn't load today's menu :(
              <br />
              <small>{errorMsg}</small>
            </p>
          )}
          {status === 'ready' && !revealed && (
            <p className="hint">
              {result?.isStale
                ? "today's menu hasn't dropped yet — tap anyway"
                : 'tap the bowl'}
            </p>
          )}
          {status === 'ready' && revealed && (
            <>
              <Notification found={result.found} meal={result.meal} />
              <Counter days={days} />
            </>
          )}
        </div>

        {result?.isTest && (
          <p className="test-banner">test mode</p>
        )}
      </div>

      <footer className="footer">
        <p>github @cyn4hia</p>
      </footer>
    </main>
  );
}