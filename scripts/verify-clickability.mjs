import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CLONE_URL = 'http://localhost:3000/';

async function verifyClickability() {
  console.log('--- VERIFYING CLICKABILITY & ZERO INTERFERENCE ---');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(CLONE_URL, { waitUntil: 'networkidle2' });

  const audit = await page.evaluate(async () => {
    const results = [];

    const selectors = [
      { name: 'Header Email Copy Button', sel: 'header button' },
      { name: 'Header CV Link', sel: 'header a[href*="drive.google.com"]' },
      { name: 'Hero Latest Work Button', sel: 'a[href*="dribbble.com/Kawsarvy"]' },
      { name: 'Contact Email Me Button', sel: 'section:last-of-type a[href^="mailto:"]' },
      { name: 'Contact WhatsApp Button', sel: 'section:last-of-type a[href*="wa.me"]' },
      { name: 'Header LinkedIn Link', sel: 'header a[href*="linkedin.com"]' },
      { name: 'Header Dribbble Link', sel: 'header a[href*="dribbble.com"]' },
      { name: 'Header Instagram Link', sel: 'header a[href*="instagram.com"]' },
      { name: 'Footer LinkedIn Link', sel: 'footer a[href*="linkedin.com"]' },
      { name: 'Footer Dribbble Link', sel: 'footer a[href*="dribbble.com"]' },
      { name: 'Footer Instagram Link', sel: 'footer a[href*="instagram.com"]' }
    ];

    for (const item of selectors) {
      const el = document.querySelector(item.sel);
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
        hitClass: hit ? hit.className : null,
        clickable: isSelfOrDescendant
      });
    }

    return results;
  });

  console.log('CLICKABILITY AUDIT RESULTS:');
  let allPass = true;
  for (const r of audit) {
    console.log(`  [${r.clickable ? 'PASS' : 'FAIL'}] ${r.name} (Hit: <${r.hitTag}> ${r.hitClass ? '.' + r.hitClass.slice(0, 30) : ''})`);
    if (!r.clickable) allPass = false;
  }

  console.log(`\nOVERALL CLICKABILITY: ${allPass ? '100% PASS' : 'FAIL'}`);
  await browser.close();

  if (!allPass) process.exit(1);
}

verifyClickability().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
