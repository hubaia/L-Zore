import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '', // 使用相对路径，解决静态服务器部署问题
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
