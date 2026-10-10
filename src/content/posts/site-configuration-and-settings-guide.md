---
title: "Site Configuration & Global Settings Guide"
slug: "site-configuration-and-settings-guide"
subtitle: "Technical documentation for updating author metadata, navigation orders, social handles, and siteConfig.ts"
excerpt: "Learn how the central siteConfig.ts file powers the website, and how to customize institutional affiliations, bios, and links in the Settings tab."
date: "October 2026"
year: 2026
readingTime: "6 min read"
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
  - "Configuration"
  - "Settings"
  - "Metadata"
  - "TypeScript"
  - "Navigation"
---

All site-wide metadata, author credentials, social links, and navigation tab orders are governed by a single configuration module located at `src/data/siteConfig.ts`. 

The **Site Settings Studio** inside the admin console (`/admin` -> **Site Settings** tab) provides a graphical, page-centric interface to modify these settings without touching code.

---

## 1. Structure of `siteConfig.ts`

The configuration object defines the core data model for the entire website:

- **`meta`**: Site title and global search engine meta description.
- **`author`**: Full name, academic title, institutional affiliation (e.g. *NEHU, Shillong*), location, degrees, profile avatar, about portrait, and biographical narratives.
- **`metrics`**: Key quantitative statistics displayed on the homepage hero (e.g., documented languages, research papers count).
- **`navigation`**: Top header navigation items with labels, destination routes, and active visibility toggles.
- **`fieldworkSpotlight`**: Spotlight card on the home page highlighting current fieldwork data with interlinear gloss units.
- **`socialLinks`**: Academic profiles (ORCID, Google Scholar, Academia.edu) and direct contact channels.
- **`pages`**: Custom banners and introductory text for the Research, Writing Feed, Poems, and Archive sections.
- **`footer`**: Copyright notices, linguistic documentation standards statement, and admin link visibility.

---

## 2. Page-Centric Studio Organization

The redesigned Site Settings Studio organizes editable properties into page-specific sections:

### 1. Home Page Settings
Contains all configurations affecting the landing page:
- **Profile Avatar Visual Picker**: Displays a live preview thumbnail of your current avatar image. Click **Upload New Photo** to select an image from your device (automatically saved to `public/images/posts/`), or click **Choose from Asset Library** to pick from existing media files using the modal picker.
- **Hero Short Bio**: The concise biographical introduction displayed directly in the hero banner.
- **Hero Statistics & Metrics**: Documented languages and research paper counts.
- **Action Buttons**: Primary and secondary call-to-action button labels and destination links.
- **Fieldwork Spotlight**: Featured linguistic fieldwork highlight, badge label, interlinear gloss lines (source text, grammatical gloss, free translation), and publication link.

### 2. About Page Settings
Contains all configurations governing the `/about` biography page:
- **About Portrait Photo Visual Picker**: Dedicated photo picker with live thumbnail preview for the large portrait on the About page. Supports direct file uploads and one-click selection from the Asset Library.
- **Page Introductions**: Eyebrow label, main title, and introductory subtitle.
- **Academic Qualifications & Degrees**: Formatted degrees and educational credentials.
- **Full Biographical Narrative**: Multi-paragraph narrative detailing research history, fieldwork expeditions, and community background.
- **Research Focus Areas**: Bulleted research pillars and linguistic specializations.

### 3. Header Navigation
- **Reordering Tabs**: Use the **Move Up** and **Move Down** buttons to swap navigation order in real time. Order badges adjust monotonically.
- **Visibility Toggles**: Checkboxes enable or disable specific menu items without deleting them.

### 4. Socials & Academic Directory
- Configure ORCID, Google Scholar, Academia.edu, ResearchGate, Twitter/X, Facebook, and institutional email links. Each profile can be individually enabled or disabled.

### 5. Other Page Headers
- Customize eyebrow labels, headings, and descriptions for the **Research**, **Writing Feed**, **Poems**, and **Archive** directory pages.

### 6. Footer Notices & Colophon
- Update copyright years, author notice, and the academic archiving statement.

### 7. GitHub Synchronization
- Connect a personal access token (PAT) to commit and push changes directly to the remote repository through the GitHub REST API.

### 8. Developer Export
- Generates live TypeScript code matching your updated settings in real time, with one-click **Copy siteConfig.ts** and **Download siteConfig.ts** buttons.

---

## 3. Direct Saving and Persistence

The redesigned studio eliminates the need to manually copy code into text editors:

### Direct Disk Persistence (Local Development)
When running the website locally (`http://localhost:4321`):
1. Make your changes in any section of the settings form.
2. Click **Save All Settings** in the top action bar.
3. The studio sends an HTTP POST request to `/api/save-config`, which overwrites `src/data/siteConfig.ts` directly on disk.
4. Uploaded photos are transmitted via `/api/save-asset` and saved directly into `public/images/posts/`.

### Direct GitHub Sync (Production / Web)
When using the CMS studio on the web:
1. Configure your GitHub Personal Access Token in the **GitHub Sync** section.
2. Clicking **Save All Settings** commits and pushes the updated `siteConfig.ts` directly to your GitHub repository via the GitHub REST API, triggering an automatic Cloudflare Pages deployment.

### Browser Local Storage Fallback
All customizations are also mirrored to browser `localStorage` under `hk_cms_site_config` so changes remain preserved across page reloads even if you haven't committed to git yet.

---

## 4. Resetting to Defaults

To discard customizations and restore the site configuration to its original codebase baseline, click **Reset to Defaults** in the top action bar. The studio purges local overrides, resets all form inputs, and restores `defaultSiteConfig`.
