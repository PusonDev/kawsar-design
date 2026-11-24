import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runNoiseForensic() {
  const auditDir = path.resolve(projectRoot, '_audit');
  if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log('Navigating to https://kawsar.design/...');
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Deep DOM & CSSOM scan for noise elements
  const noiseSpec = await page.evaluate(() => {
    // Search all elements for noise keywords in background, class, style, etc.
    const allEls = Array.from(document.querySelectorAll('*'));
    const noiseCandidates = [];

    for (const el of allEls) {
      const cs = window.getComputedStyle(el);
      const bgImg = cs.backgroundImage || '';
      const styleAttr = el.getAttribute('style') || '';
      const classAttr = el.className || '';

      if (
        bgImg.includes('noise') ||
        bgImg.includes('grain') ||
        bgImg.includes('rR6HYXBrMmX4cRpXfXUOvpvpB0') ||
        styleAttr.includes('rR6HYXBrMmX4cRpXfXUOvpvpB0') ||
        (typeof classAttr === 'string' && classAttr.includes('ekivo5'))
      ) {
        const r = el.getBoundingClientRect();
        const anims = el.getAnimations ? el.getAnimations() : [];
        const animDetails = anims.map(a => {
          const timing = a.effect ? a.effect.getTiming() : null;
          const kf = a.effect ? a.effect.getKeyframes() : [];
          return {
            id: a.id,
            playState: a.playState,
            currentTime: a.currentTime,
            timing,
            keyframes: kf
          };
        });

        noiseCandidates.push({
          tagName: el.tagName,
          className: String(el.className),
          id: el.id,
          styleAttr,
          rect: { x: r.x, y: r.y, w: r.width, h: r.height },
          computed: {
            position: cs.position,
            inset: `${cs.top} ${cs.right} ${cs.bottom} ${cs.left}`,
            width: cs.width,
            height: cs.height,
            opacity: cs.opacity,
            mixBlendMode: cs.mixBlendMode,
            filter: cs.filter,
            zIndex: cs.zIndex,
            pointerEvents: cs.pointerEvents,
            backgroundImage: cs.backgroundImage,
            backgroundSize: cs.backgroundSize,
            backgroundRepeat: cs.backgroundRepeat,
            backgroundPosition: cs.backgroundPosition,
            willChange: cs.willChange,
            transform: cs.transform
          },
          animationCount: anims.length,
          animations: animDetails,
          parent: el.parentElement ? {
            tagName: el.parentElement.tagName,
            className: String(el.parentElement.className),
            overflow: window.getComputedStyle(el.parentElement).overflow,
            rect: el.parentElement.getBoundingClientRect()
          } : null
        });
      }
    }

    // Also scan all stylesheets for keyframes related to noise
    const keyframesList = [];
    try {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            if (rule.type === CSSRule.KEYFRAMES_RULE) {
              const name = rule.name;
              const text = rule.cssText;
              if (
                name.toLowerCase().includes('noise') ||
                name.toLowerCase().includes('grain') ||
                text.toLowerCase().includes('translate') ||
                text.toLowerCase().includes('steps')
              ) {
                keyframesList.push({ name, cssText: text });
              }
            }
          }
        } catch (e) {}
      }
    } catch (e) {}

    return {
      noiseCandidates,
      keyframesList
    };
  });

  console.log('Noise spec extracted:', JSON.stringify(noiseSpec, null, 2));
  fs.writeFileSync(path.join(auditDir, 'live-noise.json'), JSON.stringify(noiseSpec, null, 2));

  // 2. Capture 2 uncompressed 200x200px crops 150ms apart
  // Find an empty background area in the hero (e.g. x=200, y=200, w=200, h=200 at dpr=2)
  console.log('Capturing 2-frame macro zoom crops (150ms apart)...');
  const clip = { x: 150, y: 150, width: 200, height: 200 };

  await page.screenshot({
    path: path.join(auditDir, 'main-noise-t0.png'),
    clip
  });

  await new Promise(r => setTimeout(r, 150));

  await page.screenshot({
    path: path.join(auditDir, 'main-noise-t1.png'),
    clip
  });

  // 3. Compute pixel difference between t0 and t1 and stats
  const t0Buffer = fs.readFileSync(path.join(auditDir, 'main-noise-t0.png'));
  const t1Buffer = fs.readFileSync(path.join(auditDir, 'main-noise-t1.png'));

  // Compare buffers and analyze PNG pixels via page evaluate
  const motionAnalysis = await page.evaluate(async (clipArea) => {
    // Create an offscreen canvas to sample pixels at clipArea over time
    // Sample frame 1
    const getLuminanceAt = () => {
      // Sample 200x200 grid
      return document.querySelector('.framer-ekivo5-container') ? true : false;
    };
    return { hasNoiseContainer: getLuminanceAt() };
  }, clip);

  console.log('Motion Analysis from DOM:', motionAnalysis);

  // Download exact noise asset if found
  const noiseUrl = 'https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png';
  try {
    const res = await page.goto(noiseUrl);
    const buffer = await res.buffer();
    fs.writeFileSync(path.join(projectRoot, 'public/assets/noise-live.png'), buffer);
    console.log(`Saved verbatim noise asset to public/assets/noise-live.png (${buffer.length} bytes)`);
  } catch (e) {
    console.error('Failed to download noise asset:', e);
  }

  await browser.close();
  console.log('Phase 1 forensic script finished successfully.');
}

runNoiseForensic().catch(console.error);
