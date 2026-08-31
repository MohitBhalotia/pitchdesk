# PitchDesk — Technical SEO Audit Report

**Audit date:** 2026-04-09
**Auditor scope:** Full codebase review (Next.js App Router)
**Site age:** ~5 months live
**Domain:** https://pitchdesk.in

---

## 1. Overall Technical SEO Score: **62 / 100**

| Category | Score | Notes |
|---|---|---|
| Metadata implementation | 13 / 20 | Great on `/features/*` and `/about`; missing on ~8 public pages |
| Heading hierarchy | 12 / 15 | H1s exist, but home H1 is keyword-poor |
| Keyword strategy | 7 / 15 | Good feature pages, weak home page, missing VC-side keywords |
| Structured data (JSON-LD) | 11 / 15 | Good Organization/Breadcrumb/SoftwareApp; missing FAQ, Product, Review |
| Sitemap & robots.txt | 8 / 10 | Sitemap mostly complete, missing a few public routes |
| Canonical tags | 7 / 10 | Present via helper, but only on pages using `generateSEOMetadata` |
| OpenGraph / social | 3 / 5 | OG present, **Twitter card is commented out** |
| Internal linking | 3 / 5 | Feature pages cross-link well, home → feature pages is weak |
| Image alt attributes | 3 / 5 | Mostly decorative; missing on several `<img>` / `Image` usages |

**Verdict:** For a 5-month-old startup the SEO foundation is **above average on the feature subpages** but **weak at the top of the funnel** (home page) and **completely silent on VC-side keywords**. With ~2 weeks of focused work you can reach ~85/100.

---

## 2. What's Working Well

- **`src/lib/seo.ts`** helper — good central abstraction for titles/descriptions/canonicals/OG.
- **Per-feature pages** (`/features/ai-pitch-simulator`, etc.) have:
  - Unique metadata with targeted long-tail keywords.
  - JSON-LD (`SoftwareApplication` + `BreadcrumbList`).
  - Clear H1 → H2 → H3 hierarchy.
  - Strong internal cross-linking via "Related Features".
- **Root layout** (`src/app/layout.tsx`) has `metadataBase`, title template, default description, robots, icons, manifest.
- **Sitemap** (`src/app/sitemap.ts`) is programmatic and covers 31 URLs.
- **robots.txt** correctly disallows private app routes (`/dashboard`, `/api`, etc.).
- Google Search Console verification file (`google9374d6af92e4664b.html`) is in place.

---

## 3. Critical Problems (fix first)

### 3.1 Home page has weak on-page SEO
File: `src/app/page.tsx` + `src/components/mvpblocks/app-hero.tsx`

- **H1 is keyword-poor:** `"Simulate VC Rooms & Refine Your Pitch."` — no mention of "AI pitch simulator", "pitch practice", "startup pitch", "pitch deck generator", or the brand.
- H1 uses a `TextGenerateEffect` animation wrapper — confirm it renders the literal text in SSR (it does, but the surrounding `"use client"` on `AppHero` means Google sees it fine; still flag).
- Home page has **no H2/H3 keyword coverage** for the VC-side audience.
- **Only 1 "Introducing Pitch Desk" brand mention above the fold.**
- No FAQ block → missing a huge opportunity for FAQ schema on the most authoritative page.

### 3.2 Missing metadata on ~8 public pages
Pages that appear in `sitemap.ts` or are otherwise public but do **not** export `metadata`:

| Page file | Status |
|---|---|
| `src/app/(others)/privacy/page.tsx` | ❌ no metadata |
| `src/app/(others)/incubations/page.tsx` | ❌ no metadata |
| `src/app/(others)/incubations/[id]/page.tsx` | ❌ no generateMetadata |
| `src/app/(others)/meet-the-team/page.tsx` | ❌ no metadata |
| `src/app/(others)/advisors/page.tsx` | ❌ no metadata |
| `src/app/(others)/competitions/page.tsx` | ❌ no metadata |
| `src/app/(others)/competitions/[id]/page.tsx` | ❌ no generateMetadata |
| `src/app/(others)/payment/page.tsx` | ❌ no metadata |
| `src/app/(others)/community/crowdfunding/page.tsx` | ❌ no metadata |
| `src/app/(others)/community/features/page.tsx` | ❌ no metadata |
| `src/app/(others)/community/support/page.tsx` | ❌ no metadata |
| `src/app/(others)/community/feedback/page.tsx` | ❌ no metadata |
| `src/app/page.tsx` (home) | ⚠️ inherits root layout only — **no page-specific canonical** |

**Impact:** These pages inherit the root template title, so Google sees many pages titled `PitchDesk | AI-Powered Pitch Practice & VC Simulation Platform` → looks like **duplicate titles** in Search Console.

### 3.3 Twitter Card metadata is commented out
`src/app/layout.tsx` lines 65–71 and `src/lib/seo.ts` lines 45–51.
- X/Twitter, Slack, Discord, LinkedIn link unfurling will fall back to default OG (works, but Twitter-specific card type is missing).

### 3.4 Missing pricing page entirely
- No `/pricing` route exists as a standalone URL. Pricing is a component (`simple-pricing`) only shown on the home page.
- "pricing" is a **huge commercial-intent keyword**. Splitting it into `/pricing` would add a high-value URL.
- Not included in sitemap.

