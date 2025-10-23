import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Mlab_Hotel_Team_Delta/',
  server: {
    port: 3030
  }
})