import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from '@rollup/plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    commonjs({
      include: /node_modules/,
    }),
    react()
  ],
  resolve: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc'
    }
  },
  optimizeDeps: {
    include: ['date-fns']
  }
})
