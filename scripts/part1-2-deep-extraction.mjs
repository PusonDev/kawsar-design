import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const AUDIT_DIR = path.resolve(projectRoot, '_audit');

if (!fs.existsSync(AUDIT_DIR)) fs.mkdirSync(AUDIT_DIR, { recursive: true });

async function runExtraction() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();

  // Monitor network for noise asset
  let noiseAssetUrl = null;
  page.on('response', async res => {
    const url = res.url();
    if (url.includes('noise') || url.includes('grain') || url.includes('rR6HYXBrMmX4cRpXfXUOvpvpB0')) {
      noiseAssetUrl = url;
    }
  });

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  // 1. Download noise asset if URL found
  console.log('Detected Noise Asset URL:', noiseAssetUrl);
  if (noiseAssetUrl) {
    const res = await fetch(noiseAssetUrl);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(projectRoot, 'public/assets/live-noise.png'), buf);
    console.log(`Saved verbatim noise tile to public/assets/live-noise.png (${buf.length} bytes)`);
  }

  // 2. Extract Noise Truth & Mechanics
  const noiseTruth = await page.evaluate(async () => {
    const el = document.querySelector('.framer-ekivo5-container div[style*="rR6HYXBrMmX4cRpXfXUOvpvpB0"]')
      || document.querySelector('.framer-ekivo5-container div > div > div');
    const container = document.querySelector('.framer-ekivo5-container');

    const s = el ? window.getComputedStyle(el) : null;
    const cs = container ? window.getComputedStyle(container) : null;

    // Measure 20 frames x 30ms empirical jumps
    const jumpSamples = [];
    const startTime = performance.now();
    let lastTransform = s ? s.transform : '';

    await new Promise(resolve => {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        const currentTransform = el ? window.getComputedStyle(el).transform : '';
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
    const totalDurationMs = jumpSamples[jumpSamples.length - 1].elapsedMs;
    const fps = (changedCount / totalDurationMs) * 1000;

    return {
      container: cs ? {
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
        pointerEvents: cs.pointerEvents
      } : null,
      tile: s ? {
        backgroundImage: s.backgroundImage,
        backgroundSize: s.backgroundSize,
        backgroundRepeat: s.backgroundRepeat,
        opacity: s.opacity,
        mixBlendMode: s.mixBlendMode,
        position: s.position,
        inset: s.inset,
        width: s.width,
        height: s.height,
        transform: s.transform,
        willChange: s.willChange
      } : null,
      empirical20Frames: jumpSamples,
      changedCountIn20Frames: changedCount,
      measuredFPS: Number(fps.toFixed(2)),
      avgIntervalMs: changedCount > 0 ? Math.round(totalDurationMs / changedCount) : 0
    };
  });

  fs.writeFileSync(path.join(AUDIT_DIR, 'noise-truth.json'), JSON.stringify(noiseTruth, null, 2));
  console.log('Noise truth saved to _audit/noise-truth.json');

  // 3. Extract exact @media breakpoints from document.styleSheets
  const breakpoints = await page.evaluate(() => {
    const rules = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSMediaRule) {
            rules.push(rule.media.mediaText);
          }
        }
      } catch (e) {}
    }
    // Get unique media rules
    const unique = Array.from(new Set(rules));
    return unique.filter(m => m.includes('width'));
  });
  console.log('Extracted Media Breakpoints:', breakpoints);

  // Helper to extract full section metrics at a viewport
  async function extractViewportSpec(vpWidth, vpHeight) {
    await page.setViewport({ width: vpWidth, height: vpHeight, deviceScaleFactor: 2 });
    await new Promise(r => setTimeout(r, 600));

    return await page.evaluate((width) => {
      function getMetrics(sel) {
        const el = document.querySelector(sel);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const s = window.getComputedStyle(el);
        return {
          x: Math.round(rect.x),
          y: Math.round(rect.y + window.scrollY),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          lineHeight: s.lineHeight,
          letterSpacing: s.letterSpacing,
          color: s.color,
          bg: s.backgroundColor,
          bgImage: s.backgroundImage,
          borderRadius: s.borderRadius,
          padding: `${s.paddingTop} ${s.paddingRight} ${s.paddingBottom} ${s.paddingLeft}`,
          margin: `${s.marginTop} ${s.marginRight} ${s.marginBottom} ${s.marginLeft}`,
          gap: s.gap,
          transform: s.transform
        };
      }

      // Collect specific key elements
      return {
        viewportWidth: width,
        bodyBg: window.getComputedStyle(document.body).backgroundColor,
        // Surfaces
        heroSurface: getMetrics('.framer-1158rf0'),
        whiteStripSurface: getMetrics('.framer-6s92xu'),
        contactSurface: getMetrics('.framer-xohbsi'),
        // Header
        headerContainer: getMetrics('.framer-19ijx41'),
        emailPill: getMetrics('.framer-19ijx41 > div:first-child, .framer-19ijx41 div:has(> a[href*="mailto"])'),
        cvPill: getMetrics('a[href*="drive.google.com"]'),
        desktopSocials: getMetrics('.framer-19ijx41 div:has(> a[href*="linkedin"])'),
        mobileSocials: getMetrics('.framer-19ijx41 div:has(> a[href*="linkedin"]) svg, .framer-19ijx41 a[href*="linkedin"]'),
        // Hero
        avatar: getMetrics('.framer-pgjdg4 img, .framer-pgjdg4 [data-framer-name*="Avatar"]'),
        avatarPill: getMetrics('.framer-pgjdg4 div:has(> div > span)'),
        h1: getMetrics('h1'),
        latestWorkBtn: getMetrics('a[href*="dribbble.com/Kawsarvy"]'),
        // Partner logos
        logoStripContainer: getMetrics('.framer-5bx8wp'),
        firstLogo: getMetrics('.framer-5bx8wp img, .framer-5bx8wp svg'),
        // Services
        servicesH2: getMetrics('h2'),
        servicesPill: getMetrics('.framer-1go8jtk + div, div:has(> div > span:empty)'),
        servicesDivider: getMetrics('.framer-1go8jtk'),
        servicesGrid: getMetrics('.framer-o7xych'),
        serviceCard1: getMetrics('.framer-o7xych > div:first-child'),
        // Contact
        contactIcon: getMetrics('.framer-1g3h3o4'),
        contactH2: getMetrics('.framer-87b4nn h2'),
        emailMeBtn: getMetrics('a[href*="mailto:kawsarvy.design@gmail.com"]'),
        whatsAppBtn: getMetrics('a[href*="wa.me"]'),
        // Footer
        footerContainer: getMetrics('.framer-1wpa80f'),
        copyrightText: getMetrics('.framer-1wpa80f p, .framer-1wpa80f span'),
        footerSocials: getMetrics('.framer-1wpa80f div:has(a)')
      };
    }, vpWidth);
  }

  console.log('Extracting Desktop 1440x900...');
  const spec1440 = await extractViewportSpec(1440, 900);

  console.log('Extracting Tablet / Split-Screen 750x900...');
  const spec750 = await extractViewportSpec(750, 900);

  console.log('Extracting Tablet 810x900...');
  const spec810 = await extractViewportSpec(810, 900);

  console.log('Extracting Mobile 375x812...');
  const spec375 = await extractViewportSpec(375, 812);

  const fullSpec = {
    breakpoints,
    noiseTruth,
    spec1440,
    spec810,
    spec750,
    spec375
  };

  fs.writeFileSync(path.join(AUDIT_DIR, 'full-spec.json'), JSON.stringify(fullSpec, null, 2));
  console.log('Full spec saved to _audit/full-spec.json');

  await browser.close();
}

runExtraction().catch(console.error);
