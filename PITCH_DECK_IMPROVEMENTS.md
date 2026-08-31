# Pitch Deck Feature — Comprehensive Improvement Plan
### Goal: Reach Gamma.ai / Beautiful.ai Level Quality

---

## Current State Summary

All 4 phases (A–D) of the Gamma-style free-form editor are implemented:
- **Phase A:** Element canvas with drag/resize (react-rnd)
- **Phase B:** Rich text via Tiptap, FormatToolbar
- **Phase C:** Shape drawing (rect, circle, line, arrow)
- **Phase D:** Layout presets (22 presets, LayoutPresetPicker)

**Tech stack:** Next.js App Router, MongoDB/Mongoose, OpenAI GPT-4o-mini, Cloudinary, react-rnd, Tiptap, dnd-kit, pptxgenjs, html2canvas+jsPDF, 11 color themes, 7 deck templates, 22 layout presets.

---

## Gaps vs Gamma.ai / Beautiful.ai

| Area | Current | Gamma/Beautiful |
|------|---------|----------------|
| Undo/Redo | ❌ None | ✅ Full history |
| Multi-select elements | ❌ None | ✅ Shift+click, drag-box |
| Font families | ❌ System only | ✅ 100+ Google Fonts |
| Snap-to-grid / guides | ❌ None | ✅ Smart snapping |
| Charts & tables | ❌ None | ✅ Full chart editor |
| Icons library | ❌ None | ✅ 1000s of icons |
| Image search (Unsplash) | ❌ None | ✅ Built-in search |
| AI design suggestions | ❌ None | ✅ Layout AI |
| Presenter mode | ❌ None | ✅ Full slideshow |
| Share / view link | ❌ None | ✅ Public URL |
| Version history | ❌ None | ✅ Time-travel |
| Templates | 11 color variants | 100+ distinct layouts |
| Export (PNG per slide) | ❌ PDF only | ✅ PNG, SVG, PDF |
| AI image in editor | ❌ No direct UX | ✅ Inline generation |
| Context menus | ❌ None | ✅ Right-click |
| Copy/paste across slides | ❌ None | ✅ Clipboard |
| Element grouping | ❌ None | ✅ Group/ungroup |
| Gradient backgrounds | ❌ No UI | ✅ Full gradient picker |
| Slide duplication | ❌ Missing | ✅ One click |
| Slide notes panel | ❌ Basic | ✅ Full notes view |

---

## Improvement Plan (Phased by Priority)

---

## PHASE 1 — Critical Missing Features (Highest ROI)

> Fix the most painful editor gaps. These are things users expect from ANY editor.

---

### 1.1 Undo / Redo System

**Why it's critical:** Users destroy work accidentally with no recovery. This is the #1 missing feature.

**Approach:**
- Maintain `undoStack: SlidesState[]` and `redoStack: SlidesState[]` in the editor page state
- Every change to `slides` (element move, resize, text edit, delete, add, layout apply) pushes a snapshot to `undoStack`
- Cap stack at 50 entries to avoid memory bloat
- Debounce text input — only snapshot after 500ms pause (not every keystroke)
- Keyboard: `Ctrl+Z` undo, `Ctrl+Shift+Z` / `Ctrl+Y` redo
- Toolbar buttons with disabled state when stack is empty

**Files to modify:**
- `src/app/(root)/pitch-deck/[id]/page.tsx` — Add undo/redo state + handlers + toolbar buttons

---

### 1.2 Slide Duplication

**Why it's critical:** Users want to copy a slide and tweak it. Currently completely missing.

**Approach:**
- "Duplicate Slide" in slide thumbnail right-click menu
- Button in slide panel header
- Inserts duplicate immediately after current slide with all elements copied

**Files to modify:**
- `src/app/(root)/pitch-deck/[id]/page.tsx` — Add `handleDuplicateSlide()` handler

---

### 1.3 Copy / Paste Elements (Across Slides)

**Why it's critical:** Can't reuse an element from slide 3 on slide 7. Very common need.

**Approach:**
- `Ctrl+C` copies selected element(s) to a `clipboard: SlideElement[]` React ref
- `Ctrl+V` pastes with +5% x/y offset so it's visible
- Clipboard persists across slide switches (stored in editor-level state)
- Pasting on a different slide inserts there

