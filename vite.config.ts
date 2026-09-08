import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Guía AIFA',
        short_name: 'Guía AIFA',
        description: 'Tu asistente de orientación en el AIFA',
        theme_color: '#173b70',
        background_color: '#f2f5fa',
        display: 'standalone',
        start_url: '/',
        lang: 'es-MX',
        icons: [
          { src: '/pwa-192x192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: '/pwa-512x512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      }
    })
  ]
})
