EXISTING WEBSITE DESIGN INTEGRATION — MASTER BUILD INSTRUCTION
==============================================================

You are building a personal portfolio website for **Navaneeth C L**, together with a private **no-code Content Studio** that allows the owner to edit the website's content without touching code.

However, there is one extremely important distinction from a normal portfolio build:

THE WEBSITE DESIGN ALREADY EXISTS
---------------------------------

The project you are starting from contains an **existing website implementation that I cloned from another portfolio website because I specifically like its design, visual language, layouts, interactions, animations, spacing, typography, responsive behavior, and overall feel.**

Your job is **NOT to invent a new portfolio design.**

Your job is to:

> **Deeply inspect the existing cloned implementation, understand how its design actually works from the source code, and then intelligently transform/recompose my portfolio and Content Studio product requirements so that they become a natural, seamless extension of that existing design.**

The final result should look as though the existing design was originally created specifically for **my portfolio**, rather than looking like:

*   a cloned website with unrelated portfolio sections pasted into it, or
    
*   my old portfolio design forced into a new skin.
    

The integration must be **design-led, structurally intelligent, and extremely conservative about anything that already works.**

0\. HIGHEST-PRIORITY RULE
=========================

DO NOT BREAK THE EXISTING IMPLEMENTATION
----------------------------------------

The existing cloned website is the starting point.

Before changing anything:

1.  Inspect it thoroughly.
    
2.  Understand it.
    
3.  Identify what already works.
    
4.  Identify its reusable design primitives.
    
5.  Identify its page architecture.
    
6.  Identify its responsive behavior.
    
7.  Identify its animation system.
    
8.  Identify its visual tokens.
    
9.  Identify its component relationships.
    
10.  Identify its data/content assumptions.
    
11.  Identify its dependencies and integrations.
    
12.  Identify anything that must be preserved.
    

**Do not make assumptions about the cloned website based on what you think the website probably looks like.**

You have access to the actual implementation.

### The source code is the authority for the cloned design.

Do not hallucinate:

*   sections
    
*   layouts
    
*   colors
    
*   fonts
    
*   animations
    
*   spacing
    
*   interactions
    
*   breakpoints
    
*   component structures
    
*   visual effects
    
*   responsive behavior
    
*   assets
    
*   navigation behavior
    
*   page transitions
    
*   card patterns
    
*   hover states
    

Instead, inspect the implementation and derive them.

If something is unclear, investigate the code further.

1\. FIRST PHASE — REVERSE-ENGINEER THE EXISTING CLONED WEBSITE
==============================================================

**Do not start coding the portfolio integration immediately.**

Your first task is to understand the existing implementation as if you were taking over an existing production website.

Inspect the entire project, including where applicable:

*   application entry points
    
*   routes
    
*   page components
    
*   layout components
    
*   reusable components
    
*   CSS
    
*   Tailwind configuration
    
*   CSS variables
    
*   theme definitions
    
*   typography
    
*   font loading
    
*   spacing system
    
*   sizing system
    
*   border-radius system
    
*   shadows
    
*   gradients
    
*   backgrounds
    
*   image handling
    
*   icons
    
*   SVGs
    
*   animations
    
*   transitions
    
*   hover states
    
*   scroll behavior
    
*   sticky/fixed elements
    
*   navigation
    
*   footer
    
*   cards
    
*   grids
    
*   lists
    
*   section wrappers
    
*   responsive breakpoints
    
*   mobile navigation
    
*   tablet behavior
    
*   desktop behavior
    
*   accessibility implementation
    
*   dependencies
    
*   utility functions
    
*   data structures
    
*   existing state management
    
*   existing backend/data integrations
    
*   existing authentication if any
    
*   existing forms
    
*   existing content-loading logic
    

Also inspect:

*   package configuration
    
*   build configuration
    
*   environment-variable expectations
    
*   asset directories
    
*   public assets
    
*   image dimensions/aspect ratios
    
*   existing responsive utilities
    
*   animation libraries
    
*   UI libraries
    
*   icon libraries
    
*   any existing CMS/data abstractions
    

### Create an internal understanding of the cloned design

Before implementation, derive:

### A. Visual system

Identify the actual:

*   primary background
    
*   secondary surfaces
    
*   text colors
    
*   muted colors
    
*   accent colors
    
*   border treatments
    
*   shadows
    
*   gradients
    
*   texture/noise
    
*   image treatment
    
*   radius language
    
*   spacing rhythm
    
*   container widths
    
*   grid structure
    
*   typography hierarchy
    

### B. Component system

Identify reusable primitives such as:

*   buttons
    
*   links
    
*   cards
    
*   section headers
    
*   badges
    
*   tags
    
*   navigation elements
    
*   image containers
    
*   typography components
    
*   grids
    
*   list structures
    
*   interactive elements
    
*   decorative elements
    

### C. Layout system

Determine:

*   maximum content width
    
*   page gutters
    
*   section spacing
    
*   grid columns
    
*   card widths
    
*   alignment rules
    
*   vertical rhythm
    
*   hero composition
    
*   content density
    
*   relationship between sections
    

### D. Interaction system

Determine exactly how the existing implementation handles:

*   hover
    
*   focus
    
*   click
    
*   scrolling
    
*   entrance animations
    
*   page load
    
*   cursor interactions
    
