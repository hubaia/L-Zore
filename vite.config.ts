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
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React 核心库
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          
          // 路由相关
          if (id.includes('node_modules/react-router')) {
            return 'router-vendor';
          }
          
          // 游戏引擎（通常是最大的依赖）
          if (id.includes('node_modules/phaser')) {
            return 'game-vendor';
          }
          
          // 状态管理
          if (id.includes('node_modules/dva') || 
              id.includes('node_modules/redux') || 
              id.includes('node_modules/history')) {
            return 'state-vendor';
          }
          
          // 样式相关
          if (id.includes('node_modules/tailwindcss') || 
              id.includes('node_modules/autoprefixer')) {
            return 'style-vendor';
          }
          
          // 其他第三方库
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
          
          // 应用代码按目录分割
          if (id.includes('/src/components/')) {
            return 'components';
          }
          if (id.includes('/src/routes/')) {
            return 'routes';
          }
          if (id.includes('/src/models/') || id.includes('/src/utils/')) {
            return 'utils';
          }
        },
        // 优化文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // 根据文件类型分类存放
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (assetInfo.name?.match(/\.(png|jpe?g|svg|gif|webp)$/)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (assetInfo.name?.match(/\.(woff2?|eot|ttf|otf)$/)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // 优化打包配置
    chunkSizeWarningLimit: 1000, // 调整 chunk 大小警告阈值
    sourcemap: false, // 生产环境关闭 sourcemap 以减小体积
    minify: 'terser', // 使用 terser 进行代码压缩
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console 语句
        drop_debugger: true, // 移除 debugger 语句
      },
    },
    // 构建目标优化
    target: 'es2015', // 兼容性设置
    // 静态资源处理
    assetsInlineLimit: 4096, // 小于 4KB 的资源内联为 base64
  },
});
