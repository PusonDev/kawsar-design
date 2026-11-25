import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectViewport(browser, w) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);

  const info = await page.evaluate(() => {
    const vis = (e) => e && e.getBoundingClientRect().width > 0 && getComputedStyle(e).display !== 'none';
    const r = (e) => {
      if (!e) return null;
      const b = e.getBoundingClientRect();
      const s = getComputedStyle(e);
      return {
        x: Math.round(b.x * 10) / 10,
        y: Math.round((b.y + scrollY) * 10) / 10,
        w: Math.round(b.width * 10) / 10,
        h: Math.round(b.height * 10) / 10,
        bg: s.backgroundColor,
        border: s.border,
        radius: s.borderRadius,
        fs: s.fontSize,
        lh: s.lineHeight,
        fw: s.fontWeight,
        pad: `${s.paddingTop} ${s.paddingRight} ${s.paddingBottom} ${s.paddingLeft}`
      };
    };

    const hdr = Array.from(document.querySelectorAll('.framer-19ijx41')).find(vis);
    const heroInner = Array.from(document.querySelectorAll('.framer-pgjdg4')).find(vis);
    const avatar = Array.from(document.querySelectorAll('img')).find(vis);
    const h1 = Array.from(document.querySelectorAll('.framer-2cgirf p, h1')).find(vis);
    const latestWork = Array.from(document.querySelectorAll('a')).find(a => vis(a) && a.textContent.includes('Latest Work'));

    // Services section elements
    const servicesSectionH2 = Array.from(document.querySelectorAll('p,h2')).find(e => vis(e) && e.textContent.includes('Collaborate with brands') && e.children.length <= 2);
    const divider = Array.from(document.querySelectorAll('.framer-otkljj, [data-framer-name="Rectangle 5725"]')).find(vis);
    const servicesPill = Array.from(document.querySelectorAll('.framer-5bx8wp')).find(vis);
    const servicesGrid = Array.from(document.querySelectorAll('.framer-o7xych')).find(vis);

    // First service icon & title & desc
    const serviceCards = servicesGrid ? Array.from(servicesGrid.children).filter(vis).map(c => r(c)) : [];

    // Contact elements
    const handshake = Array.from(document.querySelectorAll('.framer-1g3h3o4')).find(vis);
    const contactH2 = Array.from(document.querySelectorAll('p,h2')).find(e => vis(e) && e.textContent.includes('Tell me about your next project') && e.children.length <= 2);
    const emailMeLink = Array.from(document.querySelectorAll('a')).find(a => vis(a) && a.textContent.includes('Email Me'));
    const emailMeOuter = emailMeLink?.parentElement;
    const whatsAppLink = Array.from(document.querySelectorAll('a')).find(a => vis(a) && a.textContent.toLowerCase().includes('whatsapp'));
    const whatsAppInner = whatsAppLink?.querySelector('[style*="background-color"], div');
    const footerWrap = Array.from(document.querySelectorAll('.framer-1wpa80f')).find(vis);
    const copyrightText = Array.from(document.querySelectorAll('p,span')).find(e => vis(e) && e.textContent.includes('© 2026 All rights reserved.') && e.children.length === 0);

    // Services sheet background color sample (no noise vs canvas)
    const desktopWrapperBg = getComputedStyle(document.querySelector('.framer-iwhjsb')).backgroundColor;
    const heroSheetBg = getComputedStyle(document.querySelector('.framer-1158rf0')).backgroundColor;

    // Footer divider SVG or border?
    const footerFirstChild = footerWrap?.firstElementChild;

    return {
      vw: window.innerWidth,
      hdr: r(hdr),
      heroInner: r(heroInner),
      avatar: r(avatar),
      h1: r(h1),
      latestWork: r(latestWork),
      servicesSectionH2: r(servicesSectionH2),
      divider: r(divider),
      servicesPill: r(servicesPill),
      servicesGrid: r(servicesGrid),
      serviceCards,
      handshake: r(handshake),
      contactH2: r(contactH2),
      emailMeOuter: r(emailMeOuter),
      emailMeLink: r(emailMeLink),
      whatsAppLink: r(whatsAppLink),
      whatsAppInner: r(whatsAppInner),
      footerWrap: r(footerWrap),
      footerDivider: r(footerFirstChild),
      copyrightText: r(copyrightText),
      desktopWrapperBg,
      heroSheetBg
    };
  });

  await page.close();
  return info;
}

async function run() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--no-sandbox'] });
  for (const w of [1440, 810, 750, 390]) {
    const res = await inspectViewport(browser, w);
    console.log(`\n=== LIVE GROUND TRUTH ${w}px ===`);
    console.log(JSON.stringify(res, null, 2));
  }
  await browser.close();
}

run().catch(console.error);
