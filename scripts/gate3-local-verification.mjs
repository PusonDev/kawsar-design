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
  console.log('--- GATE 3 LOCAL VERIFICATION STARTING ---');
  const server = await createStaticServer(3000);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle0' });

  // 1. Verify Image Dimensions & CSS backgroundSize
  const assetCheck = await page.evaluate(async () => {
    const el = document.querySelector('.animate-live-noise');
    if (!el) return { error: 'Noise element not found' };

    const s = window.getComputedStyle(el);
    const bgUrlMatch = s.backgroundImage.match(/url\(["']?([^"']+)["']?\)/);
    const url = bgUrlMatch ? bgUrlMatch[1] : null;

    // Load image to get natural dimensions
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = url;
    });

    return {
      bgUrl: url,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      backgroundSize: s.backgroundSize,
      backgroundRepeat: s.backgroundRepeat,
      opacity: s.opacity,
      containerOpacity: window.getComputedStyle(el.parentElement).opacity
    };
  });

  console.log('Local Asset Check:');
  console.log(JSON.stringify(assetCheck, null, 2));

  // 2. Run exact 3000ms requestAnimationFrame motion trace on clone
  console.log('Running 3000ms motion trace on local clone...');
  const cloneTrace = await page.evaluate(async () => {
    const el = document.querySelector('.animate-live-noise');
    if (!el) return { error: 'Not found' };

    const records = [];
    const startTime = performance.now();
    let lastTransform = '';
    let lastBgPos = '';
    let lastOpacity = '';

    await new Promise((resolve) => {
      function check(time) {
        const cs = window.getComputedStyle(el);
        const transform = cs.transform || el.style.transform;
        const bgPos = cs.backgroundPosition;
        const opacity = cs.opacity;

        if (transform !== lastTransform || bgPos !== lastBgPos || opacity !== lastOpacity) {
          records.push({
            t_ms: Math.round(time - startTime),
            transform,
            backgroundPosition: bgPos,
            opacity
          });
          lastTransform = transform;
          lastBgPos = bgPos;
          lastOpacity = opacity;
        }

        if (time - startTime < 3000) {
          requestAnimationFrame(check);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(check);
    });

    const intervals = [];
    for (let i = 1; i < records.length; i++) {
      intervals.push(records[i].t_ms - records[i - 1].t_ms);
    }
    const avgInterval = intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 0;
    const fps = avgInterval > 0 ? 1000 / avgInterval : 0;

    return {
      isAnimated: records.length > 1,
      totalStateChangesIn3000ms: records.length,
      avgIntervalMs: Math.round(avgInterval),
      calculatedFPS: Number(fps.toFixed(2)),
      intervals,
      traceRecords: records
    };
  });

  console.log('Local Clone 3000ms Trace Summary:');
  console.log({
    totalChanges: cloneTrace.totalStateChangesIn3000ms,
    avgInterval: cloneTrace.avgIntervalMs,
    fps: cloneTrace.calculatedFPS
  });

  // 3. Measure grain stdDev on Hero and Contact
  const heroCrop = await page.screenshot({ clip: { x: 200, y: 250, width: 200, height: 200 } });
  await page.evaluate(() => {
    const contact = document.querySelector('section:last-of-type');
    if (contact) contact.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 400));
  const contactEl = await page.$('section:last-of-type');
  const contactCrop = await contactEl.screenshot({ clip: { x: 200, y: 150, width: 200, height: 200 } });

  const grainStats = await page.evaluate(async (heroB64, contactB64) => {
    function loadImg(b64) {
      return new Promise(r => {
        const img = new Image();
        img.onload = () => r(img);
        img.src = 'data:image/png;base64,' + b64;
      });
    }

    async function analyze(b64) {
      const img = await loadImg(b64);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      let sumR = 0, sumG = 0, sumB = 0;
      const total = canvas.width * canvas.height;
      for (let i = 0; i < data.length; i += 4) {
        sumR += data[i];
        sumG += data[i + 1];
        sumB += data[i + 2];
      }
      const meanR = sumR / total;
      const meanG = sumG / total;
      const meanB = sumB / total;

      let varianceSum = 0;
      for (let i = 0; i < data.length; i += 4) {
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const meanLum = 0.299 * meanR + 0.587 * meanG + 0.114 * meanB;
        varianceSum += Math.pow(lum - meanLum, 2);
      }
      return {
        meanRGB: { r: Number(meanR.toFixed(2)), g: Number(meanG.toFixed(2)), b: Number(meanB.toFixed(2)) },
        stdDev: Number(Math.sqrt(varianceSum / total).toFixed(4))
      };
    }

    return {
      hero: await analyze(heroB64),
      contact: await analyze(contactB64)
    };
  }, heroCrop.toString('base64'), contactCrop.toString('base64'));

  console.log('Local Grain Analysis:');
  console.log(JSON.stringify(grainStats, null, 2));

  // Compare against ground truth trace
  const liveTrace = JSON.parse(fs.readFileSync(path.join(AUDIT_DIR, 'noise-pattern-trace.json'), 'utf8'));
  const report = {
    assetMatch: assetCheck.naturalWidth === 256 && assetCheck.naturalHeight === 256 && assetCheck.backgroundSize === '256px 256px',
    dimensions: `${assetCheck.naturalWidth}x${assetCheck.naturalHeight}`,
    backgroundSize: assetCheck.backgroundSize,
    timing: {
      liveFPS: liveTrace.calculatedFPS,
      cloneFPS: cloneTrace.calculatedFPS,
      liveIntervalMs: liveTrace.avgIntervalMs,
      cloneIntervalMs: cloneTrace.avgIntervalMs,
      fpsDelta: Math.abs(liveTrace.calculatedFPS - cloneTrace.calculatedFPS)
    },
    grain: grainStats,
    pass: Math.abs(liveTrace.calculatedFPS - cloneTrace.calculatedFPS) < 0.5 && assetCheck.naturalWidth === 256
  };

  fs.writeFileSync(path.join(AUDIT_DIR, 'gate3-local-report.json'), JSON.stringify(report, null, 2));
  console.log('GATE 3 LOCAL REPORT:');
  console.log(JSON.stringify(report, null, 2));

  await browser.close();
  server.close();
}

run().catch(console.error);
