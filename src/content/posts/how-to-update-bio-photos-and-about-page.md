---
title: "How to Update Your Bio, Photos, and About Page"
slug: "how-to-update-bio-photos-and-about-page"
subtitle: "Changing your personal profile, credentials, and story across the site"
excerpt: "A factual guide on using the Site Settings Studio to edit author identity, home hero avatars, about portraits, navigation, and social links."
date: "October 2026"
year: 2026
readingTime: "4 min read"
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
  - "Bio"
  - "Profile"
  - "About Page"
  - "Settings"
---

All site-wide metadata, author information, social links, and page headers are managed in the **Settings** tab (`tab-site-config`) inside the admin studio.

The Settings panel features a sticky sidebar on desktop (and a quick jump bar on mobile) that lets you navigate through each section:
1. Home Page
2. About Page
3. Header & Menu
4. Social Links
5. Footer & Notices
6. Other Page Headers
7. GitHub & Sync
8. Developer Export

---

## 1. Home Page Settings & Identity

This section governs the hero introduction on the main landing page:

- **Profile Picture (Avatar)**: View the circular avatar preview. Click **Upload New Photo** to upload a new picture directly from your device, or click **Choose from Asset Library** to select any photo already in the repository.
- **Author Identity**: Enter your *Full Name* (`H. Kapginlian`), *Short / Brand Name*, *Academic Title*, *Affiliation* (`NEHU, Shillong`), and *Location*.
- **Home Page Hero Short Bio**: The introductory blurb displayed under your photo.
- **Hero Metrics**: Configure the two highlight statistics (such as *Papers Count* and *Languages Documented*).
- **Hero Action Buttons**: Set the text and links for the primary and secondary call-to-action buttons.
- **Fieldwork Spotlight Card**: An interactive interlinear gloss card displayed on the home page. You can toggle this on or off, edit the badge label, enter four word pairs (Source morpheme and gloss annotation), and provide a free English translation.

---

## 2. About Page Settings & Biography

This section controls the content displayed at `/about`:

- **Portrait Photo**: View the portrait preview. Use **Upload New Portrait** or **Choose from Asset Library** to pick your picture.
- **Page Header**: Adjust the eyebrow, title, and tagline banner.
- **Academic Qualifications & Degrees**: List your formal degrees and honors.
- **Full Biography**: Write your complete narrative story. You can write multiple paragraphs; leave a blank line between paragraphs to create breaks.
- **Research & Specialization Areas**: Enter comma-separated topics (for example: `Tibeto-Burman Linguistics, Morphosyntax, Typology, Oral Traditions`).

---

## 3. Header Navigation and Social Links

- **Header & Menu**: View the 7 navigation items. You can edit their display labels, adjust their destination URLs, and toggle individual items on or off.
- **Social & Academic Directory**: Manage up to 8 social and academic profiles (including Google Scholar, ORCID, Academia.edu, GitHub, and email). Toggle profiles active or inactive with a single switch.

---

## 4. Saving and Committing Changes

When you make changes in the Settings tab:

1. Click the black **Save & Commit Changes** button in the top action bar.
2. If you are developing locally, the studio saves your configuration directly to `src/data/siteConfig.ts` on disk.
3. If connected to GitHub, the studio commits your updated configuration to the repository.
4. If you ever make an error, click **Reset Defaults** to restore the factory configuration settings.
