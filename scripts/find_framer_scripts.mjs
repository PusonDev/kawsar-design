import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  // Search script sources for the noise component
  const scriptContent = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
    return scripts;
  });

  console.log('Scripts on kawsar.design:', scriptContent);
  await browser.close();
}

run().catch(console.error);
