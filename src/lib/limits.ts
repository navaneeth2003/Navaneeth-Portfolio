// Field-level limits — spec section 5. Enforced in the studio forms (primary defense);
// components line-clamp/wrap as a backstop. Item caps without a number in the spec
// (stats, experience, projects, tools, skill groups, certifications, education) are
// sized generously against the seed content — do not shrink them.

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
} as const;

export const ITEM_LIMITS = {
  stats: 6,
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
} as const;

export const HISTORY_LIMIT = 20;
