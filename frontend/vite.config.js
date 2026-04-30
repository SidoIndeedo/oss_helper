import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3232',
        changeOrigin: true,
        rewrite: (path) => path, // keep /api prefix
      },
      '/health': {
        target: 'http://localhost:3232',
        changeOrigin: true,
      },
    },
  },
});