---
title: "What is a CMS and How to Access It"
slug: "what-is-a-cms-and-how-to-access-it"
subtitle: "A simple guide to the website control panel and how to log in"
excerpt: "Learn what a content management system is, how to open the admin panel on your phone or computer, and how it connects to GitHub."
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
  - "CMS"
  - "Admin"
  - "Beginner"
  - "Guide"
---

## What a CMS is

CMS stands for Content Management System. It is the private control panel for your website.

Without a CMS, publishing a new poem or updating your biography would require writing raw code and manually editing configuration files. The CMS provides a clean visual workspace where you fill out forms, paste your text, and click buttons. The system handles all file formatting and technical steps behind the scenes.

Your website has a dedicated control studio called **Admin CMS Studio**. It works in any standard web browser on desktop, tablet, and mobile.

---

## How to open the admin panel

1. Open your web browser (such as Chrome, Safari, or Firefox).
2. Type `https://lianhangluah.com/admin` in the browser address bar (or `http://localhost:4321/admin` when working locally).
3. Press Enter.

---

## Signing into the studio

The admin console connects directly to the site repository (`thingpuisen-studio/khangluah`). To protect your website from unauthorized changes, direct publishing and deletions require GitHub authentication.

When you open `/admin`:
- You will see the **Admin CMS Studio** sign-in screen.
- Click the black **Sign In with GitHub** button.
- Authorize your account in the GitHub prompt. Once connected, your browser saves your session and unlocks the studio dashboard.
- If you are running the site on your own computer for local testing, a dashed gold button labeled `[Localhost Detected: Unlock Studio for Testing]` will appear so you can test without signing into GitHub.

At the top of the screen, a green indicator dot confirms that you are connected.

---

## The studio workspace tabs

Across the top navigation bar (and along the bottom dock on mobile phones), you will find seven workspace tabs:

- **Write**: The composer where you write, style, and publish new poems, essays, or research papers.
- **Preview**: A full simulation showing how your current piece will look with live fonts, colors, and styling before you publish.
- **Catalog**: A searchable library of all published works on your site, where you can reopen pieces to edit them or delete them.
- **Assets**: A media gallery where you can drop photos to convert them automatically to lightweight WebP images, upload them to the repository, and copy markdown image tags.
- **Drafts**: A list of unfinished posts saved directly to your browser so you can resume writing anytime.
- **Export .md**: A view showing the raw markdown file with its frontmatter, ready to copy or download as a `.md` file.
- **Settings**: A comprehensive control room for your home hero avatar, about portrait, full biography, social profiles, and site texts.

When you finish working on a shared computer, click the **Sign Out** button in the top right corner.
