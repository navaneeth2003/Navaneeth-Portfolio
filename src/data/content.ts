export const site = {
  name: "Rohit Anand",
  role: "Brand & Product Designer",
  email: "rohitkumarverma1834@gmail.com",
  phoneDisplay: "+91 7619905397",
  phoneHref: "tel:+917619905397",
  calendly: "https://calendly.com/rohitanand46/30min",
  resumeHref:
    "https://drive.google.com/drive/folders/1NlcUL0YUpfkJ_FxKs9jYn8wXACJpH-1K",
  contraHref: "https://contra.com/rohitanand",
  heroImage:
    "https://framerusercontent.com/images/NCuD7GcinbBboxqp5U7sNNdYgE.png?width=3708&height=2012",
  aboutImage:
    "https://framerusercontent.com/images/waunbo3Tfqp2I3gqZd3znFRolbk.png?width=1536&height=1024",
  ogImage:
    "https://framerusercontent.com/images/OddaxilXD250xuNchKWZsLQEAiM.png",
};

export const navLinks = [
  { label: "Home", href: "#hero", id: "hero" },
  { label: "Work", href: "#projects", id: "projects" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export const hero = {
  subtitle:
    "With a decade of experience, I'm a Brand designer turned UI designer with a strong background in design psychology having expertise mainly in SaaS and B2B brands.",
  quote: "I turn ideas into meaningful products",
};

export const clientLogos = [
  "Transatlantic",
  "Top Shelf",
  "Monnettoyage",
  "kinled",
  "HA5",
  "plánty",
  "fenix",
  "Young Chefs Academy",
];

export const logoImages = [
  "https://framerusercontent.com/images/DKX8nNLoZZxB92PBmnzXiw6dnyc.png?width=335&height=260",
  "https://framerusercontent.com/images/13jqMNeqG1Upup2loSY56JAW3ZI.png?width=414&height=209",
  "https://framerusercontent.com/images/ZlEDGdNiDQZ9piKRypxyjqion0s.png?width=466&height=170",
  "https://framerusercontent.com/images/Z24PMdoluc7bNeOWAko0XI5NE.png?width=371&height=169",
  "https://framerusercontent.com/images/XFFcPPMcnwRIJljvsmGilR0N06Y.png?width=437&height=155",
  "https://framerusercontent.com/images/mVucELipzvAOreLbl0XDvdbw.png?width=364&height=153",
  "https://framerusercontent.com/images/qyn3nMPkpPDFkN2nzCSTZFrsqQE.png?width=421&height=135",
];

export const aboutIntro = {
  heading: "Design that sparks engagement and inspires action",
  body: "With over 11 years of experience in the design industry, I have been crafting innovative design solutions. Worked on over 2200 projects, completed for a global clientele that includes prestigious names like UNICEF, Panasonic, and David Bowie. Currently, I am a visual designer specializing in design research, where I focus on addressing and solving traditional design market challenges.",
};

export const stats = [
  { value: "20+", target: 20, suffix: "+", label: "Websites Done" },
  { value: "11+", target: 11, suffix: "+", label: "Years In Design" },
  { value: "5+", target: 5, suffix: "+", label: "Projects" },
  { value: "45+", target: 45, suffix: "+", label: "Design Awards" },
];

export const services = [
  {
    index: "01",
    title: "Web Design",
    description:
      "Modern, high-performance websites designed to capture attention, communicate clearly, and turn visitors into customers.",
    tags: ["Landing pages", "Portfolio & personal sites"],
    preview:
      "https://framerusercontent.com/images/uXeXgJxfzkTerz0pfVhtpxEj84.png?width=1536&height=1024",
  },
  {
    index: "02",
    title: "Framer Development",
    description:
      "Pixel-perfect Framer websites built with smooth animations, CMS integration, responsive layouts, and performance optimized for a seamless user experience.",
    tags: ["Responsive builds", "Animations", "CMS & SEO"],
    preview:
      "https://framerusercontent.com/images/8trq7EkuyEg4bV16EiQUfXL5Yw.png?width=1536&height=1024",
  },
  {
    index: "03",
    title: "Branding",
    description:
      "Creating memorable brand identities with strategic logos, visual systems, and design language that keeps your brand consistent across every touchpoint.",
    tags: ["Logo design", "Visual systems", "Brand guidelines"],
    preview:
      "https://framerusercontent.com/images/MDGMYcRuoFpgKPfeWwCeM0OI4.png?width=1536&height=1024",
  },
  {
    index: "04",
    title: "UI / UX Design",
    description:
      "I design intuitive digital experiences that feel effortless to use. From SaaS platforms to mobile apps and dashboards, every interface is built to improve usability, engagement, and conversion.",
    tags: ["SaaS platforms", "dashboards", "mobile apps"],
    preview:
      "https://framerusercontent.com/images/UZTJYIRisBcsHGPFhS23IJr5QY.png?width=1536&height=1024",
  },
];

export type Project = {
  name: string;
  tag: string;
  description: string;
  mockTitle: string;
  mockSubtitle: string;
  image: string;
  accent: string;
  href: string;
};

export const projects: Project[] = [
  {
    name: "NorthWay",
    tag: "Website",
    description: "Travel experience that stays with you",
    mockTitle: "Journey that stays with you. Forever",
    mockSubtitle: "Aurora escapes · Norway",
    image:
      "https://framerusercontent.com/images/uXeXgJxfzkTerz0pfVhtpxEj84.png?width=1536&height=1024",
    accent: "#7CFFB2",
    href: "#projects",
  },
  {
    name: "Solixx",
    tag: "Website",
    description: "Solar energy, premium positioning",
    mockTitle: "Ultra-low resistance for maximum efficiency",
    mockSubtitle: "SOLIX · Solar",
    image:
      "https://framerusercontent.com/images/IcAV4IOC7yGj4viq7jBzBKvbm4U.png?width=1536&height=1024",
    accent: "#FFD84D",
    href: "/solixx.html",
  },
  {
    name: "Hubid",
    tag: "Website",
    description: "Luxury watch boutique",
    mockTitle: "The Beyond Ordinary",
    mockSubtitle: "HUBID · Swiss precision",
    image:
      "https://framerusercontent.com/images/MDGMYcRuoFpgKPfeWwCeM0OI4.png?width=1536&height=1024",
    accent: "#FFFFFF",
    href: "/hubid.html",
  },
  {
    name: "RealOne",
    tag: "Website",
    description: "Real-estate 3D template",
    mockTitle: "YOUR APARTMENTS",
    mockSubtitle: "Real Estate 3D Template",
    image:
      "https://framerusercontent.com/images/UZTJYIRisBcsHGPFhS23IJr5QY.png?width=1536&height=1024",
    accent: "#FFB86B",
    href: "/realone.html",
  },
];

export const galleryItems = [
  {
    title: "Build B2B growth that ends in purchase orders",
    image:
      "https://framerusercontent.com/images/Ft5E6vbXEzPW0iVTukukbkCuMM.png?width=1172&height=852",
  },
  {
    title: "The Beyond Ordinary",
    image:
      "https://framerusercontent.com/images/4TOaudXsxkFFwu3h7hRGuBr474g.png?width=1448&height=1086",
  },
  {
    title: "Build the Next Era of Web3 Innovation",
    image:
      "https://framerusercontent.com/images/szufef32UqXtohOmXWbnPWk1RDc.webp?width=1339&height=1080",
  },
  {
    title: "Smarter Finance. Stronger Future.",
    image:
      "https://framerusercontent.com/images/CAnTuyC7rYGbO1sbhC8LNj6E.jpg?width=1080&height=1080",
  },
  {
    title: "Panasonic — Light the future",
    image:
      "https://framerusercontent.com/images/am0JIL2cCzcIYLmZLvS6WH9le3w.jpg?width=2048&height=1529",
  },
  {
    title: "Power Decisions. Drive Real Outcomes.",
    image:
      "https://framerusercontent.com/images/D5to85TmmFI4rAuvfbNqLXriSc.png?width=1448&height=1086",
  },
  {
    title: "Solar Power",
    image:
      "https://framerusercontent.com/images/nqWPDqP2Irs65djTJlJLtKJ5SI.webp?width=1448&height=1086",
  },
  {
    title: "Advanced Web3 Solutions Built for the Future",
    image:
      "https://framerusercontent.com/images/b4CY8gkPahGjizIhAciARATwzlk.png?width=1448&height=1086",
  },
  {
    title: "Work smarter, not harder. All in one workspace.",
    image:
      "https://framerusercontent.com/images/oRhHTzpqddTThlSWiKtFphEd21E.png?width=1448&height=1086",
  },
  {
    title: "Ethereal Mind",
    image:
      "https://framerusercontent.com/images/8fO9XaNyKpuVdGGfeDDRzGUgInY.png?width=1536&height=1024",
  },
];

export const about = {
  title: "With a decade of experience, I'm a Brand designer turned UI designer with a strong background in design psychology having expertise mainly in SaaS and B2B brands.",
  body: "I am a self taught Visual Designer with over 11 years of experience, dedicated to creating impactful, user-centered designs that resonate across multiple platforms. My passion for art began at a young age, evolving into a professional journey driven by self-study and a deep understanding of the craft. Over the years, I've completed more than 2,300 projects for a diverse range of clients, including well-known brands like Panasonic, David Bowie, and UNICEF, helping them craft unique visual identities that stand out.",
  tags: ["Web Design", "Brand Design", "UI Design", "Product Design", "Framer"],
  role: "Designer",
  type: "Freelance",
  period: "2015-Present",
};

export const testimonials = [
  {
    quote:
      "Mark transformed Microshaft's brand with his visionary design. His creativity and attention to detail brought our ideas to life, exceeding all expectations.",
    name: "LAYNE MORGAN",
    role: "COMMERCIAL DIRECTOR, SNAPPLE",
  },
  {
    quote:
      "Mark transformed Microshaft's brand with his visionary design. His creativity and attention to detail brought our ideas to life, exceeding all expectations.",
    name: "ANNA KORHONEN",
    role: "DESIGN DIRECTOR, GIGGLE",
  },
  {
    quote:
      "Mark transformed Microshaft's brand with his visionary design. His creativity and attention to detail brought our ideas to life, exceeding all expectations.",
    name: "TIMOTHY RODGERS",
    role: "HEAD OF PROJECTS, MICROSHAFT",
  },
  {
    quote:
      "Mark transformed Microshaft's brand with his visionary design. His creativity and attention to detail brought our ideas to life, exceeding all expectations.",
    name: "RICK BELLANTE",
    role: "PRODUCT MANAGER, NEXUSGATE",
  },
  {
    quote:
      "Mark transformed Microshaft's brand with his visionary design. His creativity and attention to detail brought our ideas to life, exceeding all expectations.",
    name: "JOSH STEVENS",
    role: "CREATIVE DIRECTOR, NETFLUX",
  },
  {
    quote:
      "Mark transformed Microshaft's brand with his visionary design. His creativity and attention to detail brought our ideas to life, exceeding all expectations.",
    name: "ANITA HOFFMANN",
    role: "LEAD UX DESIGNER, BETA",
  },
];

export const faqs = [
  { index: "01", q: "What does a project look like?", a: "Discovery call, UX wireframes, high-fidelity UI in Figma/Framer, motion pass, responsive build, CMS + SEO setup, handover with Loom walkthroughs." },
  { index: "02", q: "How is the pricing structure?", a: "Fixed-scope packages for landing pages and marketing sites, weekly sprints for product work. You get a transparent quote up-front — no hidden hours." },
  { index: "03", q: "Are all projects fixed scope?", a: "Most marketing sites are fixed scope. Ongoing product and experimentation work runs as flexible weekly sprints you can pause anytime." },
  { index: "04", q: "What is the ROI?", a: "Clients typically see faster load times, higher demo conversion and fewer design revisions — premium positioning that pays back in pipeline." },
  { index: "05", q: "How do we measure success?", a: "We agree on 2–3 KPIs up front: conversion rate, engagement time, or qualified leads — then track them post-launch." },
  { index: "06", q: "What do I need to get started?", a: "Just a 30-min intro call, your logo/content (or rough drafts), and access to your domain. I handle the rest." },
  { index: "07", q: "How easy is it to edit for beginners?", a: "Very. Everything is built in Framer CMS with clean class names, so your team can edit text, images and blog posts without code." },
  { index: "08", q: "Do I need to know how to code?", a: "No. You get a fully visual editor, plus video guides. And I'm one message away if you ever get stuck." },
];

export const socials = [
  { label: "Linkedin", href: "https://linkedin.com/in/rohitanand" },
  { label: "Telegram", href: "https://t.me/rohitanand" },
  { label: "WhatsApp", href: "https://wa.me/917619905397" },
  { label: "Signal", href: "#contact" },
];
