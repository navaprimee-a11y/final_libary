import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:4000' } },
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/react-dom/') || id.includes('/node_modules/react/')) return 'react-vendor';
          if (id.includes('/@reduxjs/') || id.includes('/react-redux/')) return 'state-vendor';
          if (id.includes('/axios/')) return 'network-vendor';
          if (id.includes('/react-router/')) return 'router-vendor';
          return undefined;
        },
      },
    },
  },
});
