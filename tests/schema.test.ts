import { describe, it, expect } from "bun:test";
import {
  toAbsoluteUrl,
  getPersonSchema,
  getDeveloperSchema,
  getWebSiteSchema,
  getScholarlyArticleSchema,
  getArticleSchema,
  getBreadcrumbSchema,
  generateJsonLdGraph,
} from "../src/utils/schema";
import { simtePronounsPost } from "../src/data/posts/simte-pronouns";

describe("Schema.org Utilities & JSON-LD Graph", () => {
  const siteUrl = "https://lianhangluah.com";

  describe("toAbsoluteUrl", () => {
    it("converts relative paths to absolute URLs", () => {
      expect(toAbsoluteUrl("/images/author.jpg", siteUrl)).toBe("https://lianhangluah.com/images/author.jpg");
      expect(toAbsoluteUrl("research/doc.pdf", siteUrl)).toBe("https://lianhangluah.com/research/doc.pdf");
    });

    it("preserves already-absolute URLs", () => {
      expect(toAbsoluteUrl("https://example.com/photo.png", siteUrl)).toBe("https://example.com/photo.png");
      expect(toAbsoluteUrl("http://example.com/photo.png", siteUrl)).toBe("http://example.com/photo.png");
    });

    it("falls back to default avatar when empty", () => {
      expect(toAbsoluteUrl("", siteUrl)).toBe("https://lianhangluah.com/images/author-avatar.jpg");
    });
  });

  describe("getPersonSchema (Author H. Kapginlian)", () => {
    const person = getPersonSchema(siteUrl);

    it("has correct Schema.org properties and ID", () => {
      expect(person["@type"]).toBe("Person");
      expect(person["@id"]).toBe("https://lianhangluah.com/#person");
      expect(person.name).toBe("H. Kapginlian");
      expect(person.url).toBe("https://lianhangluah.com/");
    });

    it("includes academic affiliations and ORCID", () => {
      expect(person.worksFor.name).toContain("NEHU");
      expect(person.sameAs.some((s: string) => s.includes("orcid.org"))).toBe(true);
      expect(person.knowsAbout).toContain("Tibeto-Burman Linguistics");
      expect(person.knowsAbout).toContain("Simte Language");
    });
  });

  describe("getDeveloperSchema (Creator Donal Muolhoi)", () => {
    const dev = getDeveloperSchema();

    it("contains required identity and verification fields", () => {
      expect(dev["@type"]).toBe("Person");
      expect(dev["@id"]).toBe("https://thingpuisen.pages.dev/#developer");
      expect(dev.name).toBe("Donal Muolhoi");
      expect(dev.url).toBe("https://thingpuisen.pages.dev");
      expect(dev.mainEntityOfPage).toBe("https://thingpuisen.pages.dev");
      expect(dev.jobTitle).toBe("Cultural Activist");
      expect(dev.disambiguatingDescription).toContain("Cultural activist");
    });

    it("includes required developer alternate names and aliases", () => {
      expect(dev.alternateName).toContain("D. Muolhoi");
      expect(dev.alternateName).toContain("Donald Hmar");
      expect(dev.alternateName).toContain("Donald Muolhoi");
      expect(dev.alternateName).toContain("Muolhoi");
    });

    it("includes software engineering capabilities", () => {
      expect(dev.knowsAbout).toContain("Astro Framework");
      expect(dev.knowsAbout).toContain("SEO & Structured Data");
    });
  });

  describe("getWebSiteSchema", () => {
    const website = getWebSiteSchema(siteUrl);

    it("contains publisher and developer attributions", () => {
      expect(website["@type"]).toBe("WebSite");
      expect(website["@id"]).toBe("https://lianhangluah.com/#website");
      expect(website.publisher["@id"]).toBe("https://lianhangluah.com/#person");
      expect(website.creator["@id"]).toBe("https://thingpuisen.pages.dev/#developer");
      expect(website.producer["@id"]).toBe("https://thingpuisen.pages.dev/#developer");
      expect(website.maintainer["@id"]).toBe("https://thingpuisen.pages.dev/#developer");
    });

    it("defines SearchAction potentialAction", () => {
      expect(website.potentialAction["@type"]).toBe("SearchAction");
      expect(website.potentialAction.target.urlTemplate).toContain("/archive?q=");
    });
  });

  describe("getScholarlyArticleSchema", () => {
    const article = getScholarlyArticleSchema(simtePronounsPost, siteUrl);

    it("generates ScholarlyArticle for peer-reviewed research papers", () => {
      expect(article["@type"]).toBe("BlogPosting");
      expect(article.additionalType).toBe("https://schema.org/ScholarlyArticle");
      expect(article.headline).toBe(simtePronounsPost.title);
      expect(article.author[0].name).toBe("H. Kapginlian");
    });

    it("includes academic fields (abstract, pdf, citation, inLanguage)", () => {
      expect(article.abstract).toBeTruthy();
      expect(article.about["@type"]).toBe("Language");
      expect(article.about.name).toBe("Simte");
      expect(article.citation).toBe(simtePronounsPost.citationApa);
    });
  });

  describe("getBreadcrumbSchema", () => {
    it("generates valid BreadcrumbList structure", () => {
      const breadcrumbs = [
        { name: "Home", url: "https://lianhangluah.com/" },
        { name: "Research", url: "https://lianhangluah.com/research" },
        { name: "Pronouns in Simte", url: "https://lianhangluah.com/research/pronouns-in-simte-pro-drop-emphatic" },
      ];
      const schema = getBreadcrumbSchema(breadcrumbs);

      expect(schema["@type"]).toBe("BreadcrumbList");
      expect(schema.itemListElement.length).toBe(3);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[0].name).toBe("Home");
      expect(schema.itemListElement[2].position).toBe(3);
      expect(schema.itemListElement[2].name).toBe("Pronouns in Simte");
    });
  });

  describe("generateJsonLdGraph", () => {
    it("combines WebSite, Person, Developer, and Article in unified @graph", () => {
      const graph = generateJsonLdGraph({
        siteUrl,
        canonicalUrl: "https://lianhangluah.com/research/pronouns-in-simte-pro-drop-emphatic",
        pageType: "scholarly_article",
        title: simtePronounsPost.title,
        post: simtePronounsPost,
      });

      expect(graph["@context"]).toBe("https://schema.org");
      expect(Array.isArray(graph["@graph"])).toBe(true);

      const types = graph["@graph"].map((item: any) => item["@type"]);
      expect(types).toContain("WebSite");
      expect(types).toContain("Person");
      expect(types).toContain("BlogPosting");

      // Verify developer entity is in the graph
      const devNode = graph["@graph"].find((item: any) => item["@id"] === "https://thingpuisen.pages.dev/#developer");
      expect(devNode).toBeDefined();
      expect(devNode?.name).toBe("Donal Muolhoi");
    });
  });
});
