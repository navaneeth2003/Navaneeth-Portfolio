# Navaneeth C L — portfolio + content studio

Next.js 16 site built on the cloned "portfolio-v4" design (Inter Tight, single
continuous background canvas, ghost section titles, laptop-mock project cards,
pill nav, Lenis smooth scroll) with a private, structured
Content Studio at `/studio` so the owner edits content without touching code.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Backend (Supabase)

1. Create a Supabase project and run `supabase/setup.sql` once in the SQL editor
   (creates the single-row `site` table, the `images` bucket, and the
   owner-only row-level policies).
2. Copy `.env.example` to `.env.local` and fill in the project URL, anon key,
   and the comma-separated owner emails. The email list must match
   `owner_emails()` in `supabase/setup.sql` — the database is the real gate.
3. Studio sign-in is a Supabase magic link (email OTP). Only allowlisted
   emails get in; any other account is rejected.
4. **Existing project set up before September 2026?** Run
   `supabase/2026-09-security.sql` once: it closes the `site` table to
   non-owners (the draft, history and stored phone number were readable with
   the anon key), adds the `site_public` view the public page reads, and caps
   uploads to PNG/JPEG/WebP under 8 MB. The app works before and after — it
   falls back to the table until the view exists.

Without Supabase keys the public site renders the built-in seed content and
the studio shows a setup notice.

## How content flows

- `src/lib/types.ts` — the content schema (hero, contact, ordered sections,
  optional site settings: favicon + company banner).
- `src/lib/marquee.ts` — the hero banner's one source of truth (the studio
  list, or the Experience companies until one is set).
- `src/lib/limits.ts` — character and item caps enforced in the studio forms.
- `src/lib/seed.ts` — the real starting content.
- `src/lib/content.ts` — draft autosave, publish (history of 20), restore.
- `src/lib/published.ts` — server-side read of `published` for the home page
  (through the `site_public` view; the table is owner-only).
- `src/lib/urls.ts` — the one gate every owner-typed URL passes before it can
  become an href or src (http/https only; anything else renders as empty).
- `src/components/site/JourneyFlow.tsx` — the journey line behind
  Experience → Projects → Tools, measured from the live sections.
- `src/components/site/PublicSite.tsx` — the one render path. `/` feeds it
  the published content; the studio preview iframe (`/studio/preview`) feeds
  it the draft over `postMessage`. There is no second implementation.

Section components live in `src/components` (the adapted clone components)
and `src/components/site` (sections composed from the clone's primitives).
The studio lives in `src/components/studio`.
