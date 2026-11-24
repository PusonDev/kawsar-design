import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function compare() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  const livePage = await browser.newPage();
  await livePage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await livePage.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const clonePage = await browser.newPage();
  await clonePage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await clonePage.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  function extractMetricsScript() {
    function findByText(text) {
      return Array.from(document.querySelectorAll('*')).find(e => e.textContent?.trim() === text || e.innerText?.trim() === text);
    }
    function getDetails(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      return {
        x: Math.round(r.x),
        y: Math.round(r.y + window.scrollY),
        w: Math.round(r.width),
        h: Math.round(r.height),
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        color: cs.color,
        bg: cs.backgroundColor,
        borderRadius: cs.borderRadius
      };
    }

    const heroHeading = document.querySelector('h1') || findByText('Building digital\nproducts, brands, and\nexperience.');
    const avatar = document.querySelector('img[src*="Ylx45dCKlDrap5HSs7wTBwhoAY"]');
    const badge = findByText('Kawsar Ahmed  👋🏼') || findByText('Kawsar Ahmed 👋🏼');
    const latestWork = findByText('Latest Work');
    const servicesPill = findByText('Services');
    const contactTitle = findByText('Tell me about your next project');
    const emailMe = findByText('Email Me');
    const whatsapp = findByText('whatsApp');
    const copyright = findByText('© 2026 All rights reserved.');

    return {
      totalHeight: document.documentElement.scrollHeight,
      heroHeading: getDetails(heroHeading),
      avatar: getDetails(avatar),
      badge: getDetails(badge),
      latestWork: getDetails(latestWork),
      servicesPill: getDetails(servicesPill),
      contactTitle: getDetails(contactTitle),
      emailMe: getDetails(emailMe),
      whatsapp: getDetails(whatsapp),
      copyright: getDetails(copyright)
    };
  }

  const liveMetrics = await livePage.evaluate(extractMetricsScript);
  const cloneMetrics = await clonePage.evaluate(extractMetricsScript);

  console.log('=== METRICS COMPARISON (LIVE vs CLONE) ===');
  for (const key of Object.keys(liveMetrics)) {
    console.log(`\n--- [${key}] ---`);
    console.log('LIVE :', liveMetrics[key]);
    console.log('CLONE:', cloneMetrics[key]);
  }

  await browser.close();
}

compare().catch(console.error);
