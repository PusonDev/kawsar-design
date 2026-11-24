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

// Reusable 1:1 Tactical Noise / Grain Overlay
function NoiseOverlay({ opacity = 0.028 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-[1] overflow-hidden"
      style={{ opacity }}
      aria-hidden="true"
    >
      <div
        className="absolute -inset-[200%] w-[400%] h-[400%] pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/noise-tile.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />
    </div>
  );
}

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
          HERO & HEADER TOP SECTION (Curved Bottom Sheet)
          y: 0 -> 742px (Height: 742px)
          ========================================================================= */}
      <section className="relative w-full bg-[#F6F5F4] rounded-b-[80px] md:rounded-b-[120px] pt-[40px] pb-[116px] z-10 overflow-hidden">
        <NoiseOverlay opacity={0.028} />
        {/* ----------------- HEADER / NAVBAR (y=40, h=56, max-w=1300) ----------------- */}
        <header className="relative w-full max-w-[1300px] mx-auto px-4 md:px-0 flex items-center justify-between z-20">
          {/* Desktop Left: Email Pill + CV Pill */}
          <div className="hidden md:flex items-center gap-[10px]">
            {/* Email + Copy Pill */}
            <div className="h-[56px] w-[279px] bg-[#F1F0EF] rounded-[1000px] flex items-center justify-between pl-[16px] pr-[4px] py-[4px]">
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
              rel="noreferrer"
              className="h-[56px] w-[108px] bg-[#F1F0EF] rounded-[1000px] p-[4px] flex items-center justify-center group"
            >
              <div className="h-[48px] w-[100px] bg-[#FFFFFE] rounded-[60px] flex items-center justify-center transition-colors group-hover:bg-zinc-50 active:scale-[0.98]">
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

          {/* Mobile Header Left */}
          <div className="flex md:hidden items-center gap-[8px]">
            <a
              href="mailto:kawsarvy.design@gmail.com"
              className="h-[48px] w-[88px] rounded-full bg-[#242424] text-white flex items-center justify-center transition active:scale-[0.98]"
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
              rel="noreferrer"
              className="h-[48px] w-[88px] rounded-full bg-[#FFFFFE] border border-[#ECEBEA] text-[#242424] flex items-center justify-center transition active:scale-[0.98]"
              style={{
                fontFamily: '"Otterco Display Medium", sans-serif',
                fontSize: '12px',
                lineHeight: '14.4px',
              }}
            >
              CV
            </a>
          </div>

          {/* Desktop Right: Social Links */}
          <div className="hidden md:flex items-center text-[14px] leading-[16.8px] text-[#373737] gap-[10px]">
            <a
              href="https://www.linkedin.com/in/kawsarvy/"
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-70 transition-opacity"
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
              rel="noreferrer"
              className="hover:opacity-70 transition-opacity"
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
              rel="noreferrer"
              className="hover:opacity-70 transition-opacity"
              style={{ fontFamily: '"Otterco Regular", sans-serif' }}
            >
              instagram
            </a>
          </div>

          {/* Mobile Right: Circular Social Buttons */}
          <div className="flex md:hidden items-center gap-[4px]">
            <a
              href="https://www.linkedin.com/in/kawsarvy/"
              target="_blank"
              rel="noreferrer"
              className="w-[48px] h-[48px] flex items-center justify-center"
              aria-label="LinkedIn"
            >
              <LinkedInSocialSvg width={48} height={48} />
            </a>
            <a
              href="https://dribbble.com/Kawsarvy"
              target="_blank"
              rel="noreferrer"
              className="w-[48px] h-[48px] flex items-center justify-center"
              aria-label="Dribbble"
            >
              <DribbbleSocialSvg width={48} height={48} />
            </a>
            <a
              href="https://www.instagram.com/kawsarvy/"
              target="_blank"
              rel="noreferrer"
              className="w-[48px] h-[48px] flex items-center justify-center"
              aria-label="Instagram"
            >
              <InstagramSocialSvg width={48} height={48} />
            </a>
          </div>
        </header>

        {/* ----------------- HERO CONTENT ----------------- */}
        <div className="relative max-w-[1300px] mx-auto px-4 flex flex-col items-center mt-[75px] md:mt-[96px] z-20">
          {/* Avatar + Floating Badge Container (Avatar at y=192) */}
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

            {/* Floating "Kawsar Ahmed  👋🏼 " Badge */}
            <div
              className="absolute left-[70px] md:left-[84px] top-[4px] md:top-[9px] bg-[#FFFFFE] rounded-[60px] px-[16px] py-[8px] shadow-[0_10px_10px_0_rgba(84,84,84,0.1)] flex items-center justify-center whitespace-nowrap z-20"
              style={{
                transform: 'rotate(-10deg)',
              }}
            >
              <span
                style={{
                  fontFamily: '"Otterco Regular", sans-serif',
                  fontSize: '12px',
                  lineHeight: '14.4px',
                  color: 'rgb(36, 36, 36)',
                }}
              >
                Kawsar Ahmed  👋🏼 
              </span>
            </div>
          </div>

          {/* Hero H1 (Starts at y=330) */}
          <h1
            className="text-gradient-hero text-center mt-[10px] md:mt-[10px] tracking-normal text-[36px] leading-[44px] md:text-[56px] md:leading-[64px]"
            style={{
              fontFamily: '"Otterco Display Medium", sans-serif',
              fontWeight: 500,
            }}
          >
            <span className="block">Building digital</span>
            <span className="block">products, brands and</span>
            <span className="block">experience.</span>
          </h1>

          {/* Latest Work Button (Starts at y=566, h=60) */}
          <a
            href="https://dribbble.com/Kawsarvy"
            target="_blank"
            rel="noreferrer"
            className="mt-[32px] md:mt-[40px] w-[180px] h-[60px] bg-[#242424] rounded-[60px] flex items-center justify-center gap-[12px] transition-all hover:bg-black active:scale-[0.98] group z-20"
          >
            <DribbbleLatestWorkSvg width={16} height={16} />
            <span
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
          Visible from y=742 to 1022 (h=280px, Ticker at y=842)
          ========================================================================= */}
      <section className="relative w-full bg-white rounded-b-[80px] md:rounded-b-[120px] -mt-[60px] md:-mt-[80px] pt-[140px] md:pt-[184px] pb-[100px] md:pb-[116px] z-[5] overflow-hidden">
        <NoiseOverlay opacity={0.028} />
        {/* Logo Ticker Strip (h=40, y=842) */}
        <div className="w-full h-[40px] relative overflow-hidden flex items-center z-20">
          {/* Subtle horizontal gradient edge masks */}
          <div className="absolute left-0 top-0 bottom-0 w-[60px] md:w-[150px] bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-[60px] md:w-[150px] bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Smooth Continuous Marquee Track */}
          <div className="animate-marquee-smooth flex items-center gap-[80px]">
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
          Visible from y=1022 to 1638 (Title at y=1122, Pill at y=1271, Grid at y=1365)
          ========================================================================= */}
      <section className="relative w-full bg-[#F6F5F4] pt-[81px] md:pt-[124px] pb-[81px] md:pb-[81px] z-[1] overflow-hidden">
        <NoiseOverlay opacity={0.028} />
        <div className="relative max-w-[1300px] mx-auto px-4 md:px-0 z-20">
          {/* Section Headline (Starts at y=1122) */}
          <h2
            className="text-gradient-services text-center max-w-[360px] md:max-w-[615px] mx-auto text-[28px] leading-[42px] md:text-[36px] md:leading-[54px] font-[500]"
            style={{
              fontFamily: '"Otterco Display Medium", sans-serif',
            }}
          >
            Collaborate with brands and agencies to create impactful results.
          </h2>

          {/* Divider Line with Tilted "Services" Pill (Centered at y=1271) */}
          <div className="relative w-full max-w-[972px] mx-auto mt-[48px] md:mt-[85px] mb-[48px] md:mb-[68px] flex items-center justify-center">
            {/* Hairline Divider */}
            <div className="w-full h-[1px] bg-[#ECEBEA]" />

            {/* Tilted Floating Pill */}
            <div
              className="absolute w-[131px] h-[69px] bg-[#FFFFFE] rounded-[60px] shadow-[0_20px_10px_0_rgba(236,235,234,0.4)] flex items-center justify-center"
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

          {/* 4 Services Grid (y=1365) */}
          <div className="max-w-[972px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-[16px] md:gap-x-[80px] gap-y-[40px] md:gap-y-0">
            {/* Service 1: UX & UI */}
            <div className="flex flex-col items-start w-full max-w-[183px]">
              <div className="w-[44px] h-[44px] flex items-center justify-center">
                <ServiceUxUiSvg width={44} height={44} />
              </div>
              <h3
                className="mt-[16px]"
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
                Designing interfaces that are intuitive, efficient and enjoyable to use.
              </p>
            </div>

            {/* Service 2: Web & Mobile App */}
            <div className="flex flex-col items-start w-full max-w-[183px]">
              <div className="w-[44px] h-[44px] flex items-center justify-center">
                <ServiceWebMobileSvg width={44} height={44} />
              </div>
              <h3
                className="mt-[16px]"
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
            <div className="flex flex-col items-start w-full max-w-[183px]">
              <div className="w-[44px] h-[44px] flex items-center justify-center">
                <ServiceDesignCreativeSvg width={44} height={44} />
              </div>
              <h3
                className="mt-[16px]"
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
            <div className="flex flex-col items-start w-full max-w-[183px]">
              <div className="w-[42px] h-[44px] flex items-center justify-center">
                <ServiceDevelopmentSvg width={42} height={44} />
              </div>
              <h3
                className="mt-[16px]"
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
          CONTACT & FOOTER (Curved White Top Sheet)
          Visible from y=1638 to 2304 (h=666px, Icon at y=1726, Title at y=1850, Buttons at y=2022)
          ========================================================================= */}
      <section className="relative w-full bg-white rounded-t-[80px] md:rounded-t-[120px] pt-[88px] md:pt-[81px] pb-[74px] z-10 overflow-hidden">
        <NoiseOverlay opacity={0.028} />
        <div className="relative max-w-[1300px] mx-auto px-4 md:px-0 flex flex-col items-center z-20">
          {/* Top Circular Ring Frame (y=1726) */}
          <div className="relative w-[128px] h-[128px] rounded-full overflow-hidden flex items-center justify-center mb-[28px] md:mb-[36px]">
            <AvatarFrameSvg className="w-full h-full pointer-events-none" />
          </div>

          {/* Contact Heading (y=1850) */}
          <h2
            className="text-gradient-contact text-center max-w-[352px] md:max-w-[667px] text-[36px] leading-[44px] md:text-[56px] md:leading-[64px] font-[600]"
            style={{
              fontFamily: '"Otterco Display SemiBold", sans-serif',
            }}
          >
            Tell me about your next project
          </h2>

          {/* Action Buttons: Email Me & whatsApp (y=2022) */}
          <div className="mt-[36px] md:mt-[44px] flex items-center justify-center gap-[10px]">
            {/* Email Me Button (x=587) */}
            <div className="w-[128px] h-[60px] bg-[#F1F0EF] border border-[#ECEBEA] rounded-[74px] p-[4px] flex items-center justify-center">
              <a
                href="mailto:kawsarvy.design@gmail.com"
                className="w-[120px] h-[52px] bg-[#242424] rounded-[90px] flex items-center justify-center gap-[8px] transition hover:bg-black active:scale-[0.98] z-20"
              >
                <EmailIconSvg width={14} height={14} />
                <span
                  style={{
                    fontFamily: '"Otterco Medium", sans-serif',
                    fontSize: '12px',
                    lineHeight: '14.4px',
                    color: 'rgb(255, 255, 255)',
                  }}
                >
                  Email Me
                </span>
              </a>
            </div>

            {/* whatsApp Button (x=725) */}
            <div className="w-[128px] h-[60px] bg-[#F1F0EF] border border-[#ECEBEA] rounded-[74px] p-[4px] flex items-center justify-center">
              <a
                href="https://wa.me/1303536185"
                target="_blank"
                rel="noreferrer"
                className="w-[120px] h-[52px] bg-[#FFFFFE] rounded-[90px] flex items-center justify-center gap-[8px] transition hover:bg-zinc-50 active:scale-[0.98] z-20"
              >
                <span
                  style={{
                    fontFamily: '"Otterco Medium", sans-serif',
                    fontSize: '12px',
                    lineHeight: '14.4px',
                    color: 'rgb(36, 36, 36)',
                  }}
                >
                  whatsApp
                </span>
              </a>
            </div>
          </div>

          {/* ----------------- FOOTER (y=2181, copyright at y=2225) ----------------- */}
          <footer className="w-full max-w-[1300px] mt-[96px] md:mt-[115px]">
            {/* Hairline Divider Line */}
            <div className="w-full h-[1px] bg-[#ECEBEA] mb-[24px] md:mb-[28px]" />

            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright (x=72 on desktop) */}
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

              {/* Desktop Footer Socials */}
              <div className="hidden md:flex items-center text-[14px] leading-[16.8px] text-[#373737] gap-[10px]">
                <a
                  href="https://www.linkedin.com/in/kawsarvy/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-70 transition-opacity"
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
                  rel="noreferrer"
                  className="hover:opacity-70 transition-opacity"
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
                  rel="noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  style={{ fontFamily: '"Otterco Regular", sans-serif' }}
                >
                  instagram
                </a>
              </div>

              {/* Mobile Footer Socials */}
              <div className="flex md:hidden items-center gap-[4px]">
                <a
                  href="https://www.linkedin.com/in/kawsarvy/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-[48px] h-[48px] flex items-center justify-center"
                  aria-label="LinkedIn"
                >
                  <LinkedInSocialSvg width={48} height={48} />
                </a>
                <a
                  href="https://dribbble.com/Kawsarvy"
                  target="_blank"
                  rel="noreferrer"
                  className="w-[48px] h-[48px] flex items-center justify-center"
                  aria-label="Dribbble"
                >
                  <DribbbleSocialSvg width={48} height={48} />
                </a>
                <a
                  href="https://www.instagram.com/kawsarvy/"
                  target="_blank"
                  rel="noreferrer"
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