*   parallax
    
*   image transitions
    
*   card interactions
    
*   navigation
    
*   mobile interactions
    

### E. Responsive system

Understand the actual behavior at:

*   mobile
    
*   tablet
    
*   desktop
    
*   intermediate widths
    

Do not merely identify CSS breakpoints.

Understand **what the design is trying to do at each breakpoint.**

2\. CREATE A DESIGN-TO-PORTFOLIO MAPPING BEFORE IMPLEMENTATION
==============================================================

After inspecting the cloned implementation, determine how my portfolio requirements can be expressed using the existing design language.

You must think like a senior product designer + design engineer.

Do **not** assume that the cloned website's existing sections correspond one-to-one with my portfolio sections.

They probably do not.

That is expected.

Instead, create a conceptual mapping such as:

Portfolio requirementExisting cloned primitive/sectionActionHeroExisting hero architectureAdaptAboutExisting content/text compositionRecomposeExperienceExisting timeline/card/list systemTransformProjectsExisting project/card/grid systemReuse/adaptToolsExisting icon/list/grid primitiveAdaptSkillsExisting tags/group systemRecomposeCertificationsExisting cards/list systemAdaptEducationExisting timeline/content systemAdaptContactExisting CTA/footer architectureIntegrateStudio previewPublic componentsReuse exactly

The exact mapping must be based on the **actual cloned implementation**, not on this example.

For every portfolio section, decide:

1.  What existing design primitive can be reused?
    
2.  What existing layout can be transformed?
    
3.  What should remain visually unchanged?
    
4.  What must be newly composed?
    
5.  What information hierarchy is required by my portfolio?
    
6.  How can that information hierarchy fit naturally into the cloned design?
    
7.  How should desktop and mobile compositions differ?
    
8.  Which existing interactions should be preserved?
    
9.  Which existing animations can naturally enhance this section?
    
10.  Which things should **not** be carried over because they conflict with the portfolio's information architecture?
    

Do not blindly preserve irrelevant cloned content structures.

Preserve the **design language**, not irrelevant content architecture.

3\. CORE DESIGN PRINCIPLE
=========================

The final website should feel like:

> **The cloned website's design system + my portfolio's information architecture + a purpose-built Content Studio.**

It should NOT feel like:

> cloned website + random new sections + generic CMS.

The integration must be seamless.

If the original design uses a particular card treatment, typography relationship, grid, spacing rhythm, hover behavior, image treatment, section transition, or navigation pattern, reuse and adapt that pattern wherever appropriate.

Do not introduce an unrelated visual system simply because a new portfolio section needs to be represented.

When a new section does not have a direct equivalent in the cloned website:

1.  identify the closest existing visual primitive;
    
2.  understand why that primitive works;
    
3.  extend it carefully;
    
4.  preserve its visual DNA;
    
5.  make the new section look native to the existing website.
    

4\. THE PORTFOLIO PRODUCT YOU ARE BUILDING
==========================================

This is a personal portfolio for:

**Navaneeth C L**

Current positioning:

**Associate Product Manager, Ex-Founder, CS Engineer**

The website has two fundamentally different areas:

### Public website

/

Anyone can visit it.

Visitors can:

*   read the portfolio
    
*   browse experience
    
*   browse projects
    
*   inspect skills/tools/certifications/education
    
*   open project links
    
*   access LinkedIn/resume/contact information
    

### Private Content Studio

/studio

Only Navaneeth can access it.

The Studio provides a structured no-code editing experience.

It is **not** a freeform page builder.

The owner can edit content without coding, but the layout remains controlled by the application's component system so that content changes cannot destroy responsive design.

This distinction is fundamental.

5\. NON-GOALS
=============

Do NOT build:

*   multi-user accounts
    
*   user roles
    
*   freeform drag-and-drop page building
    
*   arbitrary element positioning
    
*   a visual page-builder canvas
    
*   a blog CMS
    
*   ecommerce
    
*   payments
    
*   booking
    
*   comments
    
*   social features
    

The Studio is a **structured content management system for a fixed, responsive design system.**

6\. REQUIRED PUBLIC PORTFOLIO STRUCTURE
=======================================

The portfolio must support these section types:

1.  Hero
    
2.  About
    
3.  Stats
    
4.  Experience
    
5.  Projects & Case Studies
    
6.  Tools
    
7.  Core Skills
    
8.  Certifications
    
9.  Education
    
10.  Contact information / footer integration
    

The exact visual representation of these sections must be determined by adapting the cloned website's actual design system.

Do not force these into generic portfolio layouts.

7\. HERO
========

Hero is always present and is not toggleable.

Data:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   type Hero = {    name: string;    tagline: string;    shortBio: string;    photo: ImageRef;  };   `

Limits:

*   name: 60 characters
    
*   tagline: 80 characters
    
*   shortBio: 320 characters
    
*   photo: 1:1
    

Seed content:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Name:  Navaneeth C L  Tagline:  Associate Product Manager, Ex-Founder, CS Engineer  Short bio:  I love building products people enjoy and that deliver real results for the business behind them. Whether it's shaping product vision, aligning stakeholders, or diving into user research, I focus on understanding what truly creates value — not just for the user, but for the business growing behind it.   `

The Hero must be expressed using the cloned website's strongest existing hero composition.

