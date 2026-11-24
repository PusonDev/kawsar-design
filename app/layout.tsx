import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Kawsarvy ⎯ Product Designer',
  description: 'Senior UI/UX & Product Designer | Mobile, Web/SaaS & Design Systems | Turning Complex Problems into Intuitive Experiences',
  metadataBase: new URL('https://kawsar.design/'),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Kawsarvy ⎯ Product Designer',
    description: 'Senior UI/UX & Product Designer | Mobile, Web/SaaS & Design Systems | Turning Complex Problems into Intuitive Experiences',
    url: 'https://kawsar.design/',
    type: 'website',
    images: [
      {
        url: '/assets/og-image.jpeg',
        width: 800,
        height: 533,
        alt: 'Kawsarvy ⎯ Product Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kawsarvy ⎯ Product Designer',
    description: 'Senior UI/UX & Product Designer | Mobile, Web/SaaS & Design Systems | Turning Complex Problems into Intuitive Experiences',
    images: ['/assets/og-image.jpeg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="preload"
          href="/assets/kawsar-avatar.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/assets/kawsar-exact-noise.png"
          as="image"
          type="image/png"
        />
      </head>
      <body className="bg-white text-[#242424] antialiased selection:bg-zinc-200">
        {children}
      </body>
    </html>
  );
}
