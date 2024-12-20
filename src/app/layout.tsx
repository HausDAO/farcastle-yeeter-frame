import './globals.css';

import type { Metadata } from 'next';

import { Header } from '@/components/ui/header';
import { Providers } from '@/providers/Providers';

const frame = {
  version: 'next',
  imageUrl: `https://zoo.farcastle.net/image.png`,
  button: {
    title: 'Enter the Abyss',
    action: {
      type: 'launch_frame',
      name: 'Menagerie',
      url: 'https://zoo.farcastle.net',
      iconImageUrl: `https://zoo.farcastle.net/icon.png`,
      splashImageUrl: `https://zoo.farcastle.net/splash.png`,
      splashBackgroundColor: '#341A34',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://zoo.farcastle.net'),
    title: 'Infernal Zoo',
    openGraph: {
      title: 'Menagerie',
      description: 'collection of cursed creatures',
      images: `https://zoo.farcastle.net/image.png`,
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  };
}

// eslint-disable-next-line import/no-default-export
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* eslint-disable-next-line @next/next/google-font-display */}
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased scrollbar-vert">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
