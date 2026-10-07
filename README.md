# H. Kapginlian - Website Guide and Publishing Manual

This repository contains the complete source code, writings, poems, and academic research papers for **H. Kapginlian's** official personal website.

Every time you add or edit a file on GitHub, Cloudflare Pages automatically detects the change, rebuilds the website, and publishes your updates to the live site within 1 to 2 minutes.

You do **not** need to install any software or use the command line. You can manage everything directly in your web browser through the GitHub website.

---

## Table of Contents

1. [Understanding How the Site Works](#1-understanding-how-the-site-works)
2. [How to Publish a New Poem](#2-how-to-publish-a-new-poem)
3. [How to Publish an Essay or Dispatch](#3-how-to-publish-an-essay-or-dispatch)
4. [How to Edit an Existing Post](#4-how-to-edit-an-existing-post)
5. [How to Delete a Post](#5-how-to-delete-a-post)
6. [How to Upload and Use Images](#6-how-to-upload-and-use-images)
7. [How to Update Your Bio, Photos, and Site Settings](#7-how-to-update-your-bio-photos-and-site-settings)
8. [Using the In-Browser CMS Studio](#8-using-the-in-browser-cms-studio)
9. [Important Rules for Non-Technical Editors](#9-important-rules-for-non-technical-editors)
10. [Developer Setup, Building, and Automated Testing](#10-developer-setup-building-and-automated-testing)

---

## 1. Understanding How the Site Works

- **Live Website:** `https://lianhangluah.com`
- **Contact Email:** `contact@lianhangluah.com`
- **Where your poems and essays live:**  
  Folder path: `src/content/posts/`  
  Every poem or essay is an individual file ending in `.md` (Markdown).
- **The Automatic Publishing Pipeline:**  
  When you click the green **Commit changes** button on GitHub, Cloudflare receives your update and publishes it to the web automatically. You do not need to press any separate deployment button.

---

## 2. How to Publish a New Poem

Follow these step-by-step instructions in your web browser:

### Step 1: Navigate to the Posts Folder
1. Go to your repository on GitHub: `https://github.com/thingpuisen-studio/khangluah`
2. Click on the folder **`src`**.
3. Click on the folder **`content`**.
4. Click on the folder **`posts`**.

### Step 2: Create a New File
1. Near the top right of the file list, click the **Add file** dropdown button.
2. Select **Create new file**.

### Step 3: Name Your File
In the box that says *Name your file...*, type a short, descriptive name using only lowercase letters and hyphens, ending with `.md`.

- Example: `hills-of-memory.md`
- Example: `monsoon-evening.md`

*(Note: Do not use spaces or capital letters in the file name).*

### Step 4: Copy and Paste the Poem Template
Copy the template below and paste it into the large text area:

```markdown
---
title: "Title of Your Poem"
slug: "title-of-your-poem"
subtitle: "A short one-line description of the mood or theme"
excerpt: "A two-sentence summary of the poem for previews and search."
date: "October 2026"
year: 2026
readingTime: "3 min read"
category: "Poetry & Literature"
postType: "poem"
authors: "H. Kapginlian"
language: "English"
languageFamily: "English Verse"
articleLanguage: "English"
tags:
  - Poetry
  - Nature
  - Memory
featuredCouplet: |
  Write two standout lines here that capture the heart of the poem.
  These lines appear in the highlighted quote card.
themeClass: "from-slate-950 via-purple-950 to-stone-950 text-purple-100"
accentBarClass: "bg-purple-500"
headerLabel: "POETIC VERSE"
formula: "la · hla"
formulaSub: "SIMTE VERSE • HIGHLAND CADENCE"
---

Write the first verse line here,  
Followed by the second line,  
And the third line of the first stanza.  

Leave a blank line between stanzas.  
Write the first line of the second stanza here,  
And continue writing your verses naturally.  

## Poet's Reflection

Write any background context, reflection, or note on where and why you composed this poem here.
```

### Step 5: Fill in Your Details
1. Replace `"Title of Your Poem"` with your actual title. Keep the quotes around it.
2. Replace `"title-of-your-poem"` with the matching lowercase slug.
3. Replace the date (e.g. `"November 2026"`).
4. In `featuredCouplet: |`, replace the two indented lines with your favorite couplet from the poem.
5. In the body below the second `---`, write your poem.
   - **Line break tip:** Add two spaces at the end of each poetic line before pressing Enter. This keeps lines closely grouped inside a stanza.
   - **Stanza break tip:** Press Enter twice to leave a completely blank line between stanzas.

### Step 6: Save and Publish
1. Click the green **Commit changes...** button at the top right of the page.
2. In the modal that appears, leave the default message or type: `feat: add new poem [title]`.
3. Click the green **Commit changes** button.
4. Your poem is now saved. Wait 60 to 90 seconds, and it will be live on the website under both the **Writing** feed and the **Poems** section!

---

## 3. How to Publish an Essay or Dispatch

Publishing an essay or cultural dispatch follows the same steps as a poem, but uses the essay template.

1. Navigate to `src/content/posts/` on GitHub.
2. Click **Add file** -> **Create new file**.
3. Name your file (e.g. `traditional-weaving-customs.md`).
4. Paste the following essay template:

```markdown
---
title: "Title of Your Essay"
slug: "title-of-your-essay"
subtitle: "A subtitle providing context on the topic"
excerpt: "A brief summary of the essay's core argument or field observations."
date: "October 2026"
year: 2026
readingTime: "6 min read"
category: "Indigenous Knowledge"
postType: "essay"
authors: "H. Kapginlian"
language: "Simte"
languageFamily: "Tibeto-Burman"
articleLanguage: "English"
tags:
  - Indigenous Knowledge
  - Oral Tradition
  - Field Notes
featuredCouplet: |
  Highlight a key sentence or philosophical statement from the essay here.
themeClass: "from-stone-900 via-stone-800 to-amber-950 text-amber-50"
accentBarClass: "bg-amber-600"
headerLabel: "FIELD DISPATCH"
formula: "simte · documentation"
formulaSub: "ORAL MEMORY • CULTURAL HERITAGE"
---

## Introduction Heading

Write your introductory paragraphs here. Paragraphs are separated by a regular blank line.

When an elder speaks of ancestral memory, the words carry both geography and history.

> Use a greater-than sign followed by a space to create a styled pull-quote callout box.

## Second Section Heading

Continue writing your observations, field narratives, or analysis.
```

5. Click **Commit changes...** -> **Commit changes**.

---

## 4. How to Edit an Existing Post

If you need to fix a typo, update a line, or change a date:

1. Go to `https://github.com/thingpuisen-studio/khangluah`.
2. Click **src** -> **content** -> **posts**.
3. Click the name of the file you want to edit (e.g. `tuithaphai-whispers-river-valley-verse.md`).
4. In the upper right of the file preview, click the **pencil icon** ("Edit this file").
5. Make your edits directly in the text editor.
6. When finished, click **Commit changes...** at the top right.
7. Click **Commit changes** to confirm.
8. The live site will reflect your edits within 1 to 2 minutes.

---

## 5. How to Delete a Post

If you want to permanently remove a post from the website:

1. Navigate to `src/content/posts/`.
2. Click the file you wish to delete.
3. In the upper right corner of the file preview, click the **three dots (...)** or the **trash can icon** ("Delete this file").
4. Scroll to the bottom and click **Commit changes...**.
5. Click **Commit changes**.
6. The post will be automatically removed from the Home feed, Writing feed, Poems page, and Archive.

---

## 6. How to Upload and Use Images

If you have author photos, field photographs, or cover images:

### Step 1: Upload the Image File
1. In your GitHub repository, go to **`public`** -> **`images`**.
2. Click **Add file** -> **Upload files**.
3. Drag and drop your image file from your computer (e.g. `village-fieldwork.jpg`).
4. Click the green **Commit changes** button.

### Step 2: Use the Image in Your Post
- **As a cover image:** In the YAML header of your post, set:
  ```yaml
  coverImage: "/images/village-fieldwork.jpg"
  ```
- **Inside the body of your essay:** Insert the standard Markdown image tag:
  ```markdown
  ![Photograph of elders in Thanlon village](/images/village-fieldwork.jpg)
  ```

---

## 7. How to Update Your Bio, Photos, and Site Settings

The site's global settings, author biography, profile photos, navigation, and social links are managed visually inside the **Site Settings Studio** at `/admin`.

You do not need to edit code files manually.

### How to Edit Settings in the CMS:
1. Open your browser and go to `/admin`.
2. Click the **Site Settings** tab in the top navigation bar.
3. The settings are organized page-by-page:
   - **Home Page Settings:**
     - **Profile Avatar:** Click **Upload New Photo** to upload a new portrait from your computer, or click **Choose from Asset Library** to pick an existing image. The live thumbnail preview updates instantly.
     - **Hero Short Bio:** Edit the concise bio shown on the home page hero section.
     - **Hero Metrics & Fieldwork Spotlight:** Adjust published counts, fieldwork highlight labels, interlinear gloss lines, and action buttons.
   - **About Page Settings:**
     - **About Portrait Photo:** Upload a new portrait photo or pick from the asset library with live thumbnail preview.
     - **Page Introductions:** Customize the eyebrow, title, and subtitle displayed at the top of the About page.
     - **Academic Qualifications & Full Bio:** Edit degrees, research areas, and write your full multi-paragraph biographical narrative.
   - **Header Navigation & Social Directory:** Toggle menu links, reorder tabs, or update social and academic directory links.
4. Click **Save All Settings**:
   - In local development, changes are saved directly to `src/data/siteConfig.ts` on disk.
   - On the web, if configured with your GitHub token, changes are synced directly to your GitHub repository.
   - You can also click **Copy siteConfig.ts** or **Download siteConfig.ts** at the bottom of the page.

*(Note for developers: You can still directly edit `src/data/siteConfig.ts` in your code editor if preferred).*

---

## 8. Using the In-Browser CMS Studio

Your website comes with a private, visual Content Studio at:  
`https://lianhangluah.com/admin` *(or `http://localhost:4321/admin` in local development)*

### Studio Features:
1. **Compose & Write:**
   - Select your content type: **Poem**, **Essay**, or **Academic Research Paper**.
   - Fill in metadata (title, slug, date, couplet, tags) with real-time typography and color gradient previews.
   - Write body content with Markdown formatting aids.
2. **Visual Asset Manager:**
   - Upload new image assets (JPEG, PNG, WebP) directly to `public/images/posts/`.
   - Browse existing images with visual thumbnails, search filtering, and one-click path copying.
3. **Site Settings Studio:**
   - Configure Home and About page text, profile and portrait photos, navigation order, and social links without writing code.
4. **Publish & Sync:**
   - Commit and push changes directly to GitHub via the GitHub API.
   - Copy or download `.md` content files and `siteConfig.ts`.

---

## 9. Important Rules for Non-Technical Editors

1. **Keep the three dashes `---` in place:**  
   The frontmatter metadata at the top of every post file must start with `---` on line 1 and end with `---` right before your body begins. Do not delete these dashes.
2. **Use quotes around text fields:**  
   If a title or subtitle contains a colon, comma, or apostrophe, ensure it is wrapped in double quotes (e.g. `title: "Aw Simlei: Traditional Simte Verses"`).
3. **Indentation matters in YAML:**  
   When writing `featuredCouplet: |` or `tags:`, make sure the lines underneath are indented by 2 spaces.
4. **No emojis in code or file names:**  
   To maintain the scholarly academic standard of the site, avoid inserting emojis into file names, titles, or commit messages.
5. **Always give Cloudflare 1-2 minutes:**  
   After you commit a change on GitHub, allow 60 to 90 seconds before refreshing your browser to view the update. If you don't see the change immediately, press `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac) to perform a hard refresh and clear your browser cache.

---

## 10. Developer Setup, Building, and Automated Testing

For developers and maintainers working with the codebase locally:

### Prerequisites
- [Bun](https://bun.sh) (v1.1 or later)
- Node.js (>=22.12.0)

### Local Development Server
Start the local Astro development server:
```bash
bun run dev
```
The site runs at `http://localhost:4321` and the CMS studio is accessible at `http://localhost:4321/admin`.

### Production Build
Generate the static production build:
```bash
bun run build
```

### Automated Testing

The repository maintains full automated test coverage comprising **494 tests** across unit, schema, static build, and Playwright browser suites.

Detailed test logs and architecture reports are maintained centrally in:
- [CMS Tab-by-Tab Coverage Report](tests/CMS_TAB_COVERAGE_REPORT.md) (429 Playwright E2E browser tests)
- [Unit, Schema & Smoke Test Report](tests/TEST_REPORT.md) (65 Bun unit & schema tests)

#### Unit & Schema Tests (65 tests)
```bash
bun test
```
Runs unit tests verifying URL utilities, Schema.org/JSON-LD graphs, academic monograph metadata, and production smoke tests.

#### Playwright E2E Test Suites (429 tests)

All suites can be run headed or headless (`HEADLESS=true`).

| Test Command | Test File | Description |
| :--- | :--- | :--- |
| `bun run test:settings-redesign` | `tests/playwright-settings-redesign.test.ts` | Page-centric Home/About settings, visual media pickers, asset modal, and local APIs |
| `bun run test:settings` | `tests/playwright-settings-tab.test.ts` | Core settings tab reordering, gloss, author details, and local storage |
| `bun run test:settings-edges` | `tests/playwright-settings-edge-cases.test.ts` | Corrupted JSON resilience, boundary guards, monotonic order, Unicode/IPA |
| `bun run test:e2e` | `tests/playwright-cms.test.ts` | End-to-end multi-tab CMS workflow test |
| `bun run test:write` | `tests/playwright-write-tab.test.ts` | Compose tab form fields, markdown formatting, and couplet callouts |
| `bun run test:write-edges` | `tests/playwright-write-edge-cases.test.ts` | Compose tab edge cases (XSS, unclosed fences, rapid input) |
| `bun run test:preview` | `tests/playwright-preview-tab.test.ts` | Card plate and live preview rendering |
| `bun run test:preview-edges` | `tests/playwright-preview-edge-cases.test.ts` | Live preview edge cases and clamping |
| `bun run test:catalog` | `tests/playwright-catalog-tab.test.ts` | Post catalog search, filters, and edit lifecycle |
| `bun run test:catalog-edges` | `tests/playwright-catalog-edge-cases.test.ts` | Catalog regex query safety, whitespace queries, deletion modals |
| `bun run test:assets` | `tests/playwright-assets-tab.test.ts` | Asset gallery uploads, WebP conversion, usage metrics |
| `bun run test:assets-edges` | `tests/playwright-assets-edge-cases.test.ts` | Asset gallery error handling, deletion protection guards |
| `bun run test:drafts` | `tests/playwright-drafts-tab.test.ts` | Local browser draft save, restore, and delete |
| `bun run test:drafts-edges` | `tests/playwright-drafts-edge-cases.test.ts` | Draft storage healing, corrupted JSON, large payloads |
| `bun run test:export` | `tests/playwright-export-tab.test.ts` | Ready-to-commit .md download and clipboard copy |
| `bun run test:export-edges` | `tests/playwright-export-edge-cases.test.ts` | Export YAML escaping, poem line break formatting |
