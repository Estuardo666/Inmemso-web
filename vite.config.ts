import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    console.log('Vite Root:', __dirname);
    console.log('Config loaded from:', path.resolve(__dirname));
    
    return {
      root: __dirname,
      base: '/',
      publicDir: 'public',
      server: {
        port: 5173,
        host: '0.0.0.0',
        strictPort: false,
        open: false,
        fs: {
          allow: [__dirname]
        }
      },
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true,
      },
      plugins: [react()],
      css: {
        postcss: './postcss.config.js',
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
