---
title: "How to Edit or Delete Published Posts"
slug: "how-to-edit-or-delete-published-posts"
subtitle: "Using the Catalog tab to fix typos, update information, or remove older posts"
excerpt: "A factual guide to searching published works, editing existing articles, and deleting files via the admin Catalog."
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
  - "Catalog"
  - "Editing"
  - "Maintenance"
  - "Admin"
---

The **Catalog** tab in the admin studio displays all published poems, essays, research papers, and technical guides on your website.

---

## Searching and Browsing the Catalog

1. Click the **Catalog** tab in the top navigation bar.
2. The badge next to the tab name shows the total number of works (for example, `Catalog (18)`).
3. In the top search bar, type any word to instantly filter posts by title or slug identifier.

Each entry displays its title, publication type badge, publication date, and target file path.

---

## How to Edit an Existing Post

To fix a typo, add a new stanza, or revise an academic citation:

1. Find the article in the Catalog list.
2. Click the **Edit** button on that item.
3. The studio automatically loads all of the post data into the **Write** tab:
   - Publication type, title, subtitle, and slug
   - Category, date, reading time, and tags
   - Tailored poem, essay, or research fields
   - Card colors and background gradient theme
   - Full body markdown text
4. Make your corrections in the form.
5. Click **Publish** (or **SPADIRR** if you want to keep changes as a draft).
6. The updated content is committed back to GitHub, updating the live website.

---

## How to Delete a Post

If you need to permanently remove a post from your website:

1. In the Catalog tab, find the item you want to remove.
2. Click the red **Delete** button next to it.
3. A confirmation modal will appear showing the post title and the target repository file path (such as `src/content/posts/example.md`).
4. Click **Delete Post** in the modal.

When confirmed, the studio calls the GitHub API to delete the file from the repository and removes the article from the live catalog view immediately.
