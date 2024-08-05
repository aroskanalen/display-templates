import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: '/',
  plugins: [react(), svgr()],
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  server: {
    strictPort: true,
    port: 3000,
    host: 'localhost',
    hmr: {
      host: 'display-templates.local.itkdev.dk',
      protocol: 'wss',
      clientPort: 443,
      path: '/ws',
    },
  },
});
