import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Export Vite configuration
export default defineConfig({
  plugins: [react()], // Enables React support
  base: './',          // Use relative paths for assets, important for Nginx / SPA deployment
});

