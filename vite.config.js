import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT: change `base` to match your GitHub repo name
// e.g. if your repo is "steast-soup", set base: '/steast-soup/'
// for a user/org page (username.github.io), use base: '/'
export default defineConfig({
  plugins: [react()],
  base: '/is-there-broccoli-cheddar-soup-at-steast-today/',
});
