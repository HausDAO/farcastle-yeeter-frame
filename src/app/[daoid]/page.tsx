import { Metadata } from "next";
import Dao from "./dao";

const appUrl = process.env.NEXT_PUBLIC_URL;

export const revalidate = 300;

type Props = {
  params: Promise<{ chainid: string; daoid: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chainid, daoid } = await params;

  console.log("chainid, daoid", chainid, daoid);
  const frame = {
    version: "next",
    imageUrl: `${appUrl}/opengraph-image`,
    button: {
      title: "Launch",
      action: {
        type: "launch_frame",
        name: "Farcastle DAO Proposals",
        url: `${appUrl}/dao/${chainid}/${daoid}`,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: "#17151F",
      },
    },
  };

  return {
    title: "Farcastle DAO Proposals",
    openGraph: {
      title: "Farcastle DAO Proposals",
      description: "Farcastle DAO Proposals",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function DaoPage() {
  return <Dao />;
}
