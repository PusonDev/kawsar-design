import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CLONE_URL = 'http://localhost:3000/';

async function verifyMobileClickability() {
  console.log('--- VERIFYING MOBILE CLICKABILITY (375x812) ---');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 });
  await page.goto(CLONE_URL, { waitUntil: 'networkidle2' });

  const audit = await page.evaluate(async () => {
    const results = [];

    // Correctly target visible mobile elements
    const tests = [
      {
        name: 'Mobile Header Email Button',
        finder: () => Array.from(document.querySelectorAll('header a')).find(a => a.textContent.trim() === 'Email')
      },
      {
        name: 'Mobile Header CV Link',
        finder: () => Array.from(document.querySelectorAll('header a')).find(a => a.textContent.trim() === 'CV' && a.offsetParent !== null)
      },
      {
        name: 'Mobile Header LinkedIn',
        finder: () => document.querySelector('header a[aria-label="LinkedIn"]')
      },
      {
        name: 'Mobile Header Dribbble',
        finder: () => document.querySelector('header a[aria-label="Dribbble"]')
      },
      {
        name: 'Mobile Header Instagram',
        finder: () => document.querySelector('header a[aria-label="Instagram"]')
      },
      {
        name: 'Mobile Latest Work Button',
        finder: () => Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Latest Work'))
      },
      {
        name: 'Mobile Contact Email Me Button',
        finder: () => Array.from(document.querySelectorAll('section:last-of-type a')).find(a => a.textContent.includes('Email Me'))
      },
      {
        name: 'Mobile Contact WhatsApp Button',
        finder: () => Array.from(document.querySelectorAll('section:last-of-type a')).find(a => a.textContent.includes('whatsApp'))
      }
    ];

    for (const item of tests) {
      const el = item.finder();
      if (!el) {
        results.push({ name: item.name, found: false, clickable: false, reason: 'Element not found' });
        continue;
      }

      el.scrollIntoView({ block: 'center', inline: 'center' });
      await new Promise(r => setTimeout(r, 50));

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const hit = document.elementFromPoint(centerX, centerY);
      const isSelfOrDescendant = hit === el || el.contains(hit);

      results.push({
        name: item.name,
        found: true,
        rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
        hitTag: hit ? hit.tagName : null,
        clickable: isSelfOrDescendant
      });
    }

    const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

    return { results, hasHorizontalOverflow, scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth };
  });

  console.log('MOBILE AUDIT RESULTS:');
  let allPass = true;
  for (const r of audit.results) {
    console.log(`  [${r.clickable ? 'PASS' : 'FAIL'}] ${r.name} (Hit: <${r.hitTag}>)`);
    if (!r.clickable) allPass = false;
  }
  console.log(`  Horizontal overflow on 375px: ${audit.hasHorizontalOverflow ? 'FAIL (Overflow)' : 'PASS (0px overflow)'}`);

  if (audit.hasHorizontalOverflow) allPass = false;

  console.log(`\nOVERALL MOBILE VERIFICATION: ${allPass ? '100% PASS' : 'FAIL'}`);
  await browser.close();

  if (!allPass) process.exit(1);
}

verifyMobileClickability().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
