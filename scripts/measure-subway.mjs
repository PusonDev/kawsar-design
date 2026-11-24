import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function measureSubway() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  
  // Find SUBWAY img element
  const subwayImg = await page.evaluate(() => {
    const img = Array.from(document.querySelectorAll('.framer-1y4ub8u-container img')).find(i => i.src.includes('XFWQcHTyPCmpljR7ttDhwueN9k'));
    if (!img) return null;
    const r = img.getBoundingClientRect();
    return {
      src: img.src,
      w: r.width,
      h: r.height,
      naturalW: img.naturalWidth,
      naturalH: img.naturalHeight
    };
  });

  console.log('SUBWAY ON LIVE:', subwayImg);
  await browser.close();
}

measureSubway().catch(console.error);
