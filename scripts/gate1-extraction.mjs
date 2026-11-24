import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const AUDIT_DIR = path.resolve(projectRoot, '_audit');
const ASSETS_DIR = path.resolve(projectRoot, 'public/assets');

if (!fs.existsSync(AUDIT_DIR)) fs.mkdirSync(AUDIT_DIR, { recursive: true });
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

async function runGate1() {
  console.log('--- GATE 1 EXTRACTION STARTING ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Intercept network responses to find all script URLs and image URLs
  const scriptUrls = [];
  let exactNoiseImageUrl = null;

  page.on('response', async res => {
    const url = res.url();
    if (url.endsWith('.js') || url.includes('.mjs')) {
      scriptUrls.push(url);
    }
    if (url.includes('rR6HYXBrMmX4cRpXfXUOvpvpB0') || url.includes('noise') || url.includes('grain')) {
      exactNoiseImageUrl = url;
    }
  });

  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  // Scan DOM for noise element and its image URL
  const domInspection = await page.evaluate(() => {
    const el = document.querySelector('.framer-ekivo5-container div[style*="rR6HYXBrMmX4cRpXfXUOvpvpB0"]')
      || document.querySelector('.framer-ekivo5-container div > div > div');
    const container = document.querySelector('.framer-ekivo5-container');

    if (!el) return { found: false };

    const s = window.getComputedStyle(el);
    const cs = container ? window.getComputedStyle(container) : null;

    // Extract exact URL from backgroundImage
    const match = s.backgroundImage.match(/url\(["']?([^"']+)["']?\)/);
    const bgUrl = match ? match[1] : null;

    return {
      found: true,
      outerHTML: el.outerHTML,
      containerOuterHTML: container ? container.outerHTML : null,
      className: el.className,
      styleText: el.getAttribute('style'),
      bgUrl,
      computed: {
        backgroundImage: s.backgroundImage,
        backgroundSize: s.backgroundSize,
        backgroundRepeat: s.backgroundRepeat,
        backgroundPosition: s.backgroundPosition,
        opacity: s.opacity,
        mixBlendMode: s.mixBlendMode,
        filter: s.filter,
        position: s.position,
        inset: s.inset,
        width: s.width,
        height: s.height,
        zIndex: s.zIndex,
        pointerEvents: s.pointerEvents,
        transform: s.transform,
        willChange: s.willChange,
        animation: s.animation,
        animationName: s.animationName,
        animationDuration: s.animationDuration,
        animationTimingFunction: s.animationTimingFunction
      },
      containerComputed: cs ? {
        position: cs.position,
        inset: cs.inset,
        top: cs.top,
        left: cs.left,
        right: cs.right,
        bottom: cs.bottom,
        width: cs.width,
        height: cs.height,
        opacity: cs.opacity,
        zIndex: cs.zIndex,
        pointerEvents: cs.pointerEvents,
        overflow: cs.overflow
      } : null
    };
  });

  console.log('DOM Inspection Result:');
  console.log(JSON.stringify(domInspection, null, 2));

  // 1b. Download EXACT raw noise image file byte-for-byte
  const imageUrl = domInspection.bgUrl || exactNoiseImageUrl || 'https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png';
  console.log(`Downloading exact raw noise image from: ${imageUrl}`);
  const imgRes = await fetch(imageUrl);
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
  const exactNoisePath = path.join(ASSETS_DIR, 'kawsar-exact-noise.png');
  fs.writeFileSync(exactNoisePath, imgBuffer);

  // Check dimensions of downloaded PNG
  const naturalWidth = imgBuffer.readUInt32BE(16);
  const naturalHeight = imgBuffer.readUInt32BE(20);
  console.log(`Saved exact noise tile to ${exactNoisePath}`);
  console.log(`Bytes: ${imgBuffer.length}, Natural Dimensions: ${naturalWidth} x ${naturalHeight}`);

  // 2. Rip exact Framer component code from .mjs scripts
  console.log('\nSearching scripts for Framer Noise component source code...');
  let framerSourceSnippet = '';
  for (const sUrl of scriptUrls) {
    try {
      const res = await fetch(sUrl);
      const text = await res.text();
      if (text.includes('rR6HYXBrMmX4cRpXfXUOvpvpB0') || text.includes('backgroundSize:`256px 256px`')) {
        console.log(`Found noise source in script: ${sUrl}`);
        const idx = text.indexOf('rR6HYXBrMmX4cRpXfXUOvpvpB0');
        // Capture a wide window of the exact component definition
        const snippet = text.substring(Math.max(0, idx - 1800), Math.min(text.length, idx + 600));
        framerSourceSnippet += `// SOURCE SCRIPT: ${sUrl}\n// EXACT NOISE COMPONENT DEFINITION:\n\n${snippet}\n\n`;
      }
    } catch (e) {
      console.error(`Error reading ${sUrl}:`, e.message);
    }
  }

  const framerSourcePath = path.join(AUDIT_DIR, 'framer-noise-source.txt');
  fs.writeFileSync(framerSourcePath, framerSourceSnippet);
  console.log(`Saved verbatim Framer noise component source to ${framerSourcePath} (${framerSourceSnippet.length} chars)`);

  // 3. 3000ms requestAnimationFrame motion trace on live site
  console.log('\nStarting 3000ms requestAnimationFrame motion trace on live site...');
  const trace = await page.evaluate(async () => {
    const el = document.querySelector('.framer-ekivo5-container div[style*="rR6HYXBrMmX4cRpXfXUOvpvpB0"]')
      || document.querySelector('.framer-ekivo5-container div > div > div');
    
    if (!el) return { error: 'Noise element not found' };

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

    // Compute intervals between jumps
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

  const tracePath = path.join(AUDIT_DIR, 'noise-pattern-trace.json');
  fs.writeFileSync(tracePath, JSON.stringify(trace, null, 2));
  console.log(`Saved 3000ms motion trace to ${tracePath} (${trace.totalStateChangesIn3000ms} state changes)`);
  console.log(`Summary: isAnimated=${trace.isAnimated}, totalChanges=${trace.totalStateChangesIn3000ms}, avgInterval=${trace.avgIntervalMs}ms, FPS=${trace.calculatedFPS}`);

  await browser.close();
  console.log('--- GATE 1 EXTRACTION FINISHED ---');
}

runGate1().catch(console.error);
