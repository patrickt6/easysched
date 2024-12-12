import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from '@rollup/plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    commonjs({
      include: /node_modules/,
      requireReturnsDefault: 'auto'
    }),
    react()
  ],
  resolve: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'date-fns': ['date-fns/format', 'date-fns/parseISO', 'date-fns/isSameDay', 'date-fns/addDays', 'date-fns/addMonths']
        }
      }
    }
  }
})