**Files to modify:**
- `src/app/(root)/pitch-deck/[id]/page.tsx` — Clipboard state + keyboard handlers
- `src/components/pitch-deck/ElementCanvas.tsx` — Emit copy/paste events upward

---

### 1.4 Multi-Element Selection + Group Operations

**Why it's critical:** Can't select multiple elements to move, align, or delete together.

**Approach:**
- `Shift+Click` to add/remove elements from selection (`selectedIds: string[]`)
- Click+drag on empty canvas area to draw a selection rectangle
- When multiple selected:
  - Drag any one of them → all move together (apply same delta)
  - `Delete` key → delete all selected
  - `Ctrl+D` → duplicate all selected
  - Alignment tools apply to bounding box of selection
- Visual: Blue ring outline on all selected elements

**Files to modify:**
- `src/components/pitch-deck/ElementCanvas.tsx` — Multi-select logic, drag-box select
- `src/app/(root)/pitch-deck/[id]/page.tsx` — Lift `selectedIds` to page level

---

### 1.5 Right-Click Context Menus

**Why it's critical:** Right-click is the standard way to discover editing actions. Currently everything is buried in sidebars.

**Approach:**
- Right-click on **element**: Copy, Paste, Duplicate, Delete, Lock/Unlock, Send Forward/Back, Edit Text
- Right-click on **canvas (empty area)**: Paste, Add Text, Add Shape, Select All
- Right-click on **slide thumbnail**: Duplicate, Delete, Insert Slide After, Move to Top/Bottom

**Files to create:**
- `src/components/pitch-deck/ContextMenu.tsx` — Reusable positioned context menu

**Files to modify:**
- `src/components/pitch-deck/ElementCanvas.tsx` — `onContextMenu` handler for elements/canvas
- `src/app/(root)/pitch-deck/[id]/page.tsx` — Context menu for slide thumbnails

---

### 1.6 Snap-to-Grid and Alignment Guides

**Why it's critical:** Elements look misaligned without snapping. This is what makes a slide look professional.

**Approach:**
- Grid toggle: 10% increment grid overlay (show/hide)
- While dragging, snap to: grid lines, slide center, slide thirds, other element edges
- Smart guides: Dashed lines appear when element aligns with another (Figma-style)
- Hold `Alt` to temporarily disable snapping

**Files to modify:**
- `src/components/pitch-deck/ElementCanvas.tsx` — Override `onDrag` callback for snapping logic

**Files to create:**
- `src/components/pitch-deck/SnapGuides.tsx` — SVG overlay for dashed guide lines

---

## PHASE 2 — Major Value Features (Big Wow Factor)

> Features that visibly upgrade the product quality and close the gap with Gamma.

---

### 2.1 Presenter / Slideshow Mode

**Why:** There is literally no way to present your own deck. This is a core missing feature.

**Approach:**
- New route: `/pitch-deck/[id]/present`
- Fullscreen view, one slide at a time at maximum viewport size
- Navigation: Left/Right arrow keys, spacebar, click
- Speaker notes panel: Toggleable bottom drawer showing `slide.notes`
- Slide counter: "3 / 12" displayed in corner
- `Escape` to exit back to editor
- Smooth transitions: Fade (default), Slide Left/Right (configurable)
- "Present" button in the editor top bar

**Files to create:**
- `src/app/(root)/pitch-deck/[id]/present/page.tsx`
- `src/components/pitch-deck/PresentationView.tsx`

---

### 2.2 Font Family Selection (Google Fonts)

**Why:** Font choice is the single biggest design lever. System fonts make everything look generic.

**Approach:**
- Load 20–30 Google Fonts via CSS import (no build-time performance hit)
- Font picker dropdown in FormatToolbar and element property inspector
- Suggested fonts: Inter, Montserrat, Poppins, Playfair Display, Raleway, DM Sans, Space Grotesk, Syne, Nunito, Lato, Roboto, Source Sans Pro, Bricolage Grotesque, Cabinet Grotesk, Outfit
- Store `fontFamily?: string` on `TextElement`
- Templates define a heading font + body font pairing

**Files to modify:**
- `src/types/slide-elements.ts` — Add `fontFamily?: string` to TextElement
- `src/components/pitch-deck/FormatToolbar.tsx` — Add font picker dropdown
- `src/components/pitch-deck/ElementContent.tsx` — Apply `fontFamily` style on render
- `src/models/PitchDeckModel.ts` — Add `fontFamily` to element schema
- `src/lib/pptx-export.ts` — Map Google Font names to nearest PPTX fonts

