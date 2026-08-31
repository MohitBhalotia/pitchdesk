# Technical SEO Improvements (code-level)

## A. Metadata

### A1. Add `export const metadata` to all public pages missing it
Files to update:
- `src/app/page.tsx` (home — canonical `/`)
- `src/app/(others)/privacy/page.tsx`
- `src/app/(others)/meet-the-team/page.tsx`
- `src/app/(others)/advisors/page.tsx`
- `src/app/(others)/competitions/page.tsx`
- `src/app/(others)/incubations/page.tsx`
- `src/app/(others)/community/crowdfunding/page.tsx`
- `src/app/(others)/community/features/page.tsx`
- `src/app/(others)/community/support/page.tsx`
- `src/app/(others)/community/feedback/page.tsx`

Use the existing `generateSEOMetadata` helper — no new abstraction needed.

### A2. Add async `generateMetadata` to dynamic routes
- `src/app/(others)/competitions/[id]/page.tsx`
- `src/app/(others)/incubations/[id]/page.tsx`

### A3. Add `noindex` to transactional / private pages
- `src/app/(others)/payment/page.tsx` → `robots: { index: false }`
- `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx` → `noindex`
- Remove these from `src/app/sitemap.ts`.

### A4. Enable Twitter card
In both `src/app/layout.tsx` and `src/lib/seo.ts`, uncomment the `twitter:` block. Add `creator: '@pitchdesk'` (replace with real handle).

### A5. Remove `"pitchdeck"` from root `keywords[]`
`src/app/layout.tsx` line 32 — delete the `"pitchdeck"` entry to stop cannibalizing your brand.

### A6. Drop `keywords[]` from feature pages (optional but recommended)
Google ignores `<meta name="keywords">`. The ~15 minutes per page you save can go into body copy variation instead.

---

## B. Structured data (JSON-LD)

### B1. Site-wide Organization + WebSite schema
Move `generateOrganizationSchema()` out of `/about` and into `src/app/layout.tsx` `<head>` so every page inherits it.

Add a new `WebSite` schema with `SearchAction` + `alternateName` for brand disambiguation:

```ts
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PitchDesk',
    alternateName: ['Pitch Desk', 'PitchDesk.in'],
    url: 'https://pitchdesk.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://pitchdesk.in/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}
```

### B2. Add FAQPage schema
- Home page: 6–8 FAQs including the `"Is PitchDesk the same as a pitch deck?"` disambiguation question.
- Every `/features/*` page: 3–5 FAQs.
- Add a reusable helper in `src/lib/seo.ts`:

```ts
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
```

### B3. Event schema for competitions and incubations
Add `@type: "BusinessEvent"` JSON-LD on `/competitions/[id]` and `/incubations/[id]` — makes you eligible for the Google Events carousel.

### B4. Person schema for team and advisors
`/meet-the-team` and `/advisors` pages — one `Person` entry per member with `jobTitle` and `sameAs` (LinkedIn).

### B5. Product / Offer schema for pricing
Once `/pricing` exists, add `Product` + `Offer` JSON-LD with each plan.

---

## C. Heading hierarchy

### C1. Home page H1 rewrite
`src/components/mvpblocks/app-hero.tsx` — change:
```
"Simulate VC Rooms &" / "Refine Your Pitch."
```
to something like:
```
"Practice Your Startup Pitch with AI Judges"
```
Keep the typewriter effect if you want visual flair, but the literal text going into SSR needs the primary keyword.

### C2. Enforce one H1 per page
Audit: search for `<h1` in every page — currently fine, but add a lint rule or manual review.

### C3. Add missing H2 structure
Home page needs explicit H2s:
- H2: "For Startup Founders"
- H2: "For VCs and Investment Firms"
- H2: "How PitchDesk Works"
- H2: "Frequently Asked Questions"

---

## D. Internal linking

### D1. Replace "Learn more" / "Explore Feature" anchors
Use descriptive anchor text = the destination page's primary keyword.
- ❌ `<Link href="/features/ai-pitch-simulator">Learn more</Link>`
- ✅ `<Link href="/features/ai-pitch-simulator">AI pitch simulator</Link>`

### D2. Add contextual inline links in body copy
Every feature page should link to 3–5 other feature pages with keyword anchors inside paragraphs, not just in "Related Features" grids.

### D3. Footer site map
`src/components/mvpblocks/footer-4col.tsx` should list every important page grouped by Founder / VC / Company / Resources. Currently the footer is thin.

---

## E. Sitemap & robots.txt

### E1. Sitemap cleanup (`src/app/sitemap.ts`)
- Remove `/login`, `/signup`, `/payment` from sitemap.
- Add missing public URLs once they exist: `/pricing`, `/for-vcs`, `/for-founders`, `/blog`.
- Add dynamic entries for `/competitions/[id]` and `/incubations/[id]` by fetching IDs at build time.
- Set `lastModified` to actual file mtime or CMS update date instead of `new Date()` (currently all pages look "updated today").

### E2. robots.txt
Current file is fine. Add explicit `Sitemap:` line (already present). Consider adding `Disallow: /login` and `/signup` once they're removed from sitemap.

---

## F. Images & alt text

### F1. Add meaningful alt text
- `src/components/mvpblocks/app-hero.tsx` line 86: `aria-label="Quick Voice Dashboard"` — change to `"PitchDesk AI pitch simulator dashboard"`.
- Verify all team/advisor photos in `/meet-the-team` and `/advisors` have `alt={member.name}`.
- OG image `/og-image.png` — ensure the filename isn't your only alt; the actual `alt` should read like a headline.

### F2. Use `next/image` everywhere
Audit for raw `<img>` tags and convert to `<Image>` — enables automatic `width`, `height`, lazy-loading, and modern formats (WebP/AVIF) which all feed into Core Web Vitals.

---

## G. Canonical URLs

Current: `generateSEOMetadata` sets `alternates.canonical`. Good, but:
- Home page has no page-level metadata → no canonical declared (relies on default).
- Pages missing metadata (listed in A1) have **no canonical** → Google picks one, which may not be the preferred URL.

Fix by completing A1 and A2.

---

## H. Core Web Vitals / performance (secondary but affects rankings)

The lighthouse JSON is in the repo (`pitchdesk.in-lighthouse.json`). Review it and address:
- LCP — likely the hero image. Preload it with `<link rel="preload" as="image">`.
- CLS — `TextGenerateEffect` animating the H1 may cause layout shift. Reserve space.
- JS bundle — audit `framer-motion` usage; heavy animations on marketing pages hurt mobile LCP.

---

## I. Code helper diff example

Add these exports to `src/lib/seo.ts`:

```ts
export function generateWebSiteSchema() { /* see B1 */ }
export function generateFAQSchema(faqs: { question: string; answer: string }[]) { /* see B2 */ }
export function generateEventSchema(event: { name: string; startDate: string; url: string; description: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BusinessEvent',
    name: event.name,
    startDate: event.startDate,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'VirtualLocation', url: event.url },
    description: event.description,
    organizer: { '@type': 'Organization', name: 'PitchDesk', url: 'https://pitchdesk.in' },
  };
}
export function generatePersonSchema(p: { name: string; jobTitle: string; image?: string; sameAs?: string[] }) {
  return { '@context': 'https://schema.org', '@type': 'Person', ...p };
}
```

---
