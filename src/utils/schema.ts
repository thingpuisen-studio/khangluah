import { siteConfig } from '../data/siteConfig';
import type { Post } from '../data/posts';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface JsonLdOptions {
  siteUrl?: string;
  canonicalUrl?: string;
  pageType?: 'website' | 'profile' | 'collection' | 'article' | 'scholarly_article';
  title?: string;
  description?: string;
  post?: Post;
  breadcrumbs?: BreadcrumbItem[];
  customSchemas?: Record<string, any>[];
}

const DEFAULT_SITE_URL = 'https://lianhangluah.com';

/**
 * Normalizes an image path to an absolute URL
 */
export function toAbsoluteUrl(pathOrUrl: string, baseUrl: string = DEFAULT_SITE_URL): string {
  if (!pathOrUrl) return `${baseUrl}/images/author-avatar.jpg`;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Normalizes date strings like 'October 2026' or timestamps into ISO-8601 strings
 */
export function toIsoDate(dateStr?: string | number, year?: number): string {
  if (!dateStr) return `${year || 2026}-01-01T00:00:00+05:30`;
  const str = String(dateStr).trim();
  const parsed = Date.parse(str);
  if (!isNaN(parsed)) return new Date(parsed).toISOString();
  const m = str.match(/([a-zA-Z]+)\s+(\d{4})/);
  if (m) {
    const monthParsed = Date.parse(`${m[1]} 1, ${m[2]}`);
    if (!isNaN(monthParsed)) return new Date(monthParsed).toISOString();
  }
  return `${year || 2026}-01-01T00:00:00+05:30`;
}

/**
 * Builds the Person entity for H. Kapginlian
 */
export function getPersonSchema(siteUrl: string = DEFAULT_SITE_URL) {
  const { author } = siteConfig;
  return {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: author.name,
    jobTitle: author.title,
    description: author.shortBio,
    url: `${siteUrl}/`,
    image: toAbsoluteUrl(author.avatar, siteUrl),
    worksFor: {
      '@type': 'EducationalOrganization',
      name: 'North-Eastern Hill University (NEHU), Shillong',
      url: 'https://nehu.ac.in',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'North-Eastern Hill University (NEHU), Shillong',
    },
    sameAs: [
      `https://orcid.org/${author.orcid}`,
      author.academia,
      author.facebook,
      author.instagram,
    ].filter(Boolean) as string[],
    knowsAbout: [
      'Tibeto-Burman Linguistics',
      'Kuki-Chin Languages',
      'Morphosyntax & Pro-Drop',
      'Simte Language',
      'Kaipeng Language',
      'Language Documentation',
      'Indigenous Knowledge Systems',
      'Oral History & Archiving',
    ],
  };
}

/**
 * Builds the Person entity for the developer (Donal Muolhoi)
 */
export function getDeveloperSchema() {
  return {
    '@type': 'Person',
    '@id': 'https://thingpuisen.pages.dev/#developer',
    identifier: [
      'kg:/g/11yf0bzxbq',
      'https://www.wikidata.org/wiki/Q134733823',
    ],
    name: 'Donal Muolhoi',
    alternateName: [
      'D. Muolhoi',
      'Pheklom',
      'Donal Hmar',
      'Donald Hmar',
      'Donald Muolhoi',
      'Muolhoi',
    ],
    url: 'https://thingpuisen.pages.dev',
    mainEntityOfPage: 'https://thingpuisen.pages.dev',
    jobTitle: 'Cultural Activist',
    disambiguatingDescription:
      'Cultural activist and community representative from Northeast India. Technical creator and digital archivist for indigenous literature and research archives.',
    worksFor: {
      '@type': 'Organization',
      '@id': 'https://www.wikidata.org/wiki/Q141635438',
      name: 'Hmar Heritage Foundation',
      url: 'https://hmarheritage.pages.dev',
    },
    sameAs: [
      'https://www.wikidata.org/wiki/Q134733823',
      'https://www.google.com/search?kgmid=/g/11yf0bzxbq',
      'https://thingpuisen.pages.dev',
      'https://github.com/azinamotoe',
    ],
    knowsAbout: [
      'Hmar Heritage & Culture',
      'Cultural Preservation',
      'Digital Humanities',
      'Indigenous Literature',
      'Web Engineering',
      'Astro Framework',
      'SEO & Structured Data',
    ],
  };
}

/**
 * Builds the WebSite entity with SearchAction, creator, producer, and maintainer attribution
 */
export function getWebSiteSchema(siteUrl: string = DEFAULT_SITE_URL) {
  return {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: siteConfig.meta.siteTitle,
    description: siteConfig.meta.siteDescription,
    publisher: {
      '@id': `${siteUrl}/#person`,
    },
    creator: {
      '@id': 'https://thingpuisen.pages.dev/#developer',
    },
    producer: {
      '@id': 'https://thingpuisen.pages.dev/#developer',
    },
    maintainer: {
      '@id': 'https://thingpuisen.pages.dev/#developer',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/archive?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Builds BreadcrumbList structured data for Google Search rich snippets
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[], siteUrl: string = DEFAULT_SITE_URL) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url.startsWith('/') ? item.url : `/${item.url}`}`,
    })),
  };
}

/**
 * Parses authors string into Person schema entities
 */
function parseAuthorEntities(authorsStr?: string, siteUrl: string = DEFAULT_SITE_URL) {
  if (!authorsStr) {
    return [{ '@id': `${siteUrl}/#person` }];
  }

  // Check if it's the primary author
  if (authorsStr.includes('H. Kapginlian') && !authorsStr.includes('&')) {
    return [
      {
        '@type': 'Person',
        name: 'H. Kapginlian',
        url: `${siteUrl}/about`,
      },
    ];
  }

  // If multiple authors e.g. "H. Kapginlian & Dr. Saralin A. Lyngdoh, Associate Professor (NEHU, Shillong)"
  const parts = authorsStr.split(/\s*&\s*|\s*,\s*and\s*/i);
  return parts.map((namePart) => {
    const cleanName = namePart.trim();
    if (cleanName.includes('H. Kapginlian')) {
      return {
        '@type': 'Person',
        name: 'H. Kapginlian',
        url: `${siteUrl}/about`,
      };
    }
    const firstCommaIdx = cleanName.indexOf(',');
    if (firstCommaIdx === -1) {
      return {
        '@type': 'Person',
        name: cleanName,
        worksFor: {
          '@type': 'EducationalOrganization',
          name: 'North-Eastern Hill University (NEHU), Shillong',
        },
      };
    }
    const authorName = cleanName.slice(0, firstCommaIdx).trim();
    const titleOrRole = cleanName.slice(firstCommaIdx + 1).trim();
    return {
      '@type': 'Person',
      name: authorName,
      jobTitle: titleOrRole,
      worksFor: {
        '@type': 'EducationalOrganization',
        name: 'North-Eastern Hill University (NEHU), Shillong',
      },
    };
  });
}

