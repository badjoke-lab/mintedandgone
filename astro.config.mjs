import { defineConfig } from 'astro/config';

const site = process.env.PUBLIC_SITE_URL ?? 'https://mag.badjoke-lab.com';

export default defineConfig({
  output: 'static',
  site
});
