import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'public', 'data');
const TODAY_PATH = join(DATA_DIR, 'today.json');
const HISTORY_PATH = join(DATA_DIR, 'history.json');

const STEAST_LOCATION_ID = 'PASTE_STETSON_EAST_LOCATION_ID_HERE';

const TARGET_KEYWORDS = [
  'broccoli cheddar',
  'broccoli & cheddar',
  'broccoli and cheddar',
];

const RELEVANT_MEALS = ['lunch', 'dinner'];

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

function loadHistory() {
  if (!existsSync(HISTORY_PATH)) {
    return { last_soup_date: null, soup_days: [] };
  }
  try {
    return JSON.parse(readFileSync(HISTORY_PATH, 'utf8'));
  } catch {
    return { last_soup_date: null, soup_days: [] };
  }
}

function updateHistory(history, date, found) {
  if (!found) return history;
  // Only record once per day, even if the action runs twice.
  if (history.last_soup_date === date) return history;
  // Only move last_soup_date forward (don't overwrite if a backfill runs).
  if (!history.last_soup_date || date > history.last_soup_date) {
    history.last_soup_date = date;
  }
  if (!history.soup_days.includes(date)) {
    history.soup_days.push(date);
    history.soup_days.sort();
  }
  return history;
}

async function main() {
  if (STEAST_LOCATION_ID.startsWith('PASTE_')) {
    throw new Error('Set STEAST_LOCATION_ID at the top of scripts/fetch-menu.js');
  }

  const date = getBostonDateString();
  console.log(`Checking ${date} for broccoli cheddar at Steast...`);

  const result = {
    date,
    found: false,
    meal: null,
    error: null,
    generated_at: new Date().toISOString(),
  };

  try {
    const periods = await getPeriods(STEAST_LOCATION_ID, date);

    for (const period of periods) {
      const periodName = (period.name ?? '').toLowerCase();
      if (!RELEVANT_MEALS.some((m) => periodName.includes(m))) continue;

      const menuJson = await getPeriodMenu(STEAST_LOCATION_ID, period.id, date);
      if (periodHasBroccoliCheddar(menuJson)) {
        result.found = true;
        result.meal = period.name;
        break;
      }
    }
  } catch (err) {
    console.error(err);
    result.error = err.message;
  }

  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(TODAY_PATH, JSON.stringify(result, null, 2) + '\n');

  const history = updateHistory(loadHistory(), date, result.found);
  writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2) + '\n');

  console.log('today:', result);
  console.log('history:', history);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});