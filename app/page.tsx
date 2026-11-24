import React from 'react';
import Image from 'next/image';
import { CopyButton } from '../components/CopyButton';
import {
  AvatarFrameSvg,
  LinkedInSocialSvg,
  DribbbleSocialSvg,
  InstagramSocialSvg,
  ServiceUxUiSvg,
  ServiceWebMobileSvg,
  ServiceDesignCreativeSvg,
  ServiceDevelopmentSvg,
  EmailIconSvg,
  DribbbleLatestWorkSvg,
} from '../components/icons';

export default function HomePage() {
  const logos = [
    { src: '/assets/nPT3My9mYZPzyjp42aeGQACk4p4.svg', width: 118, height: 34, alt: 'Partner Logo' },
    { src: '/assets/XFWQcHTyPCmpljR7ttDhwueN9k.svg', width: 94, height: 32, alt: 'Partner Logo' },
    { src: '/assets/FeK7mQ25Aj92hjXNE7801ccv4.svg', width: 134, height: 24, alt: 'Partner Logo' },
    { src: '/assets/S7Wn9R0XUGbZP76whfsn435N8o.svg', width: 118, height: 24, alt: 'Partner Logo' },
    { src: '/assets/9kIk1y3XOCY94YnLwCDU3SSHL0I.svg', width: 155, height: 44, alt: 'Partner Logo' },
    { src: '/assets/Pjlzorsbp4GK4U9nqYaPWgkPs.svg', width: 122, height: 33, alt: 'Partner Logo' },
  ];

  return (
    <main className="w-full min-h-screen bg-[#F6F5F4] text-[#242424] relative overflow-x-hidden selection:bg-zinc-200">
      {/* =========================================================================
          GLOBAL 1:1 LIVE NOISE LAYER (Exact Framer Tile, Absolute Document Inset, 11.25 FPS Cadence)
          ========================================================================= */}
      <div
        className="absolute inset-0 h-full w-full pointer-events-none select-none z-[25] overflow-hidden"
        style={{ opacity: 0.08 }}
        aria-hidden="true"
      >
        <div
          className="absolute -inset-[200%] w-[400%] h-[400%] pointer-events-none animate-live-noise"
          style={{
            backgroundImage: 'url(/assets/kawsar-exact-noise.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
            opacity: 0.4,
          }}
        />
      </div>

      {/* =========================================================================
          HERO & HEADER TOP SECTION (Curved Bottom Sheet)
          Surface: #F6F5F4 (Exact RGB 246, 245, 244)
          ========================================================================= */}
      <section
        data-framer-border="true"
        className="relative w-full bg-[#F6F5F4] rounded-b-[80px] md:rounded-b-[120px] min-h-[660px] md:h-[742px] pt-[40px] pb-[83px] md:pb-[116px] z-10 overflow-hidden"
      >
        {/* ----------------- HEADER / NAVBAR (w=90% max-w=1296) ----------------- */}
        <header className="relative w-[90%] max-w-[1296px] mx-auto flex items-center justify-between z-20">
          {/* Desktop Left (>= 810px): Email Pill + CV Pill */}
          <div className="hidden md:flex items-center gap-[10px]">
            {/* Email + Copy Pill */}
            <div className="h-[56px] w-[279px] bg-[#F1F0EF] border border-[#ECEBEA] rounded-[1000px] flex items-center justify-between pl-[16px] pr-[4px] py-[4px]">
              <span
                style={{
                  fontFamily: '"Otterco Regular", sans-serif',
                  fontSize: '12px',
                  lineHeight: '14.4px',
                  color: 'rgb(55, 55, 55)',
                }}
                dangerouslySetInnerHTML={{
                  __html: '<!--email_off-->kawsarvy.design@gmail.com<!--/email_off-->',
                }}
              />
              <CopyButton />
            </div>

            {/* CV Pill */}
            <a
              href="https://drive.google.com/file/d/1CSIY8rbsj0Izwj-OeM2R93eJTddzCdAM/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="h-[56px] w-[108px] bg-[#F1F0EF] border border-[#ECEBEA] rounded-[1000px] p-[4px] flex items-center justify-center group"
            >
              <div className="h-[48px] w-[100px] bg-[#FFFFFE] rounded-[60px] flex items-center justify-center">
                <span
                  style={{
                    fontFamily: '"Otterco Display Medium", sans-serif',
                    fontSize: '12px',
                    lineHeight: '14.4px',
                    color: 'rgb(36, 36, 36)',
                  }}
                  className="capitalize"
                >
                  CV
                </span>
              </div>
            </a>
          </div>

          {/* Tablet & Mobile Header Left (<= 809px): Compact Email & CV Buttons */}
          <div className="flex md:hidden items-center gap-[8px]">
            <a
              href="mailto:kawsarvy.design@gmail.com"
              className="h-[48px] w-[88px] rounded-[24px] bg-[#242424] text-white flex items-center justify-center"
              style={{
                fontFamily: '"Otterco Display Medium", sans-serif',
                fontSize: '12px',
                lineHeight: '14.4px',
              }}
            >
              Email
            </a>
            <a
              href="https://drive.google.com/file/d/1CSIY8rbsj0Izwj-OeM2R93eJTddzCdAM/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="h-[48px] w-[88px] rounded-[24px] bg-[#FFFFFE] border border-[#ECEBEA] text-[#242424] flex items-center justify-center"
              style={{
                fontFamily: '"Otterco Display Medium", sans-serif',
                fontSize: '12px',
                lineHeight: '14.4px',
              }}
            >
              CV
            </a>
          </div>

          {/* Desktop Right (>= 810px): Social Links */}
          <div className="hidden md:flex items-center text-[14px] leading-[16.8px] text-[#373737] gap-[10px]">
            <a
              href="https://www.linkedin.com/in/kawsarvy/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: '"Otterco Regular", sans-serif' }}
            >
              LinkedIn
            </a>
            <span className="select-none" style={{ fontFamily: '"Outfit", sans-serif' }}>
              /
            </span>
            <a
              href="https://dribbble.com/Kawsarvy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: '"Otterco Regular", sans-serif' }}
            >
              Dribbble
            </a>
            <span className="select-none" style={{ fontFamily: '"Outfit", sans-serif' }}>
              /
            </span>
            <a
              href="https://www.instagram.com/kawsarvy/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: '"Otterco Regular", sans-serif' }}
            >
              instagram
            </a>
          </div>

          {/* Tablet & Mobile Header Right (<= 809px): 3 Circular Social Buttons */}
          <div className="flex md:hidden items-center gap-[4px]">
            <a
              href="https://www.linkedin.com/in/kawsarvy/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[48px] h-[48px] flex items-center justify-center"
              aria-label="LinkedIn"
            >
              <LinkedInSocialSvg width={48} height={48} />
            </a>
            <a
              href="https://dribbble.com/Kawsarvy"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[48px] h-[48px] flex items-center justify-center"
              aria-label="Dribbble"
            >
              <DribbbleSocialSvg width={48} height={48} />
            </a>
            <a
              href="https://www.instagram.com/kawsarvy/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[48px] h-[48px] flex items-center justify-center"
              aria-label="Instagram"
            >
              <InstagramSocialSvg width={48} height={48} />
            </a>
          </div>
        </header>

        {/* ----------------- HERO CONTENT ----------------- */}
        <div className="relative max-w-[1300px] mx-auto px-4 flex flex-col items-center mt-[116px] md:mt-[96px] z-20">
          {/* Avatar + Floating Badge Container */}
          <div className="relative flex items-center justify-center">
            {/* 128x128 Avatar Circle */}
            <div className="relative w-[128px] h-[128px] rounded-full overflow-hidden flex items-center justify-center border border-[#ECEBEA] shadow-sm">
              <Image
                src="/assets/kawsar-avatar.png"
                alt="Kawsar Ahmed"
                width={128}
                height={128}
                priority
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Floating "Kawsar Ahmed  👋🏼 " Badge with Framer Live Float Animation (Links to Dribbble) */}
            <a
              href="https://dribbble.com/Kawsarvy"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-[102px] top-[20px] w-[120px] h-[48px] bg-[#FFFFFE] rounded-[60px] shadow-[0_10px_10px_0_rgba(84,84,84,0.1)] flex items-center justify-center whitespace-nowrap z-20 animate-badge-float cursor-pointer select-none"
              style={{
                transformOrigin: 'center center',
              }}
            >
              <span
                style={{
                  fontFamily: '"Otterco Regular", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
                  fontSize: '12px',
                  lineHeight: '14.4px',
                  color: 'rgb(36, 36, 36)',
                }}
              >
                {'Kawsar Ahmed  \u{1F44B}\u{1F3FC} '}
              </span>
            </a>
          </div>

          {/* Hero H1 (Authentic Framer text gradient matching kawsar.design) */}
          <h1
            className="heading-hero-gradient text-center mt-[16px] md:mt-[10px] tracking-normal text-[36px] leading-[44px] md:text-[56px] md:leading-[64px]"
            style={{
              fontFamily: '"Otterco Display Medium", sans-serif',
              fontWeight: 500,
            }}
          >
            <span className="block">Building digital</span>
            <span className="block">products, brands, and</span>
            <span className="block">experience.</span>
          </h1>

          {/* Latest Work Button (underlines text on hover matching kawsar.design) */}
          <a
            href="https://dribbble.com/Kawsarvy"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[44px] w-[180px] h-[60px] bg-[#242424] rounded-[60px] flex items-center justify-center gap-[12px] group z-20"
          >
            <DribbbleLatestWorkSvg width={16} height={16} />
            <span
              className="group-hover:underline"
              style={{
                fontFamily: '"Otterco Medium", sans-serif',
                fontSize: '12px',
                lineHeight: '14.4px',
                color: 'rgb(255, 255, 255)',
              }}
            >
              Latest Work
            </span>
          </a>
        </div>
      </section>

      {/* =========================================================================
          MIDDLE WHITE SHEET (Houses Client Logos Marquee)
          Surface: Pure White #FFFFFF
          Seamless flat top behind hero sheet (rounded-t-[80px]), curved bottom (rounded-b-[80px] md:rounded-b-[120px])
          1:1 Framer border stroke #ECEBEA
          ========================================================================= */}
      <section
        data-framer-border="true"
        className="relative w-full bg-white rounded-t-[80px] rounded-b-[80px] md:rounded-b-[120px] -mt-[80px] md:-mt-[120px] pt-[162px] md:pt-[220px] pb-[118px] md:pb-[140px] z-[5] overflow-hidden"
      >
        {/* Logo Ticker Strip (Clean 100% Crisp Edges matching live site) */}
        <div className="w-full h-[40px] relative overflow-hidden flex items-center z-20">
          {/* Smooth Continuous Marquee Track */}
          <div className="animate-marquee-smooth flex items-center gap-[60px] md:gap-[80px]">
            {[...logos, ...logos, ...logos, ...logos].map((logo, idx) => (
              <div key={idx} className="w-[160px] h-[40px] flex-shrink-0 relative">
                <div className="absolute inset-0">
                  <img
                    decoding="auto"
                    width={logo.width}
                    height={logo.height}
                    src={logo.src}
                    alt={logo.alt}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      objectPosition: 'center',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SERVICES SECTION (Background Canvas #F6F5F4)
          ========================================================================= */}
      <section className="relative w-full bg-[#F6F5F4] pt-[72px] md:pt-[100px] pb-[80px] md:pb-[121px] z-[1] overflow-hidden">
        <div className="relative max-w-[1300px] mx-auto px-0 z-20">
          {/* Section Headline (Authentic Framer text gradient matching kawsar.design) */}
          <h2
            className="heading-collaborate-gradient text-center w-[360px] md:w-[615px] shrink-0 text-[28px] leading-[42px] md:text-[36px] md:leading-[54px] font-[500] relative left-1/2 -translate-x-1/2"
            style={{
              fontFamily: '"Otterco Display Medium", sans-serif',
            }}
          >
            Collaborate with brands and agencies to create impactful results.
          </h2>

          {/* Divider Line with Tilted "Services" Pill */}
          <div className="relative w-[360px] md:w-full md:max-w-[972px] shrink-0 left-1/2 -translate-x-1/2 md:static md:translate-x-0 mx-auto mt-[44px] md:mt-[69px] mb-[101px] md:mb-[65px] flex items-center justify-center">
            {/* Hairline Divider */}
            <div className="w-full h-[1px] bg-[#ECEBEA]" />

            {/* Tilted Floating Pill */}
            <div
              className="absolute w-[125px] h-[48px] bg-[#FFFFFE] rounded-[60px] shadow-[0_20px_10px_0_rgba(236,235,234,0.4)] flex items-center justify-center pointer-events-none"
              style={{
                transform: 'rotate(-10deg)',
              }}
            >
              <span
                style={{
                  fontFamily: '"Otterco Display Medium", sans-serif',
                  fontSize: '12px',
                  lineHeight: '14.4px',
                  color: 'rgb(36, 36, 36)',
                }}
              >
                Services
              </span>
            </div>
          </div>

          {/* 4 Services Grid: 2 col on mobile/tablet, 4 col on desktop */}
          <div className="w-[360px] md:w-full md:max-w-[972px] shrink-0 relative left-1/2 -translate-x-1/2 md:static md:translate-x-0 mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-[16px] md:gap-x-[80px] gap-y-[65px] md:gap-y-0 h-auto md:h-[152px]">
            {/* Service 1: UX & UI */}
            <div className="flex flex-col items-start w-full">
              <div className="w-[44px] h-[44px] flex items-center justify-center">
                <ServiceUxUiSvg width={44} height={44} />
              </div>
              <h3
                className="mt-[20px]"
                style={{
                  fontFamily: '"Otterco Regular", sans-serif',
                  fontSize: '18px',
                  lineHeight: '21.6px',
                  color: 'rgb(36, 36, 36)',
                }}
              >
                UX & UI
              </h3>
              <p
                className="mt-[8px]"
                style={{
                  fontFamily: '"Otterco Light", sans-serif',
                  fontWeight: 300,
                  fontSize: '14px',
                  lineHeight: '16.8px',
                  color: 'rgb(42, 42, 42)',
                }}
              >
                Designing interfaces that are intuitive, efficient, and enjoyable to use.
              </p>
            </div>

            {/* Service 2: Web & Mobile App */}
            <div className="flex flex-col items-start w-full">
              <div className="w-[44px] h-[44px] flex items-center justify-center">
                <ServiceWebMobileSvg width={44} height={44} />
              </div>
              <h3
                className="mt-[20px]"
                style={{
                  fontFamily: '"Otterco Regular", sans-serif',
                  fontSize: '18px',
                  lineHeight: '21.6px',
                  color: 'rgb(36, 36, 36)',
                }}
              >
                Web & Mobile App
              </h3>
              <p
                className="mt-[8px]"
                style={{
                  fontFamily: '"Otterco Light", sans-serif',
                  fontWeight: 300,
                  fontSize: '14px',
                  lineHeight: '16.8px',
                  color: 'rgb(42, 42, 42)',
                }}
              >
                Transforming ideas into exceptional web and mobile app experiences.
              </p>
            </div>

            {/* Service 3: Design & Creative */}
            <div className="flex flex-col items-start w-full">
              <div className="w-[44px] h-[44px] flex items-center justify-center">
                <ServiceDesignCreativeSvg width={44} height={44} />
              </div>
              <h3
                className="mt-[20px]"
                style={{
                  fontFamily: '"Otterco Regular", sans-serif',
                  fontSize: '18px',
                  lineHeight: '21.6px',
                  color: 'rgb(36, 36, 36)',
                }}
              >
                Design & Creative
              </h3>
              <p
                className="mt-[8px]"
                style={{
                  fontFamily: '"Otterco Light", sans-serif',
                  fontWeight: 300,
                  fontSize: '14px',
                  lineHeight: '16.8px',
                  color: 'rgb(42, 42, 42)',
                }}
              >
                Crafting visually stunning designs that connect with your audience.
              </p>
            </div>

            {/* Service 4: Development */}
            <div className="flex flex-col items-start w-full">
              <div className="w-[42px] h-[44px] flex items-center justify-center">
                <ServiceDevelopmentSvg width={42} height={44} />
              </div>
              <h3
                className="mt-[20px]"
                style={{
                  fontFamily: '"Otterco Regular", sans-serif',
                  fontSize: '18px',
                  lineHeight: '21.6px',
                  color: 'rgb(36, 36, 36)',
                }}
              >
                Development
              </h3>
              <p
                className="mt-[8px]"
                style={{
                  fontFamily: '"Otterco Light", sans-serif',
                  fontWeight: 300,
                  fontSize: '14px',
                  lineHeight: '16.8px',
                  color: 'rgb(42, 42, 42)',
                }}
              >
                Bringing your vision to life with the latest technology and design trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONTACT & FOOTER (Curved Sheet, Pure White)
          Surface: Pure White #FFFFFF
          1:1 Framer border stroke #ECEBEA
          ========================================================================= */}
      <section
        data-framer-border="true"
        className="relative w-full bg-white rounded-t-[80px] md:rounded-t-[120px] pt-[72px] md:pt-[88px] pb-[60px] md:pb-[62px] z-10 overflow-hidden"
      >
        <div className="relative w-full max-w-[1300px] mx-auto px-0 flex flex-col items-center z-20">
          {/* Top Circular Ring Frame */}
          <div className="relative w-[128px] h-[128px] rounded-full overflow-hidden flex items-center justify-center mb-0 md:mb-0">
            <AvatarFrameSvg className="w-full h-full pointer-events-none" />
          </div>

          {/* Contact Heading (Authentic Framer text gradient matching kawsar.design) */}
          <h2
            className="heading-contact-gradient text-center w-[352px] md:w-[658px] shrink-0 text-[36px] leading-[44px] md:text-[56px] md:leading-[64px] font-[600] relative left-1/2 -translate-x-1/2 md:static md:translate-x-0"
            style={{
              fontFamily: '"Otterco Display SemiBold", sans-serif',
            }}
          >
            Tell me about your next project
          </h2>

          {/* Action Buttons: Email Me & WhatsApp */}
          <div className="mt-[36px] md:mt-[40px] flex items-center justify-center gap-[10px]">
            {/* Email Me Button */}
            <div className="w-[128px] h-[60px] bg-[#F1F0EF] border border-[#ECEBEA] rounded-[74px] p-[4px] flex items-center justify-center">
              <a
                href="mailto:kawsarvy.design@gmail.com"
                className="w-[120px] h-[52px] bg-[#242424] rounded-[90px] flex items-center justify-center gap-[8px] z-20"
              >
                <EmailIconSvg width={14} height={14} />
                <span
                  style={{
                    fontFamily: '"Otterco Medium", sans-serif',
                    fontSize: '12px',
                    lineHeight: '14.4px',
                    color: 'rgb(255, 255, 255)',
                  }}
                  className="capitalize"
                >
                  Email Me
                </span>
              </a>
            </div>

            {/* WhatsApp Button */}
            <div className="w-[128px] h-[60px] bg-[#F1F0EF] border border-[#ECEBEA] rounded-[74px] p-[4px] flex items-center justify-center">
              <a
                href="https://wa.me/1303536185"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[120px] h-[52px] bg-[#FFFFFE] rounded-[90px] flex items-center justify-center gap-[8px] z-20"
              >
                <span
                  style={{
                    fontFamily: '"Otterco Medium", sans-serif',
                    fontSize: '12px',
                    lineHeight: '14.4px',
                    color: 'rgb(36, 36, 36)',
                  }}
                  className="capitalize"
                >
                  whatsApp
                </span>
              </a>
            </div>
          </div>

          {/* ----------------- FOOTER (Single Semantic Node, Responsive Layout) ----------------- */}
          <footer className="w-[90%] max-w-[1296px] mx-auto mt-[80px] md:mt-[99px]">
            {/* Hairline Divider Line */}
            <div className="w-full h-[1px] bg-[#ECEBEA] mb-[24px] md:mb-[43px]" />

            {/* Single Responsive Flex Container: Single Row on ALL viewports */}
            <div className="w-full flex flex-row items-center justify-between text-left">
              <p
                className="pl-0 md:pl-[2px]"
                style={{
                  fontFamily: '"Otterco Regular", sans-serif',
                  fontSize: '14px',
                  lineHeight: '16.8px',
                  color: 'rgb(55, 55, 55)',
                }}
              >
                © 2026 All rights reserved.
              </p>

              {/* Desktop Text Links (>= 810px) */}
              <div className="hidden md:flex items-center text-[14px] leading-[16.8px] text-[#373737] gap-[10px]">
                <a
                  href="https://www.linkedin.com/in/kawsarvy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: '"Otterco Regular", sans-serif' }}
                >
                  LinkedIn
                </a>
                <span className="select-none" style={{ fontFamily: '"Outfit", sans-serif' }}>
                  /
                </span>
                <a
                  href="https://dribbble.com/Kawsarvy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: '"Otterco Regular", sans-serif' }}
                >
                  Dribbble
                </a>
                <span className="select-none" style={{ fontFamily: '"Outfit", sans-serif' }}>
                  /
                </span>
                <a
                  href="https://www.instagram.com/kawsarvy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: '"Otterco Regular", sans-serif' }}
                >
                  instagram
                </a>
              </div>

              {/* Tablet & Mobile 3 Circular Icon Buttons (<= 809px) */}
              <div className="flex md:hidden items-center gap-[4px]">
                <a
                  href="https://www.linkedin.com/in/kawsarvy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[48px] h-[48px] flex items-center justify-center"
                  aria-label="LinkedIn"
                >
                  <LinkedInSocialSvg width={48} height={48} />
                </a>
                <a
                  href="https://dribbble.com/Kawsarvy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[48px] h-[48px] flex items-center justify-center"
                  aria-label="Dribbble"
                >
                  <DribbbleSocialSvg width={48} height={48} />
                </a>
                <a
                  href="https://www.instagram.com/kawsarvy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[48px] h-[48px] flex items-center justify-center"
                  aria-label="Instagram"
                >
                  <InstagramSocialSvg width={48} height={48} />
                </a>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
