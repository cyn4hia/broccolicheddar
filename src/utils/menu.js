import {
  SITE_ID,
  STEAST_LOCATION_ID,
  TARGET_ITEM_KEYWORDS,
  RELEVANT_MEALS,
  MENU_API_BASE,
} from './config.js';

/**
 * Get today's date in YYYY-MM-DD format, anchored to Boston (America/New_York).
 * We use Boston time because the dining hall is in Boston — if you load the
 * page from California at 9pm PT, you still want today's Boston menu.
 */
export function getBostonDateString(date = new Date()) {
  // en-CA gives YYYY-MM-DD format directly
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Pretty-print today's date for display (e.g. "Tuesday, April 28").
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
 * Fetch the day's menu for Stetson East from Dine On Campus.
 * Returns the parsed JSON, or throws on failure.
 */
export async function fetchTodaysMenu(dateString = getBostonDateString()) {
  if (
    SITE_ID.startsWith('PASTE_') ||
    STEAST_LOCATION_ID.startsWith('PASTE_')
  ) {
    throw new Error(
      'Missing API IDs — open src/utils/config.js and follow the instructions.'
    );
  }

  const url = `${MENU_API_BASE}?date=${dateString}&location_id=${STEAST_LOCATION_ID}&site_id=${SITE_ID}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Menu API returned ${res.status}`);
  }
  return res.json();
}

/**
 * Walk the menu JSON and decide whether broccoli cheddar soup is being
 * served at lunch or dinner today.
 *
 * Returns: { found: boolean, meal: string | null }
 *   - meal is the human-friendly name of the period it was found in
 *     ("Lunch" or "Dinner"), or null if not found.
 */
export function findBroccoliCheddar(menuJson) {
  // The DineOnCampus shape is roughly:
  //   { menu: { periods: [{ name, categories: [{ items: [{ name, ... }] }] }] } }
  const periods = menuJson?.menu?.periods ?? [];

  for (const period of periods) {
    const periodName = (period?.name ?? '').toLowerCase();
    const isRelevantMeal = RELEVANT_MEALS.some((meal) =>
      periodName.includes(meal)
    );
    if (!isRelevantMeal) continue;

    const categories = period?.categories ?? [];
    for (const category of categories) {
      const items = category?.items ?? [];
      for (const item of items) {
        const itemName = (item?.name ?? '').toLowerCase();
        const matches = TARGET_ITEM_KEYWORDS.some((kw) =>
          itemName.includes(kw.toLowerCase())
        );
        if (matches) {
          return { found: true, meal: period.name };
        }
      }
    }
  }

  return { found: false, meal: null };
}
