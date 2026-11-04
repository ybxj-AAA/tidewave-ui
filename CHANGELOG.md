# Changelog

All notable changes to Tidewave UI are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project
uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Nothing yet.

## [1.0.0] — 2025-11-04

First public version.

### Added

- **Design tokens** (`assets/css/tokens.css`): 10-step brand palette,
  11-step neutral ramp, four semantic hues, type scale, 4px spacing
  scale, radii, six shadow levels, motion tokens, and a full dark theme.
- **Eighteen components** (`assets/css/components.css`): buttons, badges,
  filter chips, cards, form controls, avatars, tables, progress bars,
  alerts, tabs, modals, tooltips and skeleton loaders.
- **Five page templates**: component gallery, dashboard, portfolio, SaaS
  landing page and pricing page.
- **Vanilla JS behaviour** (`assets/js/app.js`, no dependencies): theme
  persistence, modal focus handling, tab panels, toast helper and docs
  scrollspy.
- **404 page**, `robots.txt`, `sitemap.xml` and a web manifest.
- **`scripts/check.mjs`** — a dependency-free validator that checks
  asset paths, internal links, balanced tags, balanced CSS braces, image
  `alt` attributes and per-page SEO minimums.
- **`scripts/serve.mjs`** — a local preview server that mirrors the
  `/tidewave-ui/` path shape used on GitHub Pages.
- **GitHub Actions workflows**: `deploy.yml` validates then publishes to
  Pages; `hygiene.yml` guards against conflict markers and oversized
  files.
- **Deploy configs** for Netlify, Vercel and Cloudflare Pages, each with
  security headers and a cache policy.

### Changed

- Sample copy rewritten to describe what the templates actually contain.
  Earlier drafts implied a working analytics product and invented
  customer metrics; those claims are gone.
- Pricing tiers and the comparison table are now explicitly labelled as
  placeholders.
- The testimonial is now a style note rather than a fabricated customer
  quote.
- Hard-coded colour literals moved into `tokens.css`; `components.css`,
  `base.css` and `site.css` now contain no raw hex values, and the
  checker enforces that.

### Notes

- No build step, no `node_modules`, no framework.
- Not audited against WCAG. Accessibility features are present but
  unverified.
- Browser support: Chrome/Edge 111+, Firefox 113+, Safari 16.4+.

[Unreleased]: https://github.com/ybxj-AAA/tidewave-ui/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/ybxj-AAA/tidewave-ui/releases/tag/v1.0.0
