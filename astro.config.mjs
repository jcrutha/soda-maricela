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
      defaultLocale: 'es', // El idioma por defecto para el sitemap
      locales: {
        es: 'es-CR', // Español (Costa Rica)
        en: 'en-US', // Inglés (Estados Unidos)
      }
    }
  })],

  server: {
    host: '0.0.0.0',
    port: 4323, // Puerto fijo para evitar conflictos
  }
});
