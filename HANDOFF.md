# JICON Website — Handoff Brief (from Claude chat session, July 26, 2026)

## What this is
Fully updated version of the getjicon.com site (repo: github.com/homeplacer/jicon-website,
publishes via GitHub Pages from `main`). All changes below are complete and validated in
`index.html`, `assets/css/styles.css`, `assets/js/main.js`, and `guide.html`.
Chris has reviewed everything in preview. **First task: commit and push these files to `main`.**

## Changes made this session (all approved by Chris)
- Hero: muted looping YouTube video background (placeholder Grand Strand aerial; photo fallback
  kept). White veil over video, dark text. Headline: "Bringing your vision to reality."
- Alternating white/black section rhythm down the page (hero white → strip black → services
  white → work black → visualize white → process black → about white → stats red → reviews
  white → areas black → contact black).
- Animated stat counters w/ static fallbacks: 2021 · 138+ projects · 323,500 sq ft flooring · 100%.
  "Free estimates always" stat removed.
- Three before/after sliders (kitchen/bath/interior) with animated hard-hat worker handle
  (flips with drag direction, bottom-anchored). Placeholder image pairs — swap when real
  before/after photos exist. Touch/pointer/tap + keyboard support.
- Reviews: 3 real reviews verbatim (David G. — Google; Charlie Buxani — Google; Sheryl Sypek —
  Google). NEVER fabricate or edit review text.
- "Visualize your space" section: free AI mockup offer; text/email photo CTAs (sms/mailto
  prefilled to 843-655-4121 / getJICON@gmail.com); demo slider.
- Financing section (white band before contact): soft copy, button currently points to #contact.
- About: original getjicon.com journey text incorporated; closer line uses "creating" not
  "building" (Chris: no home-builder language — they do renovation/remodeling only).
- Copy rules applied: slogan is "Building tomorrow, today"; brand is "JICO Construction" or
  "JICON, LLC" (never "JICON Construction" alone in guide); no "second stories" (license);
  no flooring durability claims; no "one business day" promises; no no-spam line under guide.
- Guide renamed "The Renovation Planning Guide" (no location), rebranded JICO Construction.
- sessionStorage crash fix (exit popup) + prefers-reduced-motion guards.

## Open TODOs (in priority order)
1. **Formspree**: quote wizard + guide forms post to placeholder `your-form-id`. Create free
   Formspree account, replace the form ID in assets/js/main.js. Until then forms fall back to mailto.
2. **Wisetack**: Chris signing up (~24hr approval). Replace financing button `href="#contact"`
   with his personal Wisetack link (marked TODO in index.html).
3. **Google reviews button**: `GOOGLE_REVIEW_LINK` placeholder in reviews section — replace
   with the JICON Google Business Profile share link.
4. **Exit-intent popup**: verify it is desktop-only (Google penalizes mobile interstitials).
5. **Hero video**: swap placeholder YouTube ID (marked in index.html) for real JICON jobsite/
   drone footage when available (upload unlisted to @getJICON channel).
6. **Photos**: gallery + before/after pairs are stock/placeholder. Replace with real project
   photos when Chris shoots them. Visualize-demo slider should become a real room + AI mockup pair.
7. **After push**: verify live at homeplacer.github.io/jicon-website — counters animate,
   sliders drag, no console errors.
8. **DNS cutover** (when Chris says go): GitHub Pages custom domain = getjicon.com (creates
   CNAME file); GoDaddy DNS: A records for apex → 185.199.108.153 / .109. / .110. / .111.153,
   CNAME www → homeplacer.github.io; enable Enforce HTTPS after cert issues.
9. Future roadmap (agreed, post-launch): FAQ section, city-specific service pages
   (N. Myrtle Beach / Conway / Murrells Inlet), project case-study pages, team photos.

## Guardrails
- No fake reviews, stats, or awards. All numbers came from Chris.
- Keep white/red/black theme (red #D71F27). A dark-theme snapshot exists in Chris's downloads
  as jicon-website-DARK-version.zip if ever wanted.
