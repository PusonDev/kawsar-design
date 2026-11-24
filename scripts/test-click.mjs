import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testClick() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const btn = await page.$('.framer-13jn164');
  if (btn) {
    await btn.click();
    await new Promise(r => setTimeout(r, 300));
    const result = await page.evaluate(() => {
      const el = document.querySelector('.framer-13jn164');
      const cs = el ? window.getComputedStyle(el) : null;
      return {
        text: el ? el.textContent.trim() : null,
        color: el && el.querySelector('p') ? window.getComputedStyle(el.querySelector('p')).color : null
      };
    });
    console.log('CLICK RESULT:', result);
  }
  await browser.close();
}

testClick().catch(console.error);
