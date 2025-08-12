import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo-icon.svg', 'playstore-icon.png'],
      manifest: {
        name: 'MyWineMemory',
        short_name: 'WineMemory', 
        description: 'あなたのワイン体験を記録し、学習するアプリ',
        theme_color: '#722F37',
        background_color: '#FFF8E1',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'ja',
        categories: ['food', 'lifestyle', 'education'],
        icons: [
          {
            src: 'android/mipmap-mdpi/ic_launcher.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: 'android/mipmap-hdpi/ic_launcher.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'android/mipmap-xhdpi/ic_launcher.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'android/mipmap-xxhdpi/ic_launcher.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'android/mipmap-xxxhdpi/ic_launcher.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'ios/AppIcon.appiconset/Icon-App-60x60@3x.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: 'android/playstore-icon.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'logo-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff,ttf}'],
        navigateFallbackDenylist: [
          /^\/__\/.*$/, 
          /^\/google\.firestore\.v1\.Firestore/,
          /^\/v1\/projects\/.*\/databases\/.*\/documents\/.*/, // Firestore REST API
          /^\/google\.firestore\.v1beta1\.Firestore/, // Firestore WebChannel
          /^.*\.firebasestorage\.app\/_.*/, // Firebase Storage internal
          /^.*\.googleapis\.com\/.*/ // All Google APIs
        ],
        runtimeCaching: [
          // Firebase Storage images
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'firebase-storage',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          // Static images
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|gif|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-images',
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          // Fonts
          {
            urlPattern: /\.(?:woff|woff2|ttf|otf)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          // Firebase APIs - NetworkOnly to prevent interference
          {
            urlPattern: /^https:\/\/.*\.googleapis\.com\/.*/i,
            handler: 'NetworkOnly' // Never cache Firebase API calls
          },
          // App shell
          {
            urlPattern: /^https:\/\/my-wine-memory\.himazi\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'app-shell',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              }
            }
          }
        ],
        // オフライン機能の拡張
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true
      }
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Separate vendor chunks for better caching
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react-router-dom')) {
              return 'vendor-router';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            // Other third party libraries
            return 'vendor-other';
          }
          
          // Split app code by feature
          if (id.includes('/pages/')) {
            return 'pages';
          }
          if (id.includes('/services/')) {
            return 'services';
          }
          if (id.includes('/contexts/')) {
            return 'contexts';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
