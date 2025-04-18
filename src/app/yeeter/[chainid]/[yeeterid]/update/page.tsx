import { Card } from "@/components/ui/card";
import { DetailsPage } from "./details-page";
// import { Metadata } from "next";

// const appUrl = process.env.NEXT_PUBLIC_URL;

// type Props = {
//   params: Promise<{ chainid: string; yeeterid: string }>;
// };

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { chainid, yeeterid } = await params;

//   const frame = {
//     version: "next",
//     imageUrl: `${appUrl}/dao/${chainid}/${yeeterid}/opengraph-image`,
//     button: {
//       title: "View Fundraiser",
//       action: {
//         type: "launch_frame",
//         name: "Fundraiser",
//         url: `${appUrl}/dao/${chainid}/${yeeterid}`,
//         iconImageUrl: `${appUrl}/icon.png`,
//         splashImageUrl: `${appUrl}/splash.png`,
//         splashBackgroundColor: "#341A34",
//       },
//     },
//   };
//   return {
//     title: "Fundraiser",
//     openGraph: {
//       title: "Farcastle Fundraiser",
//       description: "Enrich the realm",
//       images: `${appUrl}/image.png`,
//     },
//     other: {
//       "fc:frame": JSON.stringify(frame),
//     },
//   };
// }

export default function Page() {
  return (
    <div className="w-full h-full pb-4 px-4">
      <Card className="flex flex-col items-center pt-4 pb-0 rounded-none">
        <DetailsPage />
      </Card>
    </div>
  );
}
