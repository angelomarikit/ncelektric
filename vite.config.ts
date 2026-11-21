import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5175,
    strictPort: false,
    watch: {
      // Windows EBUSY: design-kit mockups and heavy public assets can lock during watch/restart
      ignored: ['**/NC_Elektric_Design_Implementation_Kit/**', '**/.cursor/**'],
      usePolling: process.platform === 'win32',
      interval: 800,
    },
  },
});