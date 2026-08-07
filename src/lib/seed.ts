import type { SiteContent } from "./types";

// Navaneeth's real content — spec section 11. Placeholder assets/URLs are left as
// empty strings or omitted (never invented); components render graceful fallbacks.

export const SEED_CONTENT: SiteContent = {
  hero: {
    name: "Navaneeth C L",
    tagline: "Associate Product Manager, Ex-Founder, CS Engineer",
    shortBio:
      "I love building products people enjoy and that deliver real results for the business behind them. Whether it's shaping product vision, aligning stakeholders, or diving into user research, I focus on understanding what truly creates value — not just for the user, but for the business growing behind it.",
    photo: { url: "", aspectRatio: "1:1" },
  },
  contact: {
    email: "navaneethclpro@gmail.com",
    phone: "+91 6282860929",
  },
  sections: [
    {
      type: "about",
      visible: true,
      order: 1,
      data: {
        heading: "A Computer Science engineer, but that's just one part of my story.",
        body: "Over the years I have taken on different roles such as co-founder, chairperson, developer, mentor, and manager. These experiences naturally placed me in environments where decisions mattered and where solving real problems required thoughtful thinking.\n\nI have always been deeply interested in technology. From exploring new products to following industry developments, I enjoy understanding how things are built and why they work the way they do. That curiosity has remained constant. What has evolved is where I want to contribute in that process.\n\nProduct management is where everything comes together for me. It sits at the intersection of people, business, and problem solving. That is the space where I am most excited to build and contribute.",
      },
    },
    {
      type: "stats",
      visible: true,
      order: 2,
      items: [
        { id: "stat-1", value: "12+", label: "Projects done" },
        { id: "stat-2", value: "5", label: "Verticals covered" },
        { id: "stat-3", value: "1", label: "Real product shipped" },
        { id: "stat-4", value: "", label: "PM certified" },
      ],
    },
    {
      type: "experience",
      visible: true,
      order: 3,
      items: [
        {
          id: "exp-1",
          company: "Final Apps",
          role: "Associate Product Manager - Growth",
          startDate: "2026-06",
          endDate: "present",
          bullets: [
            "Led product growth for FSEO.ai by identifying key onboarding, activation, and retention bottlenecks through user behavior analysis and customer feedback.",
            "Planned and executed growth initiatives that increased user activation by 58% and drove 275%+ growth in Monthly Recurring Revenue (MRR) through improvements across the user journey and monetization strategy.",
            "Currently leading the development of a new commerce platform that reimagines ecommerce for enthusiast communities by combining community-driven content with shoppable product experiences across niches such as mechanical keyboards, PC building, workspace setups, and coffee stations.",
          ],
          highlight:
            "Drove 58% higher user activation and 275%+ MRR growth while leading product strategy for two ecommerce products",
        },
        {
          id: "exp-2",
          company: "Final Apps",
          role: "Product Management Intern",
          startDate: "2026-04",
          endDate: "2026-06",
          bullets: [
            "Worked with the product team of FSEO.ai to understand merchant needs, customer feedback, and the end-to-end workflows of a Shopify SaaS product in the emerging agentic commerce ecosystem.",
            "Researched user behavior and the e-commerce ecosystem to identify opportunities for improving merchant activation and retention.",
            "Collaborated with design and engineering teams to support product improvements aimed at making AI search optimization more accessible for Shopify merchants.",
          ],
          highlight:
            "Contributed to product growth initiatives for a Shopify AI SaaS platform serving merchants in the emerging Answer Engine Optimization (AEO) space",
        },
        {
          id: "exp-3",
          company: "Revyne Studio",
          role: "Co-Founder & Finance Officer",
          startDate: "2024-12",
          endDate: "2025-08",
          bullets: [
            "Co-founded a media production and marketing agency and helped define the initial service offering, pricing model, and growth strategy.",
            "Worked closely with clients and internal teams to understand needs, shape solutions, and translate requirements into clear project scopes.",
            "Built the company's financial and performance tracking system, creating visibility into revenue, costs, and project profitability to support data-driven decisions.",
            "Regularly reviewed performance metrics and client feedback to refine offerings and improve overall service quality.",
          ],
          highlight: "Took the company from zero to five-figure monthly revenue within the first year",
        },
        {
          id: "exp-4",
          company: "iTurn - UC Monks",
          role: "Software Developer Intern (Internship)",
          startDate: "2024-06",
          endDate: "2024-11",
          bullets: [
            "Worked with senior developers on the Flutter codebase, contributing to front end features that shipped to production.",
            "Translated feature requirements into UI components and integrated APIs to support core product functionality.",
            "Fixed bugs, improved UI responsiveness, and helped maintain a stable user experience across releases.",
            "Collaborated with developers to understand implementation trade-offs and how technical decisions impact product behavior and user experience.",
          ],
          highlight:
            "Left with a stronger understanding of how product decisions affect technical implementation and UX",
        },
      ],
    },
    {
      type: "projects",
      visible: true,
      order: 4,
      items: [
        {
          id: "proj-1",
          vertical: "Product Creation",
          title: "UCEK Events: Campus Event Discovery and Management Platform",
          coverImage: { url: "", aspectRatio: "16:9" },
          overview:
            "UCEK Events is a web-based event discovery and management platform built for college students. It came from a real observation: events were happening, but participation was low because information was scattered across places. UCEK Events brought everything into one place, making it easier for students to find events and register, and for organizers to manage them.",
          resultsAndImpact:
            "The platform was adopted across 10+ college clubs, with 20+ events listed and 200+ student registrations recorded. Features like Gmail login, prefilled registrations, and QR-based attendance meaningfully reduced friction for both students and organizers, replacing scattered event updates and manual registration entirely. Event participation picked up noticeably compared to before, validating that the core problem of discovery friction was real.",
        },
        {
          id: "proj-2",
          vertical: "Product Design",
          title: "ProposalPilot: Designing an AI Proposal Engine for Small Business Owners",
          coverImage: { url: "", aspectRatio: "16:9" },
          overview:
            "ProposalPilot is an AI product that helps small business owners respond to US government contracts faster and with less confusion. The US government spends over 700 billion dollars a year on contracts, but winning one requires reading through 50-page documents, understanding complex legal language, and writing a fully compliant proposal. Most small businesses either give up or hire expensive consultants just to compete. ProposalPilot cuts that process down to under 10 minutes: the AI reads the contract, matches it against the user's business profile, and generates a ready-to-review proposal draft.",
        },
      ],
    },
    {
      type: "tools",
      visible: true,
      order: 5,
      items: [
        { id: "tool-1", name: "Notion", level: "Intermediate", icon: { url: "", aspectRatio: "1:1" } },
        { id: "tool-2", name: "Figma", level: "Intermediate", icon: { url: "", aspectRatio: "1:1" } },
        { id: "tool-3", name: "Canva", level: "Expert", icon: { url: "", aspectRatio: "1:1" } },
        { id: "tool-4", name: "ClickUp", level: "Intermediate", icon: { url: "", aspectRatio: "1:1" } },
        { id: "tool-5", name: "Jira", level: "Beginner", icon: { url: "", aspectRatio: "1:1" } },
        { id: "tool-6", name: "Google Analytics", level: "Beginner", icon: { url: "", aspectRatio: "1:1" } },
        { id: "tool-7", name: "Tableau", level: "Beginner", icon: { url: "", aspectRatio: "1:1" } },
        { id: "tool-8", name: "Power BI", level: "Beginner", icon: { url: "", aspectRatio: "1:1" } },
      ],
    },
    {
      type: "skills",
      visible: true,
      order: 6,
      items: [
        {
          id: "skill-grp-1",
          category: "Product Thinking",
          skills: ["User Research", "Problem Framing", "Prioritization", "Product Strategy", "Roadmapping"],
        },
        {
          id: "skill-grp-2",
          category: "Execution and Delivery",
          skills: [
            "Agile Workflows",
            "Cross-functional Collaboration",
            "Stakeholder Management",
            "Feature Scoping",
            "Go-to-Market Planning",
          ],
        },
        {
          id: "skill-grp-3",
          category: "Data and Decision Making",
          skills: [
            "Product Analytics",
            "Metrics Definition",
            "A/B Testing",
            "User Behavior Analysis",
            "Insight Synthesis",
          ],
        },
      ],
    },
    {
      type: "certifications",
      visible: true,
      order: 7,
      items: [
        {
          id: "cert-1",
          title: "Product Management Specialization",
          issuer: "IBM",
          credentialId: "Z3MI8HBQU7X9",
        },
        {
          id: "cert-2",
          title: "Introduction to Agile Development and Scrum",
          issuer: "IBM",
          credentialId: "T134ZB03S4IP",
        },
        {
          id: "cert-3",
          title: "The Fundamentals of Digital Marketing",
          issuer: "Google Digital Garage",
          credentialId: "7AX 8CU GSR",
        },
      ],
    },
    {
      type: "education",
      visible: true,
      order: 8,
      items: [
        {
          id: "edu-1",
          degree: "Bachelor of Technology (Computer Science & Engineering)",
          institution: "University of Kerala",
          startYear: "2021",
          endYear: "2025",
        },
        {
          id: "edu-2",
          degree: "Senior Secondary / 12th Grade (Physics, Chemistry, Mathematics, Computer Science)",
          startYear: "2020",
          endYear: "2021",
        },
      ],
    },
  ],
};
