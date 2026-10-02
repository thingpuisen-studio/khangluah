import { simtePronounsPost } from './posts/simte-pronouns';
import { genderInSimtePost } from './posts/gender-in-simte';
import { numeralsKaipengSimtePost } from './posts/numerals-kaipeng-simte';
import { historyChristianityPost } from './posts/history-christianity-simte';
import { url } from '../utils/url';
import { siteConfig } from './siteConfig';

export interface PostSection {
  heading: string;
  paragraphs?: string[];
  blockquote?: {
    text: string;
    source?: string;
  };
  table?: {
    caption?: string;
    headers: string[];
    rows: string[][];
  };
  tables?: {
    caption?: string;
    headers: string[];
    rows: string[][];
  }[];
  glossExamples?: {
    label: string;
    words: { src: string; gloss: string }[];
    trans: string;
  }[];
}

export interface Post {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  date: string;
  year: number;
  readingTime: string;
  category: string;
  languageFamily?: string;
  language?: string; // Linguistic focus / subject language
  articleLanguage?: "English" | "Simte"; // Language the article is written in
  tags: string[];
  coverImage: string;
  featured?: boolean;
  draft?: boolean;
  postType: "academic_paper" | "essay" | "poem";
  
  // Academic paper specific metadata
  journal?: string;
  volume?: string;
  issn?: string;
  doi?: string;
  authors?: string;
  pdfUrl?: string;
  abstract?: string;
  keywords?: string[];
  citationApa?: string;
  bibtex?: string;
  sections?: PostSection[];
  references?: string[];

  // Card Plate Styling Customization
  themeClass?: string;
  accentBarClass?: string;
  headerLabel?: string;
  formula?: string;
  formulaSub?: string;
  body?: string;
  html?: string;
}

function parseMarkdownToSections(rawMd: string, defaultHeading: string, couplet?: string, authors?: string): PostSection[] {
  if (!rawMd || !rawMd.trim()) {
    if (couplet) {
      return [{
        heading: defaultHeading,
        blockquote: { text: couplet.trim(), source: authors || "H. Kapginlian" },
        paragraphs: []
      }];
    }
    return [];
  }

  const lines = rawMd.split('\n');
  const sections: PostSection[] = [];
  let currentHeading = defaultHeading;
  let currentParagraphs: string[] = [];
  let currentBlockquote: { text: string; source?: string } | undefined;
  let currentBlockquoteLines: string[] = [];
  let buffer: string[] = [];

  function flushBuffer() {
    if (buffer.length > 0) {
      const text = buffer.join('\n').trim();
      if (text) {
        currentParagraphs.push(text);
      }
      buffer = [];
    }
  }

  function flushSection() {
    flushBuffer();
    if (currentBlockquoteLines.length > 0 && !currentBlockquote) {
      currentBlockquote = {
        text: currentBlockquoteLines.join('\n'),
        source: authors || "H. Kapginlian"
      };
      currentBlockquoteLines = [];
    }
    if (currentParagraphs.length > 0 || currentBlockquote) {
      sections.push({
        heading: currentHeading,
        paragraphs: currentParagraphs.length > 0 ? currentParagraphs : undefined,
        blockquote: currentBlockquote
      });
      currentParagraphs = [];
      currentBlockquote = undefined;
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      flushSection();
      currentHeading = trimmed.replace(/^##\s+/, '').trim();
    } else if (trimmed.startsWith('> ')) {
      flushBuffer();
      currentBlockquoteLines.push(trimmed.replace(/^>\s*/, ''));
    } else if (trimmed === '') {
      flushBuffer();
      if (currentBlockquoteLines.length > 0) {
        currentBlockquote = {
          text: currentBlockquoteLines.join('\n'),
          source: authors || "H. Kapginlian"
        };
        currentBlockquoteLines = [];
      }
    } else {
      buffer.push(line);
    }
  }

  flushSection();

  if (couplet && sections.length > 0 && !sections[0].blockquote) {
    sections[0].blockquote = {
      text: couplet.trim(),
      source: authors || "H. Kapginlian"
    };
  }

  return sections.length > 0 ? sections : [{ heading: defaultHeading, paragraphs: [rawMd] }];
}

// Load all Markdown publications from src/content/posts/*.md
const mdModules = import.meta.glob<Record<string, any>>('../content/posts/*.md', { eager: true });

const markdownPosts: Post[] = Object.entries(mdModules).map(([path, mod]) => {
  const fm = mod.frontmatter || {};
  const rawBody = typeof mod.rawContent === 'function' ? mod.rawContent() : "";
  const compiledHtml = typeof mod.compiledContent === 'function' ? mod.compiledContent() : "";
  const defaultTitle = fm.title || "Untitled";
  const slug = fm.slug || path.split('/').pop()?.replace(/\.md$/, "") || "untitled";

  return {
    slug,
    title: fm.title || "Untitled",
    subtitle: fm.subtitle || "",
    excerpt: fm.excerpt || fm.abstract || fm.subtitle || fm.title || "",
    date: fm.date || "2026",
    year: typeof fm.year === 'number' ? fm.year : parseInt(String(fm.date || "2026").slice(-4)) || 2026,
    readingTime: fm.readingTime || "3 min read",
    category: fm.category || "Poetry & Literature",
    languageFamily: fm.languageFamily || "English Verse",
    language: fm.language || "English",
    articleLanguage: fm.articleLanguage || "English",
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    coverImage: fm.coverImage || "https://placehold.co/800x450/1c1917/ffffff?text=Publication",
    featured: Boolean(fm.featured),
    draft: Boolean(fm.draft),
    postType: fm.postType || "poem",
    authors: fm.authors || "H. Kapginlian",
    abstract: fm.abstract || "",
    themeClass: fm.themeClass,
    accentBarClass: fm.accentBarClass,
    headerLabel: fm.headerLabel,
    formula: fm.formula,
    formulaSub: fm.formulaSub,
    body: rawBody,
    html: compiledHtml,
    sections: fm.sections || parseMarkdownToSections(rawBody, defaultTitle, fm.featuredCouplet, fm.authors)
  };
});

// Complete catalog including remote drafts for admin CMS management
export const allPosts: Post[] = [
  simtePronounsPost,
  genderInSimtePost,
  numeralsKaipengSimtePost,
  historyChristianityPost,
  ...markdownPosts
];

// Primary public catalog combining academic research monographs and markdown publications (excluding remote drafts)
export const samplePosts: Post[] = allPosts.filter((p) => !p.draft);

export function getPostUrl(post: { slug: string; postType?: string }): string {
  return post.postType === "academic_paper" ? url(`/research/${post.slug}`) : url(`/feed/${post.slug}`);
}

export const authorProfile = siteConfig.author;
