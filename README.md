# Tidewave UI

A static HTML/CSS component library: **18 components, design tokens, light and dark themes, 5 page templates.** No build step, no dependencies, no JavaScript framework.

What this is not: a product, a hosting service, or a design tool. It's a folder of files you copy and edit.

```bash
git clone https://github.com/ybxj-AAA/tidewave-ui.git
cd tidewave-ui
# open index.html in a browser — that's the whole install
```

---

## Pages

| File | What it shows |
|---|---|
| `index.html` | Component gallery — every element with the class names that produce it |
| `dashboard.html` | App shell: sidebar, stat cards, bar chart, donut, table, activity feed |
| `portfolio.html` | Portfolio layout: hero, case-study grid, timeline, contact form |
| `landing.html` | Marketing page: hero, feature grid, split sections, FAQ, CTA |
| `pricing.html` | Three-tier pricing, comparison table, license FAQ |
| `404.html` | Not-found page, styled to match |

All six share `tokens.css`, so a change to one file re-themes all of them.

**Every number, name and project on these pages is sample data.** They're labelled where it matters, but they are not real customers or real metrics.

---

## Components

| Group | Notes |
|---|---|
| Buttons | 6 variants × 3 sizes, icon slot, block and disabled states |
| Badges & chips | 5 semantic tones; chips toggle via `aria-pressed` |
| Cards | plain, interactive (hover lift), flush-with-media |
| Forms | inputs, selects, textareas, input groups, custom checkboxes, switches |
| Avatars | 4 sizes, initials fallback, stacked group |
| Tables | scroll wrapper, hover rows |
| Progress | bars animate on load via `data-value` |
| Alerts | info / success / warning / danger |
| Tabs | `role="tablist"`, panel swap, one small JS block |
| Modals | backdrop blur, Escape to close, focus moves on open |
| Tooltips | CSS only — `:hover` and `:focus-within` |
| Skeletons | shimmer placeholders |

Foundations: 10-step brand palette, 11-step neutral ramp, 4 semantic hues, type scale, 4px spacing scale, radii, 6 shadow levels, motion tokens.

---

## Theming

Components reference semantic tokens only. Override the aliases; nothing else changes:

```css
/* put this after tokens.css */
:root {
  --tw-brand:        #0f766e;
  --tw-brand-hover:  #115e59;
  --tw-brand-ink:    #115e59;
  --tw-radius-lg:    6px;
  --tw-font-sans:    "IBM Plex Sans", sans-serif;
  --tw-container:    1240px;
}
```

Dark mode is a second token block in the same file, activated by an attribute:

```html
<html data-theme="dark">
```

The pages ship with a toggle that persists to `localStorage` and falls back to `prefers-color-scheme` on first visit.

---

## File layout

```
tidewave-ui/
├── index.html              component gallery
├── dashboard.html          dashboard sample
├── portfolio.html          portfolio sample
├── landing.html            marketing page sample
├── pricing.html            pricing page sample
├── 404.html                not-found page
├── assets/
│   ├── css/
│   │   ├── tokens.css      design tokens + dark theme (edit this one)
│   │   ├── base.css        reset, type, layout helpers
│   │   ├── components.css  the 18 components
│   │   ├── site.css        nav, footer, docs layout
│   │   ├── dashboard.css
│   │   ├── portfolio.css
│   │   ├── landing.css
│   │   └── pricing.css
│   └── js/
│       └── app.js          theme toggle, modals, tabs, toasts, scrollspy
├── scripts/
│   ├── check.mjs           dependency-free validator
│   └── serve.mjs           local preview server
├── .github/workflows/      CI: validate, then deploy to Pages
├── robots.txt
├── sitemap.xml
├── manifest.webmanifest
├── netlify.toml / vercel.json / _redirects
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
└── README.md
```

---

## Validation

There's no bundler, but there is a checker. It runs with Node 18+ and installs nothing:

```bash
node scripts/check.mjs
```

It verifies:
- every page's `<link>` and `<script>` assets exist on disk
- every internal `href` points at a file that exists
- `<div>`, `<section>` and friends are balanced per page
- CSS files have balanced braces
- every `<img>` has an `alt` attribute
- no page is missing `canonical`, a `description`, `lang` or an `<h1>`
- every JSON file parses
- `sitemap.xml` points only at files that exist
- the shared CSS files contain no raw hex colours

The last one is the interesting rule: `components.css`, `base.css` and `site.css` must reference tokens, never literals. Template-specific files (`dashboard.css`, `portfolio.css`, …) are allowed decorative gradients, because those are illustration art rather than interface colour.

## Local preview

```bash
node scripts/serve.mjs
# http://127.0.0.1:4173/tidewave-ui/
```

It serves the repo under the same `/tidewave-ui/` prefix GitHub Pages uses, so absolute paths behave identically in development and production.

## Deploying

- **GitHub Pages** — the included workflow handles it; enable Pages with source "GitHub Actions".
- **Netlify** — `netlify.toml` is ready: no build command, publish `.`.
- **Vercel** — `vercel.json` is ready: no build, no framework.
- **Cloudflare Pages** — `_redirects` is ready: build command empty, output `.`.

All four include security headers and a cache policy.

---

## Browser support

Chrome / Edge 111+, Firefox 113+, Safari 16.4+. The one modern feature is `color-mix()` in the sticky nav backdrop; on older browsers that bar falls back to a solid colour.

Keyboard navigation works, `:focus-visible` is styled, `prefers-reduced-motion` is respected. This has **not** been through a formal WCAG audit.

---

## Licence

Sold under a commercial licence; reselling the kit itself is not permitted. Read [`LICENSE`](LICENSE) — it's short and written in plain language.

---

## Who

**ybxj-AAA**. Issues and typo fixes welcome. Feature requests will probably be declined, because the kit's selling point is that it stays small.
