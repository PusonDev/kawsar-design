import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function extractGroundTruth() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const groundTruth = await page.evaluate(() => {
    function styleOf(el) {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        class: el.className,
        rect: { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        borderRadius: cs.borderRadius,
        padding: cs.padding,
        margin: cs.margin,
        transform: cs.transform,
        boxShadow: cs.boxShadow,
        border: cs.border,
        textAlign: cs.textAlign
      };
    }

    // 1. Email pill container
    const emailPillContainer = document.querySelector('.framer-19ijx41 > div:first-child > div:first-child');
    // 2. Email span
    const emailSpan = emailPillContainer ? emailPillContainer.querySelector('p, span') : null;
    // 3. Copy button
    const copyButton = emailPillContainer ? emailPillContainer.querySelector('div[data-border="true"], a, button') : null;
    // 4. CV pill container
    const cvPillContainer = document.querySelector('a[href*="drive.google.com"]');
    // 5. CV inner pill
    const cvInnerPill = cvPillContainer ? cvPillContainer.querySelector('div') : null;
    // 6. Header Social links
    const socialLinks = Array.from(document.querySelectorAll('.framer-19ijx41 a')).filter(a => !a.href.includes('drive.google.com'));

    // 7. Hero Container
    const heroContainer = document.querySelector('.framer-1158rf0');
    // 8. Avatar Circle
    const avatarImg = document.querySelector('img[src*="Ylx45dCKlDrap5HSs7wTBwhoAY"]');
    // 9. Floating "Kawsar Ahmed  👋🏼 " Badge
    const kawsarBadge = Array.from(document.querySelectorAll('*')).find(e => e.textContent && e.textContent.includes('Kawsar Ahmed') && e.textContent.includes('👋🏼') && (window.getComputedStyle(e).transform.includes('matrix') || window.getComputedStyle(e).borderRadius.includes('px')));
    // 10. Hero Headline ("Building digital products...")
    const heroH1 = Array.from(document.querySelectorAll('*')).find(e => e.textContent && e.textContent.includes('Building digital') && e.children.length === 3 && e.children[0].tagName === 'P') ||
                   Array.from(document.querySelectorAll('div, p')).find(e => e.innerText && e.innerText.startsWith('Building digital'));
    // 11. Latest Work Button
    const latestWorkBtn = Array.from(document.querySelectorAll('a')).find(a => a.textContent && a.textContent.includes('Latest Work'));

    // 12. Middle White Sheet
    const middleSheet = document.querySelector('.framer-6s92xu');
    // 13. Marquee Container
    const marqueeContainer = document.querySelector('.framer-1y4ub8u-container');

    // 14. Services Headline ("Collaborate with brands...")
    const servicesH2 = Array.from(document.querySelectorAll('*')).find(e => e.textContent && e.textContent.includes('Collaborate with brands') && e.children.length === 0 || e.children.length === 1 && e.children[0].tagName === 'P');
    // 15. Tilted "Services" Pill
    const servicesPill = document.querySelector('.framer-5bx8wp');
    // 16. Services Divider line
    const servicesDivider = document.querySelector('.framer-otkljj');

    // 17. Services Cards (UX & UI, Web & Mobile, Design & Creative, Development)
    const serviceCards = Array.from(document.querySelectorAll('.framer-o7xych > div, .framer-o7xych'));

    // 18. Contact Sheet
    const contactSheet = document.querySelector('.framer-xohbsi');
    // 19. Contact Circular Ring/Icon
    const contactIcon = document.querySelector('.framer-1g3h3o4');
    // 20. Contact Heading ("Tell me about your next project")
    const contactHeading = Array.from(document.querySelectorAll('*')).find(e => e.textContent && e.textContent.includes('Tell me about your next project') && (e.tagName === 'P' || e.children.length === 1));
    // 21. Contact Action Buttons
    const emailMeBtn = Array.from(document.querySelectorAll('a')).find(a => a.textContent && a.textContent.includes('Email Me'));
    const whatsAppBtn = Array.from(document.querySelectorAll('a')).find(a => a.textContent && a.textContent.includes('WhatsApp'));

    // 22. Footer
    const footer = document.querySelector('.framer-1wpa80f');

    return {
      emailPillContainer: styleOf(emailPillContainer),
      emailSpan: styleOf(emailSpan),
      copyButton: styleOf(copyButton),
      cvPillContainer: styleOf(cvPillContainer),
      cvInnerPill: styleOf(cvInnerPill),
      socialLinks: socialLinks.map(styleOf),
      heroContainer: styleOf(heroContainer),
      avatarImg: styleOf(avatarImg),
      kawsarBadge: styleOf(kawsarBadge),
      heroH1: styleOf(heroH1),
      latestWorkBtn: styleOf(latestWorkBtn),
      middleSheet: styleOf(middleSheet),
      marqueeContainer: styleOf(marqueeContainer),
      servicesH2: styleOf(servicesH2),
      servicesPill: styleOf(servicesPill),
      servicesDivider: styleOf(servicesDivider),
      contactSheet: styleOf(contactSheet),
      contactIcon: styleOf(contactIcon),
      contactHeading: styleOf(contactHeading),
      emailMeBtn: styleOf(emailMeBtn),
      whatsAppBtn: styleOf(whatsAppBtn),
      footer: styleOf(footer)
    };
  });

  fs.writeFileSync(path.join(projectRoot, '_ref', 'ground-truth.json'), JSON.stringify(groundTruth, null, 2));
  console.log('Saved _ref/ground-truth.json successfully!');
  await browser.close();
}

extractGroundTruth().catch(console.error);
