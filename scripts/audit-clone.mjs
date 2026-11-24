import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const LOCAL_URL = 'http://localhost:3000';
const refDir = path.join(projectRoot, '_ref');

async function audit() {
  console.log('Launching browser to audit clone...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  // 1. Audit Desktop 1440x900
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  console.log('Navigating to', LOCAL_URL);
  await page.goto(LOCAL_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const cloneDesktopPath = path.join(refDir, 'clone-desktop.png');
  await page.screenshot({ path: cloneDesktopPath, fullPage: true });
  console.log('Captured clone desktop screenshot to:', cloneDesktopPath);

  const desktopAudit = await page.evaluate(() => {
    // Check all images
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      broken: img.naturalWidth === 0
    }));

    function getStyles(el) {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        rect: { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        borderRadius: cs.borderRadius
      };
    }

    const h1 = document.querySelector('h1');
    const heroSection = document.querySelector('section');
    const latestWorkBtn = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Latest Work'));
    const servicesTitle = document.querySelector('h2');
    const contactTitle = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Tell me'));

    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight
      },
      images,
      h1: getStyles(h1),
      heroSection: getStyles(heroSection),
      latestWorkBtn: getStyles(latestWorkBtn),
      servicesTitle: getStyles(servicesTitle),
      contactTitle: getStyles(contactTitle)
    };
  });

  // 2. Audit Mobile 375x812
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 2000));

  const cloneMobilePath = path.join(refDir, 'clone-mobile.png');
  await page.screenshot({ path: cloneMobilePath, fullPage: true });
  console.log('Captured clone mobile screenshot to:', cloneMobilePath);

  const mobileAudit = await page.evaluate(() => {
    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight
      },
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });

  const report = {
    auditedAt: new Date().toISOString(),
    consoleErrors,
    desktop: desktopAudit,
    mobile: mobileAudit
  };

  fs.writeFileSync(path.join(refDir, 'clone-audit-report.json'), JSON.stringify(report, null, 2));
  console.log('Saved clone audit report to _ref/clone-audit-report.json');

  await browser.close();
}

audit().catch(e => {
  console.error('Audit failed:', e);
  process.exit(1);
});
