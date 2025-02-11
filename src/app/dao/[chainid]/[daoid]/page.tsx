import { Metadata } from "next";
import DaoHome from "./dao-home";

const appUrl = process.env.NEXT_PUBLIC_URL;

export const revalidate = 300;

type Props = {
  params: Promise<{ chainid: string; daoid: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chainid, daoid } = await params;

  const frame = {
    version: "next",
    imageUrl: `${appUrl}/opengraph-image`,
    button: {
      title: "Launch",
      action: {
        type: "launch_frame",
        name: "#3 Farcastle DAO Proposals",
        url: `${appUrl}/dao/${chainid}/${daoid}`,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: "#17151F",
      },
    },
  };

  return {
    title: "#1 Farcastle DAO Proposals",
    openGraph: {
      title: "#2 Farcastle DAO Proposals",
      description: "Farcastle DAO Proposals",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

("use client");
export default function Page() {
  return <DaoHome />;
}
