import { Metadata } from "next";
import Launch from "./launch";

const appUrl = process.env.NEXT_PUBLIC_URL;

export async function generateMetadata(): Promise<Metadata> {
  const frame = {
    version: "next",
    imageUrl: `${appUrl}/image.png`,
    button: {
      title: "Launch Fundraiser",
      action: {
        type: "launch_frame",
        name: "Fundraisers",
        url: `${appUrl}/explore`,
        iconImageUrl: `${appUrl}/icon.png`,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: "#341A34",
      },
    },
  };
  return {
    title: "Fundraisers",
    openGraph: {
      title: "Farcastle Fundraisers",
      description: "Shape the fate of the realm",
      images: `${appUrl}/image.png`,
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Page() {
  return <Launch />;
}
