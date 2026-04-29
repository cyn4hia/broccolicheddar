# is there broccoli cheddar soup at steast today?

A daily check for broccoli cheddar soup at Stetson East dining hall. Click the bowl, find out.

## How it works

The DineOnCampus API is behind Cloudflare and won't accept browser fetches
from a static GitHub Pages origin. So instead of calling it from the client,
a GitHub Action runs twice a day, fetches the menu, and commits a tiny
`public/data/today.json` like:

```json
{ "date": "2026-04-28", "found": true, "meal": "Lunch" }
```

The React app just reads that file. No API keys, no proxy, no CORS.

## Stack

- Vite + React (frontend)
- Vanilla Node (the daily fetch script)
- GitHub Actions (cron + auto-deploy)
- GitHub Pages (hosting)

## Setup

### 1. Find the Stetson East location ID

1. Open https://nudining.com in Chrome
2. DevTools → Network tab
3. Click on "The Eatery at Stetson East"
4. Look for a request to `api.dineoncampus.com/v1/location/<ID>/...`
5. Copy that `<ID>`

### 2. Paste it into the script

Open `scripts/fetch-menu.js` and set:

```js
const STEAST_LOCATION_ID = 'paste-the-id-here';
```

### 3. Set the Vite base path

In `vite.config.js`, set `base` to `'/<your-repo-name>/'`. If you're using a
user/org page (`username.github.io`), set it to `'/'`.

### 4. Push to GitHub

Push to a public repo. In the repo Settings:
- **Pages** → set source to **GitHub Actions**
- **Actions** → **General** → make sure "Read and write permissions" is enabled

That's it. The deploy workflow runs on push, and the menu workflow runs at
11:00 UTC (lunch) and 21:00 UTC (dinner) every day. You can also trigger
either manually from the Actions tab.

## Local dev

```bash
npm install
npm run dev
```

To regenerate `today.json` locally:

```bash
node scripts/fetch-menu.js
```

(Cloudflare may block this from your home IP — that's fine, it'll work from
GitHub's runners.)

## File layout

```
.github/workflows/
  update-menu.yml       cron — fetches menu, commits today.json
  deploy.yml            builds and deploys site on push

scripts/
  fetch-menu.js         hits the DineOnCampus API, writes today.json

public/data/
  today.json            the result the frontend reads

src/
  App.jsx               main wiring
  components/
    Header.jsx          title + date + location
    SoupBowl.jsx        the SVG bowl
    Notification.jsx    yes! / no :( banner
  utils/
    config.js           where to fetch today.json from
    menu.js             fetch + date helpers
  styles/
    global.css
```

## Customizing

- **Different soup?** Change `TARGET_KEYWORDS` in `scripts/fetch-menu.js`.
- **Different meals?** Change `RELEVANT_MEALS` in the same file (e.g.
  `['breakfast', 'lunch', 'dinner']`).
- **Different dining hall?** Change `STEAST_LOCATION_ID` and update the
  copy in `Header.jsx`.