Do not create an unrelated generic portfolio hero.

8\. ABOUT
=========

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   type About = {    heading: string;    body: string;  };   `

Limits:

*   heading: 100 chars
    
*   body: 1500 chars
    

Seed content:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Heading:  A Computer Science engineer, but that's just one part of my story.  Body:  Over the years I have taken on different roles such as co-founder, chairperson, developer, mentor, and manager. These experiences naturally placed me in environments where decisions mattered and where solving real problems required thoughtful thinking.  I have always been deeply interested in technology. From exploring new products to following industry developments, I enjoy understanding how things are built and why they work the way they do. That curiosity has remained constant. What has evolved is where I want to contribute in that process.  Product management is where everything comes together for me. It sits at the intersection of people, business, and problem solving. That is the space where I am most excited to build and contribute.   `

Render paragraphs by splitting on blank lines.

9\. STATS
=========

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   type StatItem = {    id: string;    value: string;    label: string;    icon?: ImageRef;  };   `

Limits:

*   value: 12 chars
    
*   label: 40 chars
    
*   maximum number of items must be enforced according to the original schema/implementation constraints
    
*   icon: 1:1
    

Seed:

*   12+ — Projects done
    
*   5 — Verticals covered
    
*   1 — Real product shipped
    
*   PM certified — represented by the IBM icon, with an empty value
    

Do not invent missing assets.

10\. EXPERIENCE
===============

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   type ExperienceItem = {    id: string;    company: string;    role: string;    startDate: string;    endDate: string | "present";    bullets: string[];    highlight?: string;    tags?: string[];    logo?: ImageRef;  };   `

Limits:

*   company: 60
    
*   role: 60
    
*   bullets: maximum 4
    
*   each bullet: 300
    
*   highlight: 160
    
*   tags: maximum 6
    
*   each tag: 20
    
*   logo: 1:1
    

Current seed experience:

### Final Apps

**Associate Product Manager - Growth**June 2026 — Present

*   Led product growth for FSEO.ai by identifying key onboarding, activation, and retention bottlenecks through user behavior analysis and customer feedback.
    
*   Planned and executed growth initiatives that increased user activation by 58% and drove 275%+ growth in Monthly Recurring Revenue (MRR) through improvements across the user journey and monetization strategy.
    
*   Currently leading the development of a new commerce platform that reimagines ecommerce for enthusiast communities by combining community-driven content with shoppable product experiences across niches such as mechanical keyboards, PC building, workspace setups, and coffee stations.
    

Highlight:

> Drove 58% higher user activation and 275%+ MRR growth while leading product strategy for two ecommerce products

### Final Apps

**Product Management Intern**April 2026 — June 2026

*   Worked with the product team of FSEO.ai to understand merchant needs, customer feedback, and the end-to-end workflows of a Shopify SaaS product in the emerging agentic commerce ecosystem.
    
*   Researched user behavior and the e-commerce ecosystem to identify opportunities for improving merchant activation and retention.
    
*   Collaborated with design and engineering teams to support product improvements aimed at making AI search optimization more accessible for Shopify merchants.
    

Highlight:

> Contributed to product growth initiatives for a Shopify AI SaaS platform serving merchants in the emerging Answer Engine Optimization (AEO) space

### Revyne Studio

**Co-Founder & Finance Officer**December 2024 — August 2025

*   Co-founded a media production and marketing agency and helped define the initial service offering, pricing model, and growth strategy.
    
*   Worked closely with clients and internal teams to understand needs, shape solutions, and translate requirements into clear project scopes.
    
*   Built the company's financial and performance tracking system, creating visibility into revenue, costs, and project profitability to support data-driven decisions.
    
*   Regularly reviewed performance metrics and client feedback to refine offerings and improve overall service quality.
    

Highlight:

> Took the company from zero to five-figure monthly revenue within the first year

### iTurn - UC Monks

**Software Developer Intern (Internship)**June 2024 — November 2024

*   Worked with senior developers on the Flutter codebase, contributing to front end features that shipped to production.
    
*   Translated feature requirements into UI components and integrated APIs to support core product functionality.
    
*   Fixed bugs, improved UI responsiveness, and helped maintain a stable user experience across releases.
    
*   Collaborated with developers to understand implementation trade-offs and how technical decisions impact product behavior and user experience.
    

Highlight:

> Left with a stronger understanding of how product decisions affect technical implementation and UX

11\. PROJECTS & CASE STUDIES
============================

Projects are grouped by vertical.

Allowed verticals:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   type ProjectVertical =    | "Product Creation"    | "Product Design"    | "Product Improvement"    | "Analytical Case Studies"    | "Product Teardowns";   `

Project model:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   type ProjectItem = {    id: string;    vertical: ProjectVertical;    title: string;    coverImage: ImageRef;    overview: string;    resultsAndImpact?: string;    liveUrl?: string;    caseStudyUrl?: string;    tags?: string[];  };   `

Limits:

*   title: 90
    
*   overview: 600
    
*   resultsAndImpact: 600
    
*   tags: max 6
    
*   tag: max 20
    
*   cover image: 16:9
    

Current projects:

### Product Creation

**UCEK Events: Campus Event Discovery and Management Platform**

Overview:

