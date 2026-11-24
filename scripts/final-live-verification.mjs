import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const AUDIT_DIR = path.resolve(projectRoot, '_audit');

const VIEWPORTS = [
  { name: 'desktop', w: 1440, h: 900 },
  { name: 'tablet', w: 750, h: 900 },
  { name: 'mobile', w: 375, h: 812 },
];

async function runLiveVerification() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  });

  const timestamp = Date.now();
  const liveTargetUrl = 'https://kawsar.design/';
  const liveCloneUrl = `https://kawsar.zenvq.com/?v=${timestamp}`;

  const results = {};

  for (const vp of VIEWPORTS) {
    console.log(`\n================ Testing Viewport: ${vp.name} (${vp.w}x${vp.h}) ================`);
    const pageTarget = await browser.newPage();
    await pageTarget.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 2 });
    await pageTarget.goto(liveTargetUrl, { waitUntil: 'networkidle2' });

    const pageClone = await browser.newPage();
    const consoleErrors = [];
    pageClone.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await pageClone.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 2 });
    await pageClone.goto(liveCloneUrl, { waitUntil: 'networkidle2' });

    // Capture screenshots
    await pageTarget.screenshot({ path: path.join(AUDIT_DIR, `final-main-${vp.name}.png`), fullPage: true });
    await pageClone.screenshot({ path: path.join(AUDIT_DIR, `final-live-clone-${vp.name}.png`), fullPage: true });

    // Extract metrics from clone
    const cloneData = await pageClone.evaluate((vpW) => {
      function getMetrics(sel) {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const s = window.getComputedStyle(el);
        return {
          x: Math.round(r.x),
          y: Math.round(r.y + window.scrollY),
          w: Math.round(r.width),
          h: Math.round(r.height),
          display: s.display,
          flexDirection: s.flexDirection,
          alignItems: s.alignItems,
          justifyContent: s.justifyContent,
          fontSize: s.fontSize,
          lineHeight: s.lineHeight,
          bg: s.backgroundColor,
          color: s.color,
          transform: s.transform
        };
      }

      // Check overflow
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const hasOverflow = docW > winW;

      // Check whatsapp button casing
      const waLink = document.querySelector('a[href*="wa.me"]');
      const waText = waLink ? waLink.textContent.trim() : null;

      // Check footer layout
      const footer = document.querySelector('footer');
      const footerMobile = document.querySelector('footer > div.flex.md\\:hidden');
      const footerDesktop = document.querySelector('footer > div.hidden.md\\:flex');

      return {
        hasOverflow,
        docW,
        winW,
        waText,
        waCasingExact: waText === 'whatsApp',
        h1: getMetrics('h1'),
        avatar: getMetrics('img[alt="Kawsar Ahmed"]'),
        avatarPill: getMetrics('.absolute.left-\\[99px\\]'),
        latestWork: getMetrics('a[href*="dribbble.com/Kawsarvy"]'),
        servicesH2: getMetrics('h2'),
        servicesGrid: getMetrics('.grid.grid-cols-1'),
        footerMobile: footerMobile ? {
          display: window.getComputedStyle(footerMobile).display,
          flexDirection: window.getComputedStyle(footerMobile).flexDirection,
          alignItems: window.getComputedStyle(footerMobile).alignItems
        } : null,
        footerDesktop: footerDesktop ? {
          display: window.getComputedStyle(footerDesktop).display
        } : null
      };
    }, vp.w);

    results[vp.name] = {
      consoleErrors,
      cloneData
    };

    await pageTarget.close();
    await pageClone.close();
  }

  // Measure noise speed & grain stdDev on live clone
  console.log('\n================ Measuring Live Clone Noise & Grain ================');
  const pageNoise = await browser.newPage();
  await pageNoise.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await pageNoise.goto(liveCloneUrl, { waitUntil: 'networkidle2' });

  const noiseStats = await pageNoise.evaluate(async () => {
    const el = document.querySelector('.animate-live-noise');
    if (!el) return { error: 'Noise element not found' };

    // Empirical jumps over 20 frames x 30ms
    const jumpSamples = [];
    const startTime = performance.now();
    let lastTransform = window.getComputedStyle(el).transform;

    await new Promise(resolve => {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        const currentTransform = window.getComputedStyle(el).transform;
        jumpSamples.push({
          step: count,
          elapsedMs: Math.round(performance.now() - startTime),
          transform: currentTransform,
          changed: currentTransform !== lastTransform
        });
        lastTransform = currentTransform;

        if (count >= 20) {
          clearInterval(interval);
          resolve();
        }
      }, 30);
    });

    const changedCount = jumpSamples.filter(j => j.changed).length;
    const totalMs = jumpSamples[jumpSamples.length - 1].elapsedMs;
    const fps = (changedCount / totalMs) * 1000;

    return {
      changedCountIn20Frames: changedCount,
      measuredFPS: Number(fps.toFixed(2)),
      avgIntervalMs: changedCount > 0 ? Math.round(totalMs / changedCount) : 0,
      jumpSamples
    };
  });

  // Measure Hero and Contact crops on live clone
  const heroCrop = await pageNoise.screenshot({ clip: { x: 200, y: 250, width: 200, height: 200 } });
  await pageNoise.evaluate(() => window.scrollTo(0, 1900));
  await new Promise(r => setTimeout(r, 400));
  const contactCrop = await pageNoise.screenshot({ clip: { x: 200, y: 500, width: 200, height: 200 } });

  const grainAnalysis = await pageNoise.evaluate(async (heroB64, contactB64) => {
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
      const stdDev = Math.sqrt(varianceSum / total);
      return {
        meanRGB: { r: Number(meanR.toFixed(2)), g: Number(meanG.toFixed(2)), b: Number(meanB.toFixed(2)) },
        stdDev: Number(stdDev.toFixed(4))
      };
    }

    return {
      hero: await analyze(heroB64),
      contact: await analyze(contactB64)
    };
  }, heroCrop.toString('base64'), contactCrop.toString('base64'));

  results.noiseStats = noiseStats;
  results.grainAnalysis = grainAnalysis;

  console.log('\n================ AUDIT SUMMARY ================');
  console.log(JSON.stringify(results, null, 2));

  fs.writeFileSync(path.join(AUDIT_DIR, 'final-verification-report.json'), JSON.stringify(results, null, 2));
  console.log(`Saved report to ${path.join(AUDIT_DIR, 'final-verification-report.json')}`);

  await browser.close();
}

runLiveVerification().catch(console.error);
