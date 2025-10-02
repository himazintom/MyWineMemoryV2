import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectRegister: 'auto',
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
      }
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false, // Don't open automatically in CLI
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // Use treemap for better visualization
    })
  ],
  build: {
    rollupOptions: {
      output: {
        // CRITICAL: Bundle React + ALL React-dependent libraries in ONE chunk
        // This prevents "Cannot read properties of undefined (reading 'createContext')" errors
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // React + ALL dependent libraries MUST be in the same chunk
            if (id.includes('react') ||
                id.includes('react-dom') ||
                id.includes('react-router') ||
                id.includes('scheduler') ||
                id.includes('framer-motion') ||
                id.includes('motion-dom') ||
                id.includes('motion-utils') ||
                id.includes('chart.js') ||
                id.includes('react-chartjs-2') ||
                id.includes('@sentry')) {
              return 'vendor-react';
            }
            // Firebase has no dependencies on React
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            // Other truly independent libraries (idb, @kurkle/color, etc.)
            return 'vendor-other';
          }

          // Split app code by feature for better lazy loading
          if (id.includes('/pages/')) {
            // Individual page chunks for optimal lazy loading
            if (id.includes('Home.tsx')) return 'page-home';
            if (id.includes('SelectWine.tsx') || id.includes('AddTastingRecord.tsx')) return 'page-wine-recording';
            if (id.includes('Records.tsx') || id.includes('WineDetail.tsx')) return 'page-wine-viewing';
            if (id.includes('Quiz.tsx') || id.includes('QuizGame.tsx')) return 'page-quiz';
            if (id.includes('Stats.tsx') || id.includes('Profile.tsx')) return 'page-user';
            return 'pages';
          }
          if (id.includes('/services/')) {
            // Separate core services from specialized ones
            if (id.includes('firebase.ts') || id.includes('auth')) return 'services-core';
            if (id.includes('wine') || id.includes('tasting')) return 'services-wine';
            return 'services';
          }
          if (id.includes('/contexts/')) {
            return 'contexts';
          }
          if (id.includes('/components/')) {
            // Keep frequently used components in main bundle
            if (id.includes('BottomNavigation') || id.includes('LoadingSpinner') || id.includes('ErrorMessage')) {
              return undefined; // Include in main bundle
            }
            return 'components';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Additional build optimizations
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console.log for debugging
        drop_debugger: true,
      },
    }
  }
})
