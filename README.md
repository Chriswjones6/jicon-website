# JICON Construction — website rebuild

A modern, fast, single-page static rebuild of **getjicon.com** for the licensed &
insured general contractor serving the Grand Strand, SC.

Replaces the old barely-customized WordPress "Vlogger" template with a custom,
conversion-focused site built on what the best general-contractor / remodeler
sites do well.

## What's here
```
index.html              # the whole site (one page, anchor-nav sections)
assets/css/styles.css   # dark black/white/red brand theme
assets/js/main.js       # nav, gallery filter, lightbox, reveal, form handling
assets/img/             # real logos + curated renovation photography
```

## Real brand assets used (pulled from getjicon.com)
- `logo-trans.png` — JICON CONSTRUCTION wordmark (black background keyed out for clean edges)
- `logo-black.png` / `logo-white.png` — original logo variants (kept as source)
- Brand colors sampled from the logo: **red #D71F27**, black, white
- Favicon built from JICON's own house/"N" mark

## Photography note (important)
The old site had **no real project photos** — everything on it was leftover
template stock (succulents, puzzle pieces, etc.). So the gallery and section
images here are high-quality, free-license **representative** renovation photos
(Unsplash) used as placeholders.

➡️ **Swap these for JICON's own real project photos** when available. In the
gallery, keep the same `data-cat` values (`kitchen` / `bath` / `interior` /
`exterior` / `craft`) and the filter buttons keep working automatically.
No fake reviews, fake numbers, or fake client names were invented anywhere.

## Lead capture (this is a lead-gen site, not a brochure)
- **Multi-step quote wizard** (`index.html` → `#wiz`) — opens from every CTA on the
  page. Project → property type → timeline → budget → contact. One-tap options,
  progress bar, asks for contact info LAST (converts far better than one big form),
  live project summary, validation, success screen with tap-to-call.
- **Exit-intent popup** — fires once per session when a desktop visitor moves to
  leave (or after deep scroll on mobile). Recovers abandoning traffic.
- **Lead magnet** — free *Grand Strand Renovation Planning Guide* (`guide.html`, a
  branded printable/save-as-PDF page). Captures name + email from people who aren't
  ready to request a quote yet — a second funnel.
- **Persistent floating "Free Quote" button** (desktop) + sticky call/quote bar (mobile).
- **Conversion-tracking events** already firing to `window.dataLayer` /`gtag`:
  `quote_open`, `quote_step`, `quote_submit`, `exit_intent_shown`, `lead_magnet_submit`.
  Add a GA4 / Google Ads tag and conversions light up with zero extra code.

## Best-practices baked in (from top GC/remodeler sites)
- Immersive full-bleed hero + dual CTA (Free Quote + click-to-call)
- Trust strip (licensed & insured, free estimates, res/commercial, local)
- Scannable services grid covering all 16 of JICON's services
- Filterable project gallery with lightbox
- Clear 4-step "how it works" process
- Values / why-us, honest stats band, reviews CTA, service-area list
- "We're hiring" careers band (they're actively recruiting) → Apply Now
- LocalBusiness/GeneralContractor JSON-LD schema, OpenGraph, sitemap-ready
- Fully responsive, accessible, no build step

## Before it goes live — needs JICON
1. **Lead delivery (Formspree).** Both the quote wizard and the guide form fall
   back to email today (the wizard opens a pre-filled email to `getJICON@gmail.com`
   with every answer). To capture leads automatically, create a free form at
   [formspree.io](https://formspree.io) and paste the endpoint into the
   `action="..."` of **`#wizForm`** (and optionally `#guideForm`) in `index.html`,
   replacing `your-form-id`. Then every wizard submission lands in your inbox/CRM.
2. **Real project photos** — swap the placeholder gallery/section images.
3. **Real Google/Facebook review quotes** — drop 2–3 into the Reviews section
   (commented marker in `index.html`).
4. **Confirm the street address.** The old site lists "3926 Welsey St" — likely a
   typo for **Wesley St**. The visible site only shows "Myrtle Beach, SC 29579";
   the full street is only in the schema + Google Maps link. Verify the spelling.
5. **Real stats** (optional) — swap the honest placeholder numbers for real ones
   (projects completed, sq ft installed, happy clients) once provided.

## Local preview
```
python3 -m http.server 8169 --directory /Users/spencer/jicon-website
# → http://localhost:8169
```

## Deploy (GitHub Pages — same pattern as the other sites)
`bash deploy-pages.sh` after creating the `homeplacer/jicon-website` repo.
