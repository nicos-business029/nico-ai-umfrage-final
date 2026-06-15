import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// Cloudflare Pages liefert direkt unter der Wurzel der Adresse aus.
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      // GitHub Pages hat kein SPA-Routing: 404.html = index.html, damit
      // direkte Aufrufe/Neuladen von /interview, /danke usw. funktionieren.
      name: 'spa-404-fallback',
      closeBundle() {
        const dist = resolve(process.cwd(), 'dist')
        const index = resolve(dist, 'index.html')
        if (existsSync(index)) copyFileSync(index, resolve(dist, '404.html'))
      },
    },
  ],
})
