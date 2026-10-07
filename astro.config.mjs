import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import fs from 'node:fs';
import path from 'node:path';

function localCmsPlugin() {
  return {
    name: 'local-cms-writer',
    configureServer(server) {
      server.middlewares.use('/api/save-config', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { code } = JSON.parse(body);
              if (typeof code === 'string' && code.includes('export const siteConfig')) {
                fs.writeFileSync(path.resolve(process.cwd(), 'src/data/siteConfig.ts'), code, 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, path: 'src/data/siteConfig.ts' }));
                return;
              }
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid configuration payload' }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
        res.statusCode = 404;
        res.end();
      });

      server.middlewares.use('/api/save-asset', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { filename, base64 } = JSON.parse(body);
              if (filename && base64) {
                const buffer = Buffer.from(base64, 'base64');
                const targetDir = path.resolve(process.cwd(), 'public/images/posts');
                if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
                const filePath = path.join(targetDir, filename);
                fs.writeFileSync(filePath, buffer);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, path: `/images/posts/${filename}` }));
                return;
              }
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing filename or base64 data' }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
        res.statusCode = 404;
        res.end();
      });
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://lianhangluah.com',
  base: '/',
  redirects: {
    '/feed/pronouns-in-simte-pro-drop-emphatic': '/research/pronouns-in-simte-pro-drop-emphatic',
    '/feed/gender-marking-in-simte-human-animal': '/research/gender-marking-in-simte-human-animal',
    '/feed/numerals-kaipeng-simte-comparative': '/research/numerals-kaipeng-simte-comparative',
    '/feed/advent-of-christianity-simte-oral-history': '/research/advent-of-christianity-simte-oral-history',
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss(), localCmsPlugin()],
  },
});
