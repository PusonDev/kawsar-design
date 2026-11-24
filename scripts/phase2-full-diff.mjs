import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve(projectRoot, 'out');
const AUDIT_DIR = path.resolve(projectRoot, '_audit');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
};

function createStaticServer(port = 3000) {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';
    let filePath = path.join(OUT_DIR, reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

async function extractMetrics(page, isLive = false) {
  return await page.evaluate((isLive) => {
    function getBox(selector) {
      const el = document.querySelector(selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      return {
        x: Math.round(r.x),
        y: Math.round(r.y + window.scrollY),
        w: Math.round(r.width),
        h: Math.round(r.height),
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        color: s.color,
        bg: s.backgroundColor,
        borderRadius: s.borderRadius
      };
    }

    // Selectors for live site vs clone
    return {
      h1: getBox('h1'),
      servicesH2: getBox('h2'),
      contactH2: getBox(isLive ? '.framer-87b4nn h2' : 'section:nth-of-type(4) h2'),
      avatar: getBox(isLive ? '.framer-pgjdg4 img, .framer-pgjdg4 [data-framer-name*="Avatar"]' : 'img[alt="Kawsar Ahmed"]'),
      latestWorkBtn: getBox(isLive ? 'a[href*="dribbble.com/Kawsarvy"]' : 'a[href*="dribbble.com/Kawsarvy"]'),
      emailPill: getBox(isLive ? 'div:has(> a[href*="mailto"])' : '.hidden.md\\:flex.items-center.gap-\\[10px\\] > div'),
      servicesGrid: getBox(isLive ? '.framer-o7xych' : '.grid.grid-cols-2'),
      footer: getBox('footer')
    };
  }, isLive);
}

async function run() {
  console.log('Starting static server on http://127.0.0.1:3000...');
  const server = await createStaticServer(3000);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  });

  // 1. Desktop comparison
  console.log('Inspecting Desktop (1440x900)...');
  const pageLive = await browser.newPage();
  await pageLive.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await pageLive.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  const liveDesktop = await extractMetrics(pageLive, true);

  const pageClone = await browser.newPage();
  await pageClone.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await pageClone.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle0' });
  const cloneDesktop = await extractMetrics(pageClone, false);

  // 2. Mobile comparison
  console.log('Inspecting Mobile (375x812)...');
  await pageLive.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await pageLive.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  const liveMobile = await extractMetrics(pageLive, true);

  await pageClone.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await pageClone.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle0' });
  const cloneMobile = await extractMetrics(pageClone, false);

  const report = {
    desktop: {
      live: liveDesktop,
      clone: cloneDesktop
    },
    mobile: {
      live: liveMobile,
      clone: cloneMobile
    }
  };

  fs.writeFileSync(path.join(AUDIT_DIR, 'full-diff.json'), JSON.stringify(report, null, 2));
  console.log('Diff report saved to _audit/full-diff.json');
  console.log(JSON.stringify(report, null, 2));

  await browser.close();
  server.close();
}

run().catch(console.error);
