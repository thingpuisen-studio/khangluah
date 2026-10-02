import { url } from '../utils/url';

export interface NavItemConfig {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
  order: number;
}

export interface ActionButtonConfig {
  id: string;
  label: string;
  href: string;
  icon: string;
  enabled: boolean;
}

export interface GlossWordUnit {
  src: string;
  gloss: string;
}

export interface FieldworkSpotlightConfig {
  enabled: boolean;
  badge: string;
  subtitle: string;
  studyLinkText: string;
  studyLinkHref: string;
  words: GlossWordUnit[];
  translation: string;
}

export interface SocialLinkConfig {
  id: string;
  title: string;
  handle: string;
  description: string;
  category: "academic" | "social" | "direct";
  badge: string;
  href: string;
  icon: string;
  colorTheme: string;
  isActive: boolean;
  order: number;
}

export interface DocumentedLanguageInfo {
  name: string;
  iso: string;
  branch: string;
  focus: string;
  region: string;
}

export interface PoeticThemeInfo {
  title: string;
  theme: string;
  desc: string;
}

export interface SiteConfig {
  meta: {
    siteTitle: string;
    siteDescription: string;
    authorName: string;
  };
  author: {
    name: string;
    shortName: string;
    title: string;
    affiliation: string;
    qualification: string;
    location: string;
    locationDetail: string;
    email: string;
    orcid: string;
    scholar?: string;
    academia?: string;
    github?: string;
    facebook?: string;
    instagram?: string;
    bluesky?: string;
    avatar: string;
    fullPhoto: string;
    shortBio: string;
    fullBio: string[];
    researchAreas: string[];
    metrics: {
      papersCountLabel: string;
      papersCountValue: string;
      documentedLanguagesLabel: string;
      documentedLanguagesValue: string;
    };
    actionButtons: ActionButtonConfig[];
  };
  navigation: NavItemConfig[];
  fieldworkSpotlight: FieldworkSpotlightConfig;
  socialLinks: SocialLinkConfig[];
  pages: {
    home: {
      recentHeading: string;
      recentDesc: string;
      allPostsText: string;
    };
    research: {
      eyebrow: string;
      title: string;
      description: string;
      specializations: string[];
    };
    feed: {
      eyebrow: string;
      title: string;
      description: string;
      researchNoticeText: string;
      researchNoticeBtnText: string;
    };
    poems: {
      eyebrow: string;
      title: string;
      description: string;
      themes: PoeticThemeInfo[];
    };
    archive: {
      eyebrow: string;
      title: string;
      description: string;
      researchNoticeText: string;
      researchNoticeBtnText: string;
    };
    about: {
      eyebrow: string;
      title: string;
      subtitle: string;
      languagesDocumented: DocumentedLanguageInfo[];
      contactNote: string;
    };
    socials: {
      headline: string;
      subheadline: string;
      note: string;
    };
  };
  footer: {
    bio: string;
    documentedLanguages: string;
    copyright: string;
    standardsNotice: string;
    backToTopText: string;
    showAdminLink: boolean;
    adminLinkLabel: string;
  };
}