UCEK Events is a web-based event discovery and management platform built for college students. It came from a real observation: events were happening, but participation was low because information was scattered across places. UCEK Events brought everything into one place, making it easier for students to find events and register, and for organizers to manage them.

Results and impact:

The platform was adopted across 10+ college clubs, with 20+ events listed and 200+ student registrations recorded. Features like Gmail login, prefilled registrations, and QR-based attendance meaningfully reduced friction for both students and organizers, replacing scattered event updates and manual registration entirely. Event participation picked up noticeably compared to before, validating that the core problem of discovery friction was real.

### Product Design

**ProposalPilot: Designing an AI Proposal Engine for Small Business Owners**

Overview:

ProposalPilot is an AI product that helps small business owners respond to US government contracts faster and with less confusion. The US government spends over 700 billion dollars a year on contracts, but winning one requires reading through 50-page documents, understanding complex legal language, and writing a fully compliant proposal. Most small businesses either give up or hire expensive consultants just to compete. ProposalPilot cuts that process down to under 10 minutes: the AI reads the contract, matches it against the user's business profile, and generates a ready-to-review proposal draft.

There are currently no populated projects in:

*   Product Improvement
    
*   Analytical Case Studies
    
*   Product Teardowns
    

**Do not invent projects.**

Those categories should simply not render publicly when empty.

They must still be manageable through the Studio.

12\. TOOLS
==========

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   type ProficiencyLevel =    | "Beginner"    | "Intermediate"    | "Expert";  type ToolItem = {    id: string;    name: string;    icon: ImageRef;    level: ProficiencyLevel;  };   `

Current tools:

*   Notion — Intermediate
    
*   Figma — Intermediate
    
*   Canva — Expert
    
*   ClickUp — Intermediate
    
*   Jira — Beginner
    
*   Google Analytics — Beginner
    
*   Tableau — Beginner
    
*   Power BI — Beginner
    

Icons are 1:1 images.

13\. CORE SKILLS
================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   type SkillGroup = {    id: string;    category: string;    skills: string[];  };   `

Limits:

*   category: 40 chars
    
*   maximum 10 skills per group
    
*   each skill: 40 chars
    

Current groups:

### Product Thinking

*   User Research
    
*   Problem Framing
    
*   Prioritization
    
*   Product Strategy
    
*   Roadmapping
    

### Execution and Delivery

*   Agile Workflows
    
*   Cross-functional Collaboration
    
*   Stakeholder Management
    
*   Feature Scoping
    
*   Go-to-Market Planning
    

### Data and Decision Making

*   Product Analytics
    
*   Metrics Definition
    
*   A/B Testing
    
*   User Behavior Analysis
    
*   Insight Synthesis
    

14\. CERTIFICATIONS
===================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   type CertificationItem = {    id: string;    title: string;    issuer: string;    date?: string;    credentialId?: string;    credentialUrl?: string;    badge?: ImageRef;  };   `

Limits:

*   title: 90
    
*   issuer: 50
    
*   badge: 1:1
    

Current:

### Product Management Specialization

IBMCredential ID: Z3MI8HBQU7X9

### Introduction to Agile Development and Scrum

IBMCredential ID: T134ZB03S4IP

### The Fundamentals of Digital Marketing

Google Digital GarageCredential ID: 7AX 8CU GSR

Do not invent dates, URLs, badges, or other missing information.

15\. EDUCATION
==============

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   type EducationItem = {    id: string;    degree: string;    institution?: string;    startYear: string;    endYear: string;  };   `

Current:

### Bachelor of Technology (Computer Science & Engineering)

University of Kerala2021 — 2025

### Senior Secondary / 12th Grade (Physics, Chemistry, Mathematics, Computer Science)

2020 — 2021

16\. CONTACT
============

Contact is a shared value rather than a standalone page section.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   type ContactInfo = {    email: string;    phone?: string;    linkedinUrl?: string;    resumeUrl?: string;  };   `

Current known data:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Email:  navaneethclpro@gmail.com  Phone:  +91 6282860929   `

LinkedIn and resume are currently placeholders.

**Never invent these URLs.**

The same ContactInfo must be used wherever contact information appears, including the Hero/CTA area and footer.

There must be one source of truth.

17\. EXACT CONTENT SCHEMA
=========================

