import { TODAY_JSON_URL, HISTORY_JSON_URL } from './config.js';

/**
 * Today's date in YYYY-MM-DD, anchored to Boston (America/New_York).
 */
export function getBostonDateString(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Pretty-printed date for display.
 */
export function getDisplayDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Read the ?test= query param to override what today's result looks like.
 *
 * Usage:
 *   ?test=yes              → fake "yes, lunch"
 *   ?test=yes&meal=Dinner  → fake "yes, dinner"
 *   ?test=no               → fake "no"
 *
 * Returns null when no test param is present.
 */
export function getTestOverride() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const test = params.get('test');
  if (test === 'yes') {
    return {
      date: getBostonDateString(),
      found: true,
      meal: params.get('meal') || 'Lunch',
      error: null,
      generated_at: new Date().toISOString(),
      isStale: false,
      isTest: true,
    };
  }
  if (test === 'no') {
    return {
      date: getBostonDateString(),
      found: false,
      meal: null,
      error: null,
      generated_at: new Date().toISOString(),
      isStale: false,
      isTest: true,
    };
  }
  return null;
}

/**
 * Fetch today.json. Returns:
 *   { date, found, meal, error, generated_at, isStale, isTest? }
 */
export async function fetchTodayResult() {
  const override = getTestOverride();
  if (override) return override;

  const url = `${TODAY_JSON_URL}?t=${Date.now()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`couldn't load today.json (${res.status})`);
  const data = await res.json();
  data.isStale = data.date !== getBostonDateString();
  return data;
}

/**
 * Fetch history.json. Returns { last_soup_date, soup_days }.
 * Falls back to empty history on failure rather than throwing.
 */
export async function fetchHistory() {
  try {
    const url = `${HISTORY_JSON_URL}?t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`history fetch ${res.status}`);
    return await res.json();
  } catch {
    return { last_soup_date: null, soup_days: [] };
  }
}

/**
 * Days between two YYYY-MM-DD dates. Counts whole days.
 *   daysBetween('2026-04-25', '2026-04-28') === 3
 */
export function daysBetween(fromYmd, toYmd) {
  const from = new Date(`${fromYmd}T00:00:00`);
  const to = new Date(`${toYmd}T00:00:00`);
  const ms = to - from;
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/**
 * Given today's result and history, return how many days since broccoli
 * cheddar was last served. If today has it, returns 0. Returns null if
 * we have no record at all.
 */
export function daysSinceBroccoliCheddar(todayResult, history) {
  if (todayResult?.found) return 0;
  if (!history?.last_soup_date) return null;
  return daysBetween(history.last_soup_date, getBostonDateString());
}