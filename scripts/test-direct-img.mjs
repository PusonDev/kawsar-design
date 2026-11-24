import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testImgTag() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('https://kawsar.zenvq.com/', { waitUntil: 'networkidle2' });

  const result = await page.evaluate(() => {
    const container = document.querySelector('.animate-marquee-smooth');
    const firstSlot = container.firstElementChild;
    firstSlot.innerHTML = `
      <div style="position: absolute; inset: 0;">
        <img src="/assets/XFWQcHTyPCmpljR7ttDhwueN9k.svg" width="94" height="32" style="display:block;width:100%;height:100%;object-fit:contain;object-position:center;">
      </div>
    `;
    firstSlot.style.position = 'relative';
    const img = firstSlot.querySelector('img');
    const r = img.getBoundingClientRect();
    return {
      w: r.width,
      h: r.height,
      csW: window.getComputedStyle(img).width,
      csH: window.getComputedStyle(img).height,
      objectFit: window.getComputedStyle(img).objectFit
    };
  });

  console.log('TEST RESULT WITH DIRECT IMG:', result);
  await browser.close();
}

testImgTag().catch(console.error);