Use this architecture as the canonical content model:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   type ImageRef = {    url: string;    aspectRatio: "1:1" | "16:9" | "4:3";  };  type ContactInfo = {    email: string;    phone?: string;    linkedinUrl?: string;    resumeUrl?: string;  };  type Hero = {    name: string;    tagline: string;    shortBio: string;    photo: ImageRef;  };  type About = {    heading: string;    body: string;  };  type StatItem = {    id: string;    value: string;    label: string;    icon?: ImageRef;  };  type ExperienceItem = {    id: string;    company: string;    role: string;    startDate: string;    endDate: string | "present";    bullets: string[];    highlight?: string;    tags?: string[];    logo?: ImageRef;  };  type ProjectVertical =    | "Product Creation"    | "Product Design"    | "Product Improvement"    | "Analytical Case Studies"    | "Product Teardowns";  type ProjectItem = {    id: string;    vertical: ProjectVertical;    title: string;    coverImage: ImageRef;    overview: string;    resultsAndImpact?: string;    liveUrl?: string;    caseStudyUrl?: string;    tags?: string[];  };  type ProficiencyLevel =    | "Beginner"    | "Intermediate"    | "Expert";  type ToolItem = {    id: string;    name: string;    icon: ImageRef;    level: ProficiencyLevel;  };  type SkillGroup = {    id: string;    category: string;    skills: string[];  };  type CertificationItem = {    id: string;    title: string;    issuer: string;    date?: string;    credentialId?: string;    credentialUrl?: string;    badge?: ImageRef;  };  type EducationItem = {    id: string;    degree: string;    institution?: string;    startYear: string;    endYear: string;  };  type Section =    | {        type: "about";        visible: boolean;        order: number;        data: About;      }    | {        type: "stats";        visible: boolean;        order: number;        items: StatItem[];      }    | {        type: "experience";        visible: boolean;        order: number;        items: ExperienceItem[];      }    | {        type: "projects";        visible: boolean;        order: number;        items: ProjectItem[];      }    | {        type: "tools";        visible: boolean;        order: number;        items: ToolItem[];      }    | {        type: "skills";        visible: boolean;        order: number;        items: SkillGroup[];      }    | {        type: "certifications";        visible: boolean;        order: number;        items: CertificationItem[];      }    | {        type: "education";        visible: boolean;        order: number;        items: EducationItem[];      };  type SiteContent = {    hero: Hero;    contact: ContactInfo;    sections: Section[];  };  type SiteDocument = {    draft: SiteContent;    published: SiteContent;    version: number;    publishedAt: string;    history: {      version: number;      publishedAt: string;      content: SiteContent;    }[];  };   `

**Do not casually redesign or alter this schema.**

The schema is a core product contract.

18\. CONTENT STUDIO
===================

The Studio is one of the most important parts of the product.

It should feel like a polished professional content-management tool, but its visual styling should be compatible with the overall application where appropriate.

The public portfolio and Studio may have different UX needs, but they must share the same underlying content/rendering architecture.

The owner flow:

1.  Go to /studio.
    
2.  Authenticate.
    
3.  Only the owner's authorized email is accepted.
    
4.  See the current published version and publication information.
    
5.  Select a portfolio section.
    
6.  Edit content.
    
7.  Add/remove list entries.
    
8.  Reorder entries within a section.
    
9.  Preview the draft.
    
10.  Switch preview between mobile/tablet/desktop.
    
11.  Publish.
    
12.  See confirmation.
    
13.  Access version history.
    
14.  Restore a previous version.
    

19\. PUBLIC SITE VS STUDIO PREVIEW
==================================

This is a critical architectural rule:

ONE COMPONENT PER PUBLIC SECTION
--------------------------------

The public website and Studio live preview must use the **same section components**.

For example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Public:  ProjectSection(publishedProjects)  Studio Preview:  ProjectSection(draftProjects)   `

NOT:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   PublicProjectSection  StudioProjectPreview   `

with two independently implemented designs.

There must never be two different rendering implementations that can drift apart.

The Studio preview is essentially the public site rendered against draft data.

This is one of the primary mechanisms protecting the site from content-editing regressions.

20\. FIREBASE ARCHITECTURE
==========================

Use Firebase for:

*   Firestore
    
*   Firebase Authentication
    
*   Firebase Storage
    

Firestore stores the entire site document.

The public website reads:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   published   `

