// Field-level limits — build prompt §7–§15. Enforced in the studio forms (the
// primary defense); the section components clamp/wrap as a backstop.
// Item caps the prompt leaves to "the implementation" are sized against the
// cloned layouts: the stats row is a fixed 4-up grid, so it caps at 4.

export const CHAR_LIMITS = {
  hero: { name: 60, tagline: 80, shortBio: 320 },
  about: { heading: 100, body: 1500 },
  stat: { value: 12, label: 40 },
  experience: { company: 60, role: 60, bullet: 300, highlight: 160, tag: 20 },
  project: { title: 90, overview: 600, resultsAndImpact: 600, tag: 20 },
  tool: { name: 30 },
  skillGroup: { category: 40, skill: 40 },
  certification: { title: 90, issuer: 50 },
  education: { degree: 110, institution: 70 },
  copyright: 120,
  projectCategory: 50,
  sectionLabel: 40,
  seo: {
    metaTitle: 70,
    metaDescription: 320,
    canonicalUrl: 160,
    twitterHandle: 40,
    keyword: 40,
    developerName: 60,
    developerRole: 40,
    developerUrl: 160,
    googleVerification: 100,
    bingVerification: 100,
    gaMeasurementId: 30,
    clarityProjectId: 50,
    geoRegion: 20,
    geoPlacename: 60,
  },
} as const;

export const ITEM_LIMITS = {
  stats: 4,
  experience: 12,
  experienceBullets: 4,
  experienceTags: 6,
  projects: 20,
  projectTags: 6,
  tools: 16,
  skillGroups: 6,
  skillsPerGroup: 10,
  certifications: 12,
  education: 6,
  marquee: 12,
  seoKeywords: 20,
} as const;

export const HISTORY_LIMIT = 20;
