import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function findGrainComponent() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  let grainCode = null;

  page.on('response', async res => {
    const url = res.url();
    if (url.endsWith('.js') || url.includes('.mjs')) {
      try {
        const text = await res.text();
        if (text.includes('rR6HYXBrMmX4cRpXfXUOvpvpB0') || text.includes('ekivo5')) {
          console.log('FOUND GRAIN SCRIPT URL:', url);
          // Extract snippet around rR6HYXBrMmX4cRpXfXUOvpvpB0
          const idx = text.indexOf('rR6HYXBrMmX4cRpXfXUOvpvpB0');
          grainCode = text.substring(Math.max(0, idx - 1500), Math.min(text.length, idx + 300));
        }
      } catch (e) {}
    }
  });

  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  console.log('GRAIN CODE SNIPPET:');
  console.log(grainCode);

  await browser.close();
}

findGrainComponent().catch(console.error);
