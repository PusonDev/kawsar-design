import puppeteer from 'puppeteer-core';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectElements() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  async function checkAt(w, h) {
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
    await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));

    return await page.evaluate((width) => {
      // Helper to find by text content
      function findByText(text, tag = '*') {
        const els = Array.from(document.querySelectorAll(tag));
        return els.find(el => el.textContent && el.textContent.trim().includes(text));
      }

      const h1El = document.querySelector('h1') || findByText('Building digital');
      const avatarPillEl = findByText('Kawsar Ahmed');
      const avatarImgEl = document.querySelector('img[src*="kawsar"], img[alt*="kawsar"]') || document.querySelector('.framer-pgjdg4 img') || document.querySelector('[data-framer-name*="Avatar"] img') || document.querySelector('.framer-pgjdg4');
      const latestWorkEl = findByText('Latest Work', 'a') || document.querySelector('a[href*="dribbble"]');
      const servicesPillEl = findByText('Services', 'div') || findByText('Services', 'span');
      const whatsAppEl = findByText('whatsApp', 'a') || document.querySelector('a[href*="wa.me"]');
      const emailMeEl = findByText('Email Me', 'a') || document.querySelector('a[href*="mailto"]');
      const cvEl = findByText('CV', 'a') || document.querySelector('a[href*="drive.google"]');
      const emailPillEl = document.querySelector('a[href*="mailto"]') ? document.querySelector('a[href*="mailto"]').closest('div') : null;
      const footerEl = document.querySelector('.framer-1wpa80f');

      function dump(el, name) {
        if (!el) return { name, found: false };
        const r = el.getBoundingClientRect();
        const s = window.getComputedStyle(el);
        return {
          name,
          found: true,
          tag: el.tagName,
          text: (el.textContent || '').trim().substring(0, 40),
          rect: {
            x: Math.round(r.x),
            y: Math.round(r.y + window.scrollY),
            w: Math.round(r.width),
            h: Math.round(r.height)
          },
          computed: {
            fontFamily: s.fontFamily,
            fontSize: s.fontSize,
            fontWeight: s.fontWeight,
            lineHeight: s.lineHeight,
            letterSpacing: s.letterSpacing,
            color: s.color,
            bg: s.backgroundColor,
            bgImage: s.backgroundImage,
            borderRadius: s.borderRadius,
            padding: `${s.paddingTop} ${s.paddingRight} ${s.paddingBottom} ${s.paddingLeft}`,
            gap: s.gap,
            transform: s.transform,
            display: s.display,
            flexDirection: s.flexDirection,
            justifyContent: s.justifyContent,
            alignItems: s.alignItems
          }
        };
      }

      return {
        width,
        h1: dump(h1El, 'H1'),
        avatarImg: dump(avatarImgEl, 'AvatarImg'),
        avatarPill: dump(avatarPillEl, 'AvatarPill'),
        latestWork: dump(latestWorkEl, 'LatestWork'),
        servicesPill: dump(servicesPillEl, 'ServicesPill'),
        emailMe: dump(emailMeEl, 'EmailMe'),
        whatsApp: dump(whatsAppEl, 'WhatsApp'),
        cv: dump(cvEl, 'CV'),
        emailPill: dump(emailPillEl, 'EmailPill'),
        footer: dump(footerEl, 'Footer')
      };
    }, w);
  }

  console.log('=== CHECK AT 1440px ===');
  const d1440 = await checkAt(1440, 900);
  console.log(JSON.stringify(d1440, null, 2));

  console.log('\n=== CHECK AT 750px ===');
  const d750 = await checkAt(750, 900);
  console.log(JSON.stringify(d750, null, 2));

  console.log('\n=== CHECK AT 375px ===');
  const d375 = await checkAt(375, 812);
  console.log(JSON.stringify(d375, null, 2));

  await browser.close();
}

inspectElements().catch(console.error);
