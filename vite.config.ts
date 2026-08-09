import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' keeps all asset URLs relative, so the site works whether it is
// served from a custom domain root (ernterechner.com) or a GitHub Pages
// project path (…github.io/ernterechner.com/). Routing is hash-based.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
