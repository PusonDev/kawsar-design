import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kawsarvy ⎯ Product Designer',
  description: 'Senior UI/UX & Product Designer | Mobile, Web/SaaS & Design Systems | Turning Complex Problems into Intuitive Experiences',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Kawsarvy ⎯ Product Designer',
    description: 'Senior UI/UX & Product Designer | Mobile, Web/SaaS & Design Systems | Turning Complex Problems into Intuitive Experiences',
    url: 'https://kawsar.design/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kawsarvy ⎯ Product Designer',
    description: 'Senior UI/UX & Product Designer | Mobile, Web/SaaS & Design Systems | Turning Complex Problems into Intuitive Experiences',
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
      </head>
      <body className="bg-white text-[#242424] antialiased selection:bg-zinc-200">
        {children}
      </body>
    </html>
  );
}
