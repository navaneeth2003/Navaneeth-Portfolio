# Navaneeth — Portfolio + Content Studio

A Next.js portfolio with a private, no-code content studio at `/studio`, backed by Firebase.
Built from `docs/navaneeth-portfolio-build-spec.md` (structure & behavior) and the brand canvas
in `docs/ui.png` / `docs/Portfolio_Master_Build_and_Brand_Specification.md` (design). Design
tokens are documented in `docs/DESIGN_NOTES.md`.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Before Firebase is connected the public site renders from the
built-in seed content and `/studio` shows a setup notice — nothing is broken, it's just offline.

## Connect Firebase (one-time)

1. Create a project at console.firebase.google.com.
2. **Firestore**: create a database (production mode). Paste `firestore.rules` in the Rules tab.
3. **Authentication**: enable the **Google** sign-in provider. Add your dev/prod domains under
   Authorized domains (localhost is pre-authorized).
4. **Storage**: enable it and paste `storage.rules` in the Rules tab.
5. Project settings → Your apps → add a **Web app** → copy the config values.
6. `cp .env.local.example .env.local`, fill in the values, restart `npm run dev`.

First sign-in at `/studio` with navaneethclpro@gmail.com seeds the Firestore document
(`site/main`) with the real content from the spec — both `draft` and `published`.

The owner email lives in three places on purpose: `.env.local` (client gate),
`firestore.rules`, and `storage.rules` (the real enforcement). Change all three together.

## How it works

- **One render path.** `src/components/site/PublicSite.tsx` renders the whole site. The public
  page feeds it `published` content; the studio preview iframe feeds it `draft`. There is no
  second layout to drift.
- **One document.** `site/main` in Firestore holds `draft`, `published`, `version`,
  `publishedAt`, and up to 20 `history` entries. Studio edits autosave to `draft`; Publish
  copies draft → published inside a transaction and pushes the old version into history;
  Restore brings any history entry back (recording what it replaced first).
- **Layout can't break.** Field lengths and list sizes are capped in the forms
  (`src/lib/limits.ts`), every image is force-cropped to its declared aspect ratio before
  upload, empty sections/verticals simply don't render, and components clamp/wrap defensively.
- **Case studies.** A project can carry an on-site case study (Problem → Impact story
  blocks with metrics and images), edited in the studio and served at
  `/case-study/[projectId]`. With at least one block, the project card's "Read case
  study" links there; otherwise it uses the external URL.

Note: because the spec keeps everything in a single public-readable document, draft content is
technically fetchable before it's published (the site never displays it). If that ever matters,
split `draft` into an owner-only document.

## Deploy

Deploy to Vercel (repo → vercel.com → add the same env vars) or Firebase App Hosting. The
public page is rendered per-request, so a publish shows up on the next refresh.
