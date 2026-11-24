import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://kawsar.design/';
const refDir = path.join(projectRoot, '_ref');
const publicAssetsDir = path.join(projectRoot, 'public', 'assets');

fs.mkdirSync(refDir, { recursive: true });
fs.mkdirSync(publicAssetsDir, { recursive: true });

async function discoverNoise() {
  console.log('Launching headless browser to perform forensic noise analysis...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  console.log('Navigating to', TARGET_URL);
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  const noiseData = await page.evaluate(() => {
    const results = [];

    function inspectStyles(el, pseudo = null) {
      const cs = window.getComputedStyle(el, pseudo);
      const bg = cs.backgroundImage;
      const filter = cs.filter;
      const mask = cs.maskImage || cs.webkitMaskImage;
      const hasNoise = (bg && bg !== 'none' && (bg.includes('png') || bg.includes('webp') || bg.includes('svg') || bg.includes('grain') || bg.includes('noise') || bg.includes('data:'))) ||
                       (filter && filter.includes('url')) ||
                       (mask && mask !== 'none');

      if (hasNoise) {
        const r = el.getBoundingClientRect();
        const anims = el.getAnimations ? el.getAnimations().map(a => ({
          animationName: a.animationName,
          playState: a.playState,
          duration: a?.effect?.getTiming ? a.effect.getTiming().duration : null,
          iterations: a?.effect?.getTiming ? a.effect.getTiming().iterations : null
        })) : [];

        // Find parent hierarchy
        const parents = [];
        let p = el.parentElement;
        while (p && parents.length < 5) {
          parents.push({
            tag: p.tagName.toLowerCase(),
            className: p.className,
            id: p.id,
            rect: { x: Math.round(p.getBoundingClientRect().x), y: Math.round(p.getBoundingClientRect().y), w: Math.round(p.getBoundingClientRect().width), h: Math.round(p.getBoundingClientRect().height) },
            bg: window.getComputedStyle(p).backgroundColor,
            borderRadius: window.getComputedStyle(p).borderRadius,
            overflow: window.getComputedStyle(p).overflow
          });
          p = p.parentElement;
        }

        return {
          target: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ').join('.') : '') + (pseudo ? '::' + pseudo : ''),
          tag: el.tagName.toLowerCase(),
          id: el.id,
          className: el.className,
          pseudo: pseudo,
          rect: {
            x: Math.round(r.x),
            y: Math.round(r.y + window.scrollY),
            w: Math.round(r.width),
            h: Math.round(r.height)
          },
          computed: {
            position: cs.position,
            top: cs.top,
            left: cs.left,
            right: cs.right,
            bottom: cs.bottom,
            inset: `${cs.top} ${cs.right} ${cs.bottom} ${cs.left}`,
            width: cs.width,
            height: cs.height,
            zIndex: cs.zIndex,
            opacity: cs.opacity,
            mixBlendMode: cs.mixBlendMode,
            filter: cs.filter,
            backgroundImage: cs.backgroundImage,
            backgroundSize: cs.backgroundSize,
            backgroundRepeat: cs.backgroundRepeat,
            backgroundPosition: cs.backgroundPosition,
            transform: cs.transform,
            willChange: cs.willChange,
            pointerEvents: cs.pointerEvents,
            userSelect: cs.userSelect,
            overflow: cs.overflow,
            borderRadius: cs.borderRadius
          },
          animations: anims,
          parents
        };
      }
      return null;
    }

    // Scan all elements, ::before, ::after
    document.querySelectorAll('*').forEach(el => {
      const selfRes = inspectStyles(el);
      if (selfRes) results.push(selfRes);
      const beforeRes = inspectStyles(el, 'before');
      if (beforeRes) results.push(beforeRes);
      const afterRes = inspectStyles(el, 'after');
      if (afterRes) results.push(afterRes);
    });

    // Scan for SVG feTurbulence / filter
    const svgFilters = [];
    document.querySelectorAll('filter, feTurbulence').forEach(f => {
      svgFilters.push({
        tag: f.tagName,
        id: f.id,
        html: f.outerHTML,
        parentSvg: f.closest('svg')?.outerHTML?.slice(0, 300)
      });
    });

    // Scan for canvas
    const canvases = Array.from(document.querySelectorAll('canvas')).map(c => ({
      width: c.width,
      height: c.height,
      style: c.getAttribute('style')
    }));

    return {
      elementsWithNoise: results,
      svgFilters,
      canvases
    };
  });

  console.log(`Discovered ${noiseData.elementsWithNoise.length} noise occurrences in DOM/CSSOM.`);
  console.log(`Discovered ${noiseData.svgFilters.length} SVG filters, ${noiseData.canvases.length} canvases.`);

  // Write _ref/noise-spec.json
  fs.writeFileSync(path.join(refDir, 'noise-spec.json'), JSON.stringify(noiseData, null, 2), 'utf8');
  console.log('Saved forensic noise spec to _ref/noise-spec.json');

  // Extract all noise URLs and download verbatim
  const urls = new Set();
  noiseData.elementsWithNoise.forEach(item => {
    const bg = item.computed.backgroundImage;
    if (bg && bg.includes('url(')) {
      const matches = bg.match(/url\(["']?([^"']*)["']?\)/g);
      if (matches) {
        matches.forEach(m => {
          const u = m.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
          urls.add(u);
        });
      }
    }
  });

  console.log(`Unique noise URLs found: ${Array.from(urls).length}`);
  const downloadedAssets = [];

  for (const rawUrl of urls) {
    let targetUrl = rawUrl;
    if (targetUrl.startsWith('//')) targetUrl = 'https:' + targetUrl;
    else if (targetUrl.startsWith('/')) targetUrl = new URL(targetUrl, TARGET_URL).href;

    console.log('Downloading noise asset from:', targetUrl);
    try {
      const res = await fetch(targetUrl);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const ext = path.extname(new URL(targetUrl).pathname) || '.png';
        const destPath = path.join(publicAssetsDir, `noise-tile${ext}`);
        fs.writeFileSync(destPath, Buffer.from(buffer));
        console.log(`  -> Saved verbatim noise tile to ${destPath} (${buffer.byteLength} bytes)`);

        // Get image dimensions using browser
        const dims = await page.evaluate(async (dataUri) => {
          return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = () => resolve(null);
            img.src = dataUri;
          });
        }, `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`);

        downloadedAssets.push({
          url: targetUrl,
          savedTo: `public/assets/noise-tile${ext}`,
          bytes: buffer.byteLength,
          naturalDimensions: dims
        });
      }
    } catch (err) {
      console.error('Failed to download noise asset:', err.message);
    }
  }

  // Update noise-spec.json with asset metadata
  const finalSpec = {
    ...noiseData,
    downloadedAssets,
    analyzedAt: new Date().toISOString()
  };
  fs.writeFileSync(path.join(refDir, 'noise-spec.json'), JSON.stringify(finalSpec, null, 2), 'utf8');

  await browser.close();
  console.log('STEP 1 FORENSIC NOISE DISCOVERY COMPLETE!');
}

discoverNoise().catch(err => {
  console.error('Forensic discovery error:', err);
  process.exit(1);
});
