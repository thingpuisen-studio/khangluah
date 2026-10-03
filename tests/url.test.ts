import { describe, it, expect } from "bun:test";
import { url } from "../src/utils/url";

describe("url utility", () => {
  it("returns root slash for empty string or root slash", () => {
    expect(url("")).toBe("/");
    expect(url("/")).toBe("/");
  });

  it("normalizes path with leading slash", () => {
    expect(url("research")).toBe("/research");
    expect(url("/research")).toBe("/research");
    expect(url("feed/guide-slug")).toBe("/feed/guide-slug");
  });

  it("handles complex paths and query parameters", () => {
    expect(url("/archive?q=linguistics")).toBe("/archive?q=linguistics");
    expect(url("images/avatar.webp")).toBe("/images/avatar.webp");
  });
});

describe("navigation active link logic", () => {
  function checkIsActive(currentPath: string, itemHref: string, homeHref: string = "/"): boolean {
    const normCurrent = currentPath.replace(/\/$/, "");
    const normItem = itemHref.replace(/\/$/, "");
    const normHome = homeHref.replace(/\/$/, "");

    if (normItem === normHome) {
      return normCurrent === normHome;
    }
    return normCurrent === normItem || normCurrent.startsWith(`${normItem}/`);
  }

  it("identifies home page active state strictly", () => {
    expect(checkIsActive("/", "/")).toBe(true);
    expect(checkIsActive("", "/")).toBe(true);
    expect(checkIsActive("/research", "/")).toBe(false);
  });

  it("identifies section paths and nested routes correctly", () => {
    expect(checkIsActive("/research", "/research")).toBe(true);
    expect(checkIsActive("/research/", "/research")).toBe(true);
    expect(checkIsActive("/research/pronouns-in-simte", "/research")).toBe(true);
    expect(checkIsActive("/writing", "/research")).toBe(false);
  });
});