### 3.5 VC-side (investor audience) is invisible in SEO
- Root layout `keywords[]` has **zero** VC-side terms (no "AI startup screening", "deal flow automation", "investor CRM", etc.).
- Home page messaging is 100% founder-facing; VC value prop only appears deep inside `/features`.
- No dedicated `/for-vcs` or `/for-investors` landing page even though the product has a full VC side (`src/app/(root)/vc/*`).

### 3.6 Sitemap ↔ page mismatch
Sitemap lists `/payment` with priority 0.7 but `/payment` is effectively a checkout page — should probably be `noindex`, not in the sitemap. Conversely, **`/meet-the-team` and `/advisors` ARE in the sitemap but have no metadata** → indexed as duplicate-title pages.

### 3.7 `keywords` meta tag is used — it does nothing for Google
Every feature page sets `keywords: [...]`. Google has ignored `<meta name="keywords">` since 2009. It's not harmful, but the effort should go into H2s, body copy, and internal anchor text instead.

---

## 4. The "pitchdesk vs pitchdeck" Google problem

**Problem:** When searching `"pitchdesk"` Google shows results for `"pitchdeck"` (a common dictionary-ish word) and your site is buried; for `"pitchdeck"` you don't rank at all.

### Why this happens
1. Google's spell-corrector thinks `"pitchdesk"` is a typo of `"pitchdeck"` because the corpus has millions of "pitch deck" documents and very few "pitchdesk" mentions.
2. Your brand has **low entity authority** — not enough third-party sites say "PitchDesk" for Google to trust it as a proper noun.
3. Your own site **also uses the word "pitchdeck"** in keywords (`src/app/layout.tsx` line 32 includes `"pitchdeck"`), which weakens the brand signal: you're telling Google you're about the generic term, not the brand.

### Fixes (do all of them)

**On-site:**
1. **Remove `"pitchdeck"` from the root `keywords[]`** in `src/app/layout.tsx` — do not cannibalize your own brand.
2. Add an explicit brand disambiguation line above the fold on the home page, e.g.:
   > *PitchDesk (not "pitchdeck") is the AI pitch practice platform for startup founders.*
3. Put "PitchDesk" in the first 100 words of the home page, About page, and every feature page opening paragraph.
4. Add `Organization` schema at the **root layout level** (currently only on `/about`) with:
   - `"name": "PitchDesk"`
   - `"alternateName": ["Pitch Desk", "PitchDesk.in"]`
   - `"url": "https://pitchdesk.in"`
   - full `sameAs` social profile list
5. Add a `WebSite` schema with `potentialAction` `SearchAction` so Google knows the canonical brand name.
6. Create a dedicated page `/pitchdesk-vs-pitchdeck` or FAQ entry answering: *"Is PitchDesk the same as a pitch deck?"* — directly targeting the confusion query.
7. Add internal anchor text: replace generic "Learn more" links with "Learn more about **PitchDesk**".

**Off-site (cannot do from the codebase, but list for the user):**
1. Verify **Google Search Console** property and submit sitemap (you have the HTML file, good).
2. Verify **Bing Webmaster Tools**.
3. Claim **Google Business Profile** (even as a virtual business) with the exact name "PitchDesk".
4. Get brand listings on: Product Hunt, G2, Crunchbase, F6S, BetaList, SaaSHub, AlternativeTo — every one of these is a strong brand-entity signal.
5. Get 3–5 press mentions / guest posts using the exact brand **"PitchDesk"** as anchor text.
6. Wikipedia/Wikidata item (Wikidata is easier; create a Q-item linking PitchDesk → startup → official website).
7. In Google Search Console → **Request Indexing** on the homepage after you ship the fixes.
8. Once you have enough authority, Google will stop the spell-correction and show "Showing results for pitchdesk" or drop the correction entirely.

**About ranking on "pitchdeck":** Honestly, don't chase this. It's a generic term with millions of results and high competition. You will never rank for `"pitchdeck"` alone. Target `"pitch deck generator"`, `"pitch deck practice"`, `"pitch deck maker AI"` — those are winnable and commercially relevant.

---

## 5. Page-Level Feedback (summary — see `01-page-feedback.md` for the full table)

- **Home `/`** — biggest problem. Missing dedicated metadata, weak H1, no VC section, no FAQ, no pricing link that is its own page.
- **`/features`** — solid. Add more H2 structure around "For Founders" / "For VCs".
- **`/features/*` (16 pages)** — best-in-class. Minor: `keywords[]` is wasted effort, move that energy to body copy.
- **`/about`** — good. Add team bios with schema `Person`.
- **`/privacy`, `/meet-the-team`, `/advisors`, `/competitions`, `/payment`, `/incubations`, `/community/*`** — add `export const metadata` via `generateSEOMetadata`.
- **`/pricing`** — does not exist. Create it.
- **`/for-vcs`** — does not exist. Create it as the VC-side landing page.

---

## 6. Files produced in this audit

1. `00-SEO-AUDIT-REPORT.md` — this file
2. `01-page-feedback.md` — per-page detailed findings
3. `02-missing-keywords.md` — 20 high-value missing keywords with placement
4. `03-overused-keywords.md` — 15 overused words/phrases to dial back
5. `04-technical-improvements.md` — concrete code-level fixes
6. `05-final-verdict.md` — top 10 improvements ranked by impact

---
