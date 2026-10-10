---
title: "How to Upload and Manage Photos"
slug: "how-to-upload-and-manage-photos"
subtitle: "Using the Asset Library to add images from your phone or computer"
excerpt: "A factual guide on using the Assets tab, automatic client-side WebP conversion, referencing images in posts, and deletion safety guards."
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
  - "Photos"
  - "Assets"
  - "Images"
  - "Media"
  - "Admin"
---

The **Assets** tab in the admin studio gives you full control over all photographs, portraits, and article graphics stored in your website repository (`public/images/posts/`).

---

## Automatic WebP Conversion and Uploading

Modern camera photos can be several megabytes in size, which slows down page loading. The admin studio includes a **Client-Side WebP Converter & Uploader** that processes your photos directly in your browser before committing them.

### How to upload an image:
1. Click the **Assets** tab in the top navigation bar.
2. In the dashed dropzone card, either:
   - Click to browse your device for a file (JPEG, PNG, HEIC, or WebP).
   - Or drag and drop an image file directly onto the dropzone.
3. The studio automatically resizes the image (max width 1400px), converts it to WebP at 0.85 quality, and shows a preview with the estimated file size.
4. You can adjust the suggested filename in the `/images/posts/` box.
5. Click **Commit WebP to GitHub**.

The converted image is saved directly into the repository media folder and becomes available across the entire site immediately.

---

## Browsing and Filtering the Media Library

Below the uploader, you will find search and filtering tools:
- **Search bar**: Filter images by filename or by the titles of the articles where they appear.
- **Filter pills**:
  - **All**: Shows every image in the repository.
  - **In Use**: Shows only pictures currently referenced in published posts, monographs, or site templates.
  - **Unused**: Shows images not referenced anywhere.

---

## Copying Image Links into Posts

Under every asset card in the gallery:
- Click **Copy Markdown** to copy a formatted image tag (such as `![Description](/images/posts/photo.webp)`).
- Switch to the **Write** tab and paste it directly into your article text wherever you want the picture to appear.

---

## Deletion Safety Guards

To protect your site from broken images, the Asset Library includes safety guards:
- If an image is currently used in an active post, the red delete button opens an alert modal showing the exact articles referencing that image. Deletion is blocked until you replace or remove the photo reference from those articles.
- If an image is verified as unused across all publications, clicking the delete button will ask for confirmation and remove the file cleanly from the repository.
