import './globals.css';

import type { Metadata } from 'next';

import { Header } from '@/components/ui/header';
import { Providers } from '@/providers/Providers';

const frame = {
  version: 'next',
  imageUrl: `https://zoo.farcastle.net/image.png`,
  button: {
    title: 'Enter',
    action: {
      type: 'launch_frame',
      name: 'Menagerie',
      url: 'https://zoo.farcastle.net',
      iconImageUrl: `https://zoo.farcastle.net/icon.png`,
      splashImageUrl: `https://zoo.farcastle.net/splash.png`,
      splashBackgroundColor: '#17151F',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://zoo.farcastle.net'),
    title: 'Infernal Menagerie',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=block"
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
