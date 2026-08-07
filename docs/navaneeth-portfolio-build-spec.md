# Portfolio Website + Content Studio — Complete Build Specification

## How to use this document

Everything after the horizontal rule below is written as direct instructions to the build agent — read the whole thing before generating any code.

**Precedence rule:** if anything in this document conflicts with the attached inspiration screenshots, the screenshots win for color, type, and layout. This document wins for structure, data behavior, and functionality. The two should never actually conflict, but if you're unsure, that's the tiebreaker.

---

You are building a personal portfolio website with a private, no-code content studio attached to it, for a product manager named Navaneeth. Read every section below before writing a single line of code. Follow the build order at the end exactly, in sequence.

## 1. Product overview

### 1.1 Problem

Navaneeth is not a developer. His portfolio content changes often: new roles, new projects, new certifications, new skills. Today that means either editing code by hand or maintaining a separate Notion page. He wants a real portfolio site he owns, with a private dashboard that lets him edit content the way Wix or Framer let you edit a page, except for one critical difference: those tools let you drag elements around freely, which is exactly what breaks responsive design. This product must give him the editing convenience without that risk.

### 1.2 Goals

- Edit all content (text, images, add/remove/reorder sections, add/remove entries within a section) with zero code.
- The site is flawless at every screen size, on every single edit, with no exceptions. This is the single most important constraint of the entire project.
- Visual design matches the quality bar of the attached inspiration screenshots.
- Only Navaneeth can access the content studio.
- Publishing is a deliberate, reversible action. A draft never goes live by accident, and a bad publish can always be undone.

### 1.3 Non-goals (do not build these)

- No multi-user accounts or roles. One owner, that's it.
- No freeform drag-and-drop or visual page builder. Layout is fixed; only content is editable.
- No blog/long-form CMS.
- No commerce, payments, or booking features.
- No public comments or social features.

### 1.4 Users

- **Owner (Navaneeth):** signs into the content studio, edits and publishes content.
- **Visitor:** anyone viewing the public site. Read-only, no account.

### 1.5 Success criteria

- Adding a new experience entry, project, or certification takes under two minutes with no code touched.
- After any content edit and publish, the public site renders correctly on mobile, tablet, and desktop with no visual regression.
- Publishing is near-instant, and reverting to a previous version is one click.

## 2. Information architecture

The public site is built from these section types, in this order by default (order is editable, per the schema in section 5):

1. **Hero** — name, tagline, short bio, photo. Always present, not toggleable.
2. **About** — a heading plus a short multi-paragraph bio.
3. **Stats bar** — a small row of number-plus-label highlights (e.g. "12+ Projects done").
4. **Experience** — a list of roles, each with a short list of bullets and exactly one highlighted outcome line.
5. **Projects & case studies** — grouped into verticals (categories). Each vertical only renders if it has at least one item.
6. **Tools** — a list of tools, each with a proficiency level.
7. **Core skills** — a small number of named skill groups, each a short list of skills.
8. **Certifications** — a list, each with a title, issuer, date, and credential ID.
9. **Education** — a list of degrees/programs with institution and years.
10. **Contact** — not a section on its own. It's a single shared value (email, phone, LinkedIn, resume link) that both the Hero area and the page footer read from, so it's only ever entered once.

## 3. User flows

### 3.1 Visitor flow

Land on Hero → scroll through whichever sections are marked visible, in their configured order → open a project's case study or live link in a new tab → reach the footer → use the Contact info or resume/LinkedIn links to get in touch.

### 3.2 Owner flow (content editing)

