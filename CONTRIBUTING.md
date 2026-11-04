# Contributing

This is a small project with narrow goals. Read this before opening a PR —
most feature requests get declined, and it's not personal.

## What gets accepted

- **Bug fixes** — broken layout, wrong behaviour, invalid markup
- **Accessibility fixes** — missing labels, focus traps, contrast
- **Typos and unclear documentation**
- **Browser compatibility fixes** for the supported range

## What gets declined

- New components. The kit sells on staying small; every addition is a
  maintenance cost someone has to carry.
- Framework ports (React, Vue, Svelte). See `README.md`.
- Build steps, bundlers, preprocessors. The whole point is that there
  isn't one.
- Design opinions that change the visual language wholesale.

If you think something belongs in the "declined" list anyway, open an
issue and argue for it. Coming with reasons is more persuasive than
coming with a diff.

## Before you send a PR

1. Run the checker:

   ```bash
   npm run check
   ```

   It must pass. CI runs the same script.

2. Check that your change works in **both** themes. Toggle the button in
   the top right of any page.

3. Resize the window down to about 360px. If a layout breaks, it's not
   ready.

4. Keep diffs small and focused. One concern per pull request.

## Code style

- 2-space indentation, LF line endings, final newline (see
  `.editorconfig`).
- CSS class names are `tw-*`, components use BEM-ish suffixes
  (`tw-card__title`, `tw-btn--primary`).
- Components read design tokens. **Never** hard-code a hex value in
  `components.css` — add a token instead. The checker will fail you.
- JavaScript stays in `app.js` and stays under 200 lines. If a feature
  needs more, it probably needs a page-specific file.
- No `!important` except in the print and reduced-motion media queries.

## Reporting a bug

Include:
- which page (`index.html`, `landing.html`, …)
- which browser and version
- what you expected and what happened
- a screenshot if the bug is visual

## Licence

By contributing, you agree your changes fall under the project's
existing licence (see `LICENSE`). Don't paste code in from projects with
incompatible licences.
