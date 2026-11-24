import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const scripts = [];
  page.on('response', async res => {
    const url = res.url();
    if (url.endsWith('.mjs') || url.endsWith('.js')) {
      try {
        const text = await res.text();
        scripts.push({ url, text });
      } catch (e) {}
    }
  });

  await page.goto('https://kawsar.design', { waitUntil: 'networkidle2' });

  console.log(`Intercepted ${scripts.length} script files.`);

  for (const s of scripts) {
    if (s.text.includes('rR6HYXBrMmX4cRpXfXUOvpvpB0') || s.text.includes('translateX(-3.5%)') || s.text.includes('translateX(')) {
      console.log('Found match in script:', s.url);
      const idx = s.text.indexOf('translateX(');
      console.log('Snippet around translateX:');
      console.log(s.text.substring(Math.max(0, idx - 200), idx + 600));

      const idxImg = s.text.indexOf('rR6HYXBrMmX4cRpXfXUOvpvpB0');
      console.log('Snippet around img url:');
      console.log(s.text.substring(Math.max(0, idxImg - 200), idxImg + 600));
    }
  }

  await browser.close();
}

main().catch(console.error);
