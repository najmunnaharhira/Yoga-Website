import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', '@tanstack/react-query'],
          'firebase': ['firebase/auth'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
      '/users': { target: 'http://localhost:5000', changeOrigin: true },
      '/user': { target: 'http://localhost:5000', changeOrigin: true },
      '/classes': { target: 'http://localhost:5000', changeOrigin: true },
      '/class': { target: 'http://localhost:5000', changeOrigin: true },
      '/instructors': { target: 'http://localhost:5000', changeOrigin: true },
      '/cart': { target: 'http://localhost:5000', changeOrigin: true },
      '/cart-item': { target: 'http://localhost:5000', changeOrigin: true },
      '/add-to-cart': { target: 'http://localhost:5000', changeOrigin: true },
      '/delete-cart-item': { target: 'http://localhost:5000', changeOrigin: true },
      '/create-payment-intent': { target: 'http://localhost:5000', changeOrigin: true },
      '/payment-info': { target: 'http://localhost:5000', changeOrigin: true },
      '/payment-history': { target: 'http://localhost:5000', changeOrigin: true },
      '/enrolled-classes': { target: 'http://localhost:5000', changeOrigin: true },
      '/popular_classes': { target: 'http://localhost:5000', changeOrigin: true },
      '/popular-instructors': { target: 'http://localhost:5000', changeOrigin: true },
      '/new-user': { target: 'http://localhost:5000', changeOrigin: true },
      '/new-class': { target: 'http://localhost:5000', changeOrigin: true },
      '/classes-manage': { target: 'http://localhost:5000', changeOrigin: true },
      '/change-status': { target: 'http://localhost:5000', changeOrigin: true },
      '/update-class': { target: 'http://localhost:5000', changeOrigin: true },
      '/admin-stats': { target: 'http://localhost:5000', changeOrigin: true },
      '/delete-user': { target: 'http://localhost:5000', changeOrigin: true },
      '/update-user': { target: 'http://localhost:5000', changeOrigin: true },
      '/as-instructor': { target: 'http://localhost:5000', changeOrigin: true },
      '/applied-instructors': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
})
