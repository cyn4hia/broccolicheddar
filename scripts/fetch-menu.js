// Fetches today's Stetson East menu from DineOnCampus and writes
// public/data/today.json with the result.
//
// Run by GitHub Actions on a cron. Also runnable locally:
//   node scripts/fetch-menu.js
//
// No dependencies — uses Node 18+ built-in fetch.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, '..', 'public', 'data', 'today.json');

// =====================================================================
// CONFIG — fill these in once.
// To find the location ID:
//   1. Open https://nudining.com in Chrome
//   2. DevTools → Network tab
//   3. Click on "The Eatery at Stetson East"
//   4. Look for any request to api.dineoncampus.com/v1/location/<ID>/...
//      Copy that <ID> here.
// =====================================================================
const STEAST_LOCATION_ID = 'PASTE_STETSON_EAST_LOCATION_ID_HERE';

const TARGET_KEYWORDS = [
  'broccoli cheddar',
  'broccoli & cheddar',
  'broccoli and cheddar',
];

const RELEVANT_MEALS = ['lunch', 'dinner'];

// Pretend to be a normal browser so Cloudflare is friendlier.
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json',
};

function getBostonDateString() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

async function getPeriods(locationId, date) {
  const url = `https://api.dineoncampus.com/v1/location/${locationId}/periods?platform=0&date=${date}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`periods request failed: ${res.status}`);
  const json = await res.json();
  return json.periods ?? [];
}

async function getPeriodMenu(locationId, periodId, date) {
  const url = `https://api.dineoncampus.com/v1/location/${locationId}/periods/${periodId}?platform=0&date=${date}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`menu request failed: ${res.status}`);
  return res.json();
}

function periodHasBroccoliCheddar(menuJson) {
  // Shape: { menu: { periods: { categories: [{ items: [{ name, ... }] }] } } }
  const categories = menuJson?.menu?.periods?.categories ?? [];
  for (const cat of categories) {
    for (const item of cat.items ?? []) {
      const name = (item.name ?? '').toLowerCase();
      if (TARGET_KEYWORDS.some((kw) => name.includes(kw))) {
        return true;
      }
    }
  }
  return false;
}

async function main() {
  if (STEAST_LOCATION_ID.startsWith('PASTE_')) {
    throw new Error(
      'Set STEAST_LOCATION_ID at the top of scripts/fetch-menu.js'
    );
  }

  const date = getBostonDateString();
  console.log(`Checking ${date} for broccoli cheddar at Steast...`);

  let result = { date, found: false, meal: null, error: null };

  try {
    const periods = await getPeriods(STEAST_LOCATION_ID, date);

    for (const period of periods) {
      const periodName = (period.name ?? '').toLowerCase();
      const isRelevant = RELEVANT_MEALS.some((m) => periodName.includes(m));
      if (!isRelevant) continue;

      const menuJson = await getPeriodMenu(STEAST_LOCATION_ID, period.id, date);
      if (periodHasBroccoliCheddar(menuJson)) {
        result.found = true;
        result.meal = period.name;
        break; // first match wins (lunch comes before dinner)
      }
    }
  } catch (err) {
    console.error(err);
    result.error = err.message;
  }

  // Always write SOMETHING so the frontend never sees a stale file.
  // generated_at lets the UI tell the user how fresh the data is.
  result.generated_at = new Date().toISOString();

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(result, null, 2) + '\n');

  console.log('Wrote', OUT_PATH);
  console.log(result);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
