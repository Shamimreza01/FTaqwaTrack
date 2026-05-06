import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Precache all core app assets
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'icon.jpg',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'icon192x192.png',
        'icon512x512.png',
      ],
      manifest: {
        name: 'TaqwaTrack',
        short_name: 'TaqwaTrack',
        description: 'TaqwaTrack — Offline Spiritual Tracker',
        theme_color: '#030712',
        background_color: '#030712',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait-primary',
        icons: [
          { src: 'favicon-16x16.png', sizes: '16x16', type: 'image/png' },
          { src: 'favicon-32x32.png', sizes: '32x32', type: 'image/png' },
          { src: 'icon192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        // Precache all JS, CSS, HTML, images, fonts
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2,ttf,eot}'],
        // 8MB cap (Quran JSON is large)
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,

        // Navigate fallback for SPA — ensures offline navigation works
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],

        // Skip waiting so new SW activates immediately
        skipWaiting: true,
        clientsClaim: true,

        runtimeCaching: [
          // --- Google Fonts (CSS) ---
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-css',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // --- Google Fonts (Static files) ---
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-static',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // --- Al-Quran API (alquran.cloud) — StaleWhileRevalidate for freshness + offline ---
          {
            urlPattern: /^https:\/\/api\.alquran\.cloud\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'alquran-api-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // --- Dua / Names of Allah APIs ---
          {
            urlPattern: /^https:\/\/(raw\.githubusercontent\.com|cdn\.jsdelivr\.net)\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'github-cdn-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // --- Nominatim / OpenStreetMap for location names ---
          {
            urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'nominatim-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
})
