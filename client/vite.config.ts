/// <reference types="vitest/config" />
import path from 'path';
import { defineConfig, type UserConfig } from 'vite';
import type { InlineConfig } from 'vitest/node';
import react from '@vitejs/plugin-react';

const __dirname = path.resolve();

const { SERVER_PORT } = process.env;

type ViteConfig = UserConfig & { test: InlineConfig };

const config: ViteConfig = {
  build: {
    manifest: true,
  },
  define: {
    'import.meta.env.APP_DOMAIN': JSON.stringify(process.env.APP_DOMAIN),
    'import.meta.env.LOG_LEVEL': JSON.stringify(process.env.LOG_LEVEL),
    'import.meta.env.COOKIE_KEY': JSON.stringify(process.env.COOKIE_KEY),
  },
  envDir: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
  },
  server: {
    allowedHosts: ['app.connect-four.dev'],
    host: true,
    // proxy: {
    //   '/api': {
    //     target: `http://server:${SERVER_PORT}`,
    //   },
    //   '/connect-ws': {
    //     target: 'ws://server:8090',
    //     ws: true,
    //     rewrite: (path) => path.replace(/^\/connect-ws/, ''),
    //   },
    // },
    watch: {
      usePolling: true,
    },
  },
  test: {
    alias: {
      /* Fixes for module resolutions */
      '#saurookkadookk/react-utils-render-with-context': path.resolve(
        __dirname,
        '../node_modules/@saurookkadookk/react-utils-render-with-context/dist/esm',
      ),
    },
    environment: 'jsdom',
    include: [
      '**/*.{test,spec}.{js,jsx,ts,tsx}', // force formatting
      '**/__tests__/**/*.{ts,tsx}',
    ],
    sequence: {
      hooks: 'list',
    },
    setupFiles: ['./vitest.setup.ts'],
  },
};

// https://vite.dev/config/
export default defineConfig(config);
