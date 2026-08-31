# Page-Level Feedback

Legend: ✅ good · ⚠️ needs improvement · ❌ missing / broken

## Home — `src/app/page.tsx`

| Item | Status | Notes |
|---|---|---|
| Page-specific metadata | ❌ | Inherits root layout only — no `export const metadata`, no canonical |
| H1 | ⚠️ | `"Simulate VC Rooms & Refine Your Pitch."` — zero keyword value |
| Keyword placement | ❌ | "AI pitch simulator", "startup pitch practice", "pitchdesk" not in first paragraph |
| VC-side content | ❌ | No VC value prop above the fold |
| FAQ section | ❌ | Missing — biggest quick win for FAQPage schema |
| Internal links to feature pages | ⚠️ | Feature component links exist via FeatureSteps; anchor text is weak |
| Pricing link | ❌ | Pricing is inline only, no `/pricing` route |
| Organization JSON-LD | ❌ | Only on `/about` — should be site-wide via root layout |
| WebSite JSON-LD with SearchAction | ❌ | Missing — important for brand recognition |

**Fix:**
1. Add `export const metadata = generateSEOMetadata({ ..., canonical: '/' })` in `src/app/page.tsx`.
2. Rewrite H1 to: `"Practice Your Startup Pitch with AI Judges | PitchDesk"` (or keep the branded tagline as visual H1 and add an SEO-targeted H2 right below).
3. Add a VC-focused section with H2 "AI-Powered Startup Screening for Investors".
4. Add an FAQ block with 6–8 questions including `"Is PitchDesk the same as a pitch deck?"`, `"How does PitchDesk's AI pitch simulator work?"`, etc. + `FAQPage` JSON-LD.
5. Move `Organization` + new `WebSite` JSON-LD into `src/app/layout.tsx` so every page inherits it.

---

## `/features` — `src/app/(others)/features/page.tsx`

| Item | Status |
|---|---|
| Metadata | ✅ |
| H1 | ✅ |
| JSON-LD | ✅ Breadcrumb + ItemList |
| Internal linking | ✅ |
| VC vs Founder split | ⚠️ Only one section, move up and expand |

**Fix:** Add an H2 comparison table "For Founders | For VCs" higher on the page.

---

## `/features/*` (16 sub-pages)

All 16 use `generateSEOMetadata` with unique titles, descriptions, canonicals, JSON-LD, and breadcrumbs. **Best-in-class section of the site.** Minor improvements:

- Drop `keywords[]` — Google ignores it. Move those phrases into H2/H3/body copy.
- Some pages repeat the exact same phrasing ("Practice your startup pitch with AI judges") — vary wording to avoid near-duplicate content signals.
- Add `aggregateRating` or `review` to `SoftwareApplication` schema once you have real reviews.
- Add `FAQPage` JSON-LD on every feature page (3–5 Q&A per page).

---

## `/about` — `src/app/(others)/about/page.tsx`

| Item | Status |
|---|---|
| Metadata | ✅ |
| Organization JSON-LD | ✅ |
| Breadcrumb JSON-LD | ✅ |
| Team `Person` schema | ❌ |

**Fix:** Add `Person` JSON-LD entries for founders/team with `sameAs` links to LinkedIn.

---

## `/privacy`

❌ **No metadata.** Inherits root title → duplicate title. Privacy pages should be indexable but deprioritized.

**Fix:** Add `generateSEOMetadata({ title: 'Privacy Policy', description: '...', canonical: '/privacy' })`.

---

## `/meet-the-team`

❌ **No metadata.** Listed in sitemap at priority 0.7.

**Fix:** Add metadata + `Person` JSON-LD for each team member.

---

## `/advisors`

❌ **No metadata.** Listed in sitemap at priority 0.6.

**Fix:** Add metadata + `Person` JSON-LD.

---

## `/competitions` + `/competitions/[id]`

❌ **No metadata** on list or detail. Detail page should use `generateMetadata` async for per-competition titles and `Event` JSON-LD.

**Fix:**
```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const comp = await fetchCompetition(params.id);
  return generateSEOMetadata({
    title: `${comp.title} | Startup Pitch Competition`,
    description: comp.shortDescription,
    canonical: `/competitions/${params.id}`,
  });
}
```
Add `Event` schema (type `BusinessEvent`) — hugely valuable because Google has a dedicated Events carousel.

---

## `/incubations` + `/incubations/[id]`

❌ **No metadata.** Same treatment as competitions. Use `Event` or custom `Program` schema.

---

## `/payment`

⚠️ In sitemap + no metadata. **This should be `noindex`** — it's a checkout/billing page.

**Fix:**
1. Remove from sitemap.
2. Add `robots: { index: false }` in metadata.

---

## `/community/*` (crowdfunding, feedback, features, support)

❌ All four pages lack metadata. Listed in sitemap.

**Fix:** Add metadata for each. If these are user-generated thin content, consider `noindex` on `/community/feedback` and `/community/support` specifically.

---

## `/login`, `/signup`

In sitemap at priority 0.8 — **too high** and these should probably be `noindex` (no value for search users, consume crawl budget).

**Fix:** Either remove from sitemap and add `robots: { index: false }`, or lower priority to 0.3.

---

## Missing pages that SHOULD exist

| URL | Why |
|---|---|
| `/pricing` | High commercial intent, pricing is a top-tier search term |
| `/for-vcs` or `/for-investors` | VC-side product has zero dedicated landing page |
| `/for-founders` | Mirror landing page with founder-intent keywords |
| `/blog` | Content marketing for long-tail SEO |
| `/resources/pitch-deck-template` | Lead magnet targeting "pitch deck template" |
| `/compare/pitchdesk-vs-pitch` | Comparison pages for branded "vs" queries |
| `/use-cases/yc-application-prep` | Intent-specific landing pages |

---