1. Go to `/studio` and sign in with Firebase Auth (restricted to Navaneeth's email only — see section 4).
2. Land on a studio home screen showing the currently published version number and last-published time.
3. Pick a section from a list (Hero, About, Stats, Experience, Projects, Tools, Skills, Certifications, Education, Contact).
4. Edit fields in a form generated from that section's schema; add or remove entries within it (e.g. add a new experience item); reorder entries by dragging within the list (never dragging onto the page itself).
5. See a live preview reflecting the draft, with a toggle to view it at mobile / tablet / desktop widths.
6. Click **Publish**. The draft becomes the published version. A toast confirms "Published." The previous version is appended to history automatically.
7. Optionally open version history and click **Restore** on any earlier version, which becomes the new published version (also recorded in history, nothing is ever lost).

## 4. System architecture

### 4.1 High level

One Next.js application with two areas:

- **Public site** (`/`) — reads the **published** content only. No auth required.
- **Content studio** (`/studio`) — reads and writes **draft** content. Requires Firebase Auth sign-in restricted to Navaneeth's email.

Both areas render sections using the exact same set of components. There is only ever one component per section type in the entire codebase — the public site and the studio's live preview both call it, just with different data (published vs. draft). This is the mechanism that makes "the design can never break from a content edit" actually true, rather than just a hope: there is no second, looser rendering path that could drift out of sync or behave differently.

### 4.2 Tech stack

- Frontend: **Next.js** (App Router) with React and TypeScript.
  - The public site (`/`) is server-rendered from the `published` content for fast loads and SEO; the studio (`/studio`) is a client-side app behind auth.
  - Hosting: Vercel.
- Backend: Supabase.
  - **Postgres** — one row in a `site` table holds the entire site's content as jsonb (schema in section 5), with row-level security: public read, allowlisted-email write.
  - **Supabase Auth** — email one-time-code sign-in, restricted to an allowlist of owner emails. Reject any other account.
  - **Supabase Storage** — image uploads (photo, logos, badges, icons, project cover images) in a public `images` bucket.
- Provision the Supabase project (one SQL script: `supabase/setup.sql`) as soon as the app needs storage or a login gate.

### 4.3 Draft, publish, and rollback

The Firestore document (see `SiteDocument` in section 5) holds a `draft` copy and a `published` copy of the full site content, plus a bounded history of previous published versions.

- All studio edits write to `draft` only, autosaved as the owner types.
- The public site only ever reads `published`.
- Clicking **Publish**: append the current `published` value (with its version number and timestamp) onto `history`, keeping only the most recent 20 entries; then copy `draft` into `published`; increment `version`; set `publishedAt` to now.
- Clicking **Restore** on a history entry: copy that entry's content into `published` (and also into `draft`, so future edits start from the restored state), increment `version`, append the version being replaced onto `history` first.

### 4.4 Guardrails against layout breakage

These are the actual mechanisms that prevent the studio from ever breaking the site. Implement all of them, not just some:

- **One schema, both sides.** The exact TypeScript types in section 5 are the single source of truth. The studio's forms are generated from these types. The public site's components are typed against these same types. There is no way for the studio to produce data shaped differently than what the components expect.
- **Field-level limits, enforced in the form.** Every text field has a max length shown as a live character counter; every list field (bullets, tags, skills, project verticals' items, etc.) has a max item count enforced by disabling the "add" control once reached. These limits are given per-field in section 5 and were sized against Navaneeth's real content in section 11, with headroom — don't shrink them.
- **Images are cropped before they ever reach a layout.** Every image field declares a required aspect ratio (see `ImageRef` in section 5). The upload flow must force a crop to that exact ratio (e.g. using a client-side crop step) before the file is saved to Storage. A component must never receive an image of unknown or arbitrary proportions.
- **Defensive components as a second layer.** Even with the above, every component should still truncate overflowing text gracefully (e.g. line-clamp), wrap tag/pill lists instead of overflowing, and render images inside fixed-ratio containers with `object-fit: cover`. Treat the field limits as the primary defense and this as a backstop, not the other way around.
- **Empty collections hide, they don't render broken.** A project vertical, a skills group, or any list-based section with zero items must not render an empty grid or heading on the public site. It simply doesn't appear. (Right now, three of the five project verticals have zero items — see section 11 — so this case is not theoretical, it happens on day one.)
- **Sections are toggled and reordered as whole units, never rearranged internally.** The owner can hide a section, show it, or move it up/down in the page order. The owner cannot move an individual field within a section's layout. This is the deliberate constraint that keeps this a content studio rather than a page builder.

## 5. Content schema

This is the exact shape of the site's content. Use it as literal TypeScript types, as the Firestore document shape, and as the source that generates the studio's forms.

```typescript
// ---------- Shared primitives ----------

type ImageRef = {
  url: string;
  aspectRatio: "1:1" | "16:9" | "4:3";
};

type ContactInfo = {
  email: string;
  phone?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
};

// ---------- Hero (always present, not a toggleable section) ----------

type Hero = {
  name: string; // max 60 chars
  tagline: string; // max 80 chars — must fit on one line at every breakpoint
  shortBio: string; // max 320 chars
  photo: ImageRef; // aspectRatio "1:1"
};

// ---------- About ----------

type About = {
  heading: string; // max 100 chars
  body: string; // max 1500 chars; render as paragraphs, splitting on blank lines
};

// ---------- Stats bar ----------

type StatItem = {
  id: string;
  value: string; // max 12 chars, e.g. "12+", "5", "" (empty allowed when icon carries the meaning)
  label: string; // max 40 chars, e.g. "Projects done"
  icon?: ImageRef; // aspectRatio "1:1", optional
};

// ---------- Experience ----------

type ExperienceItem = {
  id: string;
  company: string; // max 60 chars
  role: string; // max 60 chars
  startDate: string; // "YYYY-MM"
  endDate: string | "present";
  bullets: string[]; // max 4 items, each max 300 chars
  highlight?: string; // max 160 chars — the single standout-outcome line, styled distinctly from bullets
  tags?: string[]; // max 6 items, each max 20 chars
  logo?: ImageRef; // aspectRatio "1:1"
};

// ---------- Projects & case studies ----------

type ProjectVertical =
  | "Product Creation"
  | "Product Design"
  | "Product Improvement"
  | "Analytical Case Studies"
  | "Product Teardowns";

type ProjectItem = {
  id: string;
  vertical: ProjectVertical;
  title: string; // max 90 chars
  coverImage: ImageRef; // aspectRatio "16:9"
  overview: string; // max 600 chars
  resultsAndImpact?: string; // max 600 chars — optional; not every project has measured results yet
  liveUrl?: string;
  caseStudyUrl?: string;
  tags?: string[]; // max 6 items, each max 20 chars
};

// ---------- Tools ----------

type ProficiencyLevel = "Beginner" | "Intermediate" | "Expert";

type ToolItem = {
  id: string;
  name: string; // max 30 chars
  icon: ImageRef; // aspectRatio "1:1"
  level: ProficiencyLevel;
};

// ---------- Core skills ----------

type SkillGroup = {
  id: string;
  category: string; // max 40 chars
  skills: string[]; // max 10 items, each max 40 chars
};

// ---------- Certifications ----------

type CertificationItem = {
  id: string;
  title: string; // max 90 chars — title only, never mixed with issuer text
  issuer: string; // max 50 chars — always a separate field
  date?: string; // "YYYY-MM"
  credentialId?: string;
  credentialUrl?: string;
  badge?: ImageRef; // aspectRatio "1:1"
};

// ---------- Education ----------

type EducationItem = {
  id: string;
  degree: string; // max 110 chars
  institution?: string; // max 70 chars
  startYear: string; // "YYYY"
  endYear: string; // "YYYY"
};

// ---------- Section wrapper — controls visibility and order, never layout ----------

type Section =
  | { type: "about"; visible: boolean; order: number; data: About }
  | { type: "stats"; visible: boolean; order: number; items: StatItem[] }
  | {
      type: "experience";
      visible: boolean;
      order: number;
      items: ExperienceItem[];
    }
  | { type: "projects"; visible: boolean; order: number; items: ProjectItem[] }
  | { type: "tools"; visible: boolean; order: number; items: ToolItem[] }
  | { type: "skills"; visible: boolean; order: number; items: SkillGroup[] }
  | {
      type: "certifications";
      visible: boolean;
      order: number;
      items: CertificationItem[];
    }
  | {
      type: "education";
      visible: boolean;
      order: number;
      items: EducationItem[];
    };

// ---------- Full site content ----------

type SiteContent = {
  hero: Hero;
  contact: ContactInfo;
  sections: Section[];
};

// ---------- Firestore document shape ----------

type SiteDocument = {
  draft: SiteContent;
  published: SiteContent;
  version: number;
  publishedAt: string; // ISO timestamp
  history: {
    version: number;
    publishedAt: string;
    content: SiteContent;
  }[]; // most recent 20 only
};
```

## 6. Design system instructions

Before writing any UI code, look at the attached inspiration screenshots and derive an explicit design token system from them:

- A color palette of 4–6 named hex values.
- A type pairing: a display face used for headings, a body face, and a utility face for captions/labels/dates if the inspiration calls for one.
- A spacing and layout rhythm (how generous the whitespace is, how content is gridded).
- One signature visual element — something specific to this inspiration (a distinctive card treatment, a hover behavior, a particular way headings are styled) that will make this site recognizable rather than templated.

State this token system explicitly in your own build notes before generating components, then apply it consistently across every section in section 2. Do not fall back on generic AI-design defaults unless the inspiration itself genuinely points there:

- A warm cream background with a high-contrast serif and a terracotta accent.
- A near-black background with a single neon or acid accent.
- A broadsheet/newspaper layout of hairline rules and zero border-radius.

All three are legitimate only if the screenshots actually show that direction. Otherwise, make deliberate choices specific to what's attached.

The component library (built in phase 1 of the build order) is the one part of this app that is locked once approved. It is never regenerated by a content edit — see the guardrails in section 4.4.

## 7. Copy and microcopy rules

- Write from the person's point of view: name controls by what they do, not how the system works internally.
- Use active voice. A button says exactly what it does: "Publish," not "Submit." An action keeps its name through the whole flow — the button that says "Publish" produces a toast that says "Published," never "Success" or "Submitted."
- Empty states are an invitation to act, not an apology. An empty section in the studio (e.g. a project vertical with nothing in it yet) should read like "Nothing here yet — add your first project" in the owner's view. On the public site, per section 4.4, it simply doesn't render at all.
- Keep the register plain and conversational. No filler, no corporate language.

## 8. Accessibility and quality floor

- Visible keyboard focus states on every interactive element, in both the public site and the studio.
- Respect `prefers-reduced-motion` for all animation.
- Genuinely responsive down to mobile — not just breakpoint-based hiding, but layouts that reflow correctly at any width between the tested breakpoints (375px, 768px, 1440px).

## 9. Build order

Follow this sequence. Do not start a phase before the previous one is solid.

1. **Component library.** Build and visually approve every section component (Hero, About, Stats bar, Experience card, Project card grouped by vertical, Tools list, Skills groups, Certification card, Education item, footer/contact) at 375px, 768px, and 1440px, styled per section 6, seeded with the real content in section 11 (not placeholder text — the real content is what has to fit).
2. **Schema and backend.** Create the `SiteDocument` shape in Firestore exactly as in section 5. Set up Firebase Auth restricted to Navaneeth's email for `/studio`. Set up Firebase Storage for image uploads.
3. **Public site.** Wire the components from phase 1 to read `published` content from Firestore. Seed `published` with the content in section 11 so the site is real from the first deploy.
4. **Studio forms.** Generate one form per section type directly from the schema types, including add/remove/reorder controls for list items, character counters against every max length, and a mandatory crop-to-ratio step on every image upload. All edits autosave to `draft`.
5. **Live preview.** The studio's preview must call the exact same components as the public site, fed `draft` data, with a device-width toggle (mobile / tablet / desktop).
6. **Publish and rollback.** Implement the publish action and history mechanism exactly as described in section 4.3. Add a version history view with a Restore action per entry.

## 10. Acceptance checklist

Before calling this done, confirm:

- [ ] Every section renders correctly with zero items (hides gracefully) and with the maximum allowed items (no overflow) at 375px, 768px, and 1440px.
- [ ] Uploading an image forces a crop to the field's declared aspect ratio before saving.
- [ ] `/studio` is reachable only after signing in with Navaneeth's own email; any other account is rejected.
- [ ] Editing draft content never changes what the public site shows, until Publish is clicked.
- [ ] Publish updates the public site and appends the previous state to history.
- [ ] Restoring any history entry correctly becomes the new published version, and nothing is lost from history in the process.
- [ ] Every field-level limit from section 5 is enforced in the studio's forms.
- [ ] Visible focus states exist on every interactive element; `prefers-reduced-motion` is respected.
- [ ] The design tokens from section 6 are applied consistently across every section, matching the attached inspiration rather than a generic default.

## 11. Seed content

This is Navaneeth's real, current content, shaped to the schema in section 5. Use this to seed both `draft` and `published` on first deploy. Fields marked `<placeholder>` need a real asset or URL from Navaneeth before launch — leave them as empty strings/omitted rather than inventing a value.

```json
{
  "hero": {
    "name": "Navaneeth C L",
    "tagline": "Associate Product Manager, Ex-Founder, CS Engineer",
    "shortBio": "I love building products people enjoy and that deliver real results for the business behind them. Whether it's shaping product vision, aligning stakeholders, or diving into user research, I focus on understanding what truly creates value — not just for the user, but for the business growing behind it.",
    "photo": { "url": "<placeholder>", "aspectRatio": "1:1" }
  },
  "contact": {
    "email": "navaneethclpro@gmail.com",
    "phone": "+91 6282860929",
    "linkedinUrl": "<placeholder>",
    "resumeUrl": "<placeholder>"
  },
  "sections": [
    {
      "type": "about",
      "visible": true,
      "order": 1,
      "data": {
        "heading": "A Computer Science engineer, but that's just one part of my story.",
        "body": "Over the years I have taken on different roles such as co-founder, chairperson, developer, mentor, and manager. These experiences naturally placed me in environments where decisions mattered and where solving real problems required thoughtful thinking.\n\nI have always been deeply interested in technology. From exploring new products to following industry developments, I enjoy understanding how things are built and why they work the way they do. That curiosity has remained constant. What has evolved is where I want to contribute in that process.\n\nProduct management is where everything comes together for me. It sits at the intersection of people, business, and problem solving. That is the space where I am most excited to build and contribute."
      }
    },
    {
      "type": "stats",
      "visible": true,
      "order": 2,
      "items": [
        { "id": "stat-1", "value": "12+", "label": "Projects done" },
        { "id": "stat-2", "value": "5", "label": "Verticals covered" },
        { "id": "stat-3", "value": "1", "label": "Real product shipped" },
        {
          "id": "stat-4",
          "value": "",
          "label": "PM certified",
          "icon": { "url": "<placeholder: IBM logo>", "aspectRatio": "1:1" }
        }
      ]
    },
    {
      "type": "experience",
      "visible": true,
      "order": 3,
      "items": [
        {
          "id": "exp-1",
          "company": "Final Apps",
          "role": "Associate Product Manager - Growth",
          "startDate": "2026-06",
          "endDate": "present",
          "bullets": [
            "Led product growth for FSEO.ai by identifying key onboarding, activation, and retention bottlenecks through user behavior analysis and customer feedback.",
            "Planned and executed growth initiatives that increased user activation by 58% and drove 275%+ growth in Monthly Recurring Revenue (MRR) through improvements across the user journey and monetization strategy.",
            "Currently leading the development of a new commerce platform that reimagines ecommerce for enthusiast communities by combining community-driven content with shoppable product experiences across niches such as mechanical keyboards, PC building, workspace setups, and coffee stations."
          ],
          "highlight": "Drove 58% higher user activation and 275%+ MRR growth while leading product strategy for two ecommerce products"
        },
        {
          "id": "exp-2",
          "company": "Final Apps",
          "role": "Product Management Intern",
          "startDate": "2026-04",
          "endDate": "2026-06",
          "bullets": [
            "Worked with the product team of FSEO.ai to understand merchant needs, customer feedback, and the end-to-end workflows of a Shopify SaaS product in the emerging agentic commerce ecosystem.",
            "Researched user behavior and the e-commerce ecosystem to identify opportunities for improving merchant activation and retention.",
            "Collaborated with design and engineering teams to support product improvements aimed at making AI search optimization more accessible for Shopify merchants."
          ],
          "highlight": "Contributed to product growth initiatives for a Shopify AI SaaS platform serving merchants in the emerging Answer Engine Optimization (AEO) space"
        },
        {
          "id": "exp-3",
          "company": "Revyne Studio",
          "role": "Co-Founder & Finance Officer",
          "startDate": "2024-12",
          "endDate": "2025-08",
          "bullets": [
            "Co-founded a media production and marketing agency and helped define the initial service offering, pricing model, and growth strategy.",
            "Worked closely with clients and internal teams to understand needs, shape solutions, and translate requirements into clear project scopes.",
            "Built the company's financial and performance tracking system, creating visibility into revenue, costs, and project profitability to support data-driven decisions.",
            "Regularly reviewed performance metrics and client feedback to refine offerings and improve overall service quality."
          ],
          "highlight": "Took the company from zero to five-figure monthly revenue within the first year"
        },
        {
          "id": "exp-4",
          "company": "iTurn - UC Monks",
          "role": "Software Developer Intern (Internship)",
          "startDate": "2024-06",
          "endDate": "2024-11",
          "bullets": [
            "Worked with senior developers on the Flutter codebase, contributing to front end features that shipped to production.",
            "Translated feature requirements into UI components and integrated APIs to support core product functionality.",
            "Fixed bugs, improved UI responsiveness, and helped maintain a stable user experience across releases.",
            "Collaborated with developers to understand implementation trade-offs and how technical decisions impact product behavior and user experience."
          ],
          "highlight": "Left with a stronger understanding of how product decisions affect technical implementation and UX"
        }
      ]
    },
    {
      "type": "projects",
      "visible": true,
      "order": 4,
      "items": [
        {
          "id": "proj-1",
          "vertical": "Product Creation",
          "title": "UCEK Events: Campus Event Discovery and Management Platform",
          "coverImage": { "url": "<placeholder>", "aspectRatio": "16:9" },
          "overview": "UCEK Events is a web-based event discovery and management platform built for college students. It came from a real observation: events were happening, but participation was low because information was scattered across places. UCEK Events brought everything into one place, making it easier for students to find events and register, and for organizers to manage them.",
          "resultsAndImpact": "The platform was adopted across 10+ college clubs, with 20+ events listed and 200+ student registrations recorded. Features like Gmail login, prefilled registrations, and QR-based attendance meaningfully reduced friction for both students and organizers, replacing scattered event updates and manual registration entirely. Event participation picked up noticeably compared to before, validating that the core problem of discovery friction was real.",
          "liveUrl": "<placeholder>",
          "caseStudyUrl": "<placeholder>"
        },
        {
          "id": "proj-2",
          "vertical": "Product Design",
          "title": "ProposalPilot: Designing an AI Proposal Engine for Small Business Owners",
          "coverImage": { "url": "<placeholder>", "aspectRatio": "16:9" },
          "overview": "ProposalPilot is an AI product that helps small business owners respond to US government contracts faster and with less confusion. The US government spends over 700 billion dollars a year on contracts, but winning one requires reading through 50-page documents, understanding complex legal language, and writing a fully compliant proposal. Most small businesses either give up or hire expensive consultants just to compete. ProposalPilot cuts that process down to under 10 minutes: the AI reads the contract, matches it against the user's business profile, and generates a ready-to-review proposal draft.",
          "liveUrl": "<placeholder>",
          "caseStudyUrl": "<placeholder>"
        }
      ]
    },
    {
      "type": "tools",
      "visible": true,
      "order": 5,
      "items": [
        {
          "id": "tool-1",
          "name": "Notion",
          "level": "Intermediate",
          "icon": { "url": "<placeholder>", "aspectRatio": "1:1" }
        },
        {
          "id": "tool-2",
          "name": "Figma",
          "level": "Intermediate",
          "icon": { "url": "<placeholder>", "aspectRatio": "1:1" }
        },
        {
          "id": "tool-3",
          "name": "Canva",
          "level": "Expert",
          "icon": { "url": "<placeholder>", "aspectRatio": "1:1" }
        },
        {
          "id": "tool-4",
          "name": "ClickUp",
          "level": "Intermediate",
          "icon": { "url": "<placeholder>", "aspectRatio": "1:1" }
        },
        {
          "id": "tool-5",
          "name": "Jira",
          "level": "Beginner",
          "icon": { "url": "<placeholder>", "aspectRatio": "1:1" }
        },
        {
          "id": "tool-6",
          "name": "Google Analytics",
          "level": "Beginner",
          "icon": { "url": "<placeholder>", "aspectRatio": "1:1" }
        },
        {
          "id": "tool-7",
          "name": "Tableau",
          "level": "Beginner",
          "icon": { "url": "<placeholder>", "aspectRatio": "1:1" }
        },
        {
          "id": "tool-8",
          "name": "Power BI",
          "level": "Beginner",
          "icon": { "url": "<placeholder>", "aspectRatio": "1:1" }
        }
      ]
    },
    {
      "type": "skills",
      "visible": true,
      "order": 6,
      "items": [
        {
          "id": "skill-grp-1",
          "category": "Product Thinking",
          "skills": [
            "User Research",
            "Problem Framing",
            "Prioritization",
            "Product Strategy",
            "Roadmapping"
          ]
        },
        {
          "id": "skill-grp-2",
          "category": "Execution and Delivery",
          "skills": [
            "Agile Workflows",
            "Cross-functional Collaboration",
            "Stakeholder Management",
            "Feature Scoping",
            "Go-to-Market Planning"
          ]
        },
        {
          "id": "skill-grp-3",
          "category": "Data and Decision Making",
          "skills": [
            "Product Analytics",
            "Metrics Definition",
            "A/B Testing",
            "User Behavior Analysis",
            "Insight Synthesis"
          ]
        }
      ]
    },
    {
      "type": "certifications",
      "visible": true,
      "order": 7,
      "items": [
        {
          "id": "cert-1",
          "title": "Product Management Specialization",
          "issuer": "IBM",
          "credentialId": "Z3MI8HBQU7X9"
        },
        {
          "id": "cert-2",
          "title": "Introduction to Agile Development and Scrum",
          "issuer": "IBM",
          "credentialId": "T134ZB03S4IP"
        },
        {
          "id": "cert-3",
          "title": "The Fundamentals of Digital Marketing",
          "issuer": "Google Digital Garage",
          "credentialId": "7AX 8CU GSR"
        }
      ]
    },
    {
      "type": "education",
      "visible": true,
      "order": 8,
      "items": [
        {
          "id": "edu-1",
          "degree": "Bachelor of Technology (Computer Science & Engineering)",
          "institution": "University of Kerala",
          "startYear": "2021",
          "endYear": "2025"
        },
        {
          "id": "edu-2",
          "degree": "Senior Secondary / 12th Grade (Physics, Chemistry, Mathematics, Computer Science)",
          "startYear": "2020",
          "endYear": "2021"
        }
      ]
    }
  ]
}
```

Note: the `"Product Improvement"`, `"Analytical Case Studies"`, and `"Product Teardowns"` verticals currently have zero items. Do not invent placeholder projects for them — per section 4.4, they should simply not render on the public site until real items are added through the studio.