---

### 2.3 Gradient Backgrounds (Per Slide)

**Why:** Flat background colors make slides look dull. Gradients are a core design feature of Gamma and Beautiful.ai.

**Approach:**
- `slide.background` already stores a CSS string — extend UI to support gradient syntax
- Gradient picker UI: preset gallery (20 gradients) + custom angle + 2 color stops
- Preset gradients: Midnight, Ocean, Sunset, Forest, Aurora, Dusk, Fire, Slate, etc.
- Store as standard CSS: `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`

**Files to modify:**
- `src/app/(root)/pitch-deck/[id]/page.tsx` — Replace plain color picker with GradientPicker

**Files to create:**
- `src/components/pitch-deck/GradientPicker.tsx` — Gradient editor with presets + custom

---

### 2.4 PNG Export Per Slide

**Why:** Users want to share individual slides as images (email, social, Notion). PDF-only is limiting.

**Approach:**
- `html2canvas` is already in the project — reuse it
- "Export PNG" option in export menu → downloads ZIP of all slides as individual PNGs
- Right-click on slide thumbnail → "Save as PNG" for single slide
- Resolution options: 1× (1280px) and 2× retina (2560px)

**Files to create:**
- `src/lib/png-export.ts` — Slide-to-canvas-to-PNG utility

**Files to modify:**
- `src/app/(root)/pitch-deck/[id]/page.tsx` — Add PNG export button + JSZip for ZIP download

---

### 2.5 Icons Library

**Why:** Icons make slides communicate faster. No way to add icons currently.

**Approach:**
- Lucide is already installed — expose it as insertable elements
- Icon picker panel: Searchable, categorized (Business, Finance, Tech, Healthcare, People, Arrows, Charts)
- ~200 curated "presentation" icons from Lucide
- Insert as a new `icon` element type: stores icon name, color, size
- Icons render as SVG in canvas and in PPTX export

**Files to create:**
- `src/components/pitch-deck/IconPicker.tsx` — Searchable icon browser panel

**Files to modify:**
- `src/types/slide-elements.ts` — Add `icon` element type
- `src/components/pitch-deck/ElementContent.tsx` — Render icon elements as Lucide SVGs

---

### 2.6 AI Chat / Content Assistant

**Why:** Gamma's "AI magic wand" is its killer feature. Users should be able to improve content without full regeneration.

**Approach:**
- Floating AI panel in editor sidebar (toggle button in toolbar)
- Free-form prompt input + quick action buttons:
  - "Make more concise"
  - "Add a statistic"
  - "Rewrite for investors"
  - "Suggest a better headline"
  - "Make it more persuasive"
- Scope selector: Selected element / Current slide / Entire deck
- AI returns revised text → user clicks Accept or Discard
- New API route handles single-element and single-slide level edits

**Files to create:**
- `src/components/pitch-deck/AIAssistPanel.tsx`
- `src/app/api/pitch-deck/ai-assist/route.ts` — GPT-4o powered inline edit endpoint

---

### 2.7 More & Better Templates (30+)

**Why:** 11 templates that are basically color swaps doesn't demonstrate real design range.

**New templates to add (20+):**

| Category | Templates |
|----------|-----------|
| Dark Premium | Obsidian, Carbon, Eclipse, Noir |
| Light / Clean | Ivory, Paper, Snow, Cream |
| Bold / Colorful | Electric, Neon, Candy, Sunset, Aurora |
| Industry | Finance (navy/gold), Healthcare (teal/white), SaaS (purple/blue), EdTech (orange/yellow) |
| Minimalist | Outline, Letterpress, Swiss, Grid |

**Each template must include:**
- Background (solid or gradient)
- Primary + secondary + accent colors
- Typography pairing (heading font + body font)
- Decorative element style (border radius, shadow style, accent bar style)
- Slide-specific accents (title slide vs. content slide)

**Files to modify:**
- `src/components/pitch-deck/templates/` — Add one subfolder per new template
- `src/data/deck-templates.ts` — Register new templates

---

### 2.8 Image Search — Unsplash Integration

**Why:** Users need contextually relevant images. AI image generation is slow and expensive. Unsplash is free and instant.

