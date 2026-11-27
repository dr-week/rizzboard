import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { REPO_ROOT } from './lib/logger.mjs';

const PORT = Number(process.env.PORT || 4173);
const DIST_ROOT = path.join(REPO_ROOT, 'web', 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.apk': 'application/vnd.android.package-archive',
  '.zip': 'application/zip'
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const cleanRel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const resolved = path.resolve(DIST_ROOT, cleanRel);

  if (!resolved.startsWith(DIST_ROOT) || !fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  const ext = path.extname(resolved).toLowerCase();
  const headers = {
    'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
    'Cache-Control': 'no-cache'
  };

  if (ext === '.apk' || ext === '.zip') {
    headers['Content-Disposition'] = `attachment; filename="${path.basename(resolved)}"`;
    headers['Content-Length'] = String(fs.statSync(resolved).size);
  }

  res.writeHead(200, headers);
  fs.createReadStream(resolved).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`RizzBoard Showcase & Download Portal listening on http://localhost:${PORT}`);
});
