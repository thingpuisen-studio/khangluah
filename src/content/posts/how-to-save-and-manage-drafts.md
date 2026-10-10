---
title: "How to Save and Manage Drafts"
slug: "how-to-save-and-manage-drafts"
subtitle: "Saving your work in progress and continuing later without losing text"
excerpt: "Learn the difference between local browser drafts (SPADTLS) and remote repository drafts (SPADIRR), and how to manage them."
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
  - "Drafts"
  - "Writing"
  - "Workflow"
  - "Admin"
---

Writing a detailed paper or translating poetry often takes several sessions. The admin studio provides two distinct draft methods to preserve your work in progress:

1. **Local Browser Drafts (SPADTLS)**
2. **Remote Repository Drafts (SPADIRR)**

Understanding both options ensures you never lose work.

---

## 1. Local Browser Drafts (SPADTLS)

**SPADTLS** stands for *Save Post as Draft to Local Storage*.

- **What it does**: Saves your title, summary, metadata, tailored fields, card colors, and full text directly inside your browser storage (`localStorage`).
- **How to save**: Click the **SPADTLS** button in the top action bar or at the bottom of the Write form.
- **Where to find them**: Click the **Drafts** tab in the main navigation. The tab badge displays how many drafts are stored (such as `Drafts (2)`).
- **Resuming writing**: Click **Load Draft** on any entry. The studio switches back to the Write tab with all your text and settings restored.
- **Privacy**: Local drafts exist only on your current device and browser. Visitors cannot see them, and no commits are made to GitHub.

---

## 2. Remote Repository Drafts (SPADIRR)

**SPADIRR** stands for *Save Post as Draft in Remote Repo*.

- **What it does**: Commits the markdown file directly to GitHub with `draft: true` in its frontmatter.
- **Why use this**: If you want to switch between your phone and your computer, or if you want your unfinished writing backed up to GitHub without showing it to public readers.
- **How to save**: Click the indigo **SPADIRR** button in the top action bar or at the bottom of the form.
- **Public visibility**: Because the post has `draft: true`, it is completely hidden from public listings, feeds, and the archive. Only you can see and edit it inside the studio.

---

## Deleting Drafts

When you publish a post or no longer need an unfinished draft:
- In the **Drafts** tab, click the **Delete** button next to that draft card.
- The item is removed from your browser storage.
