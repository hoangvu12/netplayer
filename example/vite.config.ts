import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['netplayer']
  },
  build: {
    commonjsOptions: { exclude: ['netplayer'], include: [] }
  },
  server: {
    watch: {
      ignored: ['!**/node_modules/netplayer/**']
    }
  }
})