**Approach:**
- New "Images" panel in editor sidebar
- Search box + grid of results from Unsplash API (free tier: 50 req/hour)
- Click a result → inserts into selected image element OR creates new image element
- Auto-attribution stored as `imageCredit` on element
- Recent searches cached in localStorage

**Files to create:**
- `src/components/pitch-deck/ImageSearchPanel.tsx` — Search UI with grid results
- `src/app/api/pitch-deck/search-images/route.ts` — Unsplash API proxy (hides API key)

---

## PHASE 3 — Polish & Professional Features

---

### 3.1 Element Grouping

Select multiple elements → "Group" → they move and resize as a single unit. Ungroup to edit individually. Stored as a `group` element type containing children array.

---

### 3.2 Charts & Data Visualization

- New `chart` element type: bar, pie, donut, line, area
- Integrate `recharts` (lightweight, React-native)
- Simple data editor: table UI to enter labels + values
- AI generate chart from text: "Show revenue growth: $100K, $250K, $500K, $1.2M"
- Charts export as captured image in PPTX

---

### 3.3 Tables

- New `table` element type with configurable rows/columns
- Click any cell to edit inline
- Header row with distinct styling
- Background color per row or cell
- Paste CSV data to populate

---

### 3.4 Version History

- Store last 20 auto-save snapshots per deck in MongoDB (`PitchDeckVersion` collection)
- "Version History" panel: Timeline of timestamps, preview on hover
- "Restore" button rolls back to that version
- Lightweight — only save when slides actually change (diff check before saving)

---

### 3.5 Share / View-Only Link

- Generate a public UUID share token stored on the deck document
- URL: `/deck/[shareToken]` → read-only presenter view (no editing)
- "Share" button in editor → copy link to clipboard
- Toggle: Public / Private
- Optional password protection for sensitive decks

---

### 3.6 Slide Transition Animations

- Simple CSS transitions between slides in Presenter Mode
- Options per deck: None, Fade, Slide (left/right), Zoom In
- Configurable in deck settings panel

---

### 3.7 Text Enhancements

- **Letter spacing:** Tight / Normal / Wide / Wider slider
- **Paragraph spacing:** Space before/after paragraphs
- **Text shadow:** Offset X/Y + blur + color
- **Highlight color:** Background fill behind selected text
- **Subscript / Superscript** toggle buttons in FormatToolbar
- **All caps / Small caps** toggle

**Files to modify:**
- `src/components/pitch-deck/FormatToolbar.tsx` — Add new controls
- `src/types/slide-elements.ts` — Add `letterSpacing`, `textShadow`, `highlight` to TextElement

---

### 3.8 Shape Enhancements

- **More shapes:** Triangle, Diamond, Star, Pentagon, Hexagon, Parallelogram, Rounded Rectangle, Cloud, Process Arrow
- **Gradient fills** on shapes (using CSS linear-gradient as background)
- **Stroke style:** Solid / Dashed / Dotted selector
- **Drop shadows** on shapes (CSS box-shadow)

**Files to modify:**
- `src/components/pitch-deck/ElementContent.tsx` — Render new shape types as SVG paths
- `src/types/slide-elements.ts` — Extend shape types, add `strokeStyle`, `shadow`

---

### 3.9 Better AI Generation

- **Upgrade to GPT-4o** for noticeably better content quality (configurable via `AI_MODEL` env var)
- **Streaming generation**: Stream slide content one-by-one using `ReadableStream` so users see slides populate in real time rather than waiting 15s
- **Custom slide count**: Let user pick 8 / 10 / 12 / 15 slides in creation wizard
- **Custom narrative arc**: Choose focus — Fundraising, Sales Pitch, Partnership, Internal Strategy
- **Smarter website scraping**: Pass scraped text through a quick AI extraction call (instead of regex) to pull out company name, tagline, product description
- **AI image suggestions**: After deck generation, AI suggests 2–3 relevant Unsplash search terms per slide

**Files to modify:**
- `src/app/api/pitch-deck/generate/route.ts` — Model upgrade, streaming, custom slide count
- `src/app/api/pitch-deck/scrape-website/route.ts` — AI extraction pass on scraped HTML
- `src/app/(root)/pitch-deck/create/page.tsx` — Add slide count + narrative arc selectors

---

### 3.10 PPTX Export Improvements

