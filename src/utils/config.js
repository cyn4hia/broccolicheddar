// =====================================================================
// CONFIG — fill in the IDs once and forget about them.
//
// HOW TO GET THE IDs (takes 30 seconds):
//   1. Open https://nudining.com in Chrome
//   2. Open DevTools → Network tab → filter by "menu.json"
//   3. Click on Stetson East ("The Eatery at Stetson East")
//   4. Find the request to:
//        api.dineoncampus.com/v1/location/menu.json
//      Copy the `site_id` and `location_id` query params from the URL.
//   5. Paste them below.
// =====================================================================

export const SITE_ID = 'PASTE_NORTHEASTERN_SITE_ID_HERE';
export const STEAST_LOCATION_ID = 'PASTE_STETSON_EAST_LOCATION_ID_HERE';

// Words to look for in menu items. Case-insensitive substring match.
// Leave a couple variants in case the dining hall names it differently.
export const TARGET_ITEM_KEYWORDS = [
  'broccoli cheddar',
  'broccoli & cheddar',
  'broccoli and cheddar',
];

// Which meal periods we care about (case-insensitive substring match
// against the "name" field DineOnCampus returns for each period).
export const RELEVANT_MEALS = ['lunch', 'dinner'];

// Base URL for the menu API.
export const MENU_API_BASE = 'https://api.dineoncampus.com/v1/location/menu.json';
