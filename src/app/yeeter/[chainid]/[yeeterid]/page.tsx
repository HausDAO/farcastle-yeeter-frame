import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import YeeterHome from "./yeeter-home";
import { headers } from "next/headers";

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");
  return `https://${host}`;
}

type Props = {
  params: Promise<{ chainid: string; yeeterid: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chainid, yeeterid } = await params;
  const baseUrl = await getBaseUrl();

  const imageUrl = new URL(`${baseUrl}/api/campaign/${chainid}/${yeeterid}}`);

  const frame = {
    version: "next",
    // imageUrl: `${baseUrl}/yeeter/${chainid}/${yeeterid}/opengraph-image`,
    imageUrl: imageUrl.toString(),
    button: {
      title: "Contribute",
      action: {
        type: "launch_frame",
        name: "Fundraiser",
        url: `${baseUrl}/yeeter/${chainid}/${yeeterid}`,
        iconImageUrl: `${baseUrl}/icon.png`,
        splashImageUrl: `${baseUrl}/splash.png`,
        splashBackgroundColor: "#341A34",
      },
    },
    input: {
      text: "Enter your message (optional)",
    },
    postUrl: `${baseUrl}/api/frame`,
  };
  return {
    title: "Fundraiser",
    openGraph: {
      title: "Farcastle Fundraiser",
      description: "Enrich the realm",
      // images: [`${baseUrl}/yeeter/${chainid}/${yeeterid}/opengraph-image`],
      images: [{ url: imageUrl.toString() }],
    },
    other: {
      "fc:frame": JSON.stringify(frame),
      "fc:frame:image": `${imageUrl.toString()}`,
      "fc:frame:button:1": "Contribute",
      "fc:frame:post_url": `${baseUrl}/api/frame`,
    },
  };
}

export default function Page() {
  return (
    <div className="w-full h-full pb-4 px-4">
      <Card className="flex flex-col items-center pt-4 pb-8 rounded-none">
        <YeeterHome />
      </Card>
    </div>
  );
}
