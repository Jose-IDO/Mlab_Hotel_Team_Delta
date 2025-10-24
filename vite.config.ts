import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/Mlab_Hotel_Team_Delta/' : '/',
  server: {
    port: 3030
  }
}))