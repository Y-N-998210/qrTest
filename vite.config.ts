import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api で始まるリクエストをバックエンド (Express: 3001) へ転送
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});