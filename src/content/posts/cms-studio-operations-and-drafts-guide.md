---
title: "CMS Studio Operations & Dual-Mode Draft Architecture"
slug: "cms-studio-operations-and-drafts-guide"
subtitle: "A technical maintenance manual for managing content, Git commits, local storage drafts, and live deployments"
excerpt: "A deep dive into how the CMS Studio connects to GitHub, manages local and remote drafts, and deploys updates to Cloudflare Pages."
date: "October 2026"
year: 2026
readingTime: "8 min read"
category: "Technical Guides"
postType: "essay"
authors: "H. Kapginlian"
language: "English"
languageFamily: "Tibeto-Burman"
articleLanguage: "English"
themeClass: "from-stone-900 via-stone-800 to-stone-900 text-stone-100"
accentBarClass: "bg-emerald-500"
coverImage: "/images/posts/linguistic-fieldwork-notes.webp"
featured: true
draft: false
tags:
  - "CMS"
  - "Operations"
  - "GitHub"
  - "Cloudflare"
  - "Architecture"
---

The CMS Studio provides a direct, serverless bridge between your web browser and the GitHub repository hosting this website. Unlike traditional database-backed CMS platforms like WordPress or Drupal, this site uses Git as its single source of truth.

This technical guide explains how content is created, saved, versioned, and deployed across the static architecture.

---

## 1. Technical Architecture Overview

Every publication on this site is stored as a Markdown file with structured YAML frontmatter inside the repository:

- **Essays, Guides, & Poems**: Located in `src/content/posts/*.md`.
- **Peer-Reviewed Academic Monologues**: Located in `src/data/posts/*.ts`.
- **Media Assets**: Stored in `public/images/posts/`.
- **Hosting & CI/CD**: Cloudflare Pages monitors the `main` branch of `thingpuisen-studio/khangluah`. When a new commit is detected, Cloudflare executes `astro build` and deploys the generated static HTML across its global edge network in ~60 seconds.

```text
Browser CMS Studio
  ├── Local Browser Cache (localStorage: "hk_cms_drafts")
  └── GitHub REST API (Contents API: PUT / DELETE)
        └── Git Repository (branch: "main")
              └── Cloudflare Pages CI/CD Pipeline
                    └── Live Website (lianhangluah.com)
```

---

## 2. The Three Save Modes: SPADTLS, SPADIRR & Publish

To give editors flexibility while avoiding accidental live publishing, the CMS Studio implements three distinct operational buttons:

### SPADTLS (Save Post as Draft to Local Storage)
- **Keyboard Shortcut**: Also accessible at the bottom of the composer.
- **Mechanism**: Serializes the current article (title, slug, metadata, category, body) into browser `localStorage` under the key `hk_cms_drafts`.
- **Network Footprint**: Zero network requests. It works completely offline without internet or GitHub credentials.
- **Retrieval**: Stored drafts appear in the **Drafts** tab with precise timestamps. Clicking **Load Draft** restores all form fields instantly.

### SPADIRR (Save Post as Draft in Remote Repo)
- **Mechanism**: Formats the post with `draft: true` in the YAML frontmatter and commits the `.md` file directly to `src/content/posts/[slug].md` via the GitHub REST API.
- **Git Commit Message**: `draft(content): save draft [title] (SPADIRR)`.
- **Public Visibility**: The data layer (`src/data/posts.ts`) automatically filters out any post where `draft === true`. The article is completely hidden from the homepage feed, archive pages, and RSS feeds.
- **Studio Catalog**: In the CMS Studio catalog, remote drafts are displayed with an amber `Draft (Remote)` badge, allowing the author to continue writing across different computers.

### Publish (Deploy to Live Site)
- **Mechanism**: Commits the Markdown file to GitHub with `draft: false`.
- **Git Commit Message**: `feat(content): publish [title]`.
- **Result**: Cloudflare Pages begins building immediately, and the article becomes live to public visitors worldwide within one to two minutes.

---

## 3. Editing and Updating Published Content

To modify an existing article:

1. Open the **Catalog** tab.
2. Search for the post by title or slug using the instant search bar.
3. Click **Edit**. The studio populates the writer form with the post's existing title, metadata, category, accent bar class, and Markdown body.
4. Make your desired adjustments.
5. Review changes in the **Preview** tab.
6. Click **Publish** to commit the updated file to GitHub.

---

## 4. Deleting Articles Safely

When an article must be removed:

1. In the **Catalog** tab, locate the post and click **Delete**.
2. A confirmation modal appears showing the target repository path (e.g. `src/content/posts/slug.md`).
3. Confirming deletion executes a `DELETE` request to the GitHub Contents API using the file's current SHA hash.
4. The local catalog view updates immediately, and GitHub records the deletion, triggering an automatic Cloudflare rebuild.

---

## 5. Authentication & Permission Verification

The CMS Studio communicates with GitHub using a GitHub OAuth token or a fine-grained Personal Access Token (PAT):

- **Repository Permissions**: The token must possess `Contents: Read and write` access on `thingpuisen-studio/khangluah`.
- **Verify Button**: Located in the top header brand line. Clicking **Verify** tests both token validity and write permission against the repository, confirming that your environment is ready to commit files without permission errors.
