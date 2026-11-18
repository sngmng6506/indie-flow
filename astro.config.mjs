import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react(), sitemap()],
  site: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
  server: { host: '0.0.0.0' }
});
