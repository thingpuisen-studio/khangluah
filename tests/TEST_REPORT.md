# Test Execution Report

**Status:** ALL TESTS PASSING (65/65)  
**Runner:** Bun native test runner (`bun test`)  
**Duration:** ~90 ms  
**Date:** 2026-10-03  

---

## Summary

| Test Suite | File | Tests | Status |
| :--- | :--- | :--- | :--- |
| **URL & Navigation Utilities** | `tests/url.test.ts` | 5 | PASS |
| **Schema.org & JSON-LD Graph** | `tests/schema.test.ts` | 14 | PASS |
| **Academic Content & Monographs** | `tests/content.test.ts` | 22 | PASS |
| **Production Build & HTML Smoke** | `tests/build.test.ts` | 24 | PASS |
| **Total** | | **65** | **100% PASS** |

---

## Detailed Test Results

### 1. URL & Navigation Utilities (`tests/url.test.ts`)
- `(pass)` returns root slash for empty string or root slash
- `(pass)` normalizes path with leading slash
- `(pass)` handles complex paths and query parameters
- `(pass)` identifies home page active state strictly
- `(pass)` identifies section paths and nested routes correctly

### 2. Schema.org & JSON-LD Graph (`tests/schema.test.ts`)
- `(pass)` converts relative paths to absolute URLs
- `(pass)` preserves already-absolute URLs
- `(pass)` falls back to default avatar when empty
- `(pass)` getPersonSchema: has correct Schema.org properties and ID for H. Kapginlian
- `(pass)` getPersonSchema: includes NEHU academic affiliations and ORCID
- `(pass)` getDeveloperSchema: contains required identity and verification fields for Donal Muolhoi
- `(pass)` getDeveloperSchema: includes required developer alternate names and aliases (`D Muolhoi`, `Donald Hmar`, `Donald Muolhoi`, `Muolhoi`)
- `(pass)` getDeveloperSchema: includes software engineering capabilities
- `(pass)` getWebSiteSchema: contains publisher, creator, producer, and maintainer attributions
- `(pass)` getWebSiteSchema: defines SearchAction potentialAction
- `(pass)` getScholarlyArticleSchema: generates ScholarlyArticle for peer-reviewed research papers
- `(pass)` getScholarlyArticleSchema: includes academic fields (abstract, pdf, citation, inLanguage)
- `(pass)` getBreadcrumbSchema: generates valid BreadcrumbList structure
- `(pass)` generateJsonLdGraph: combines WebSite, Person, Developer, and Article in unified `@graph`

### 3. Academic Content & Monograph Integrity (`tests/content.test.ts`)
- `(pass)` contains exactly 4 core peer-reviewed academic research monographs
- `(pass)` Monograph: Pronouns in Simte: valid academic metadata
- `(pass)` Monograph: Pronouns in Simte: working PDF download URL
- `(pass)` Monograph: Pronouns in Simte: formatted APA and BibTeX citations
- `(pass)` Monograph: Pronouns in Simte: structured content sections
- `(pass)` Monograph: Gender in Simte: valid academic metadata
- `(pass)` Monograph: Gender in Simte: working PDF download URL
- `(pass)` Monograph: Gender in Simte: formatted APA and BibTeX citations
- `(pass)` Monograph: Gender in Simte: structured content sections
- `(pass)` Monograph: Numerals in Kaipeng and Simte: valid academic metadata
- `(pass)` Monograph: Numerals in Kaipeng and Simte: working PDF download URL
- `(pass)` Monograph: Numerals in Kaipeng and Simte: formatted APA and BibTeX citations
- `(pass)` Monograph: Numerals in Kaipeng and Simte: structured content sections
- `(pass)` Monograph: Advent of Christianity Among the Simtes: valid academic metadata
- `(pass)` Monograph: Advent of Christianity Among the Simtes: working PDF download URL
- `(pass)` Monograph: Advent of Christianity Among the Simtes: formatted APA and BibTeX citations
- `(pass)` Monograph: Advent of Christianity Among the Simtes: structured content sections
- `(pass)` Markdown Technical Guides: contains markdown guide posts
- `(pass)` validates structure and YAML frontmatter for markdown-formatting-complete-guide.md
- `(pass)` validates structure and YAML frontmatter for cms-studio-operations-and-drafts-guide.md
- `(pass)` validates structure and YAML frontmatter for asset-library-and-image-optimization-guide.md
- `(pass)` validates structure and YAML frontmatter for site-configuration-and-settings-guide.md

### 4. Production Build & Static HTML Smoke Tests (`tests/build.test.ts`)
- `(pass)` verifies generated `dist/` directory exists
- `(pass)` verifies static HTML exists for all 18 primary routes
- `(pass)` verifies sitemap.xml exists and is well-formed XML
- `(pass)` verifies robots.txt exists and references sitemap.xml
- `(pass)` verifies home page HTML contains structured data and developer credit (`Built by Donal Muolhoi`)
- `(pass)` verifies research monograph page contains ScholarlyArticle and linguistic IPA markers
- `(pass)` verifies technical guide page contains TechArticle schema and article-prose styling