export const defaultSiteConfig: SiteConfig = {
  meta: {
    siteTitle: "H. Kapginlian | Linguist & Language Researcher",
    siteDescription: "Personal academic website, fieldwork notes, and linguistic research by H. Kapginlian (NEHU, Shillong).",
    authorName: "H. Kapginlian",
  },
  author: {
    name: "H. Kapginlian",
    shortName: "H. Kapginlian",
    title: "PhD in Linguistics",
    affiliation: "NEHU, Shillong",
    qualification: "Completed PhD in Linguistics from NEHU, Shillong",
    location: "Shillong, Meghalaya • Manipur",
    locationDetail: "NEHU, Shillong • Manipur, Northeast India",
    email: "contact@lianhangluah.com",
    orcid: "0009-0008-9045-3527",
    academia: "https://nehuac.academia.edu/HKapginlian",
    facebook: "https://facebook.com/lianhangluah",
    instagram: "https://instagram.com/lian.hangluah",
    avatar: url("/images/author-avatar.jpg"),
    fullPhoto: url("/images/author-centered.jpg"),
    shortBio: "I am H. Kapginlian, a linguist working at the intersection of morphology and syntax, Indigenous Knowledge Systems, language documentation, traditional folklore and folktales, and intangible cultural heritage.",
    fullBio: [
      "I am H. Kapginlian, a linguist working at the intersection of morphology and syntax, Indigenous Knowledge Systems, language documentation, traditional folklore and folktales, and intangible cultural heritage.",
      "This website is a space where I bring together my linguistic research, writings on society and culture, theological reflections, book reviews, and poetry. It is also an attempt to document, preserve, and share knowledge, stories, languages, and cultural expressions that are often passed down through generations but remain less visible in the wider world.",
      "For me, language is more than a system of words and grammar—it is a repository of memory, identity, knowledge, and lived experience. Through my research and writings, I hope to explore these connections and contribute, in my own small way, to the understanding and preservation of Indigenous languages and cultures.",
      "Welcome to my world of language, culture, thought, faith, and words."
    ],
    researchAreas: [
      "Morphology & Syntax",
      "Indigenous Knowledge",
      "Language Documentation",
      "Folklore & Orality",
      "Intangible Cultural Heritage"
    ],
    metrics: {
      papersCountLabel: "Research Papers",
      papersCountValue: "4 Publications",
      documentedLanguagesLabel: "Documented",
      documentedLanguagesValue: "Simte & Kaipeng"
    },
    actionButtons: [
      {
        id: "btn-research",
        label: "Research Publications (4)",
        href: "/research",
        icon: "paper",
        enabled: true
      },
      {
        id: "btn-about",
        label: "Biography",
        href: "/about",
        icon: "academic",
        enabled: true
      },
      {
        id: "btn-socials",
        label: "Linkhub",
        href: "/socials",
        icon: "globe",
        enabled: true
      }
    ]
  },
  navigation: [
    { id: "home", label: "Home", href: "/", enabled: true, order: 1 },
    { id: "research", label: "Research", href: "/research", enabled: true, order: 2 },
    { id: "writing", label: "Writing", href: "/feed", enabled: true, order: 3 },
    { id: "poems", label: "Poems", href: "/poems", enabled: true, order: 4 },
    { id: "archive", label: "Archive", href: "/archive", enabled: true, order: 5 },
    { id: "about", label: "About", href: "/about", enabled: true, order: 6 },
    { id: "socials", label: "Socials", href: "/socials", enabled: true, order: 7 }
  ],
  fieldworkSpotlight: {
    enabled: true,
    badge: "Fieldwork Spotlight",
    subtitle: "Simte (smt) • Leipzig Interlinear Gloss",
    studyLinkText: "Explore Study (Vāk Manthan 2023)",
    studyLinkHref: "/research/pronouns-in-simte-pro-drop-emphatic",
    words: [
      { src: "kou", gloss: "1PL.EXCL" },
      { src: "ka", gloss: "1PL.AGR" },
      { src: "ki-it", gloss: "RECIP-love" },
      { src: "-uʔ", gloss: "PL" }
    ],
    translation: "‘We love each other.’ (Simte Reciprocal Construction & Pro-Drop Morphology, Kapginlian 2023)"
  },
  socialLinks: [
    {
      id: "academia",
      title: "Academia.edu",
      handle: "hkapginlian",
      description: "Department of Linguistics, North-Eastern Hill University (NEHU), Shillong. Research papers and academic monographs.",
      category: "academic",
      badge: "NEHU Shillong",
      href: "https://nehuac.academia.edu/HKapginlian",
      icon: "academia",
      colorTheme: "border-sky-700/30 bg-sky-700/5 hover:bg-sky-700/15 text-sky-700 dark:text-sky-400",
      isActive: true,
      order: 1
    },
    {
      id: "orcid",
      title: "ORCID Registry",
      handle: "0009-0008-9045-3527",
      description: "Verified Open Researcher and Contributor ID for cross-institutional authorship verification.",
      category: "academic",
      badge: "Verified ID",
      href: "https://orcid.org/0009-0008-9045-3527",
      icon: "orcid",
      colorTheme: "border-[#A6CE39]/30 bg-[#A6CE39]/5 hover:bg-[#A6CE39]/15 text-[#A6CE39]",
      isActive: true,
      order: 2
    },
    {
      id: "facebook",
      title: "Facebook",
      handle: "lianhangluah",
      description: "Community updates, cultural reflections, folk documentation dispatches, and public notes.",
      category: "social",
      badge: "Personal",
      href: "https://facebook.com/lianhangluah",
      icon: "facebook",
      colorTheme: "border-sky-600/30 bg-sky-600/5 hover:bg-sky-600/15 text-sky-600 dark:text-sky-400",
      isActive: true,
      order: 3
    },
    {
      id: "instagram",
      title: "Instagram",
      handle: "lian.hangluah",
      description: "Visual dispatches, fieldwork landscapes, book notes, and personal updates.",
      category: "social",
      badge: "Personal",
      href: "https://instagram.com/lian.hangluah",
      icon: "instagram",
      colorTheme: "border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/15 text-pink-600 dark:text-pink-400",
      isActive: true,
      order: 4
    },
    {
      id: "email",
      title: "Email Correspondence",
      handle: "contact@lianhangluah.com",
      description: "Formal academic communication, editorial correspondence, peer reviews, and speaking invitations.",
      category: "direct",
      badge: "Primary",
      href: "mailto:contact@lianhangluah.com?subject=Academic%20Inquiry%20-%20H.%20Kapginlian",
      icon: "email",
      colorTheme: "border-[var(--accent)]/30 bg-[var(--accent)]/5 hover:bg-[var(--accent)]/15 text-[var(--accent)]",
      isActive: true,
      order: 5
    }
  ],
  pages: {
    home: {
      recentHeading: "Recent Dispatches",
      recentDesc: "Peer-reviewed papers, oral histories, theological reflections, and cultural dispatches.",
      allPostsText: "All Posts"
    },
    research: {
      eyebrow: "Linguistic Scholarship • NEHU Shillong",
      title: "Research & Publications",
      description: "Peer-reviewed studies in Tibeto-Burman morphology, syntax, and comparative Kuki-Chin linguistics. All papers are archived in Green Open Access format with complete Leipzig glosses, paradigm tables, and downloadable original PDFs.",
      specializations: [
        "Morphosyntax & Pro-Drop",
        "Gender Marking & Kinship",
        "Comparative Numerals",
        "Oral History & Archiving",
        "Indigenous Knowledge Systems"
      ]
    },
    feed: {
      eyebrow: "Chronological Dispatches",
      title: "Writing & Field Notes",
      description: "Essays on Indigenous Knowledge Systems, oral history documentation, theological reflections, and poetry.",
      researchNoticeText: "Looking for peer-reviewed linguistics papers & journal publications?",
      researchNoticeBtnText: "Visit Research & Publications"
    },
    poems: {
      eyebrow: "Poetry & Creative Writing",
      title: "Poems & Homeland Verse",
      description: "A collection of poems, nature lyrics, harvest songs, and quiet evening meditations by H. Kapginlian.",
      themes: [
        {
          title: "Nature & Valleys",
          theme: "Twilight & Rivers",
          desc: "Meditations on flowing water, mountain mist at sundown, and the quiet peace of open trails."
        },
        {
          title: "Harvest & Community",
          theme: "Autumn Celebrations",
          desc: "Joyful verses celebrating golden terraces, shared labor on hillside slopes, and the warmth of home."
        },
        {
          title: "Faith & Silence",
          theme: "Night Skies & Wonder",
          desc: "Solitary contemplations under cold starry winter skies, reflecting on prayer, gratitude, and stillness."
        },
        {
          title: "Memory & Home",
          theme: "Longing for the Hills",
          desc: "Reflections on generational roots, remembering the paths walked by those who came before us."
        }
      ]
    },
    archive: {
      eyebrow: "Writing Directory",
      title: "Archive & Index",
      description: "Chronological index of essays, oral histories, field reflections, and poetry.",
      researchNoticeText: "Looking for peer-reviewed academic papers & journal studies?",
      researchNoticeBtnText: "Visit Research Archive"
    },
    about: {
      eyebrow: "Curriculum & Research Agenda",
      title: "About & Research",
      subtitle: "Biography, research focus, language documentation fieldwork, and academic publications of H. Kapginlian (NEHU Shillong).",
      languagesDocumented: [
        {
          name: "Simte",
          iso: "smt",
          branch: "Northern Kuki-Chin (Tibeto-Burman)",
          focus: "Pronominal morphology, pro-drop & clusivity, animate gender classification, oral history, and traditional folklore documentation",
          region: "Pherzawl District (Pamjal & Joutung) & Churachandpur, Manipur"
        },
        {
          name: "Kaipeng",
          iso: "kzp",
          branch: "Old Kuki (Tibeto-Burman)",
          focus: "Comparative numeral typology, base-10 structures, and cross-branch lexical morphology with Simte",
          region: "Tripura highlands (Collaborative comparative research)"
        },
        {
          name: "Kuki-Chin Comparative",
          iso: "tbq",
          branch: "Tibeto-Burman Family",
          focus: "Morphological typology, genetic classification, and intangible cultural heritage preservation",
          region: "Northeast India (Manipur, Tripura, Meghalaya)"
        }
      ],
      contactNote: "For speaking invitations, research collaborations, or language consultation, please send an academic inquiry."
    },
    socials: {
      headline: "Connect & Social Directory",
      subheadline: "Verified academic identifiers, scholarly networks, and public communication channels for H. Kapginlian.",
      note: "All listed profiles are monitored and verified."
    }
  },
  footer: {
    bio: "Linguist specializing in Tibeto-Burman & Kuki-Chin morphology and syntax, Indigenous Knowledge Systems, and intangible cultural heritage documentation. Completed PhD in Linguistics from NEHU, Shillong.",
    documentedLanguages: "Documented: Simte (smt) • Kaipeng (kzp)",
    copyright: "H. Kapginlian. All rights reserved.",
    standardsNotice: "ISO 639-3 Documentation Standards",
    backToTopText: "Back to top",
    showAdminLink: false,
    adminLinkLabel: "Admin CMS"
  }
};

export const siteConfig: SiteConfig = defaultSiteConfig;
