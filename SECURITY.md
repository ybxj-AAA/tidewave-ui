# Security

## Supported versions

| Version | Supported |
|---|---|
| 1.x     | ✅        |

## What this project is

Tidewave UI is **static HTML, CSS and a small amount of client-side
JavaScript**. It has:

- no server component
- no database
- no authentication
- no third-party scripts or analytics
- no network requests of any kind
- no build-time dependencies

That removes most of the usual attack surface. What remains is:

## Relevant risks

**Content Security Policy.** The demo pages use a handful of inline
`style` attributes and three small inline `onclick` handlers (theme
toggles and modal confirms). If you deploy with a strict CSP, either
relax it for `style-src 'unsafe-inline'` and `script-src 'unsafe-inline'`,
or move those handlers into `app.js` first. Moving them is the better
option if you're serving real users.

**Sample data.** The dashboard and portfolio pages contain invented
company names, people and metrics. Make sure you replace them before
publishing — a real-sounding fake customer on your site is your problem,
not this template's.

**Links.** Footer and CTA links point at `#` placeholders. Replace them;
don't ship a page whose "Contact" button scrolls to the top.

## Reporting a vulnerability

This project has no security email. For a small static kit, open a
[GitHub issue](https://github.com/ybxj-AAA/tidewave-ui/issues) if the
problem is benign, or contact the maintainer directly if publishing it
publicly would cause harm.

Please don't open a public issue with a working exploit and no
warning.
