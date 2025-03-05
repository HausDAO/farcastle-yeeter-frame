import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import DaoHome from "./dao-home";

type Props = {
  params: Promise<{ chainid: string; daoid: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  console.log("meta params", params);

  const { chainid, daoid } = await params;

  const frame = {
    version: "next",
    imageUrl: `https://proposals.farcastle.net/image.png`,
    button: {
      title: "Make Proposal (DAO)",
      action: {
        type: "launch_frame",
        name: "Proposals (DAO)",
        url: `https://proposals.farcastle.net/dao/${chainid}/${daoid}`,
        iconImageUrl: `https://proposals.farcastle.net/icon.png`,
        splashImageUrl: `https://proposals.farcastle.net/splash.png`,
        splashBackgroundColor: "#341A34",
      },
    },
  };
  return {
    metadataBase: new URL("https://proposals.farcastle.net"),
    title: "Proposals (DAO)",
    openGraph: {
      title: "Farcastle Proposals (DAO)",
      description: "the actions of organizations",
      images: `https://proposals.farcastle.net/image.png`,
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Page({ params }: Props) {
  console.log("page params", params);

  return (
    <div className="w-full h-full pb-4 px-4">
      <Card className="flex flex-col items-center pt-4 pb-8 rounded-none">
        <DaoHome />
      </Card>
    </div>
  );
}
