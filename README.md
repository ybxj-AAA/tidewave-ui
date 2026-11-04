# Tidewave UI

A calm, dependency-free design system for product teams — **24 design tokens, 18 components, light + dark themes, and 5 ready-made page templates.**

Built with plain HTML, CSS custom properties and ~180 lines of vanilla JavaScript. No build step, no framework, no `node_modules`. Open an HTML file and it works.

```bash
git clone https://github.com/ybxj-AAA/tidewave-ui.git
cd tidewave-ui
# open index.html in any browser — that's it
```

---

## What's included

| Template | Preview | Description |
|---|---|---|
| **Components** | `index.html` | The full component gallery — every element with usage notes and a scroll-nav. |
| **Dashboard** | `dashboard.html` | App shell: sidebar, top bar, stat cards, bar chart, donut, data table, activity feed. |
| **Portfolio** | `portfolio.html` | Personal portfolio: hero, skills marquee, case-study grid, timeline, contact. |
| **SaaS Landing** | `landing.html` | Marketing page: hero, logo wall, feature grid, two split sections, testimonial, FAQ, CTA. |
| **Pricing** | `pricing.html` | Three-tier pricing, comparison table, license FAQ, trust row. |

Every page shares the same token file, so they all re-theme together.

---

## The component list

- **Buttons** — 6 variants × 3 sizes, icon slots, block + disabled states
- **Badges & chips** — 5 semantic tones, togglable filter chips
- **Cards** — plain, interactive, flush-with-media, header/desc/body slots
- **Forms** — inputs, selects, textareas, input groups, custom checkboxes, toggle switches
- **Avatars** — 4 sizes, initials fallback, stacked groups
- **Tables** — semantic markup, scroll wrapper, hover rows
- **Progress** — animated meter bars
- **Alerts** — info / success / warning / danger
- **Tabs** — accessible `role="tablist"` with panel swapping
- **Modals** — backdrop blur, Escape to close, focus management
- **Tooltips** — pure CSS, hover + keyboard focus
- **Skeleton loaders** — shimmer placeholders

Plus foundations: a 10-step brand palette, an 11-step neutral ramp, 4 semantic hues, a type scale, a 4px spacing scale, radii, 6 shadow levels and a motion system.

---

## Theming

Every component reads **semantic tokens only**. To rebrand the entire kit, override the aliases — no component file changes:

```css
/* put this after tokens.css */
:root {
  --tw-brand:        #e8590c;   /* any hue */
  --tw-brand-hover:  #c94a08;
  --tw-brand-ink:    #c94a08;
  --tw-radius-lg:    4px;       /* sharper corners */
  --tw-font-sans:    "IBM Plex Sans", sans-serif;
  --tw-container:    1320px;    /* wider layout */
}
```

Dark mode is a second token set:

```html
<html data-theme="dark">
```

The demo pages ship with a theme toggle that persists to `localStorage` and respects `prefers-color-scheme` on first visit.

---

## File structure

```
tidewave-ui/
├── index.html              component gallery
├── dashboard.html          app dashboard template
├── portfolio.html          portfolio template
├── landing.html            SaaS landing template
├── pricing.html            pricing page template
├── assets/
│   ├── css/
│   │   ├── tokens.css      ← design tokens + dark theme (the single source of truth)
│   │   ├── base.css        reset, typography, layout helpers
│   │   ├── components.css  the 18 components
│   │   ├── site.css        nav, footer, docs layout
│   │   ├── dashboard.css   dashboard-specific
│   │   ├── portfolio.css   portfolio-specific
│   │   ├── landing.css     landing-specific
│   │   └── pricing.css     pricing-specific
│   └── js/
│       └── app.js          theme toggle, modals, tabs, toasts, scrollspy
├── LICENSE
└── README.md
```

---

## Browser support

Chrome / Edge 111+, Firefox 113+, Safari 16.4+. The only modern feature used is `color-mix()` in the sticky nav backdrop; everything else degrades cleanly.

Everything is keyboard navigable, `prefers-reduced-motion` is respected, and `:focus-visible` outlines are styled throughout.

---

## License

Selling or redistributing the kit itself is not permitted. See [LICENSE](LICENSE) for the exact terms.

---

## Built by

**ybxj-AAA** — a small studio that got tired of fighting CSS.

If you build something with it, I'd genuinely like to see it.
