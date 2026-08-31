# 15 Overused Keywords / Phrases

Ripgrep of `src/` and content files shows several phrases repeated to the point of keyword stuffing or thin variation.

| # | Phrase | Approx. occurrences | Why it's a problem | Suggested replacement |
|---|---|---|---|---|
| 1 | **"AI pitch simulator"** | 30+ | Appears verbatim on 10+ pages in title, H1, body, meta, and alt — near-duplicate signal | Vary with *"AI pitch practice room"*, *"virtual investor simulator"*, *"AI pitch rehearsal tool"* |
| 2 | **"Practice your startup pitch with AI judges"** | 12+ | Identical sentence on multiple pages → duplicate content risk | Rewrite each page: *"Rehearse with AI judges"*, *"Simulate investor Q&A"*, *"Pitch to an AI VC panel"* |
| 3 | **"real VC meetings"** | 15+ | Repeats in every feature page intro | Swap with *"actual investor calls"*, *"live pitch meetings"*, *"real fundraising conversations"* |
| 4 | **"tough questions"** | 10+ | Cliché, overused in body copy | *"rigorous investor-style questioning"*, *"drill-down follow-ups"* |
| 5 | **"instant feedback"** | 12+ | Used in almost every page | *"immediate scoring"*, *"live coaching"*, *"real-time evaluation"* |
| 6 | **"risk-free practice"** | 8+ | Redundant with "safe" and "private" | Use once per page max |
| 7 | **"complete toolkit"** / **"everything you need"** | 6+ | Generic filler, no keyword value | Replace with specific benefit + keyword |
| 8 | **"Shark Tank style"** | 6+ | Trademark risk + repetitive | Alternate with *"panel-style"*, *"multi-judge format"* — and use Shark Tank sparingly |
| 9 | **"startup founders"** | 40+ | Not stuffing per se but monotonous | Vary with *"early-stage founders"*, *"pre-seed teams"*, *"first-time founders"* |
| 10 | **"pitch"** (as standalone) | 300+ | Keyword density too high on several pages | Some instances can become *"presentation"*, *"deck"*, *"fundraising round"* |
| 11 | **"pitchdeck"** (in keywords array) | 2 | **Cannibalizes the brand** — do not target the misspelled generic | Remove entirely from `src/app/layout.tsx` keywords |
| 12 | **"Get discovered by VCs"** | 8+ | Repeated CTA phrasing | *"Reach investors actively scouting"*, *"Be seen by funds in your sector"* |
| 13 | **"AI-powered"** | 25+ | Buzzword fatigue, Google devalues | Use *"AI"* or *"built on [specific model]"*, or describe the actual capability |
| 14 | **"Simulate real VC meetings"** | 10+ | Near-identical sentence across feature pages | Rewrite each occurrence uniquely |
| 15 | **"platform"** | 60+ | Overused in titles and H1s | Alternate with *"tool"*, *"software"*, *"app"*, *"workspace"* |

## Duplicate title/description risks

- **Root template** `"%s | PitchDesk"` + default title is fine, but pages without `export const metadata` all render as `"PitchDesk | AI-Powered Pitch Practice & VC Simulation Platform"` → fix by adding per-page metadata (see §3.2 of the main report).
- Several feature pages have descriptions that begin with the same phrase (*"Practice your startup pitch with AI judges..."*) — rewrite for variety.

## Action
1. Do a **global find/replace audit** on the 4 most repeated phrases (#1, #2, #3, #14) and rewrite each instance uniquely per page.
2. Keep one "canonical phrasing" per concept per page and vary the rest.
3. Remove `"pitchdeck"` from root layout `keywords[]`.

---
