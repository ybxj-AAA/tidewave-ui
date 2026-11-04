#!/usr/bin/env node
/**
 * Tidewave UI — local preview server
 * ---------------------------------------------------------------
 * A tiny static file server so the pages can be previewed without a
 * bundler. Serves the repo at http://127.0.0.1:4173/tidewave-ui/ — the
 * same path shape GitHub Pages uses, so absolute paths behave the same
 * way in development and production.
 *
 *   node scripts/serve.mjs
 *   PORT=8080 node scripts/serve.mjs
 * ---------------------------------------------------------------
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve, dirname, extname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = '/tidewave-ui';
const PORT = Number(process.env.PORT || 4173);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

const SECURITY_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { ...SECURITY_HEADERS, 'Content-Type': type });
  res.end(body);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === BASE) pathname = '/';
    else if (pathname.startsWith(BASE + '/')) pathname = pathname.slice(BASE.length);
    else return send(res, 404, 'Not found — try /tidewave-ui/');

    if (pathname.endsWith('/')) pathname += 'index.html';

    const target = normalize(join(ROOT, pathname));
    if (!target.startsWith(ROOT + sep) && target !== ROOT) {
      return send(res, 403, 'Forbidden');
    }

    let filePath = target;
    try {
      const st = await stat(filePath);
      if (st.isDirectory()) filePath = join(filePath, 'index.html');
    } catch {
      try {
        return send(res, 404, await readFile(join(ROOT, '404.html'), 'utf8'), MIME['.html']);
      } catch {
        return send(res, 404, 'Not found');
      }
    }

    const body = await readFile(filePath);
    const type = MIME[extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': type });
    res.end(body);
  } catch (err) {
    send(res, 500, `Server error: ${err.message}`);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('  Tidewave UI — preview server');
  console.log('');
  console.log(`  http://127.0.0.1:${PORT}${BASE}/`);
  console.log('');
  console.log('  Ctrl+C to stop');
  console.log('');
});
