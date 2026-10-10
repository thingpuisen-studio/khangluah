---
title: "How to Add and Publish Posts"
slug: "how-to-add-and-publish-posts"
subtitle: "Step-by-step instructions for writing and publishing new content"
excerpt: "A factual guide on using the Write tab, setting publication types, styling cards, composing with the markdown toolbar, and publishing live."
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
  - "Publishing"
  - "Writing"
  - "Tutorial"
  - "Admin"
---

The **Write** tab is where you create and edit all content for the website. Here is how to complete each section of the form.

---

## Step 1: Choose the Publication Type

At the top of the Write tab, click one of the three pills:
- **Poem**
- **Essay / Dispatch**
- **Research Paper**

Selecting a pill updates the form with the relevant fields for that content format.

---

## Step 2: Fill in Title, Slug, and Metadata

- **Title**: Enter the headline for your piece.
- **Slug (URL identifier)**: Generated automatically from your title (for example, `whispers-high-mountains`). You can adjust this text if you prefer a different web address.
- **Subtitle / Summary Excerpt**: A brief overview that appears on the article card and under the title on the reading page.
- **Category, Date & Reading Time**: Enter your chosen category (such as *Poetry & Literature* or *Linguistics*), date (for example, *October 2026*), and estimated reading time (such as *3 min read*).
- **Tags**: Enter comma-separated keywords (for example: `Simte, Field Notes, Oral History`).

---

## Step 3: Choose Cover Images and Card Plate Styling

### Cover Image
- Type an existing path (such as `/images/posts/photo.webp`).
- Or click **Upload Device Image** to select a photo from your computer or phone. The editor creates an instant preview thumbnail.

### Card Plate Styling
Under **Preview Card Styling & Colors**, you can customize how the article card appears in listings:
- **Top Tip / Spine Color**: Click any color swatch (Purple, Amber, Blue, Emerald, Rose, Sky) to color the accent stripe along the top edge of the card.
- **Card Background Gradient Theme**: Click a background tile (such as *Poetic Violet*, *Ocean Indigo*, *Emerald Forest*, or *Midnight Slate*) to set the card atmosphere.
- Watch the **Live Card Simulation** box on the right side of the screen update in real time.

---

## Step 4: Write in the Composer

Below the tailored fields, you will find the main text composer:

### Quick Markdown Toolbar
Above the text area, use the toolbar buttons for instant formatting:
- **B**: Bold text (`**text**`)
- **I**: Italic text (`*text*`)
- **H2 & H3**: Section headers (`##` and `###`)
- **Quote**: Blockquote formatting (`>`)
- **List**: Bulleted list items (`-`)
- **Stanza Break**: Horizontal divider (`---`)
- **↵ Verse Break**: Inserts a markdown hard line break (`  \n`) so poetry verses break to the next line without extra spacing.
- **Image**: Prompts for an image URL and caption, then inserts an image tag.

---

## Step 5: Save or Publish

At the bottom of the form (and in the top-right action bar), you have several options:

- **Live Preview →**: Switches to the **Preview** tab to review the rendered article and full card styling.
- **SPADTLS (Save Draft to Local Storage)**: Saves the entire form safely in your browser without touching the public website.
- **SPADIRR (Save Draft in Remote Repo)**: Commits the post directly to GitHub with `draft: true`. Your draft is preserved in repository version control, but hidden from public visitors.
- **Publish**: Commits the post to GitHub with `draft: false`. This triggers a live deployment to `lianhangluah.com`.
