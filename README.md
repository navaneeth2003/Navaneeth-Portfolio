# Navaneeth — Portfolio + Content Studio

A Next.js portfolio with a private, no-code content studio at `/studio`, backed by Supabase.
Built from `docs/navaneeth-portfolio-build-spec.md` (structure & behavior) and the brand canvas
in `docs/ui.png` / `docs/Portfolio_Master_Build_and_Brand_Specification.md` (design). Design
tokens are documented in `docs/DESIGN_NOTES.md`.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Before Supabase is connected the public site renders from the
built-in seed content and `/studio` shows a setup notice — nothing is broken, it's just offline.

## Connect Supabase (one-time)

1. Create a project at supabase.com (free tier is plenty).
2. **SQL Editor** → New query → paste the whole of `supabase/setup.sql` → Run. This creates
   the `site` table, the `images` bucket, and every access policy in one go.
3. Project Settings → **API** → copy the Project URL and the `anon` public key into
   `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Restart `npm run dev`.

Sign-in is an emailed 6-digit code — no OAuth setup needed. First sign-in at `/studio` with
an allowlisted email seeds the database with the real content from the spec — both `draft`
and `published`.

Studio access is an email allowlist (comma-separated) living in two places on purpose:
`NEXT_PUBLIC_OWNER_EMAILS` in `.env.local` (client gate) and `owner_emails()` in
`supabase/setup.sql` (the real enforcement — re-run the script after editing). Change both
together.

Note: Supabase's built-in email service is rate-limited (a handful of codes per hour).
Sessions persist, so sign-ins are rare; if it ever matters, plug custom SMTP into
Supabase Auth settings.

## How it works

- **One render path.** `src/components/site/PublicSite.tsx` renders the whole site. The public
  page feeds it `published` content; the studio preview iframe feeds it `draft`. There is no
  second layout to drift.
- **One row.** The `site` table's single row (`id = 'main'`) holds `draft`, `published`,
  `version`, `published_at`, and up to 20 `history` entries. Studio edits autosave to `draft`;
  Publish copies draft → published and pushes the old version into history; Restore brings any
  history entry back (recording what it replaced first).
- **Layout can't break.** Field lengths and list sizes are capped in the forms
  (`src/lib/limits.ts`), every image is force-cropped to its declared aspect ratio before
  upload, empty sections/verticals simply don't render, and components clamp/wrap defensively.
- **Case studies.** A project can carry an on-site case study (Problem → Impact story
  blocks with metrics and images), edited in the studio and served at
  `/case-study/[projectId]`. With at least one block, the project card's "Read case
  study" links there; otherwise it uses the external URL.

Note: because the spec keeps everything in a single public-readable row, draft content is
technically fetchable before it's published (the site never displays it). If that ever matters,
move `draft` behind an owner-only policy via a column-split or a view.

## Deploy

Deploy to Vercel (repo → vercel.com → add the same env vars). The public page is rendered
per-request, so a publish shows up on the next refresh.
