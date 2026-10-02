import type { APIRoute } from 'astro';
import { samplePosts, getPostUrl } from '../data/posts';

export const GET: APIRoute = async () => {
  const siteUrl = 'https://lianhangluah.com';

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/research', priority: '0.9', changefreq: 'weekly' },
    { url: '/feed', priority: '0.8', changefreq: 'weekly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/poems', priority: '0.7', changefreq: 'monthly' },
    { url: '/archive', priority: '0.6', changefreq: 'weekly' },
    { url: '/socials', priority: '0.5', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
  ];

  const postPages = samplePosts.map((post) => ({
    url: getPostUrl(post),
    priority: post.postType === 'academic_paper' ? '0.9' : '0.7',
    changefreq: 'monthly',
  }));

  const allUrls = [...staticPages, ...postPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
