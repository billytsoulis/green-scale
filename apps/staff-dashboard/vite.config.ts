import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Staff Engineer Tip:
 * Tailwind v4 requires the @tailwindcss/vite plugin.
 * This replaces the need for postcss.config.js and tailwind.config.js.
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    // Ensure the HMR (Hot Module Replacement) works correctly in monorepos
    watch: {
        usePolling: true,
    }
  },
})