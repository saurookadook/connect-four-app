/// <reference types="vitest/config" />
import path from 'path';
import { defineConfig, type UserConfig } from 'vite';
import type { InlineConfig } from 'vitest/node';
import react from '@vitejs/plugin-react';

const __dirname = path.resolve();

const { SERVER_PORT } = process.env;

type ViteConfig = UserConfig & { test: InlineConfig };

const config: ViteConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
      '@ConnectFour': path.resolve(__dirname, './src/pages/ConnectFour/'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${SERVER_PORT}`,
      },
      '/connect-ws': {
        target: 'ws://localhost:8090',
        ws: true,
        rewrite: (path) => path.replace(/^\/connect-ws/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    // globals: true,
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