The Studio reads/writes:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   draft   `

### Autosave

All Studio edits save to draft.

They must NOT modify published.

### Publish

When Publish is clicked:

1.  append current published to history;
    
2.  keep only the latest 20 history entries;
    
3.  copy draft into published;
    
4.  increment version;
    
5.  update publishedAt;
    
6.  confirm with:Published.
    

### Restore

When restoring:

1.  append the version being replaced to history first;
    
2.  copy selected historical content into published;
    
3.  copy the same content into draft;
    
4.  increment version;
    
5.  preserve the history mechanism;
    
6.  do not silently destroy previous versions.
    

21\. AUTHENTICATION
===================

/studio must be protected by Firebase Auth.

Only Navaneeth's authorized email may access the Studio.

Any other authenticated account must be rejected.

Do not expose Studio data or editing capabilities to unauthorized users.

Do not weaken this security simply to make development easier.

22\. IMAGE UPLOAD SYSTEM
========================

Every image field has a declared aspect ratio.

Images must be cropped to the required ratio **before being saved to Firebase Storage**.

Required ratios:

*   profile photo: 1:1
    
*   stat icons: 1:1
    
*   experience logos: 1:1
    
*   project covers: 16:9
    
*   tool icons: 1:1
    
*   certification badges: 1:1
    

A component must never receive an arbitrary image ratio.

The crop step is part of the Studio's functionality, not an optional enhancement.

23\. CONTENT-SAFETY / LAYOUT GUARDRAILS
=======================================

The entire reason this is a structured Studio rather than a freeform page builder is to prevent content from breaking the design.

Implement all of these.

### Field limits

Every text field must:

*   enforce its maximum length;
    
*   show a live character count;
    
*   prevent exceeding the limit.
    

### List limits

Every list must enforce its maximum number of items.

When maximum count is reached:

**Disable the Add control.**

### Defensive rendering

Even with validation:

*   gracefully truncate overly long content;
    
*   use sensible line clamping where appropriate;
    
*   wrap tags;
    
*   prevent horizontal overflow;
    
*   contain images;
    
*   use fixed aspect-ratio image containers;
    
*   use object-fit: cover where appropriate;
    
*   prevent content from destroying the layout.
    

### Empty states

On the public site:

> Empty sections do not render.

On the Studio:

Show useful owner-facing empty states such as:

> Nothing here yet — add your first project.

Never display broken empty grids, orphaned headings, or blank structural sections publicly.

### Section ordering

The owner can:

*   hide/show sections;
    
*   reorder sections as whole units.
    

The owner cannot rearrange individual fields inside a section.

This is intentional.

24\. DESIGN INTEGRATION RULES
=============================

This is where the existing cloned implementation matters most.

DO NOT APPLY A GENERIC PORTFOLIO DESIGN
---------------------------------------

Do not replace the cloned website's design with:

*   generic SaaS UI
    
*   generic AI portfolio UI
    
*   generic bento portfolio
    
*   generic Apple-style redesign
    
*   generic glassmorphism
    
*   generic dark portfolio
    
*   generic minimal portfolio
    

unless those patterns are genuinely present in the cloned implementation.

The cloned implementation is the visual foundation.

25\. PRESERVE THE CLONED DESIGN'S DNA
=====================================

Identify and preserve its:

*   typography personality
    
*   hierarchy
    
*   visual density
    
*   whitespace
    
*   grid logic
    
*   card language
    
*   image treatment
    
*   border language
    
*   radius language
    
*   color system
    
*   background treatment
    
*   motion language
    
*   interaction language
    
*   navigation behavior
    
*   footer treatment
    
*   responsive philosophy
    

When adapting a section, ask:

> "If the original designer had to build this portfolio section using their own existing design system, how would they build it?"

That is the target.

26\. DO NOT DESTROY EXISTING VISUAL DETAILS
===========================================

Do not simplify or remove distinctive existing features merely because they are inconvenient.

Do not casually replace:

*   animations
    
*   transitions
    
*   typography
    
*   spacing
    
*   image effects
    
*   navigation
    
*   responsive behavior
    
*   component architecture
    
*   hover states
    
*   decorative details
    
*   interactions
    

If something from the cloned implementation can be reused, reuse it.

If something must change to accommodate the portfolio information architecture, change the **minimum necessary amount**.

27\. ADAPT, DON'T PASTE
=======================

A portfolio section may need to be structurally different from the corresponding cloned section.

For example:

The clone might contain:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Featured Work   `

while my portfolio needs:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Projects    Product Creation    Product Design    Product Improvement    Analytical Case Studies    Product Teardowns   `

Do not simply paste five new grids into the page.

Instead:

1.  understand the clone's existing project/work composition;
    
2.  determine its strongest reusable pattern;
    
3.  extend that pattern to support project verticals;
    
4.  preserve its spacing, typography, image treatment, interaction and visual hierarchy;
    
5.  make the categorization feel native.
    

The same principle applies to Experience, Skills, Tools, Certifications, Education and all other sections.

28\. DESKTOP AND MOBILE MUST BE INTENTIONAL
===========================================

Do not simply stack the desktop design on mobile.

The portfolio must behave as a deliberately designed experience at:

*   375px
    
*   tablet widths around 768–1024px
    
*   1440px
    

The exact composition should be based on the cloned implementation's existing responsive philosophy.

Where the cloned design already has distinct mobile behavior, preserve it.

Where a portfolio section requires new behavior, design the mobile composition intentionally.

Never allow:

*   horizontal overflow
    
*   clipped content
    
*   unreadable text
    
*   broken cards
    
*   distorted images
    
*   overlapping elements
    
*   unusable controls
    
*   accidental desktop-only interactions
    
*   inaccessible Studio forms
    

29\. ACCESSIBILITY
==================

Maintain:

*   keyboard navigation
    
*   visible focus states
    
*   semantic HTML
    
*   accessible buttons
    
*   accessible links
    
*   useful labels
    
*   appropriate ARIA only where necessary
    
*   sufficient contrast
    
*   reduced-motion support
    

Every interactive element must have a visible focus state.

Do not sacrifice accessibility to reproduce a visual effect.

30\. MOTION
===========

Reuse the cloned site's motion language wherever possible.

Do not add arbitrary animation merely to make the site look impressive.

Every animation should support:

*   hierarchy
    
*   feedback
    
*   navigation
    
*   materiality
    
*   storytelling
    
*   interaction
    

Respect:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   prefers-reduced-motion   `

When reduced motion is enabled:

*   information must remain available;
    
*   interactions must remain understandable;
    
*   animations can become instant/static;
    
*   nothing essential may disappear.
    

31\. CONTENT IS NOT PLACEHOLDER CONTENT
=======================================

Use the actual supplied Navaneeth content.

Do not replace it with:

*   Lorem ipsum
    
*   fake projects
    
*   fake companies
    
*   fake metrics
    
*   fake URLs
    
*   fake credentials
    
*   fake dates
    
*   invented testimonials
    
*   invented achievements
    

Where an asset is explicitly marked as a placeholder, leave it empty until a real asset exists.

Do not hallucinate missing information.

32\. STUDIO DESIGN
==================

The Studio does not need to literally copy the public site's visual composition.

It needs to be:

*   clean
    
*   professional
    
*   obvious
    
*   efficient
    
*   reliable
    
