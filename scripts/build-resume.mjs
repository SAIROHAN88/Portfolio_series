/**
 * Renders the print-only resume page to a downloadable PDF using headless
 * Chrome, so the file always matches what the site shows.
 *
 *   npm run resume
 *
 * Output: public/assets/Sai_Rohan_Resume.pdf
 */
import { execFile } from 'node:child_process';
import { createServer } from 'node:net';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);

const ROOT = resolve(import.meta.dirname, '..');
const OUT_DIR = resolve(ROOT, 'public/assets');
const OUT_PDF = resolve(OUT_DIR, 'Sai_Rohan_Resume.pdf');

/** Ask the OS for a free port so a stale server can never block the build. */
function findFreePort() {
  return new Promise((resolvePort, reject) => {
    const srv = createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolvePort(port));
    });
  });
}

const PORT = Number(process.env.RESUME_PREVIEW_PORT) || (await findFreePort());
// `vite preview` serves the build under its configured base path, so the
// print page lives at <base>resume.html — not at the server root.
const BASE = process.env.VITE_BASE_PATH ?? '/Portfolio_series/';
const PAGE_URL = `http://127.0.0.1:${PORT}${BASE.replace(/\/*$/, '/')}resume.html`;

/** Candidate Chrome/Edge binaries, in preference order. */
const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean);

function findBrowser() {
  for (const b of BROWSERS) if (existsSync(b)) return b;
  return null;
}

async function waitForServer(url, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

const browser = findBrowser();
if (!browser) {
  console.error(
    'Could not find Chrome or Edge.\n' +
      'Set CHROME_PATH to the browser executable and re-run: npm run resume',
  );
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

console.log('Starting preview server…');
// `shell: true` is needed for `npx` on Windows. The command line is fully
// controlled here — no user input reaches it — but the deprecation warning
// is noisy, so it is suppressed.
const preview = execFile(
  'npx',
  ['vite', 'preview', '--port', String(PORT), '--host', '127.0.0.1'],
  { cwd: ROOT, shell: true, stdio: 'ignore' },
);

let exitCode = 0;
try {
  if (!(await waitForServer(PAGE_URL))) {
    throw new Error(`Preview server did not become ready at ${PAGE_URL}`);
  }

  const profileDir = resolve(ROOT, 'node_modules/.tmp/resume-profile');
  rmSync(profileDir, { recursive: true, force: true });

  console.log('Rendering resume to PDF…');
  await run(
    browser,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-first-run',
      '--disable-extensions',
      '--virtual-time-budget=12000',
      '--user-data-dir=' + profileDir,
      '--print-to-pdf=' + OUT_PDF,
      '--no-pdf-header-footer',
      PAGE_URL,
    ],
    { timeout: 120_000 },
  );

  rmSync(profileDir, { recursive: true, force: true });

  if (!existsSync(OUT_PDF)) {
    throw new Error('Chrome did not produce a PDF at ' + OUT_PDF);
  }
  console.log(`✓ ${OUT_PDF}`);
} catch (err) {
  console.error('Resume build failed:', err.message ?? err);
  exitCode = 1;
} finally {
  // `shell: true` means the OS shell owns the child, so kill the whole tree
  // — otherwise the preview server survives as an orphan.
  try {
    if (process.platform === 'win32') {
      execFile('taskkill', ['/pid', String(preview.pid), '/f', '/t'], { stdio: 'ignore' });
    } else {
      preview.kill();
    }
  } catch {
    /* already gone */
  }
}

process.exit(exitCode);