- **Font mapping:** Map Google Font names to nearest available PPTX fonts (Calibri, Arial, Georgia, etc.)
- **Gradient backgrounds:** Use pptxgenjs gradient fill API for slide backgrounds
- **Proper image handling:** Pre-fetch all image URLs and embed as base64 before export (eliminates broken image links)
- **Speaker notes:** Write `slide.notes` to PPTX notes section (already supported by pptxgenjs)
- **Better text fidelity:** Preserve bold/italic/underline, alignment, and font sizes exactly

**Files to modify:**
- `src/lib/pptx-export.ts` — All of the above improvements

---

### 3.11 Editor UX Polish

- **Zoom controls:** Fit / 50% / 75% / 100% / 125% / 150% — buttons in canvas toolbar
- **Keyboard shortcuts help panel:** Press `?` to open modal listing all shortcuts
- **Auto-save status indicator:** "Saving…" → "Saved ✓" → "Error" in top bar (replace silent save)
- **Slide counter:** "Slide 4 of 12" shown in editor header
- **Slide notes panel:** Expandable bottom drawer for speaker notes per slide
- **Grid overlay toggle:** Button to show/hide background grid dots
- **Better thumbnails:** Show slide type label below each thumbnail

**Files to modify:**
- `src/app/(root)/pitch-deck/[id]/page.tsx` — All UX polish items above

---

## PHASE 4 — Advanced / Premium Features

---

### 4.1 Brand Kit

- Save company colors (primary, secondary, accent) to user profile
- Upload company logo → auto-available as an asset in all decks
- Set company fonts → auto-applied when creating new decks
- Brand kit applied by default on deck creation

---

### 4.2 Deck Analytics

- Track views via share link (Phase 3.5 required)
- Metrics: total views, views per slide, average time per slide, where viewers dropped off
- View count badge on deck cards in dashboard
- Email notification when someone views your deck

---

### 4.3 Collaborative Editing

- Real-time presence: Show collaborator avatars + cursor positions
- Conflict resolution: Last-write-wins per element (not per slide)
- Comment threads on slides (pin a comment to a position)
- Requires: Liveblocks or Pusher integration (WebSocket)

---

### 4.4 AI Auto-Layout

- "Auto-arrange" button: AI analyzes current slide content and suggests better element positions
- AI scores visual balance and gives tips ("Your heading and body text overlap", "Consider centering this metric")
- Integrated into AI Assist panel (Phase 2.6)

---

### 4.5 Interactive Presentation Elements

- Clickable link buttons in slides (open URL on click during presenter mode)
- Animated number counters (count up from 0 to metric value in presenter mode)
- Embedded video (YouTube/Loom URL → plays inline in presenter mode)

---

## Implementation Priority Matrix

| Phase | Feature | Impact | Effort | Priority |
|-------|---------|--------|--------|----------|
| 1 | Undo/Redo | Critical | Medium | **P0** |
| 1 | Slide Duplication | High | Low | **P0** |
| 1 | Copy/Paste Elements | High | Low | **P0** |
| 2 | Presenter Mode | Critical | Medium | **P0** |
| 2 | Font Families | High | Low | **P0** |
| 1 | Multi-element Select | High | Medium | P1 |
| 1 | Context Menus | High | Medium | P1 |
| 1 | Snap-to-grid | Medium | Medium | P1 |
| 2 | Gradient Backgrounds | High | Medium | P1 |
| 2 | PNG Export | High | Low | P1 |
| 2 | AI Chat Assistant | High | Medium | P1 |
| 2 | More Templates (30+) | High | High | P1 |
| 2 | Icons Library | High | Medium | P1 |
| 2 | Image Search (Unsplash) | High | Medium | P1 |
| 3 | Charts & Tables | High | High | P2 |
| 3 | Version History | Medium | Medium | P2 |
| 3 | Share Link | High | Medium | P2 |
| 3 | Text Enhancements | Medium | Low | P2 |
| 3 | Shape Enhancements | Medium | Medium | P2 |
| 3 | Better AI Generation | High | Medium | P2 |
| 3 | PPTX Improvements | Medium | Medium | P2 |
| 3 | Editor UX Polish | Medium | Low | P2 |
| 4 | Brand Kit | High | Medium | P3 |
| 4 | Analytics | Medium | High | P3 |
| 4 | Collaboration | High | Very High | P3 |
| 4 | AI Auto-Layout | Medium | High | P3 |

