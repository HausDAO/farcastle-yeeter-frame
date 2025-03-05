import { Metadata } from "next";
import Proposal from "./proposal";
import { FORM_CONFIGS } from "@/lib/form-configs";

const appUrl = process.env.NEXT_PUBLIC_URL;

type Props = {
  params: Promise<{ chainid: string; daoid: string; proposaltype: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chainid, daoid, proposaltype } = await params;

  const proposalTitle = FORM_CONFIGS[proposaltype]
    ? `Make ${FORM_CONFIGS[proposaltype].title} Proposal`
    : "Make Proposal";

  const frame = {
    version: "next",
    imageUrl: `${appUrl}/image.png`,
    button: {
      title: proposalTitle,
      action: {
        type: "launch_frame",
        name: "Farcastle Proposals",
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