*   easy to edit
    
*   responsive
    
*   accessible
    

But do not unnecessarily rebuild a Studio shell if useful working functionality already exists in the project.

The Studio's most important properties are functional correctness and safe content management.

33\. DO NOT OVER-ENGINEER
=========================

Do not introduce new libraries when the existing project already contains an appropriate solution.

Before adding:

*   UI libraries
    
*   animation libraries
    
*   state libraries
    
*   form libraries
    
*   drag-and-drop libraries
    
*   styling systems
    

check whether the existing implementation already has a suitable primitive.

Prefer:

> reuse existing infrastructure → extend existing infrastructure → introduce something new only when genuinely necessary.

34\. DO NOT REWRITE WORKING CODE WITHOUT A REASON
=================================================

The cloned implementation is valuable.

If an existing component works:

**reuse it.**

If it can be parameterized:

**parameterize it.**

If it can be extended:

**extend it.**

Do not rewrite it from scratch just because you personally would structure it differently.

Avoid unnecessary refactors.

Avoid "cleaning up" unrelated code.

Avoid changing dependency versions unless necessary.

Avoid changing configuration unless necessary.

Avoid changing existing behavior unless the portfolio requirements genuinely require it.

35\. REQUIRED IMPLEMENTATION ORDER
==================================

Follow this sequence.

PHASE 1 — INSPECT
-----------------

Do not code yet.

Inspect the entire cloned implementation.

Understand it.

PHASE 2 — MAP
-------------

Create the internal design mapping between:

*   existing cloned components
    
*   existing visual primitives
    
*   existing layouts
    
*   portfolio sections
    
*   Studio rendering architecture
    

Identify:

*   reused
    
*   adapted
    
*   extended
    
*   newly created
    

components.

PHASE 3 — ARCHITECTURE
----------------------

Determine how the existing implementation can accommodate:

*   SiteContent
    
*   SiteDocument
    
*   Firebase
    
*   Studio
    
*   public rendering
    
*   shared components
    

without unnecessarily disturbing existing architecture.

PHASE 4 — COMPONENT INTEGRATION
-------------------------------

Implement portfolio sections using the cloned design language.

Do not build all-new visual systems unless absolutely necessary.

PHASE 5 — CONTENT SYSTEM
------------------------

Implement the exact schema.

PHASE 6 — FIREBASE
------------------

Implement:

*   Firestore
    
*   Auth
    
*   Storage
    
*   draft
    
*   published
    
*   history
    
*   publish
    
*   restore
    

PHASE 7 — STUDIO
----------------

Implement:

*   authentication gate
    
*   section navigation
    
*   forms
    
*   character counts
    
*   list management
    
*   entry reordering
    
*   section visibility
    
*   section ordering
    
*   autosave
    
*   image cropping
    
*   live preview
    

PHASE 8 — SHARED RENDERING
--------------------------

Verify that the public site and Studio preview use the exact same public-facing section components.

PHASE 9 — RESPONSIVE PASS
-------------------------

Test:

*   375px
    
*   768px
    
*   1024px
    
*   1440px
    
*   intermediate widths
    

PHASE 10 — REGRESSION AUDIT
---------------------------

Verify that no existing cloned functionality was unintentionally broken.

36\. IMPORTANT DECISION RULE WHEN REQUIREMENTS CONFLICT
=======================================================

Use this hierarchy:

### Highest priority

1.  Do not break functioning behavior.
    
2.  Preserve the existing cloned website's actual design language.
    
3.  Preserve the portfolio's required product architecture and Studio functionality.
    
4.  Preserve the exact content schema and guardrails.
    
5.  Preserve responsive correctness.
    
6.  Preserve accessibility.
    
7.  Preserve performance.
    
8.  Add visual enhancements only when they fit naturally.
    

If a design idea requires breaking architecture or Studio behavior:

**reject the design idea.**

If a portfolio requirement conflicts with an irrelevant cloned content structure:

**adapt the cloned structure.**

If a cloned visual detail can accommodate the portfolio:

**reuse it.**

If a new component is unavoidable:

**make it look native to the existing system.**

37\. CRITICAL ANTI-HALLUCINATION RULE
=====================================

You must never say:

> "The cloned website probably uses..."

when you can inspect the source.

Instead:

> inspect the implementation and determine what it actually uses.

Do not invent missing information.

Do not assume the clone has a particular:

*   font
    
*   color
    
*   layout
    
*   section
    
*   animation
    
*   framework
    
*   breakpoint
    
*   component
    
*   asset
    
*   interaction
    

unless verified from the implementation.

38\. CRITICAL ANTI-REGRESSION RULE
==================================

Before modifying any existing component, understand:

*   who imports it;
    
*   what data it receives;
    
*   what pages use it;
    
*   what responsive behavior it controls;
    
*   what styles depend on it;
    
*   what animations depend on it;
    
*   what state it manages;
    
*   whether it is shared.
    

Then modify it in the smallest safe way.

If a component can be adapted without changing its existing public behavior, prefer that.

39\. FINAL QUALITY BAR
======================

The result should pass this mental test:

### If someone sees the finished website without knowing the project history:

They should believe:

> "This is a portfolio website that was deliberately designed and built for Navaneeth."

They should NOT think:

> "This is someone's website clone with a different person's information inserted."

