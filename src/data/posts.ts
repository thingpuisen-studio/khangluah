import { simtePronounsPost } from './posts/simte-pronouns';
import { genderInSimtePost } from './posts/gender-in-simte';
import { numeralsKaipengSimtePost } from './posts/numerals-kaipeng-simte';
import { historyChristianityPost } from './posts/history-christianity-simte';
import { indigenousKnowledgePost } from './posts/indigenous-knowledge';
import { simtePoetryPost } from './posts/simte-poetry';
import { tuithaphaiVersePost } from './posts/tuithaphai-verse';
import { changVuiHarvestPost } from './posts/chang-vui-harvest';
import { zanKhawThiangPost } from './posts/zan-khaw-thiang';

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
}

export const samplePosts: Post[] = [
  simtePronounsPost,
  genderInSimtePost,
  numeralsKaipengSimtePost,
  historyChristianityPost,
  indigenousKnowledgePost,
  simtePoetryPost,
  tuithaphaiVersePost,
  changVuiHarvestPost,
  zanKhawThiangPost
];

import { url } from '../utils/url';
import { siteConfig } from './siteConfig';

export function getPostUrl(post: { slug: string; postType?: string }): string {
  return post.postType === "academic_paper" ? url(`/research/${post.slug}`) : url(`/feed/${post.slug}`);
}

export const authorProfile = siteConfig.author;
