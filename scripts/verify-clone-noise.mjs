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

  // Sample the transform of the noise div over 1 second (10 samples, 100ms apart)
  const samples = [];
  for (let i = 0; i < 10; i++) {
    const data = await page.evaluate(() => {
      const el = document.querySelector('.animate-live-noise');
      if (!el) return null;
      return {
        styleAttr: el.getAttribute('style'),
        transform: window.getComputedStyle(el).transform
      };
    });
    samples.push({ i, time: i * 100, data });
    await new Promise(r => setTimeout(r, 100));
  }
  console.log('CLONE TRANSFORM SAMPLES OVER 1 SECOND:');
  console.log(JSON.stringify(samples.slice(0, 4), null, 2));

  // Capture frame t0
  const t0Buffer = await page.screenshot({
    clip: { x: 200, y: 250, width: 200, height: 200 },
    type: 'png'
  });
  fs.writeFileSync(path.join(AUDIT_DIR, 'clone-noise-t0.png'), t0Buffer);

  // Wait 900ms to cross the 800ms stepped jitter threshold
  await new Promise(r => setTimeout(r, 900));

  // Capture frame t1
  const t1Buffer = await page.screenshot({
    clip: { x: 200, y: 250, width: 200, height: 200 },
    type: 'png'
  });
  fs.writeFileSync(path.join(AUDIT_DIR, 'clone-noise-t1.png'), t1Buffer);

  // Analyze t0 and t1 in page context
  const t0Base64 = t0Buffer.toString('base64');
  const t1Base64 = t1Buffer.toString('base64');

  const stats = await page.evaluate(async (b64_0, b64_1) => {
    function loadImg(b64) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = 'data:image/png;base64,' + b64;
      });
    }

    const img0 = await loadImg(b64_0);
    const img1 = await loadImg(b64_1);

    const canvas = document.createElement('canvas');
    canvas.width = img0.width;
    canvas.height = img0.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img0, 0, 0);
    const data0 = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img1, 0, 0);
    const data1 = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let diffPixels = 0;
    let sumR = 0, sumG = 0, sumB = 0;
    const totalPixels = canvas.width * canvas.height;

    for (let i = 0; i < data0.length; i += 4) {
      sumR += data0[i];
      sumG += data0[i + 1];
      sumB += data0[i + 2];
      if (
        data0[i] !== data1[i] ||
        data0[i + 1] !== data1[i + 1] ||
        data0[i + 2] !== data1[i + 2]
      ) {
        diffPixels++;
      }
    }

    const meanR = sumR / totalPixels;
    const meanG = sumG / totalPixels;
    const meanB = sumB / totalPixels;

    let varianceSum = 0;
    for (let i = 0; i < data0.length; i += 4) {
      const lum = 0.299 * data0[i] + 0.587 * data0[i + 1] + 0.114 * data0[i + 2];
      const meanLum = 0.299 * meanR + 0.587 * meanG + 0.114 * meanB;
      varianceSum += Math.pow(lum - meanLum, 2);
    }

    const stdDev = Math.sqrt(varianceSum / totalPixels);

    return {
      totalPixels,
      diffPixels,
      diffPercent: (diffPixels / totalPixels) * 100,
      isAnimated: diffPixels > 0,
      meanRGB: {
        r: Number(meanR.toFixed(2)),
        g: Number(meanG.toFixed(2)),
        b: Number(meanB.toFixed(2))
      },
      stdDev: Number(stdDev.toFixed(4))
    };
  }, t0Base64, t1Base64);

  console.log('\n================ CLONE NOISE STATS ================');
  console.log(JSON.stringify(stats, null, 2));

  // Load ground truth stats
  const liveStatsPath = path.join(AUDIT_DIR, 'noise-stats.json');
  if (fs.existsSync(liveStatsPath)) {
    const liveStats = JSON.parse(fs.readFileSync(liveStatsPath, 'utf8'));
    console.log('\n================ GROUND TRUTH STATS ================');
    console.log(JSON.stringify(liveStats, null, 2));

    const stdDevDiff = Math.abs(stats.stdDev - liveStats.stdDev);
    const meanRDiff = Math.abs(stats.meanRGB.r - liveStats.meanRGB.r);
    const meanGDiff = Math.abs(stats.meanRGB.g - liveStats.meanRGB.g);
    const meanBDiff = Math.abs(stats.meanRGB.b - liveStats.meanRGB.b);

    console.log('\n================ DELTA COMPARISON ================');
    console.log(`stdDev Delta: ${stdDevDiff.toFixed(4)} (Target: <= 0.35) -> ${stdDevDiff <= 0.35 ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log(`meanRGB R Delta: ${meanRDiff.toFixed(2)} (Target: <= 2.0) -> ${meanRDiff <= 2.0 ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log(`meanRGB G Delta: ${meanGDiff.toFixed(2)} (Target: <= 2.0) -> ${meanGDiff <= 2.0 ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log(`meanRGB B Delta: ${meanBDiff.toFixed(2)} (Target: <= 2.0) -> ${meanBDiff <= 2.0 ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log(`Motion isAnimated: ${stats.isAnimated ? 'PASS (Animated) ✅' : 'FAIL (Static) ❌'}`);

    fs.writeFileSync(path.join(AUDIT_DIR, 'clone-noise-stats.json'), JSON.stringify({
      clone: stats,
      groundTruth: liveStats,
      delta: {
        stdDevDiff: Number(stdDevDiff.toFixed(4)),
        meanRDiff: Number(meanRDiff.toFixed(2)),
        meanGDiff: Number(meanGDiff.toFixed(2)),
        meanBDiff: Number(meanBDiff.toFixed(2)),
      },
      pass: stdDevDiff <= 0.35 && meanRDiff <= 2.0 && stats.isAnimated
    }, null, 2));
  }

  // Full screenshots
  console.log('\nCapturing full desktop screenshot (1440px)...');
  await page.screenshot({ path: path.join(AUDIT_DIR, 'clone-desktop.png'), fullPage: true });

  console.log('Capturing full mobile screenshot (375px)...');
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(AUDIT_DIR, 'clone-mobile.png'), fullPage: true });

  await browser.close();
  server.close();
  console.log('Verification finished cleanly.');
}

run().catch(console.error);
