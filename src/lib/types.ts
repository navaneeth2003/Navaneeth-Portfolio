// The single source of truth for content shape — spec section 5, verbatim.
// The studio's forms and the public components are both typed against these.

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
  tagline: string; // max 80 chars — must fit on one line at every breakpoint
  shortBio: string; // max 320 chars
  photo: ImageRef; // aspectRatio "1:1"
};

export type About = {
  heading: string; // max 100 chars
  body: string; // max 1500 chars; render as paragraphs, splitting on blank lines
};

export type StatItem = {
  id: string;
  value: string; // max 12 chars — empty allowed when icon carries the meaning
  label: string; // max 40 chars
  icon?: ImageRef; // "1:1"
};

export type ExperienceItem = {
  id: string;
  company: string; // max 60 chars
  role: string; // max 60 chars
  startDate: string; // "YYYY-MM"
  endDate: string | "present";
  bullets: string[]; // max 4 items, each max 300 chars
  highlight?: string; // max 160 chars — single standout-outcome line
  tags?: string[]; // max 6 items, each max 20 chars
  logo?: ImageRef; // "1:1"
};

export const PROJECT_VERTICALS = [
  "Product Creation",
  "Product Design",
  "Product Improvement",
  "Analytical Case Studies",
  "Product Teardowns",
] as const;

export type ProjectVertical = (typeof PROJECT_VERTICALS)[number];

// ---------- Case studies (Phase 2) ----------
// A project may carry an on-site case study: an ordered sequence of story
// blocks following the PM arc. With at least one block, "Read case study"
// links to /case-study/[projectId] instead of the external URL.

export const CASE_STUDY_STAGES = [
  "Problem",
  "Research",
  "Insights",
  "Strategy",
  "Prioritization",
  "Execution",
  "Results",
  "Impact",
] as const;

export type CaseStudyStage = (typeof CASE_STUDY_STAGES)[number];

export type CaseStudyMetric = {
  id: string;
  value: string; // max 12 chars, e.g. "58%", "10+"
  label: string; // max 40 chars
};

export type CaseStudyBlock = {
  id: string;
  stage: CaseStudyStage;
  heading: string; // max 90 chars
  body: string; // max 1200 chars; paragraphs split on blank lines
  metrics?: CaseStudyMetric[]; // max 4
  image?: ImageRef; // "16:9"
};

export type ProjectItem = {
  id: string;
  vertical: ProjectVertical;
  title: string; // max 90 chars
  coverImage: ImageRef; // "16:9"
  overview: string; // max 600 chars
  resultsAndImpact?: string; // max 600 chars
  liveUrl?: string;
  caseStudyUrl?: string; // used when there is no on-site case study
  caseStudy?: { blocks: CaseStudyBlock[] }; // max 8 blocks
  tags?: string[]; // max 6 items, each max 20 chars
};

export const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Expert"] as const;
export type ProficiencyLevel = (typeof PROFICIENCY_LEVELS)[number];

export type ToolItem = {
  id: string;
  name: string; // max 30 chars
  icon: ImageRef; // "1:1"
  level: ProficiencyLevel;
};

export type SkillGroup = {
  id: string;
  category: string; // max 40 chars
  skills: string[]; // max 10 items, each max 40 chars
};

export type CertificationItem = {
  id: string;
  title: string; // max 90 chars — title only, never mixed with issuer
  issuer: string; // max 50 chars
  date?: string; // "YYYY-MM"
  credentialId?: string;
  credentialUrl?: string;
  badge?: ImageRef; // "1:1"
};

export type EducationItem = {
  id: string;
  degree: string; // max 110 chars
  institution?: string; // max 70 chars
  startYear: string; // "YYYY"
  endYear: string; // "YYYY"
};

export type Section =
  | { type: "about"; visible: boolean; order: number; data: About }
  | { type: "stats"; visible: boolean; order: number; items: StatItem[] }
  | { type: "experience"; visible: boolean; order: number; items: ExperienceItem[] }
  | { type: "projects"; visible: boolean; order: number; items: ProjectItem[] }
  | { type: "tools"; visible: boolean; order: number; items: ToolItem[] }
  | { type: "skills"; visible: boolean; order: number; items: SkillGroup[] }
  | { type: "certifications"; visible: boolean; order: number; items: CertificationItem[] }
  | { type: "education"; visible: boolean; order: number; items: EducationItem[] };

export type SectionType = Section["type"];

export type SiteContent = {
  hero: Hero;
  contact: ContactInfo;
  sections: Section[];
};

export type HistoryEntry = {
  version: number;
  publishedAt: string;
  content: SiteContent;
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
  skills: "Core skills",
  certifications: "Certifications",
  education: "Education",
};

/** True when a section has nothing to show — such sections never render publicly. */
export function sectionIsEmpty(section: Section): boolean {
  if (section.type === "about") {
    return !section.data.heading.trim() && !section.data.body.trim();
  }
  return section.items.length === 0;
}

/** Visible, non-empty sections in configured order. */
export function renderableSections(content: SiteContent): Section[] {
  return [...content.sections]
    .sort((a, b) => a.order - b.order)
    .filter((s) => s.visible && !sectionIsEmpty(s));
}