/**
 * Builds ScholarlyArticle structured data for peer-reviewed academic publications
 */
export function getScholarlyArticleSchema(post: Post, siteUrl: string = DEFAULT_SITE_URL) {
  const canonicalUrl = `${siteUrl}/research/${post.slug}`;
  const authors = parseAuthorEntities(post.authors, siteUrl);
  const isoDate = toIsoDate(post.date, post.year);
  const coverUrl = toAbsoluteUrl(post.coverImage, siteUrl);

  const schema: Record<string, any> = {
    '@type': 'BlogPosting',
    additionalType: 'https://schema.org/ScholarlyArticle',
    '@id': `${canonicalUrl}#article`,
    isPartOf: {
      '@id': `${siteUrl}/#website`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: post.title,
    name: post.title,
    description: post.abstract || post.excerpt,
    datePublished: isoDate,
    dateModified: isoDate,
    image: [coverUrl],
    author: authors,
    publisher: post.journal
      ? {
          '@type': 'Organization',
          name: post.journal,
          ...(post.doi ? { url: `https://doi.org/${post.doi}` } : {}),
        }
      : {
          '@type': 'Person',
          name: 'H. Kapginlian',
          url: `${siteUrl}/`,
        },
    inLanguage: post.language || 'en',
    keywords: post.keywords ? post.keywords.join(', ') : post.tags?.join(', '),
  };

  if (post.abstract) {
    schema.abstract = post.abstract;
  }

  if (post.journal) {
    schema.publication = {
      '@type': 'PublicationIssue',
      issueNumber: post.volume || undefined,
      isPartOf: {
        '@type': 'Periodical',
        name: post.journal,
        issn: post.issn || undefined,
      },
    };
  }

  if (post.doi) {
    schema.identifier = `https://doi.org/${post.doi}`;
    schema.sameAs = `https://doi.org/${post.doi}`;
  }

  if (post.language) {
    schema.about = {
      '@type': 'Language',
      name: post.language,
    };
  }

  if (post.citationApa) {
    schema.citation = post.citationApa;
  }

  return schema;
}

/**
 * Builds Article/TechArticle/BlogPosting structured data for writing & guides
 */
export function getArticleSchema(post: Post, siteUrl: string = DEFAULT_SITE_URL) {
  const canonicalUrl = `${siteUrl}/feed/${post.slug}`;
  const isTechnical = post.category === 'Technical Guides';
  const isoDate = toIsoDate(post.date, post.year);
  const coverUrl = toAbsoluteUrl(post.coverImage, siteUrl);

  return {
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#article`,
    isPartOf: {
      '@id': `${siteUrl}/#website`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: post.title,
    name: post.title,
    description: post.excerpt,
    datePublished: isoDate,
    dateModified: isoDate,
    image: [coverUrl],
    author: {
      '@type': 'Person',
      name: post.authors || 'H. Kapginlian',
      url: `${siteUrl}/about`,
    },
    publisher: {
      '@type': 'Person',
      name: 'H. Kapginlian',
      url: `${siteUrl}/`,
    },
    articleSection: post.category,
    keywords: post.tags?.join(', '),
    inLanguage: post.articleLanguage || 'English',
    ...(isTechnical
      ? {
          dependencies: 'Markdown, Astro, CMS Studio',
          proficiencyLevel: 'Beginner to Intermediate',
        }
      : {}),
  };
}

/**
 * Builds ProfilePage structured data for the /about biography page
 */
export function getProfilePageSchema(siteUrl: string = DEFAULT_SITE_URL) {
  return {
    '@type': 'ProfilePage',
    '@id': `${siteUrl}/about#webpage`,
    url: `${siteUrl}/about`,
    name: 'About & Research | H. Kapginlian',
    description: 'Biography, research focus, language documentation fieldwork, and academic publications of H. Kapginlian (NEHU Shillong).',
    isPartOf: {
      '@id': `${siteUrl}/#website`,
    },
    mainEntity: {
      '@id': `${siteUrl}/#person`,
    },
  };
}

/**
 * Builds CollectionPage structured data for archive/feed/research listing indexes
 */
export function getCollectionPageSchema(
  name: string,
  description: string,
  path: string,
  siteUrl: string = DEFAULT_SITE_URL
) {
  const canonicalUrl = `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
  return {
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name,
    description,
    isPartOf: {
      '@id': `${siteUrl}/#website`,
    },
  };
}

/**
 * Creates the complete JSON-LD Schema.org graph object
 */
export function generateJsonLdGraph(options: JsonLdOptions = {}): Record<string, any> {
  const siteUrl = options.siteUrl || DEFAULT_SITE_URL;
  const graph: Record<string, any>[] = [
    getWebSiteSchema(siteUrl),
    getPersonSchema(siteUrl),
    getDeveloperSchema(),
  ];

  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    graph.push(getBreadcrumbSchema(options.breadcrumbs, siteUrl));
  }

  if (options.pageType === 'scholarly_article' && options.post) {
    graph.push(getScholarlyArticleSchema(options.post, siteUrl));
  } else if (options.pageType === 'article' && options.post) {
    graph.push(getArticleSchema(options.post, siteUrl));
  } else if (options.pageType === 'profile') {
    graph.push(getProfilePageSchema(siteUrl));
  } else if (options.pageType === 'collection') {
    graph.push(
      getCollectionPageSchema(
        options.title || siteConfig.meta.siteTitle,
        options.description || siteConfig.meta.siteDescription,
        options.canonicalUrl || '/',
        siteUrl
      )
    );
  }

  if (options.customSchemas && options.customSchemas.length > 0) {
    graph.push(...options.customSchemas);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
