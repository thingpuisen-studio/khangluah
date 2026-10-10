---
title: "Exporting Files and Backing Up Content"
slug: "exporting-files-and-backing-up-content"
subtitle: "How to download raw Markdown files, copy siteConfig.ts, and keep offline backups"
excerpt: "A factual guide explaining the Export .md tab, downloading site configuration, and keeping offline backups of your work."
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
  - "Backup"
  - "Export"
  - "Markdown"
  - "Maintenance"
  - "Admin"
---

The admin studio never locks your writing inside a proprietary database. Everything you write compiles into standard text files and TypeScript modules that you can inspect, copy, or download at any time.

---

## 1. Exporting Markdown Posts (`tab-code`)

Whenever you compose an essay, poem, or research paper in the **Write** tab, the studio generates a clean, ready-to-commit Markdown file with complete YAML frontmatter.

To export your post:
1. Click the **Export .md** tab in the top navigation bar (or click **Export .md** at the bottom of the Write form).
2. The code window displays the complete generated file, including your metadata headers (title, date, tags, card themes, and tailored fields) and the body text.
3. You have two export actions:
   - **Copy Markdown**: Copies the entire file text to your clipboard so you can paste it into an email or external text editor.
   - **Download .md**: Downloads the file directly to your device (named according to your slug, such as `my-new-poem.md`).

You can keep these downloaded files in your personal archives or Google Drive as an extra offline backup.

---

## 2. Exporting Site Configuration (`src/data/siteConfig.ts`)

All global site settings (including your home page bio, about story, degrees, metrics, social directory, and header tab orders) can also be exported as raw code.

To export your site configuration:
1. Open the **Settings** tab.
2. In the left navigation menu, click **Developer Export** (`#sec-cfg-export`).
3. The preview box generates the complete TypeScript module for `src/data/siteConfig.ts`.
4. Click **Copy File** to copy the code to your clipboard, or click **Download** to save the file to your computer.

---

## 3. Full Repository Backups

Because the entire website is hosted in the GitHub repository (`thingpuisen-studio/khangluah`), every commit you make creates a permanent, version-controlled backup.

- If you ever make a change by accident, GitHub retains the full revision history.
- You can clone or download a complete zip archive of the website at any time from GitHub, ensuring your poems, monographs, and research dispatches remain permanently preserved.
