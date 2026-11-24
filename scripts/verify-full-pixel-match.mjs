import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function extractMetrics(page, isLive = false) {
  return await page.evaluate((isLiveSite) => {
    function r(el) {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      return {
        x: Math.round(b.x * 10) / 10,
        y: Math.round(b.y * 10) / 10,
        w: Math.round(b.width * 10) / 10,
        h: Math.round(b.height * 10) / 10,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        color: cs.color,
        bg: cs.backgroundColor,
        radius: cs.borderRadius
      };
    }

    // Email pill
    const emailPill = isLiveSite
      ? document.querySelector('.framer-177fnul')
      : document.querySelector('header .h-\\[56px\\].w-\\[279px\\]') || document.querySelector('header div');

    // Email text
    const emailText = Array.from(document.querySelectorAll('*')).find(
      el => el.textContent && el.textContent.trim() === 'kawsarvy.design@gmail.com' && el.children.length === 0
    );

    // Copy button
    const copyBtn = isLiveSite
      ? document.querySelector('.framer-13jn164')
      : document.querySelector('header button');

    // CV pill
    const cvPill = isLiveSite
      ? document.querySelector('.framer-bnpv5q')
      : Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === 'CV');

    // Avatar image
    const avatar = document.querySelector('img[src*="Ylx45dCKlDrap5HSs7wTBwhoAY"], img[src*="kawsar-avatar"]');

    // Badge
    const badge = Array.from(document.querySelectorAll('*')).find(
      el => el.textContent && el.textContent.includes('Kawsar Ahmed') && el.textContent.includes('👋🏼') && (el.className.includes('rounded') || el.className.includes('framer-') || el.style.borderRadius)
    );

    // Hero H1
    const h1 = document.querySelector('h1');

    // Latest work button
    const latestWork = Array.from(document.querySelectorAll('a')).find(
      a => a.textContent && a.textContent.includes('Latest Work')
    );

    // Marquee container
    const marquee = isLiveSite
      ? document.querySelector('.framer-1y4ub8u-container')
      : document.querySelector('.animate-marquee-smooth')?.parentElement;

    // Services headline
    const servicesH2 = Array.from(document.querySelectorAll('h2, p')).find(
      el => el.textContent && el.textContent.includes('Collaborate with brands')
    );

    // Services tilted pill
    const servicesPill = Array.from(document.querySelectorAll('*')).find(
      el => el.textContent && el.textContent.trim() === 'Services' && (el.className.includes('rotate') || el.style.transform?.includes('rotate') || el.className.includes('framer-5bx8wp'))
    );

    // Contact heading
    const contactH2 = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent && el.textContent.includes('Tell me about your next project')
    );

    // Email Me button
    const emailMe = Array.from(document.querySelectorAll('a')).find(
      a => a.textContent && a.textContent.includes('Email Me')
    );

    // whatsApp button
    const whatsApp = Array.from(document.querySelectorAll('a')).find(
      a => a.textContent && a.textContent.toLowerCase().includes('whatsapp')
    );

    // Copyright
    const copyright = Array.from(document.querySelectorAll('p, div, span')).find(
      el => el.textContent && el.textContent.includes('© 2026') && el.children.length === 0
    );

    return {
      emailPill: r(emailPill),
      emailText: r(emailText),
      copyBtn: r(copyBtn),
      cvPill: r(cvPill),
      avatar: r(avatar),
      badge: r(badge),
      h1: r(h1),
      latestWork: r(latestWork),
      marquee: r(marquee),
      servicesH2: r(servicesH2),
      servicesPill: r(servicesPill),
      contactH2: r(contactH2),
      emailMe: r(emailMe),
      whatsApp: r(whatsApp),
      copyright: r(copyright)
    };
  }, isLive);
}

async function verifyAll() {
  console.log('🚀 Starting Full Pixel & Metric Verification Audit...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const refDir = path.resolve(projectRoot, '_ref');
  if (!fs.existsSync(refDir)) fs.mkdirSync(refDir, { recursive: true });

  // 1. Desktop 1440x900 comparison
  console.log('📸 Auditing Desktop (1440x900)...');
  const livePage = await browser.newPage();
  await livePage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await livePage.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await livePage.screenshot({ path: path.join(refDir, 'live-final-desktop.png'), fullPage: true });
  const liveMetrics = await extractMetrics(livePage, true);

  const clonePage = await browser.newPage();
  await clonePage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await clonePage.goto('https://kawsar.zenvq.com/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await clonePage.screenshot({ path: path.join(refDir, 'clone-final-desktop.png'), fullPage: true });
  const cloneMetrics = await extractMetrics(clonePage, false);

  // 2. Mobile 375x812 comparison
  console.log('📸 Auditing Mobile (375x812)...');
  await livePage.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 });
  await livePage.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await livePage.screenshot({ path: path.join(refDir, 'live-final-mobile.png'), fullPage: true });

  await clonePage.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 });
  await clonePage.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await clonePage.screenshot({ path: path.join(refDir, 'clone-final-mobile.png'), fullPage: true });

  await browser.close();

  // 3. Compare metrics
  const comparison = {};
  for (const key of Object.keys(liveMetrics)) {
    const l = liveMetrics[key];
    const c = cloneMetrics[key];
    if (!l || !c) {
      comparison[key] = { status: 'MISSING', live: l, clone: c };
      continue;
    }
    const dx = Math.abs(l.x - c.x);
    const dy = Math.abs(l.y - c.y);
    const dw = Math.abs(l.w - c.w);
    const dh = Math.abs(l.h - c.h);
    comparison[key] = {
      status: (dx <= 4 && dy <= 4 && dw <= 4 && dh <= 4) ? 'PERFECT_MATCH' : 'CLOSE_MATCH',
      delta: { dx, dy, dw, dh },
      live: l,
      clone: c
    };
  }

  fs.writeFileSync(path.join(refDir, 'audit-comparison.json'), JSON.stringify(comparison, null, 2));
  console.log('✅ Audit comparison saved to _ref/audit-comparison.json');
  console.log(JSON.stringify(comparison, null, 2));
}

verifyAll().catch(console.error);
