import { describe, it, expect } from "bun:test";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { simtePronounsPost } from "../src/data/posts/simte-pronouns";
import { genderInSimtePost } from "../src/data/posts/gender-in-simte";
import { numeralsKaipengSimtePost } from "../src/data/posts/numerals-kaipeng-simte";
import { historyChristianityPost } from "../src/data/posts/history-christianity-simte";

describe("Academic Content & Monograph Integrity", () => {
  const monographs = [
    simtePronounsPost,
    genderInSimtePost,
    numeralsKaipengSimtePost,
    historyChristianityPost,
  ];

  it("contains exactly 4 core peer-reviewed academic research monographs", () => {
    expect(monographs.length).toBe(4);
  });

  monographs.forEach((paper) => {
    describe(`Monograph: ${paper.title}`, () => {
      it("has valid required academic metadata", () => {
        expect(paper.slug).toBeTruthy();
        expect(paper.title).toBeTruthy();
        expect(["Linguistics", "Society & Culture"]).toContain(paper.category);
        expect(paper.postType).toBe("academic_paper");
        expect(paper.authors).toContain("H. Kapginlian");
        expect(paper.abstract).toBeTruthy();
        expect(paper.year).toBeGreaterThanOrEqual(2020);
      });

      it("has working PDF download URL referencing public directory", () => {
        expect(paper.pdfUrl).toBeTruthy();
        const localPdfPath = join(process.cwd(), "public", paper.pdfUrl!.replace(/^\//, ""));
        expect(existsSync(localPdfPath)).toBe(true);
      });

      it("provides formatted APA and BibTeX academic citations", () => {
        expect(paper.citationApa).toBeTruthy();
        expect(paper.citationApa).toContain("Kapginlian, H.");
        expect(paper.bibtex).toBeTruthy();
        expect(paper.bibtex?.startsWith("@")).toBe(true);
      });

      it("contains structured content sections", () => {
        expect(paper.sections && paper.sections.length > 0).toBe(true);
      });
    });
  });
});

describe("Markdown Technical Guides & Articles", () => {
  const postsDir = join(process.cwd(), "src/content/posts");
  const files = readdirSync(postsDir).filter((f) => f.endsWith(".md"));

  it("contains markdown guide posts", () => {
    expect(files.length).toBeGreaterThanOrEqual(1);
  });

  files.forEach((file) => {
    it(`validates structure and YAML frontmatter for ${file}`, () => {
      const content = readFileSync(join(postsDir, file), "utf-8");
      expect(content.startsWith("---")).toBe(true);

      const endFm = content.indexOf("---", 3);
      expect(endFm).toBeGreaterThan(3);

      const frontmatter = content.slice(3, endFm);
      expect(frontmatter).toContain("title:");
      expect(frontmatter).toContain("slug:");
      expect(frontmatter).toContain("category:");

      const body = content.slice(endFm + 3).trim();
      expect(body.length).toBeGreaterThan(100);
    });
  });
});
