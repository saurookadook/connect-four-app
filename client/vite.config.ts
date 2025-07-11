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
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
      '@ConnectFour': path.resolve(__dirname, './src/pages/ConnectFour/'),
    },
  },
  server: {
    allowedHosts: ['app.connect-four.dev'],
    // https: {
    //   cert: fs.readFileSync('../certs/app.connect-four.dev+4.pem'),
    //   key: fs.readFileSync('../certs/app.connect-four.dev+4-key.pem'),
    // },
    host: true,
    proxy: {
      '/api': {
        target: `http://server:${SERVER_PORT}`,
      },
      '/connect-ws': {
        target: 'ws://server:8090',
        ws: true,
        rewrite: (path) => path.replace(/^\/connect-ws/, ''),
      },
    },
    watch: {
      usePolling: true,
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
