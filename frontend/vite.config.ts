import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 同じWi-Fi（ローカルネットワーク）に繋がっているスマホや他のPC・タブレットから、開発中のWebサイトにアクセスできるようになる(0.0.0.0でバインドしローカルネットワークに公開）
    // ngrok のホスト名を許可（'all' で全ての外部ホストを許可、または個別に指定）
    allowedHosts: true,
    proxy: {
      // /api で始まるリクエストをバックエンド (Express: 3001) へ転送
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});