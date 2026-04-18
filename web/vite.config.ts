import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['pawtag-web.onrender.com'],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
      },
      '/uploads': {
        target: 'http://localhost:3001',
      },
    },
  },
})
