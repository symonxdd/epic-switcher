import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { version } from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // define: {
  //   'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
  // },
  define: {
    __APP_VERSION__: JSON.stringify(version)
  },
})
