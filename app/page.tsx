import React from 'react';
import Image from 'next/image';
import { CopyButton } from '../components/CopyButton';
import { LiveNoiseDriver } from '../components/LiveNoiseDriver';
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
      {/* Client-Side JavaScript Live Noise Driver (100% Guaranteed Grain Jitter across all browsers & mobile devices) */}
      <LiveNoiseDriver />

      {/* Global Canvas Scoped Background Noise Layer (z-0 strictly behind all sections and sheets) */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden max-w-full z-0"
        style={{ opacity: 0.08, contain: 'paint' }}
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
        className="relative w-full bg-[#F6F5F4] rounded-b-[80px] md:rounded-b-[120px] h-[660px] md:h-[742px] pt-[40px] pb-[72px] md:pb-[116px] z-10 overflow-hidden"
      >
        {/* Section Scoped Background Noise Layer (1:1 with kawsar.design framer-ekivo5-container) */}
        <div
          className="absolute inset-0 pointer-events-none select-none overflow-hidden max-w-full rounded-b-[80px] md:rounded-b-[120px] z-0"
          style={{ opacity: 0.08, contain: 'paint' }}
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

        {/* ----------------- HEADER / NAVBAR (Exact responsive width matching kawsar.design) ----------------- */}
        <header className="relative w-full max-w-[367px] md:max-w-none md:w-[729px] lg:w-[1296px] mx-auto px-[11px] md:px-0 pt-[4px] md:pt-0 flex items-center justify-between z-20">
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
                  className="capitalize group-hover:underline"
                >
                  CV
                </span>
              </div>
            </a>
          </div>

          {/* Tablet & Mobile Header Left (<= 809px): Authentic Dual-Capsule Email & CV Buttons (180px x 48px Frame 1321314924) */}
          <div className="flex md:hidden items-center gap-[4px]">
            {/* Email Dual Capsule */}
            <a
              href="mailto:kawsarvy.design@gmail.com"
              className="h-[48px] w-[88px] bg-[#F1F0EF] border border-[#ECEBEA] rounded-[24px] p-[4px] flex items-center justify-center group"
            >
              <div className="h-[40px] w-[80px] bg-[#242424] rounded-[60px] flex items-center justify-center">
                <span
                  style={{
                    fontFamily: '"Otterco Display Medium", sans-serif',
                    fontSize: '12px',
                    lineHeight: '14.4px',
                    color: 'rgb(255, 255, 255)',
                  }}
                  className="group-hover:underline"
                >
                  Email
                </span>
              </div>
            </a>

            {/* CV Dual Capsule */}
            <a
              href="https://drive.google.com/file/d/1CSIY8rbsj0Izwj-OeM2R93eJTddzCdAM/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="h-[48px] w-[88px] bg-[#F1F0EF] border border-[#ECEBEA] rounded-[24px] p-[4px] flex items-center justify-center group"
            >
              <div className="h-[40px] w-[80px] bg-[#FFFFFE] rounded-[60px] flex items-center justify-center">
                <span
                  style={{
                    fontFamily: '"Otterco Display Medium", sans-serif',
                    fontSize: '12px',
                    lineHeight: '14.4px',
                    color: 'rgb(36, 36, 36)',
                  }}
                  className="group-hover:underline"
                >
                  CV
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Right (>= 810px): Social Links */}
          <div className="hidden md:flex items-center text-[14px] leading-[16.8px] text-[#373737] gap-[10px]">
            <a
              href="https://www.linkedin.com/in/kawsarvy/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
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
              className="hover:underline"
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
              className="hover:underline"
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
          <div className="relative w-[128px] h-[128px] flex items-center justify-center">
            {/* 128x128 Avatar Circle with Authentic Noise Overlay matching kawsar.design (framer-1dh92xw-container) */}
            <div className="relative w-[128px] h-[128px] rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src="/assets/kawsar-avatar.png"
                alt="Kawsar Ahmed"
                width={128}
                height={128}
                priority
                className="w-full h-full object-cover rounded-full"
              />
              {/* Authentic Avatar Noise Overlay (1:1 with kawsar.design framer-1dh92xw-container) */}
              <div
                className="absolute inset-0 pointer-events-none select-none overflow-hidden max-w-full rounded-full z-10"
                style={{ opacity: 0.08, contain: 'paint' }}
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
            </div>

            {/* Floating "Kawsar Ahmed  👋🏼 " Badge with Framer Live Float Animation (1:1 Ruler: w=120px, h=48px, top=20px, left=102px, rounded-[60px], shadow) */}
            <div
              className="absolute left-[102px] top-[20px] w-[120px] h-[48px] bg-[#FFFFFE] rounded-[60px] shadow-[0_10px_10px_0_rgba(84,84,84,0.1)] flex items-center justify-center whitespace-pre z-20 animate-badge-float select-none"
              style={{
                transformOrigin: '60px 24px',
                transform: 'translateY(0px) rotate(-10deg)',
              }}
            >
              <p
                style={{
                  fontFamily: '"Otterco Regular", "Otterco Regular Placeholder", sans-serif',
                  fontSize: '12px',
                  fontWeight: 400,
                  lineHeight: '14.4px',
                  letterSpacing: '0px',
                  color: 'rgb(36, 36, 36)',
                  whiteSpace: 'pre',
                }}
              >
                {'Kawsar Ahmed  \u{1F44B}\u{1F3FC} '}
              </p>
            </div>
          </div>

          {/* Hero H1 (1:1 with Framer .framer-2cgirf: w-[308px] md:w-[525px] shrink-0, exact 3 lines, zero unwanted line breaks) */}
          <h1
            className="heading-hero-gradient text-center mt-[16px] md:mt-[10px] tracking-normal text-[36px] leading-[44px] md:text-[56px] md:leading-[64px] w-[308px] md:w-[525px] shrink-0 mx-auto"
            style={{
              fontFamily: '"Otterco Display Medium", sans-serif',
              fontWeight: 500,
            }}
          >
            <span className="block whitespace-nowrap">Building digital</span>
            <span className="block whitespace-nowrap">products, brands, and</span>
            <span className="block whitespace-nowrap">experience.</span>
          </h1>

          {/* Latest Work Button (matching kawsar.design) */}
          <a
            href="https://dribbble.com/Kawsarvy"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-[44px] w-[180px] h-[60px] bg-[#242424] rounded-[60px] flex items-center justify-center gap-[12px] no-underline z-20"
          >
            <DribbbleLatestWorkSvg width={16} height={16} />
            <span
              style={{
                fontFamily: '"Otterco Medium", sans-serif',
                fontSize: '12px',
                lineHeight: '14.4px',
                color: 'rgb(255, 255, 255)',
              }}
              className="group-hover:underline"
            >
              Latest Work
            </span>
          </a>
        </div>
      </section>

      {/* =========================================================================
          MIDDLE WHITE SHEET (Houses Client Logos Marquee)
          Surface: Pure White #FFFFFF
          Seamless flat top behind hero sheet (rounded-t-none), curved bottom (rounded-b-[80px] md:rounded-b-[120px])
          1:1 Framer border stroke #ECEBEA
          ========================================================================= */}
      <section
        data-framer-border="true"
        className="relative w-full bg-white rounded-t-[80px] rounded-b-[80px] md:rounded-b-[120px] -mt-[80px] md:-mt-[120px] pt-[162px] md:pt-[220px] pb-[118px] md:pb-[140px] z-[5] overflow-hidden"
      >
        {/* Section Scoped Background Noise Layer (z-0 strictly behind foreground UI) */}
        <div
          className="absolute inset-0 pointer-events-none select-none overflow-hidden max-w-full rounded-t-[80px] rounded-b-[80px] md:rounded-b-[120px] z-0"
          style={{ opacity: 0.08, contain: 'paint' }}
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

        {/* Logo Ticker Strip (Clean 100% Crisp Edges matching live site) */}
        <div
          className="w-full max-w-full h-[40px] relative overflow-hidden flex items-center z-20"
          style={{ contain: 'paint' }}
        >
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
          SERVICES SECTION (Sits seamlessly on #F6F5F4 Canvas)
          ========================================================================= */}
      <section className="relative w-full pt-[63px] md:pt-[100px] pb-[70px] md:pb-[121px] z-[1] overflow-hidden">
        {/* Section Scoped Background Noise Layer (z-0 strictly behind foreground UI) */}
        <div
          className="absolute inset-0 pointer-events-none select-none overflow-hidden max-w-full z-0"
          style={{ opacity: 0.08, contain: 'paint' }}
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

        <div className="relative max-w-[1300px] mx-auto px-0 z-20">
          {/* Section Headline (Authentic Framer text gradient matching kawsar.design) */}
          <h2
            className="heading-collaborate-gradient text-center w-[351px] md:w-[615px] shrink-0 text-[28px] leading-[42px] md:text-[36px] md:leading-[54px] font-[500] mx-auto"
            style={{
              fontFamily: '"Otterco Display Medium", sans-serif',
            }}
          >
            Collaborate with brands and agencies to create impactful results.
          </h2>

          {/* Divider Line with Tilted "Services" Pill */}
          <div className="w-full max-w-[351px] md:max-w-none md:w-[972px] px-3 md:px-0 mx-auto md:mx-0 md:relative md:left-1/2 md:-translate-x-1/2 mt-[51px] md:mt-[69px] mb-[110px] md:mb-[65px] flex items-center justify-center">
            {/* Hairline Divider */}
            <div className="w-full h-[1px] bg-[#ECEBEA]" />

            {/* Tilted "Services" Pill (Static -10deg rotation matching kawsar.design) */}
            <div
              className="absolute w-[125px] h-[48px] bg-[#FFFFFE] border border-[#ECEBEA] rounded-[60px] shadow-[0_20px_10px_0_rgba(236,235,234,0.4)] flex items-center justify-center pointer-events-none z-20 select-none"
              style={{
                transformOrigin: '62px 24px',
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

          {/* 4 Services Grid: 2 col on mobile (w=360px), 4 col on tablet/desktop */}
          <div className="w-[360px] md:w-[762px] lg:w-[972px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-[16px] md:gap-x-[10px] lg:gap-x-[80px] gap-y-[49px] md:gap-y-0 h-auto md:h-[152px]">
            {/* Service 1: UX & UI */}
            <div className="flex flex-col items-start w-[172px] md:w-[183px]">
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
                className="mt-[16px]"
                style={{
                  fontFamily: '"Otterco Light", sans-serif',
                  fontWeight: 300,
                  fontSize: '14px',
                  lineHeight: '18.2px',
                  color: 'rgb(42, 42, 42)',
                }}
              >
                <span className="block">Designing interfaces that</span>
                <span className="block">are intuitive, efficient, and enjoyable to use.</span>
              </p>
            </div>

            {/* Service 2: Web & Mobile App */}
            <div className="flex flex-col items-start w-[172px] md:w-[183px]">
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
                className="mt-[16px]"
                style={{
                  fontFamily: '"Otterco Light", sans-serif',
                  fontWeight: 300,
                  fontSize: '14px',
                  lineHeight: '18.2px',
                  color: 'rgb(42, 42, 42)',
                }}
              >
                <span className="block">Transforming ideas into exceptional web and</span>
                <span className="block">mobile app experiences.</span>
              </p>
            </div>

            {/* Service 3: Design & Creative */}
            <div className="flex flex-col items-start w-[172px] md:w-[183px]">
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
                className="mt-[16px]"
                style={{
                  fontFamily: '"Otterco Light", sans-serif',
                  fontWeight: 300,
                  fontSize: '14px',
                  lineHeight: '18.2px',
                  color: 'rgb(42, 42, 42)',
                }}
              >
                <span className="block">Crafting visually stunning designs that connect with</span>
                <span className="block">your audience.</span>
              </p>
            </div>

            {/* Service 4: Development */}
            <div className="flex flex-col items-start w-[172px] md:w-[183px]">
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
                className="mt-[16px]"
                style={{
                  fontFamily: '"Otterco Light", sans-serif',
                  fontWeight: 300,
                  fontSize: '14px',
                  lineHeight: '18.2px',
                  color: 'rgb(42, 42, 42)',
                }}
              >
                <span className="block">Bringing your vision to life</span>
                <span className="block">with the latest technology</span>
                <span className="block">and design trends.</span>
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
        className="relative w-full bg-white rounded-t-[80px] md:rounded-t-[120px] pt-[61px] md:pt-[88px] pb-[34px] md:pb-[62px] z-10 overflow-hidden"
      >
        {/* Section Scoped Background Noise Layer (z-0 strictly behind foreground UI) */}
        <div
          className="absolute inset-0 pointer-events-none select-none overflow-hidden max-w-full rounded-t-[80px] md:rounded-t-[120px] z-0"
          style={{ opacity: 0.08, contain: 'paint' }}
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

        <div className="relative w-full max-w-[1302px] mx-auto px-0 flex flex-col items-center z-20">
          {/* Top Circular Ring Frame */}
          <div className="relative w-[128px] h-[128px] rounded-full overflow-hidden flex items-center justify-center mb-[27px] md:mb-0">
            <AvatarFrameSvg className="w-full h-full pointer-events-none" />
          </div>

          {/* Contact Heading (Authentic Framer text gradient matching kawsar.design) */}
          <h2
            className="heading-contact-gradient text-center w-[355px] md:w-[658px] shrink-0 text-[36px] leading-[44px] md:text-[56px] md:leading-[64px] font-[600] mx-auto"
            style={{
              fontFamily: '"Otterco Display SemiBold", sans-serif',
            }}
          >
            Tell me about your next project
          </h2>

          {/* Action Buttons: Email Me & WhatsApp */}
          <div className="mt-[23px] md:mt-[40px] flex items-center justify-center gap-[10px]">
            {/* Email Me Button */}
            <div className="w-[128px] h-[60px] bg-[#F1F0EF] border border-[#ECEBEA] rounded-[74px] p-[4px] flex items-center justify-center">
              <a
                href="mailto:kawsarvy.design@gmail.com"
                className="w-[120px] h-[52px] bg-[#242424] rounded-[90px] flex items-center justify-center gap-[8px] z-20 group"
              >
                <EmailIconSvg width={14} height={14} />
                <span
                  style={{
                    fontFamily: '"Otterco Medium", sans-serif',
                    fontSize: '12px',
                    lineHeight: '14.4px',
                    color: 'rgb(255, 255, 255)',
                  }}
                  className="capitalize group-hover:underline"
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
                className="w-[120px] h-[52px] bg-[#FFFFFE] rounded-[90px] flex items-center justify-center gap-[8px] z-20 group"
              >
                <span
                  style={{
                    fontFamily: '"Otterco Medium", sans-serif',
                    fontSize: '12px',
                    lineHeight: '14.4px',
                    color: 'rgb(36, 36, 36)',
                  }}
                  className="capitalize group-hover:underline"
                >
                  whatsApp
                </span>
              </a>
            </div>
          </div>

          {/* ----------------- FOOTER (Single Semantic Node, Responsive Layout) ----------------- */}
          <footer className="w-full max-w-[351px] md:max-w-none md:w-[729px] lg:w-[1302px] px-3 md:px-0 mx-auto mt-[87px] md:mt-[99px]">
            {/* Hairline Divider Line */}
            <div className="w-full h-[1px] bg-[#ECEBEA] mb-[33px] md:mb-[43px]" />

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
                  className="hover:underline"
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
                  className="hover:underline"
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
                  className="hover:underline"
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
