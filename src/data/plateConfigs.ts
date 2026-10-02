export interface PlateConfig {
  headerLabel: string;
  themeClass: string;
  accentBarClass: string;
  subCategory: string;
  formula: string;
  formulaSub: string;
  languageBadge: string;
  statusBadge: string;
  pattern: string;
}

export interface ColorPreset {
  id: string;
  name: string;
  accentBarClass: string;
  swatchHex: string;
  badgeClass: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  themeClass: string;
  borderClass: string;
  previewBg: string;
  accentTip: string;
}

export const PRESET_TIPS: ColorPreset[] = [
  { id: "purple", name: "Purple", accentBarClass: "bg-purple-500", swatchHex: "#a855f7", badgeClass: "bg-purple-500" },
  { id: "indigo", name: "Indigo", accentBarClass: "bg-indigo-500", swatchHex: "#6366f1", badgeClass: "bg-indigo-500" },
  { id: "cyan", name: "Cyan", accentBarClass: "bg-cyan-500", swatchHex: "#06b6d4", badgeClass: "bg-cyan-500" },
  { id: "sky", name: "Sky Blue", accentBarClass: "bg-sky-400", swatchHex: "#38bdf8", badgeClass: "bg-sky-400" },
  { id: "emerald", name: "Emerald", accentBarClass: "bg-emerald-500", swatchHex: "#10b981", badgeClass: "bg-emerald-500" },
  { id: "amber", name: "Amber", accentBarClass: "bg-amber-500", swatchHex: "#f59e0b", badgeClass: "bg-amber-500" },
  { id: "rose", name: "Rose", accentBarClass: "bg-rose-500", swatchHex: "#f43f5e", badgeClass: "bg-rose-500" },
  { id: "accent", name: "Theme Ochre", accentBarClass: "bg-[var(--accent)]", swatchHex: "#d97706", badgeClass: "bg-amber-600" },
];

export const PRESET_THEMES: ThemePreset[] = [
  {
    id: "violet",
    name: "Poetic Violet",
    themeClass: "from-slate-950 via-purple-950 to-stone-950 text-purple-100",
    borderClass: "border-purple-900/60",
    previewBg: "from-slate-950 via-purple-950 to-stone-950",
    accentTip: "bg-purple-500"
  },
  {
    id: "cyan",
    name: "Riverine Cyan",
    themeClass: "from-slate-950 via-cyan-950 to-stone-950 text-cyan-100",
    borderClass: "border-cyan-900/60",
    previewBg: "from-slate-950 via-cyan-950 to-stone-950",
    accentTip: "bg-cyan-500"
  },
  {
    id: "amber",
    name: "Autumn Amber",
    themeClass: "from-amber-950 via-stone-900 to-amber-950 text-amber-100",
    borderClass: "border-amber-900/60",
    previewBg: "from-amber-950 via-stone-900 to-amber-950",
    accentTip: "bg-amber-500"
  },
  {
    id: "sky",
    name: "Nocturne Sky",
    themeClass: "from-slate-950 via-blue-950 to-neutral-950 text-sky-100",
    borderClass: "border-blue-900/60",
    previewBg: "from-slate-950 via-blue-950 to-neutral-950",
    accentTip: "bg-sky-400"
  },
  {
    id: "indigo",
    name: "Scholarly Indigo",
    themeClass: "from-slate-900 via-slate-800 to-indigo-950 text-slate-100",
    borderClass: "border-indigo-900/60",
    previewBg: "from-slate-900 via-slate-800 to-indigo-950",
    accentTip: "bg-indigo-500"
  },
  {
    id: "emerald",
    name: "Highland Emerald",
    themeClass: "from-stone-900 via-emerald-950 to-stone-900 text-stone-100",
    borderClass: "border-emerald-900/60",
    previewBg: "from-stone-900 via-emerald-950 to-stone-900",
    accentTip: "bg-emerald-500"
  },
  {
    id: "rose",
    name: "Archival Rose",
    themeClass: "from-stone-900 via-stone-800 to-rose-950 text-stone-100",
    borderClass: "border-rose-900/60",
    previewBg: "from-stone-900 via-stone-800 to-rose-950",
    accentTip: "bg-rose-500"
  },
  {
    id: "obsidian",
    name: "Obsidian Stone",
    themeClass: "from-stone-900 via-stone-800 to-stone-900 text-stone-100",
    borderClass: "border-stone-800",
    previewBg: "from-stone-900 via-stone-800 to-stone-900",
    accentTip: "bg-stone-500"
  }
];