---

## Recommended Start Order

### Week 1 — Quick Foundation
1. **Slide Duplication** (~1 hr) — trivial array copy in page.tsx
2. **Undo/Redo system** (~4 hr) — snapshot-based, biggest usability win
3. **Copy/Paste elements across slides** (~2 hr) — clipboard ref in page state
4. **Font family picker** (~3 hr) — add `fontFamily` to element + 15 Google Fonts via CSS
5. **PNG export per slide** (~2 hr) — html2canvas already installed
6. **Presenter / Slideshow mode (basic)** (~4 hr) — new route, keyboard nav, fullscreen

### Week 2 — Wow Factor
1. **Gradient background picker** (~3 hr) — preset gallery + custom picker
2. **Right-click context menus** (~3 hr) — reusable ContextMenu component
3. **Multi-element selection** (~4 hr) — shift+click + drag-box in ElementCanvas
4. **Icons library** (~3 hr) — Lucide picker panel + new icon element type
5. **Unsplash image search panel** (~3 hr) — proxy route + search UI
6. **AI Chat assistant panel** (~4 hr) — sidebar panel + ai-assist API route

---

## Files to Modify (Most Impacted)

| File | What Changes |
|------|-------------|
| `src/app/(root)/pitch-deck/[id]/page.tsx` | Undo/redo, multi-select, clipboard, slide duplicate, presenter button, UX polish |
| `src/components/pitch-deck/ElementCanvas.tsx` | Multi-select, snap-to-grid, context menu, copy/paste key events |
| `src/components/pitch-deck/FormatToolbar.tsx` | Font family, letter spacing, highlight, subscript/superscript |
| `src/components/pitch-deck/ElementContent.tsx` | Font family render, icon element type, new shapes |
| `src/types/slide-elements.ts` | icon type, chart type, table type, fontFamily, letterSpacing, etc. |
| `src/models/PitchDeckModel.ts` | Schema additions for new element properties |
| `src/data/layout-presets.ts` | More layout presets (target 50+) |
| `src/lib/pptx-export.ts` | Gradients, fonts, embedded images, notes, new shapes |
| `src/app/api/pitch-deck/generate/route.ts` | GPT-4o upgrade, streaming, custom slide count |
| `src/app/api/pitch-deck/scrape-website/route.ts` | AI extraction pass |

---

## New Files to Create

| File | Purpose |
|------|---------|
| `src/components/pitch-deck/ContextMenu.tsx` | Reusable right-click context menu |
| `src/components/pitch-deck/GradientPicker.tsx` | Gradient background editor with presets |
| `src/components/pitch-deck/IconPicker.tsx` | Lucide icon browser (searchable, categorized) |
| `src/components/pitch-deck/ImageSearchPanel.tsx` | Unsplash image search UI |
| `src/components/pitch-deck/AIAssistPanel.tsx` | AI chat assistant sidebar panel |
| `src/components/pitch-deck/SnapGuides.tsx` | SVG overlay for alignment guide lines |
| `src/components/pitch-deck/PresentationView.tsx` | Fullscreen presenter component |
| `src/app/(root)/pitch-deck/[id]/present/page.tsx` | Presenter mode route |
| `src/app/api/pitch-deck/ai-assist/route.ts` | AI inline content editing endpoint |
| `src/app/api/pitch-deck/search-images/route.ts` | Unsplash API proxy |
| `src/lib/png-export.ts` | PNG export utility using html2canvas |

---

## Quick Wins (Each Under Half a Day)

These can be shipped immediately with minimal risk:

1. **Slide duplication** — Array copy in page state
2. **PNG export per slide** — html2canvas already installed
3. **Keyboard shortcuts help modal** — Press `?` → show list of all shortcuts
4. **Auto-save status indicator** — "Saving…" / "Saved ✓" / "Error" in top bar
5. **Slide counter** — "Slide 4 of 12" in editor header
6. **Font size presets** — S / M / L / XL quick buttons next to font size input
7. **Insert slide before/after** — Add to slide thumbnail right-click
8. **Slide type label** — Show slide type name below each thumbnail
9. **Zoom fit button** — "Fit to screen" single button in canvas toolbar
10. **Select All** — `Ctrl+A` selects all elements on current slide

---

*Last updated: 2026-04-15*
