// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Dominio de Producción para sitemap y SEO
  site: 'https://sodamaricela.com',

  vite: {
    plugins: [tailwindcss()]
  },

  // Integración para SEO y Multi-idioma
  integrations: [sitemap({
    i18n: {
      defaultLocale: 'es',
      locales: {
        es: 'es-CR',
        en: 'en-US',
      }
    }
  })],
  
  // En producción (Docker + Caddy), esto se ignora para el build estático,
  // pero es útil si corres 'npm run preview' localmente.
  server: {
    host: '0.0.0.0',
    port: 4323
  }
});
