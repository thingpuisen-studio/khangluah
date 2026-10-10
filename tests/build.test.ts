import { describe, it, expect } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

describe("Production Build Output Verification", () => {
  const distDir = join(process.cwd(), "dist");

  it("has a generated dist directory", () => {
    expect(existsSync(distDir)).toBe(true);
  });

  const criticalRoutes = [
    "index.html",
    "about/index.html",
    "archive/index.html",
    "feed/index.html",
    "poems/index.html",
    "privacy/index.html",
    "research/index.html",
    "socials/index.html",
    "terms/index.html",
    "research/pronouns-in-simte-pro-drop-emphatic/index.html",
    "research/gender-marking-in-simte-human-animal/index.html",
    "research/numerals-kaipeng-simte-comparative/index.html",
    "research/advent-of-christianity-simte-oral-history/index.html",
    "feed/markdown-formatting-complete-guide/index.html",
    "feed/site-configuration-and-settings-guide/index.html",
    "feed/the-epistemic-commutativity-of-the-remote-push-an-inscription-in-edge-cached-melancholia/index.html",
  ];

  criticalRoutes.forEach((route) => {
    it(`verifies static HTML file exists: ${route}`, () => {
      const filePath = join(distDir, route);
      expect(existsSync(filePath)).toBe(true);
    });
  });

  it("verifies sitemap.xml exists and is well-formed XML", () => {
    const sitemapPath = join(distDir, "sitemap.xml");
    expect(existsSync(sitemapPath)).toBe(true);
    const sitemapContent = readFileSync(sitemapPath, "utf-8");
    expect(sitemapContent).toContain("<?xml");
    expect(sitemapContent).toContain("<urlset");
    expect(sitemapContent).toContain("https://lianhangluah.com/research");
    expect(sitemapContent).toContain("https://lianhangluah.com/about");
  });

  it("verifies robots.txt exists and references sitemap.xml", () => {
    const robotsPath = join(distDir, "robots.txt");
    expect(existsSync(robotsPath)).toBe(true);
    const robotsContent = readFileSync(robotsPath, "utf-8");
    expect(robotsContent).toContain("User-agent: *");
    expect(robotsContent).toContain("Sitemap: https://lianhangluah.com/sitemap.xml");
  });

  it("verifies home page HTML contains structured data and developer credit", () => {
    const homeHtml = readFileSync(join(distDir, "index.html"), "utf-8");
    expect(homeHtml).toContain('application/ld+json');
    expect(homeHtml).toContain('https://thingpuisen.pages.dev/#developer');
    expect(homeHtml).toContain('Donal Muolhoi');
    expect(homeHtml).toContain('Built by Donal Muolhoi');
    expect(homeHtml).toContain('<title>');
    expect(homeHtml).toContain('rel="canonical"');
  });

  it("verifies research monograph page contains ScholarlyArticle and linguistic IPA markers", () => {
    const paperHtml = readFileSync(
      join(distDir, "research/pronouns-in-simte-pro-drop-emphatic/index.html"),
      "utf-8"
    );
    expect(paperHtml).toContain('application/ld+json');
    expect(paperHtml).toContain('ScholarlyArticle');
    expect(paperHtml).toContain('H. Kapginlian');
    expect(paperHtml).toContain('ipa');
    expect(paperHtml).toContain('Download Original PDF');
  });

  it("verifies technical guide page contains schema and article-prose styling", () => {
    const guideHtml = readFileSync(
      join(distDir, "feed/markdown-formatting-complete-guide/index.html"),
      "utf-8"
    );
    expect(guideHtml).toContain('application/ld+json');
    expect(guideHtml).toContain('BlogPosting');
    expect(guideHtml).toContain('article-prose');
  });
});
