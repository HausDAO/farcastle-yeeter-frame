import "./globals.css";

import type { Metadata } from "next";

import { Header } from "@/components/ui/header";
import { Providers } from "@/providers/Providers";

const appUrl = process.env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/image.png`,
  button: {
    title: "Open Fundraiser",
    action: {
      type: "launch_frame",
      name: "Fundraiser",
      url: `${appUrl}`,
      iconImageUrl: `${appUrl}/icon.png`,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#341A34",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(`${appUrl}`),
    title: "Fundraiser",
    openGraph: {
      title: "Farcastle Fundraiser",
      description: "Shape the fate of the realm",
      images: `${appUrl}/image.png`,
    },
    other: {
      "fc:frame": JSON.stringify(frame),
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
        <link
          rel="preload"
          href="/fonts/FetteUNZFraktur.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased scrollbar-vert">
        <Providers>
          <div className="w-full flex flex-col items-center">
            <div className="w-screen md:w-[768px]">
              <Header />
              <div className="mt-1">{children}</div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
