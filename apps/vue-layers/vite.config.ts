import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    fs: {
      // Allow serving files from one level up from packages
      allow: ['..']
    }
  },
  resolve: {
    alias: {
      '/fabric-layers-core': path.resolve(__dirname, '../../packages/fabric-layers-core')
    }
  }
})