And they should NOT think:

> "This is a generic AI-generated portfolio."

The design must feel intentional.

The portfolio information architecture must feel natural.

The Studio must feel like a legitimate product feature rather than an afterthought.

The cloned design must remain recognizable and intact.

40\. FINAL ACCEPTANCE CHECKLIST
===============================

Do not consider the implementation complete until every applicable item below has been verified.

Existing implementation
-----------------------

*   Existing application builds successfully.
    
*   Existing routes still work.
    
*   Existing navigation still works.
    
*   Existing animations still work.
    
*   Existing interactions still work.
    
*   Existing responsive behavior still works.
    
*   Existing assets remain functional.
    
*   No unrelated functionality was removed.
    
*   No unnecessary dependencies were introduced.
    
*   No unnecessary refactors were made.
    

Portfolio
---------

*   Hero exists and is always present.
    
*   About works.
    
*   Stats work.
    
*   Experience works.
    
*   Projects work.
    
*   Project verticals work.
    
*   Empty project verticals hide completely.
    
*   Tools work.
    
*   Skills work.
    
*   Certifications work.
    
*   Education works.
    
*   Contact information is shared from one source.
    
*   All supplied real content is used correctly.
    
*   No information was invented.
    

Studio
------

*   /studio requires authentication.
    
*   Only the authorized owner can enter.
    
*   Draft editing works.
    
*   Autosave works.
    
*   Published content remains unchanged while editing draft.
    
*   Character limits are enforced.
    
*   Character counters are visible.
    
*   List limits are enforced.
    
*   Add controls disable at maximum.
    
*   Items can be added.
    
*   Items can be removed.
    
*   Items can be reordered within sections.
    
*   Sections can be shown/hidden.
    
*   Sections can be reordered.
    
*   Freeform page dragging does not exist.
    
*   Image uploads require cropping.
    
*   Aspect ratios are enforced.
    
*   Live preview uses the exact same public components.
    
*   Preview supports mobile/tablet/desktop.
    
*   Publish works.
    
*   Published version updates only after Publish.
    
*   Version history works.
    
*   Restore works.
    
*   History remains intact.
    
*   Maximum 20 history entries are retained.
    

Responsive
----------

*   375px tested.
    
*   768px tested.
    
*   1024px tested.
    
*   1440px tested.
    
*   Intermediate widths tested.
    
*   No horizontal overflow.
    
*   No text clipping.
    
*   No image distortion.
    
*   No broken grids.
    
*   No overlapping content.
    
*   Studio remains usable on mobile/tablet.
    

Accessibility
-------------

*   Keyboard navigation works.
    
*   Focus states are visible.
    
*   Interactive elements are accessible.
    
*   Contrast is sufficient.
    
*   Reduced-motion behavior works.
    
*   No information depends solely on animation.
    

Visual integration
------------------

*   The cloned site's design language remains clearly recognizable.
    
*   Portfolio sections look native to that design.
    
*   No generic replacement design has been introduced.
    
*   New components reuse existing primitives wherever possible.
    
*   Spacing remains coherent.
    
*   Typography remains coherent.
    
*   Card treatments remain coherent.
    
*   Image treatment remains coherent.
    
*   Motion remains coherent.
    
*   Mobile design remains coherent.
    
*   The result does not feel like two different websites stitched together.
    

41\. FINAL INSTRUCTION
======================

**Do not rush into implementation.**

The most important work happens before writing code:

1.  understand the existing cloned website;
    
2.  understand its design language;
    
3.  understand its architecture;
    
4.  understand my portfolio requirements;
    
5.  map one to the other;
    
6.  identify the safest integration strategy;
    
7.  then implement.
    

You are not being asked to reproduce a screenshot.

You are being asked to **merge two systems intelligently**:

### SYSTEM A

The existing cloned website's actual implementation, design language, components, interactions, responsive behavior and visual identity.

### SYSTEM B

My portfolio product specification:

*   personal portfolio
    
*   fixed responsive layouts
    
*   structured content editing
    
*   Firebase-backed Content Studio
    
*   draft/published workflow
    
*   autosave
    
*   version history
    
*   rollback
    
*   authentication
    
*   image cropping
    
*   section visibility
    
*   section ordering
    
*   entry management
    
*   shared public/preview components
    
*   strict content limits
    
*   defensive rendering
    

The goal is not for either system to overpower the other.

The goal is for **System B to become a natural product built inside System A's design language.**

Preserve what already works.

Reuse what already exists.

Adapt intelligently where structures differ.

Create new things only where genuinely necessary.

Never hallucinate the cloned design when the implementation can be inspected.

Never sacrifice architecture for visual convenience.

Never sacrifice responsive reliability for flexibility.

Never sacrifice existing functionality for aesthetics.

**The final result should feel designed, not assembled.**

And above everything else:

> **DO NOT BREAK THE EXISTING WEBSITE.**
> 
> **DO NOT BREAK THE CONTENT STUDIO.**
> 
> **DO NOT BREAK RESPONSIVENESS.**
> 
> **DO NOT INVENT INFORMATION.**
> 
> **DO NOT REPLACE THE CLONED DESIGN WITH A GENERIC AI DESIGN.**
> 
> **INSPECT FIRST. MAP SECOND. IMPLEMENT THIRD. TEST LAST.**