// The single source of truth for content shape — build prompt §17, verbatim.
// The studio's forms and the public section components are both typed against
// these, so the two can never drift apart.

export type AspectRatio = "1:1" | "16:9" | "4:3";

export type ImageRef = {
  url: string;
  aspectRatio: AspectRatio;
};

export type ContactInfo = {
  email: string;
  phone?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
};

export type Hero = {
  name: string; // max 60 chars
  tagline: string; // max 80 chars
  shortBio: string; // max 320 chars
  photo: ImageRef; // "1:1"
  /** The small picture beside the name in the navigation bar and footer ("1:1"). Missing = the photo, then the illustrated avatar. */
  avatar?: ImageRef;
};

export type About = {
  heading: string; // max 100 chars
  body: string; // max 1500 chars; rendered as paragraphs split on blank lines
};

export type StatItem = {
  id: string;
  value: string; // max 12 chars — may be empty when the icon carries the meaning
  label: string; // max 40 chars
  icon?: ImageRef; // "1:1"
};

export type ExperienceItem = {
  id: string;
  company: string; // max 60 chars
  role: string; // max 60 chars
  startDate: string; // "YYYY-MM"
  endDate: string | "present";
  bullets: string[]; // max 4, each max 300 chars
  highlight?: string; // max 160 chars
  tags?: string[]; // max 6, each max 20 chars
  logo?: ImageRef; // "1:1"
};

export const PROJECT_VERTICALS = [
  "Product Creation",
  "Product Design",
  "Product Improvement",
  "Analytical Case Studies",
  "Product Teardowns",
] as const;

export type DefaultProjectVertical = (typeof PROJECT_VERTICALS)[number];
export type ProjectVertical = string;

export type ProjectItem = {
  id: string;
  vertical: ProjectVertical;
  title: string; // max 90 chars
  coverImage: ImageRef; // "16:9"
  overview: string; // max 600 chars
  resultsAndImpact?: string; // max 600 chars
  liveUrl?: string;
  caseStudyUrl?: string;
  tags?: string[]; // max 6, each max 20 chars
};

export const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Expert"] as const;
export type ProficiencyLevel = (typeof PROFICIENCY_LEVELS)[number];

export type ToolItem = {
  id: string;
  name: string;
  icon: ImageRef; // "1:1"
  level: ProficiencyLevel;
};

export type SkillGroup = {
  id: string;
  category: string; // max 40 chars
  skills: string[]; // max 10, each max 40 chars
};

export type CertificationItem = {
  id: string;
  title: string; // max 90 chars
  issuer: string; // max 50 chars
  date?: string;
  credentialId?: string;
  credentialUrl?: string;
  badge?: ImageRef; // "1:1"
};

export type EducationItem = {
  id: string;
  degree: string;
  institution?: string;
  startYear: string;
  endYear: string;
};

export type CustomSectionTemplate =
  | "story"
  | "media-text"
  | "grid"
  | "metrics"
  | "quote"
  | "cta";

export type CustomSectionItem = {
  id: string;
  title?: string;
  subtitle?: string;
  body?: string;
  image?: ImageRef;
  linkText?: string;
  linkUrl?: string;
  highlight?: string;
};

export type CustomSectionData = {
  id: string;
  template: CustomSectionTemplate;
  heading: string;
  subheading?: string;
  body?: string;
  image?: ImageRef;
  ctaText?: string;
  ctaUrl?: string;
  items?: CustomSectionItem[];
};

export type Section =
  | { type: "about"; visible: boolean; order: number; label?: string; data: About }
  | { type: "stats"; visible: boolean; order: number; label?: string; items: StatItem[] }
  | { type: "experience"; visible: boolean; order: number; label?: string; items: ExperienceItem[] }
  | { type: "projects"; visible: boolean; order: number; label?: string; items: ProjectItem[] }
  | { type: "tools"; visible: boolean; order: number; label?: string; items: ToolItem[] }
  | { type: "skills"; visible: boolean; order: number; label?: string; items: SkillGroup[] }
  | { type: "certifications"; visible: boolean; order: number; label?: string; items: CertificationItem[] }
  | { type: "education"; visible: boolean; order: number; label?: string; items: EducationItem[] }
  | {
      type: "custom";
      id: string;
      template: CustomSectionTemplate;
      visible: boolean;
      order: number;
      label?: string;
      data: CustomSectionData;
    };

export type SectionType = Section["type"];

export type DeveloperCredit = {
  enabled: boolean;
  name: string;
  siteUrl: string;
  role?: string;
  linkedinUrl?: string;
  githubUrl?: string;
};

export type SeoSettings = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: ImageRef;
  twitterHandle?: string;
  keywords?: string[];
  googleVerification?: string;
  bingVerification?: string;
  gaMeasurementId?: string;
  clarityProjectId?: string;
  geoRegion?: string;
  geoPlacename?: string;
  developerCredit?: DeveloperCredit;
};

export type CustomCompany = {
  id: string;
  name: string;
  logo?: ImageRef;
  showLogo?: boolean;
};

