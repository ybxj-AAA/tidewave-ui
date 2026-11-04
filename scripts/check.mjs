#!/usr/bin/env node
/**
 * Tidewave UI — static validation
 * ---------------------------------------------------------------
 * Zero dependencies. Runs on Node 18+.
 *
 *   node scripts/check.mjs
 *
 * Exit code 0 = all checks passed.
 * Exit code 1 = at least one error.
 *
 * Checks:
 *   1. Every page's <link href> and <script src> resolve on disk
 *   2. Every internal <a href> to a .html file resolves on disk
 *   3. Container tags balance per page
 *   4. CSS files have balanced braces
 *   5. Every <img> carries an alt attribute
 *   6. Every page has title, description, canonical, lang and one <h1>
 *   7. JSON files parse
 *   8. sitemap.xml references only files that exist
 *   9. Shared CSS files carry no raw hex colours
 * ---------------------------------------------------------------
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const C = {
  reset: '\u001b[0m',
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  dim: '\u001b[2m',
  bold: '\u001b[1m',
};

const errors = [];
const warnings = [];
let checksRun = 0;

const fail = (where, message) => errors.push(`${where}: ${message}`);
const warn = (where, message) => warnings.push(`${where}: ${message}`);
const pass = () => { checksRun++; };

/* -------------------------------------------------------------- */

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const read = (p) => readFileSync(p, 'utf8');
const rel = (full) => relative(ROOT, full).split('\\').join('/');

const ALL_FILES = walk(ROOT);
const HTML_FILES = ALL_FILES.filter((f) => f.endsWith('.html'));
const CSS_FILES = ALL_FILES.filter((f) => f.endsWith('.css'));

/* ---- 1 + 2. Asset and link resolution ------------------------ */

const BASE_PATH = '/tidewave-ui/';

