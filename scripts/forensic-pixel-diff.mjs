import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function forensicDiff() {
  console.log('--- RUNNING DEEP FORENSIC COMPARISON: LIVE VS CLONE ---');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  // 1. Inspect Live Site
  const livePage = await browser.newPage();
  await livePage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  console.log('Navigating to https://kawsar.design/...');
  await livePage.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const liveData = await livePage.evaluate(() => {
    function getDetails(el) {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        rect: { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        borderRadius: cs.borderRadius,
        padding: cs.padding,
        margin: cs.margin,
        transform: cs.transform
      };
    }

    return {
      body: getDetails(document.body),
      // Header elements
      emailPill: getDetails(document.querySelector('.framer-19ijx41 > div:first-child')),
      cvLink: getDetails(document.querySelector('a[href*="drive.google.com"]')),
      // Hero elements
      avatar: getDetails(document.querySelector('img[src*="Ylx45dCKlDrap5HSs7wTBwhoAY"]')),
      h1: getDetails(document.querySelector('h1')),
      latestWorkBtn: getDetails(document.querySelector('a[href*="dribbble.com/Kawsarvy"]')),
      // Logo strip
      marqueeContainer: getDetails(document.querySelector('.framer-1y4ub8u-container')),
      // Services elements
      servicesH2: getDetails(document.querySelector('h2')),
      servicesPill: getDetails(document.querySelector('.framer-5bx8wp')),
      // Contact elements
      contactHeading: getDetails(document.querySelectorAll('h2')[1] || document.querySelector('h2')),
      emailMeBtn: getDetails(document.querySelector('a[href^="mailto:"]')),
      whatsAppBtn: getDetails(document.querySelector('a[href*="wa.me"]'))
    };
  });

  // 2. Inspect Clone
  const clonePage = await browser.newPage();
  await clonePage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  console.log('Navigating to http://localhost:3000/...');
  try {
    await clonePage.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  } catch (e) {
    // try pages.dev
    console.log('Fallback to https://kawsar-8sf.pages.dev...');
    await clonePage.goto('https://kawsar-8sf.pages.dev', { waitUntil: 'networkidle2' });
  }
  await new Promise(r => setTimeout(r, 1500));

  const cloneData = await clonePage.evaluate(() => {
    function getDetails(el) {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        rect: { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        borderRadius: cs.borderRadius,
        padding: cs.padding,
        margin: cs.margin,
        transform: cs.transform
      };
    }

    return {
      body: getDetails(document.body),
      emailPill: getDetails(document.querySelector('header .hidden.md\\:flex > div:first-child')),
      cvLink: getDetails(document.querySelector('header a[href*="drive.google.com"]')),
      avatar: getDetails(document.querySelector('img[alt="Kawsar Ahmed"]')),
      h1: getDetails(document.querySelector('h1')),
      latestWorkBtn: getDetails(Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Latest Work'))),
      marqueeContainer: getDetails(document.querySelector('.animate-marquee-smooth')?.parentElement),
      servicesH2: getDetails(document.querySelector('h2')),
      servicesPill: getDetails(document.querySelector('div[style*="rotate(-10deg)"]')),
      contactHeading: getDetails(document.querySelectorAll('h2')[1]),
      emailMeBtn: getDetails(document.querySelector('section:last-of-type a[href^="mailto:"]')),
      whatsAppBtn: getDetails(document.querySelector('section:last-of-type a[href*="wa.me"]'))
    };
  });

  const comparison = {};
  for (const key of Object.keys(liveData)) {
    comparison[key] = {
      live: liveData[key],
      clone: cloneData[key],
      rectDiff: liveData[key] && cloneData[key] ? {
        dx: cloneData[key].rect.x - liveData[key].rect.x,
        dy: cloneData[key].rect.y - liveData[key].rect.y,
        dw: cloneData[key].rect.w - liveData[key].rect.w,
        dh: cloneData[key].rect.h - liveData[key].rect.h
      } : null
    };
  }

  fs.writeFileSync(path.join(projectRoot, '_ref', 'forensic-diff.json'), JSON.stringify(comparison, null, 2));
  console.log('Saved forensic-diff.json');

  console.log('\n--- KEY POSITIONAL & DIMENSION DIFFS ---');
  for (const [key, val] of Object.entries(comparison)) {
    if (val.rectDiff) {
      console.log(`[${key}] Live: (${val.live.rect.x}, ${val.live.rect.y}, ${val.live.rect.w}x${val.live.rect.h}) | Clone: (${val.clone.rect.x}, ${val.clone.rect.y}, ${val.clone.rect.w}x${val.clone.rect.h}) | Delta: dx=${val.rectDiff.dx}, dy=${val.rectDiff.dy}, dw=${val.rectDiff.dw}, dh=${val.rectDiff.dh}`);
    }
  }

  await browser.close();
}

forensicDiff().catch(console.error);
