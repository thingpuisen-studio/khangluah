---
title: "How Publishing Works and Going Live"
slug: "how-publishing-works-and-going-live"
subtitle: "What happens when you click publish and how updates appear to readers"
excerpt: "A factual guide explaining GitHub commits, Cloudflare Pages automated builds, edge caching, and browser refreshes."
date: "October 2026"
year: 2026
readingTime: "3 min read"
category: "Technical Guides"
postType: "essay"
authors: "H. Kapginlian"
language: "English"
languageFamily: "Tibeto-Burman"
articleLanguage: "English"
themeClass: "from-slate-950 via-blue-950 to-neutral-950 text-sky-100"
accentBarClass: "bg-sky-400"
coverImage: "/images/posts/library-archives-reading.webp"
featured: false
draft: false
tags:
  - "Publishing"
  - "Deployments"
  - "Website"
  - "Technical"
---

When you click **Publish** in the admin studio or save settings, your website goes through a fast automated publishing cycle. Here is an overview of what happens from the moment you click until readers see your new work on `lianhangluah.com`.

---

## 1. Committing to GitHub

When you click **Publish**:
1. The studio compiles your title, metadata, card styling, and body into a structured Markdown file with YAML frontmatter.
2. If you uploaded a new cover photo, the image file is pushed to `public/images/posts/` in the repository.
3. The studio calls the GitHub API and creates a new commit directly on the `main` branch of `thingpuisen-studio/khangluah`.
4. A green toast notification confirms: *Committed to GitHub! Cloudflare will deploy in ~60s.*

---

## 2. Automated Cloudflare Pages Build

Cloudflare Pages watches your GitHub repository for new commits:
1. Within seconds of the commit arriving on GitHub, Cloudflare starts an automated static build.
2. The build runs Astro, compiling all articles, poem typography, research monographs, and sitemaps into high-speed static HTML pages.
3. Once the build succeeds, Cloudflare distributes the updated pages across hundreds of edge data centers worldwide.
4. This entire process takes between 45 and 90 seconds.

---

## 3. Viewing Your Changes Live

Once the Cloudflare build finishes, your updates are live on `https://lianhangluah.com`.

If you visit the website immediately after publishing and do not see your changes yet, your device browser may still be holding a cached version of the page. You can bypass the cache:

- **On a Windows or Linux computer**: Press `Ctrl + Shift + R` (or `Ctrl + F5`).
- **On a Mac**: Press `Command + Shift + R`.
- **On a smartphone**: Swipe down firmly to refresh, or close and reopen the browser tab.

Your browser will download the fresh HTML from the network, displaying your newest writing and updated settings.
