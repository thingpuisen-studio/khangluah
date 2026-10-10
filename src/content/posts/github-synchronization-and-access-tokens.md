---
title: "GitHub Synchronization and Personal Access Tokens"
slug: "github-synchronization-and-access-tokens"
subtitle: "How the website connects to GitHub, OAuth authentication, and using personal access tokens"
excerpt: "A factual guide explaining GitHub integration, OAuth sign-in for lianhangluah, creating personal access tokens, and troubleshooting connection status."
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
  - "GitHub"
  - "Authentication"
  - "Tokens"
  - "Sync"
  - "Security"
---

The website content, photographs, configuration, and academic papers live in a repository on GitHub:
- **Repository**: `thingpuisen-studio/khangluah`
- **Owner Account**: `lianhangluah`
- **Branch**: `main`

The admin studio gives you two distinct ways to authenticate and commit changes:
1. **One-Click OAuth Login** (Recommended for daily writing on phone or computer)
2. **Personal Access Token (PAT)** (Recommended for direct API connections or automated devices)

---

## 1. One-Click OAuth Login

OAuth is the quickest way to log into the studio without copying long secret keys.

- When you visit `/admin`, the sign-in screen displays the **Sign In with GitHub** button.
- Clicking this redirects your browser to GitHub's secure authentication server using the registered OAuth application client ID (`Ov23liKRkzVePYAQkuOx`).
- You approve access for repository scope (`scope=repo`).
- GitHub sends you back through a secure Cloudflare authentication worker (`/api/auth/callback`), which exchanges your code for an access token, confirms your username (`@lianhangluah`), and stores your session securely in your browser's local storage.
- You are redirected back to the studio with the green **Connected** status indicator active.

---

## 2. Personal Access Tokens (PAT)

If you prefer using a persistent token, or if you need to reconnect without going through the OAuth flow:

1. Open the **Settings** tab in the admin studio.
2. Scroll to the **GitHub Live Synchronization** section (`#sec-cfg-github`).
3. Click the link that says **Generate Token →** (this opens `https://github.com/settings/tokens/new?scopes=repo&description=HK-CMS-Studio`).
4. On GitHub, make sure the **repo** scope checkbox is checked (or if creating a fine-grained token, select Repository permissions: `Contents: Read and write`).
5. Generate the token and copy the secret string starting with `ghp_` or `github_pat_`.
6. Return to the admin studio, paste the token into the **Personal Access Token** box, and click **Save**.
7. Click the **Test** button to verify that the token can successfully read and commit to `thingpuisen-studio/khangluah`.

---

## Connection Status Indicators

At the top of the admin studio, next to your name, you will see a live connection indicator:
- **Green dot with "Connected"**: Confirms that your session or token is active and ready to commit new posts or photos.
- **"Verify" link**: Click this at any time to run a live test ping against the GitHub API. It checks whether your token has write permissions to the repository.
- **Amber dot with "Local Testing Mode"**: Shown when you are running on your computer (`localhost`) in simulation mode.

---

## Signing Out or Switching Accounts

To sign out of the studio on a shared device:
- Click the **Sign Out** button in the top header.
- The studio clears your stored token from browser storage, closes your session, and returns you to the login gate.
