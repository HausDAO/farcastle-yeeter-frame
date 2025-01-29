import { Metadata } from "next";
import Proposal from "./proposal";

const appUrl = process.env.NEXT_PUBLIC_URL;

export const revalidate = 300;
export const runtime = "edge";

type Props = {
  params: Promise<{ chainid: string; daoid: string; proposaltype: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chainid, daoid, proposaltype } = await params;

  const frame = {
    version: "next",
    imageUrl: `${appUrl}/opengraph-image`,
    button: {
      title: "Launch",
      action: {
        type: "launch_frame",
        name: "Farcastle DAO Proposals",
        url: `${appUrl}/dao/${chainid}/${daoid}/${proposaltype}`,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: "#17151F",
      },
    },
  };
  return {
    title: "Farcastle Proposal",
    openGraph: {
      title: "Farcastle Proposal",
      description: "Farcastle Proposal",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Page() {
  return <Proposal />;
}