function resolveAsset(pageFile, url) {
  if (!url) return null;
  const clean = url.split('#')[0].split('?')[0];
  if (!clean) return null;
  if (/^(https?:)?\/\//i.test(clean)) return null;
  if (/^(mailto:|tel:|data:|javascript:)/i.test(clean)) return null;

  if (clean.startsWith('/')) {
    return clean.startsWith(BASE_PATH)
      ? join(ROOT, clean.slice(BASE_PATH.length))
      : join(ROOT, clean.replace(/^\/+/, ''));
  }
  return resolve(dirname(pageFile), clean);
}

for (const file of HTML_FILES) {
  const where = rel(file);
  const html = read(file);
  let m;

  const linkRe = /<link\b[^>]*?\bhref=["']([^"']+)["'][^>]*>/gi;
  while ((m = linkRe.exec(html))) {
    const target = resolveAsset(file, m[1]);
    if (target && !existsSync(target)) {
      fail(where, `<link href="${m[1]}"> does not resolve to a file`);
    }
  }

  const scriptRe = /<script\b[^>]*?\bsrc=["']([^"']+)["'][^>]*>/gi;
  while ((m = scriptRe.exec(html))) {
    const target = resolveAsset(file, m[1]);
    if (target && !existsSync(target)) {
      fail(where, `<script src="${m[1]}"> does not resolve to a file`);
    }
  }

  const anchorRe = /<a\b[^>]*?\bhref=["']([^"']+)["'][^>]*>/gi;
  while ((m = anchorRe.exec(html))) {
    const target = resolveAsset(file, m[1]);
    if (!target) continue;
    if (target.toLowerCase().endsWith('.html') && !existsSync(target)) {
      fail(where, `internal link href="${m[1]}" points at a missing page`);
    }
  }
  pass();
}

/* ---- 3. Balanced container tags ------------------------------ */

const TRACKED = ['div', 'section', 'main', 'header', 'footer', 'article', 'aside', 'nav'];

for (const file of HTML_FILES) {
  const where = rel(file);
  const html = read(file);

  const stripped = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '<script></script>')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '<style></style>');

  for (const tag of TRACKED) {
    const open = (stripped.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
    const close = (stripped.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    if (open !== close) {
      fail(where, `<${tag}> unbalanced: ${open} opened, ${close} closed`);
    }
  }
  pass();
}

/* ---- 4. CSS sanity ------------------------------------------- */

for (const file of CSS_FILES) {
  const where = rel(file);
  const css = read(file);

  const open = (css.match(/{/g) || []).length;
  const close = (css.match(/}/g) || []).length;
  if (open !== close) {
    fail(where, `braces unbalanced: ${open} "{" vs ${close} "}"`);
  }

  const emptyDecl = css.match(/[a-z-]+\s*:\s*;/gi);
  if (emptyDecl) {
    warn(where, `${emptyDecl.length} declaration(s) with an empty value`);
  }
  pass();
}

/* ---- 5. Images need alt text --------------------------------- */

for (const file of HTML_FILES) {
  const where = rel(file);
  const html = read(file);
  const imgRe = /<img\b[^>]*>/gi;
  let m;
  while ((m = imgRe.exec(html))) {
    if (!/\balt\s*=/i.test(m[0])) {
      fail(where, `<img> without an alt attribute: ${m[0].slice(0, 80)}`);
    }
  }
  pass();
}

/* ---- 6. Per-page SEO minimums -------------------------------- */

for (const file of HTML_FILES) {
  const where = rel(file);
  const html = read(file);
  const is404 = where.endsWith('404.html');

  if (!/<title>[^<]{3,}<\/title>/i.test(html)) {
    fail(where, 'missing or empty <title>');
  }

  if (!is404) {
    if (!/<meta\s+name=["']description["']\s+content=["'][^"']{20,}["']/i.test(html)) {
      fail(where, 'missing a meta description of at least 20 characters');
    }
    if (!/<link\s+rel=["']canonical["']/i.test(html)) {
      fail(where, 'missing <link rel="canonical">');
    }
  }

  const h1s = html.match(/<h1\b/gi) || [];
  if (h1s.length === 0) {
    fail(where, 'no <h1> on the page');
  } else if (h1s.length > 1) {
    warn(where, `${h1s.length} <h1> elements; one per page is the convention`);
  }

  if (!/<html\b[^>]*\blang=["'][a-z-]+["']/i.test(html)) {
    fail(where, '<html> is missing a lang attribute');
  }
  pass();
}

/* ---- 7. JSON files parse ------------------------------------- */

const JSON_FILES = ALL_FILES.filter(
  (f) => f.endsWith('.json') || f.endsWith('.webmanifest')
);

for (const file of JSON_FILES) {
  const where = rel(file);
  try {
    JSON.parse(read(file));
    pass();
  } catch (e) {
    fail(where, `invalid JSON: ${e.message}`);
  }
}

/* ---- 8. Sitemap targets exist -------------------------------- */

const sitemapPath = join(ROOT, 'sitemap.xml');
if (existsSync(sitemapPath)) {
  const xml = read(sitemapPath);
  const locRe = /<loc>([^<]+)<\/loc>/gi;
  let m;
  while ((m = locRe.exec(xml))) {
    const url = m[1].trim();
    const marker = 'github.io';
    const idx = url.indexOf(marker);
    if (idx === -1) {
      warn('sitemap.xml', `unexpected <loc> host: ${url}`);
      continue;
    }
    const afterHost = url.indexOf('/', idx);
    const afterProject = afterHost === -1 ? -1 : url.indexOf('/', afterHost + 1);
    const pathPart = afterProject === -1 ? '' : url.slice(afterProject + 1);
    const localName = pathPart === '' ? 'index.html' : pathPart;
    if (!existsSync(join(ROOT, localName))) {
      fail('sitemap.xml', `<loc> points at a missing file: ${url}`);
    }
  }
  pass();
} else {
  warn('sitemap.xml', 'not present');
}

/* ---- 9. Tokens discipline ------------------------------------ */

const SHARED = ['components.css', 'base.css', 'site.css'];

for (const file of CSS_FILES) {
  const where = rel(file);
  const basename = where.split('/').pop();
  if (!SHARED.includes(basename)) continue;

  const hexes = read(file).match(/#[0-9a-f]{3,8}\b/gi) || [];
  if (hexes.length > 0) {
    fail(
      where,
      `${hexes.length} hard-coded hex colour(s) in a shared file — add a token in tokens.css instead`
    );
  }
  pass();
}

/* ---- Report -------------------------------------------------- */

console.log('');
console.log(`${C.bold}Tidewave UI — validation${C.reset}`);
console.log(
  `${C.dim}${HTML_FILES.length} HTML, ${CSS_FILES.length} CSS, ${JSON_FILES.length} JSON${C.reset}`
);
console.log('');

if (warnings.length) {
  console.log(`${C.yellow}${C.bold}Warnings (${warnings.length})${C.reset}`);
  for (const w of warnings) console.log(`  ${C.yellow}!${C.reset} ${w}`);
  console.log('');
}

if (errors.length) {
  console.log(`${C.red}${C.bold}Errors (${errors.length})${C.reset}`);
  for (const e of errors) console.log(`  ${C.red}✗${C.reset} ${e}`);
  console.log('');
  console.log(
    `${C.red}${C.bold}FAILED${C.reset} — ${errors.length} error(s), ${warnings.length} warning(s)`
  );
  process.exit(1);
}

console.log(
  `${C.green}${C.bold}PASSED${C.reset} — ${checksRun} checks, ${warnings.length} warning(s)`
);
console.log('');