export const plateConfigs: Record<string, PlateConfig> = {
  "pronouns-in-simte-pro-drop-emphatic": {
    headerLabel: "LANG IN INDIA • VOL. 23:6",
    themeClass: "from-slate-900 via-slate-800 to-indigo-950 text-slate-100",
    accentBarClass: "bg-indigo-500",
    subCategory: "MORPHOSYNTAX & CLUSIVITY",
    formula: "kei · naŋ · amaʔ",
    formulaSub: "[ki-] PRO-DROP • -maʔ EMPH",
    languageBadge: "smt (Simte)",
    statusBadge: "Peer-Reviewed",
    pattern: "pro-drop",
  },
  "gender-marking-in-simte-human-animal": {
    headerLabel: "VĀK MANTHAN • VOL. 10(II)",
    themeClass: "from-stone-900 via-emerald-950 to-stone-900 text-stone-100",
    accentBarClass: "bg-emerald-500",
    subCategory: "SEMANTIC CLASSIFICATION",
    formula: "[-human, +animal]",
    formulaSub: "-tal (M) · -pi (F) / pu · pi",
    languageBadge: "smt (Simte)",
    statusBadge: "Peer-Reviewed",
    pattern: "gender",
  },
  "numerals-kaipeng-simte-comparative": {
    headerLabel: "JOELL • VOL. 12:2 (2025)",
    themeClass: "from-stone-900 via-amber-950 to-stone-900 text-amber-50",
    accentBarClass: "bg-amber-500",
    subCategory: "COMPARATIVE NUMERATION",
    formula: "kʰat-ka ↔ khat",
    formulaSub: "BASE-10 • VEI- PREFIX / SUFFIX",
    languageBadge: "kzp × smt",
    statusBadge: "DOI Indexed",
    pattern: "numerals",
  },
  "advent-of-christianity-simte-oral-history": {
    headerLabel: "ARCHIVAL MONOGRAPH (1917–1958)",
    themeClass: "from-stone-900 via-stone-800 to-rose-950 text-stone-100",
    accentBarClass: "bg-rose-500",
    subCategory: "ORAL HISTORY & MISSION",
    formula: "1917 — 1958",
    formulaSub: "THANLON • SENVON • SUMTUH",
    languageBadge: "Simte Oral History",
    statusBadge: "25 Footnotes",
    pattern: "history",
  },
  "indigenous-knowledge-systems-language-documentation": {
    headerLabel: "FIELDWORK DISPATCH • 2026",
    themeClass: "from-neutral-900 via-stone-900 to-neutral-950 text-stone-200",
    accentBarClass: "bg-amber-600",
    subCategory: "INDIGENOUS KNOWLEDGE",
    formula: "Memory & Identity",
    formulaSub: "ORAL TRADITION & ECOLOGY",
    languageBadge: "smt / kzp",
    statusBadge: "Field Reflection",
    pattern: "essay",
  },
  "aw-simlei-simte-oral-poetry-memory": {
    headerLabel: "POETRY OF MEMORY • 2024",
    themeClass: "from-slate-950 via-purple-950 to-stone-950 text-purple-100",
    accentBarClass: "bg-purple-500",
    subCategory: "POETRY & ORAL VERSE",
    formula: "Hills of Memory",
    formulaSub: "LONGING • HOMELAND RIDGES",
    languageBadge: "English Verse",
    statusBadge: "Poetry",
    pattern: "default",
  },
  "tuithaphai-whispers-river-valley-verse": {
    headerLabel: "RIVER MEDITATIONS • 2025",
    themeClass: "from-slate-950 via-cyan-950 to-stone-950 text-cyan-100",
    accentBarClass: "bg-cyan-500",
    subCategory: "POETRY & NATURE",
    formula: "Where the River Winds",
    formulaSub: "WATER • TWILIGHT MIST",
    languageBadge: "English Verse",
    statusBadge: "Poetry",
    pattern: "default",
  },
  "chang-vui-harvest-couplets-simte": {
    headerLabel: "AUTUMN HARVEST • 2024",
    themeClass: "from-amber-950 via-stone-900 to-amber-950 text-amber-100",
    accentBarClass: "bg-amber-500",
    subCategory: "CELEBRATION OF WORK",
    formula: "Golden Terraces",
    formulaSub: "COMMUNAL SONGS • HARVEST",
    languageBadge: "English Verse",
    statusBadge: "Poetry",
    pattern: "default",
  },
  "zan-khaw-thiang-night-of-clear-skies": {
    headerLabel: "NIGHT CONTEMPLATION • 2024",
    themeClass: "from-slate-950 via-blue-950 to-neutral-950 text-sky-100",
    accentBarClass: "bg-sky-400",
    subCategory: "CONTEMPLATIVE VERSE",
    formula: "Clear Night Skies",
    formulaSub: "STARS & SILENCE • MEDITATION",
    languageBadge: "English Verse",
    statusBadge: "Poetry",
    pattern: "default",
  }
};
