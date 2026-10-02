import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://hkhangluah.pages.dev',
  base: '/',
  redirects: {
    '/feed/pronouns-in-simte-pro-drop-emphatic': '/research/pronouns-in-simte-pro-drop-emphatic',
    '/feed/gender-marking-in-simte-human-animal': '/research/gender-marking-in-simte-human-animal',
    '/feed/numerals-kaipeng-simte-comparative': '/research/numerals-kaipeng-simte-comparative',
    '/feed/advent-of-christianity-simte-oral-history': '/research/advent-of-christianity-simte-oral-history',
  },
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
