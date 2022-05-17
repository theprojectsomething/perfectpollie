import { defineConfig } from 'vite'
import { resolve } from 'path'

let localConfig;
try {
  localConfig = require('./vite.config.local.js');
} catch (e) {/* no local config exists */}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  ...localConfig,
});
