import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

/**
 * GreenScale Staff Dashboard - Vite Configuration
 * Path: apps/staff-dashboard/vite.config.ts
 * * Updated: Added resolve.alias to match TypeScript path mappings for @repo/ui.
 * * Note: Tailwind v4 is integrated via the @tailwindcss/vite plugin.
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      /**
       * In a monorepo, Vite needs an explicit alias to resolve 
       * non-built workspace packages during development.
       */
      '@repo/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    /**
     * Polling is often necessary for HMR consistency when 
     * watching files across the monorepo workspace boundary.
     */
    watch: {
      usePolling: true,
    }
  },
});