export type CompanyLogoOverride = {
  displayName?: string;
  showLogo?: boolean;
  customLogo?: ImageRef;
};

/** The line-art cast a chatter voice can wear — "owner" is the site owner (their photo, or their avatar). */
export const CHATTER_AVATARS = ["owner", "gus", "ezra", "iris", "rosa", "hazel", "maya", "fiona", "uma"] as const;
export type ChatterAvatar = (typeof CHATTER_AVATARS)[number];

/** One character in the crowd: who they are, their corner badge, and the lines they cycle through. */
export type ChatterVoice = {
  id: string;
  avatar: ChatterAvatar;
  badge?: string; // an emoji, max 8 chars
  lines: string[]; // max 3, each max 40 chars; "{name}" becomes the owner's first name
};

/** The speech-bubble crowds: on the hero (around the name) and on the contact composer. */
export type SiteChatter = {
  hero?: ChatterVoice[];
  contact?: ChatterVoice[];
};

/**
 * Site-level settings added in the V2 & V4 pass. Every field is optional so documents
 * written before it existed keep loading unchanged; a missing `settings` means
 * "use the defaults".
 */
export type SiteSettings = {
  favicon?: ImageRef; // "1:1" — the browser-tab icon, follows draft → publish
  marquee?: string[]; // legacy field: company names for running banner
  customCompanies?: CustomCompany[]; // manually added companies
  companyOverrides?: Record<string, CompanyLogoOverride>; // per-company logo configuration
  copyrightText?: string; // editable copyright line in footer
  projectCategories?: string[]; // custom categories registry
  palette?: string; // selected theme id (see lib/palettes)
  chatter?: SiteChatter; // editable speech-bubble lines; missing = the default crowd
  seo?: SeoSettings;
};

export type SiteContent = {
  hero: Hero;
  contact: ContactInfo;
  sections: Section[];
  settings?: SiteSettings;
};

export type HistoryEntry = {
  version: number;
  publishedAt: string;
  content: SiteContent;
  label?: string;
};

export type SiteDocument = {
  draft: SiteContent;
  published: SiteContent;
  version: number;
  publishedAt: string; // ISO timestamp
  history: HistoryEntry[]; // most recent 20 only
};

export const SECTION_LABELS: Record<SectionType, string> = {
  about: "About",
  stats: "Stats",
  experience: "Experience",
  projects: "Projects",
  tools: "Tools",
  skills: "Skills",
  certifications: "Certifications",
  education: "Education",
  custom: "Custom Section",
};

/** Get the effective display label of a section, falling back to default label. */
export function getSectionLabel(section: { type: SectionType; label?: string }): string {
  return section.label?.trim() || SECTION_LABELS[section.type];
}

const filled = (v: unknown): boolean => typeof v === "string" && v.trim().length > 0;

/**
 * The section with blank items removed — a role with no title or company, a
 * tool with no name, a skill group with no skills, a custom card with nothing
 * in it. What the public site renders, so a half-filled item never shows up
 * as an empty card.
 */
export function pruneSection(section: Section): Section {
  switch (section.type) {
    case "stats":
      return { ...section, items: (section.items ?? []).filter((s) => filled(s.value) || filled(s.label) || filled(s.icon?.url)) };
    case "skills":
      return {
        ...section,
        items: (section.items ?? []).map((g) => ({ ...g, skills: (g.skills ?? []).filter(filled) })).filter((g) => g.skills.length > 0),
      };
    case "experience":
      return { ...section, items: (section.items ?? []).filter((e) => filled(e.role) || filled(e.company)) };
    case "projects":
      return { ...section, items: (section.items ?? []).filter((p) => filled(p.title) || filled(p.overview) || filled(p.coverImage?.url)) };
    case "tools":
      return { ...section, items: (section.items ?? []).filter((t) => filled(t.name) || filled(t.icon?.url)) };
    case "certifications":
      return { ...section, items: (section.items ?? []).filter((c) => filled(c.title)) };
    case "education":
      return { ...section, items: (section.items ?? []).filter((e) => filled(e.degree) || filled(e.institution)) };
    case "custom":
      return {
        ...section,
        data: {
          ...section.data,
          items: (section.data?.items ?? []).filter(
            (i) => filled(i.title) || filled(i.subtitle) || filled(i.body) || filled(i.highlight) || filled(i.image?.url),
          ),
        },
      };
    default:
      return section;
  }
}

/** True when a section has nothing to show — such sections never render publicly (and get no nav link). */
export function sectionIsEmpty(section: Section): boolean {
  const s = pruneSection(section);
  switch (s.type) {
    case "about":
      return !filled(s.data?.heading) && !filled(s.data?.body);
    case "custom":
      return !filled(s.data?.heading) && !filled(s.data?.body) && (s.data.items ?? []).length === 0;
    default:
      return (s.items ?? []).length === 0;
  }
}

/** Visible, non-empty sections in configured order — the public render list. */
export function renderableSections(content: SiteContent): Section[] {
  return [...content.sections]
    .sort((a, b) => a.order - b.order)
    .filter((s) => s.visible && !sectionIsEmpty(s))
    .map(pruneSection);
}
