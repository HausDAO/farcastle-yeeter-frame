import "./globals.css";

import type { Metadata } from "next";

import { Header } from "@/components/ui/header";
import { Providers } from "@/providers/Providers";

const frame = {
  version: "next",
  imageUrl: `https://proposals.farcastle.net/image.png`,
  button: {
    title: "Make Proposal",
    action: {
      type: "launch_frame",
      name: "Proposals",
      url: "https://proposals.farcastle.net",
      iconImageUrl: `https://proposals.farcastle.net/icon.png`,
      splashImageUrl: `https://proposals.farcastle.net/splash.png`,
      splashBackgroundColor: "#341A34",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://proposals.farcastle.net"),
    title: "Proposals",
    openGraph: {
      title: "Farcastle Proposals",
      description: "the actions of organizations",
      images: `https://proposals.farcastle.net/image.png`,
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
      </head>
      <body className="antialiased scrollbar-vert">
        <Providers>
          <Header />
          <div className="mt-1">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
