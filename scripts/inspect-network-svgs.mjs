import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectNetworkSvgs() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  const svgResponses = {};

  page.on('response', async res => {
    const url = res.url();
    if (url.includes('.svg') && url.includes('framerusercontent')) {
      try {
        const text = await res.text();
        svgResponses[url] = {
          hasViewBox: text.includes('viewBox'),
          svgStart: text.substring(0, 150)
        };
      } catch (e) {}
    }
  });

  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  console.log('NETWORK SVGS:', JSON.stringify(svgResponses, null, 2));

  await browser.close();
}

inspectNetworkSvgs().catch(console.error);
