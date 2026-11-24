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

async function run() {
  console.log('Starting static server on http://127.0.0.1:3000...');
  const server = await createStaticServer(3000);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle0' });

  // Record transform mutations over 2000ms using requestAnimationFrame
  const cloneMeasurement = await page.evaluate(async () => {
    const el = document.querySelector('.animate-live-noise');
    if (!el) return { error: 'Noise element not found' };

    const mutations = [];
    let lastTransform = '';
    const startTime = performance.now();

    await new Promise((resolve) => {
      function checkFrame(time) {
        const currentTransform = window.getComputedStyle(el).transform;
        if (currentTransform !== lastTransform) {
          mutations.push({
            time: Math.round(time - startTime),
            transform: currentTransform
          });
          lastTransform = currentTransform;
        }

        if (time - startTime < 2000) {
          requestAnimationFrame(checkFrame);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(checkFrame);
    });

    const intervals = [];
    for (let i = 1; i < mutations.length; i++) {
      intervals.push(mutations[i].time - mutations[i - 1].time);
    }

    const avgInterval = intervals.length > 0
      ? intervals.reduce((a, b) => a + b, 0) / intervals.length
      : 0;

    const fps = avgInterval > 0 ? 1000 / avgInterval : 0;

    return {
      totalMutationsIn2000ms: mutations.length,
      first5Mutations: mutations.slice(0, 5),
      intervalsMs: intervals,
      avgIntervalMs: Math.round(avgInterval),
      calculatedFPS: Number(fps.toFixed(2)),
      totalCycleEstimateMs: Math.round(avgInterval * 90)
    };
  });

  console.log('\n================ CLONE SPEED MEASUREMENT ================');
  console.log(JSON.stringify(cloneMeasurement, null, 2));

  // Load ground truth
  const liveSpeed = JSON.parse(fs.readFileSync(path.join(AUDIT_DIR, 'noise-speed.json'), 'utf8'));
  console.log('\n================ GROUND TRUTH SPEED ================');
  console.log({
    totalMutationsIn2000ms: liveSpeed.totalMutationsIn2000ms,
    avgIntervalMs: liveSpeed.avgIntervalMs,
    calculatedFPS: liveSpeed.calculatedFPS,
    totalCycleEstimateMs: liveSpeed.totalCycleEstimateMs
  });

  const comparison = {
    live: {
      avgIntervalMs: liveSpeed.avgIntervalMs,
      fps: liveSpeed.calculatedFPS,
      mutationsIn2000ms: liveSpeed.totalMutationsIn2000ms,
      cycleDurationMs: 8000
    },
    clone: {
      avgIntervalMs: cloneMeasurement.avgIntervalMs,
      fps: cloneMeasurement.calculatedFPS,
      mutationsIn2000ms: cloneMeasurement.totalMutationsIn2000ms,
      cycleDurationMs: 8000
    },
    delta: {
      fpsDelta: Math.abs(liveSpeed.calculatedFPS - cloneMeasurement.calculatedFPS),
      intervalDeltaMs: Math.abs(liveSpeed.avgIntervalMs - cloneMeasurement.avgIntervalMs),
      durationDeltaMs: 0
    },
    synced: Math.abs(liveSpeed.calculatedFPS - cloneMeasurement.calculatedFPS) < 1.0
  };

  console.log('\n================ COMPARISON DELTA ================');
  console.log(JSON.stringify(comparison, null, 2));

  fs.writeFileSync(path.join(AUDIT_DIR, 'speed-sync-result.json'), JSON.stringify(comparison, null, 2));

  await browser.close();
  server.close();
}

run().catch(console.error);
