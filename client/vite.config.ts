/// <reference types="vitest/config" />
import path from 'path';
import { defineConfig, type LogLevel, type UserConfig } from 'vite';
import type { InlineConfig } from 'vitest/node';
import react from '@vitejs/plugin-react';

const __dirname = path.resolve();

enum ViteLogLevels {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  SILENT = 'silent',
}

const { LOG_LEVEL, SERVER_PORT } = process.env;

const configLogLevel =
  LOG_LEVEL in ViteLogLevels // force formatting
    ? (LOG_LEVEL as LogLevel)
    : 'info';

type ViteConfig = UserConfig & { test: InlineConfig };

const config: ViteConfig = {
  build: {
    manifest: true,
  },
  clearScreen: false,
  define: {
    'import.meta.env.APP_DOMAIN': JSON.stringify(process.env.APP_DOMAIN),
    'import.meta.env.LOG_LEVEL': JSON.stringify(process.env.LOG_LEVEL),
    'import.meta.env.COOKIE_KEY': JSON.stringify(process.env.COOKIE_KEY),
  },
  envDir: './',
  logLevel: configLogLevel,
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
    reporters: ['verbose'],
    sequence: {
      hooks: 'list',
    },
    setupFiles: ['./vitest.setup.ts'],
  },
};

// https://vite.dev/config/
export default defineConfig(config);
