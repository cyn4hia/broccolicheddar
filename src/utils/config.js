// Where to fetch the pre-baked daily result from. Lives under /public/data/
// so Vite copies it to the site root.
//
// import.meta.env.BASE_URL respects the `base` option in vite.config.js,
// so this works whether you deploy to username.github.io/ or
// username.github.io/your-repo-name/.
export const TODAY_JSON_URL = `${import.meta.env.BASE_URL}data/today.json`;
