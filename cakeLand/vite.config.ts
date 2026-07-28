import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Split the heavy third-party code out of the app chunk so a change to a
    // component doesn't invalidate the whole ~1 MB bundle in users' caches.
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'vendor-ui': [
            '@fortawesome/react-fontawesome',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/free-brands-svg-icons',
            'react-hot-toast',
            'react-slideshow-image',
          ],
        },
      },
    },
  },
})
