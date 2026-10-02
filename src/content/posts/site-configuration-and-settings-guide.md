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

The **Settings** tab in the CMS Studio provides a graphical interface to modify these settings in real time.

---

## 1. Structure of `siteConfig.ts`

The configuration object defines the core data model for the entire website:

- **`meta`**: Site title and global search engine meta description.
- **`author`**: Full name, academic title, institutional affiliation (e.g. *NEHU, Shillong*), location, degrees, and bio paragraphs.
- **`metrics`**: Key quantitative statistics displayed on the homepage (e.g., number of documented languages, research papers count).
- **`navigation`**: Top header navigation items with labels, destination routes, and active visibility toggles.
- **`fieldworkSpotlight`**: Spotlight card on the home page highlighting current fieldwork data with interlinear gloss units.
- **`socialLinks`**: Academic profiles (ORCID, Google Scholar, Academia.edu) and direct contact channels.
- **`footer`**: Copyright notices, linguistic documentation standards statement, and admin link visibility.

---

## 2. Using the Two-Column Settings Studio

The **Settings** tab features a Master-Detail layout designed for easy navigation across extensive configurations:

### Sticky Section Index (Left Column)
Clicking any link in the index navigates smoothly to that section:
- **Navigation**: Toggle visibility or change tab labels.
- **Author**: Edit academic title, degrees, short bio, and research specializations.
- **Spotlight**: Configure featured fieldwork gloss units.
- **Socials**: Update ORCID identifiers, GitHub profile, and institutional email.
- **Pages**: Edit custom header banners across Feed, Research, and Archive.
- **Footer**: Modify copyright lines and documentation standards notices.
- **GitHub**: Manage repository tokens and test push permissions.
- **Export**: Real-time TypeScript code preview.

---

## 3. Saving Changes: Local Overrides vs Repository Commit

The Settings studio provides two options for saving changes:

### Save Locally (Browser Cache)
Clicking **Save Settings Locally** writes the entire configuration object to browser `localStorage` (`hk_cms_site_config`). This is ideal for testing customizations on your computer without modifying repository files.

### Exporting `siteConfig.ts` to the Repository
To make your settings permanent for all visitors:
1. Scroll to the **Export & Synchronize** section at the bottom of the Settings tab.
2. The code block displays the generated TypeScript code matching your updated settings.
3. Click **Copy Code** or **Download siteConfig.ts**.
4. Commit the updated `src/data/siteConfig.ts` file to your GitHub repository to trigger a Cloudflare rebuild.

---

## 4. Resetting to Defaults

If you make unwanted changes or wish to discard local overrides, click **Reset to Defaults** in the top action bar of the Settings tab. The studio clears browser storage overrides and re-synchronizes with the repository's original `defaultSiteConfig`.
