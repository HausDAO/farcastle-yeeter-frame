/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { getGraphUrl } from "@/lib/endpoints";
import { GraphQLClient } from "graphql-request";
import { RecordItem, YeeterItem } from "@/lib/types";
import { FIND_YEETER, FIND_YEETER_PROFILE } from "@/lib/graph-queries";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({
  params,
}: {
  params: { chainid: string; yeeterid: string };
}) {
  const dhUrl = getGraphUrl({
    chainid: params.chainid,
    graphKey: process.env.NEXT_PUBLIC_GRAPH_KEY || "",
    subgraphKey: "DAOHAUS",
  });

  const yeeterUrl = getGraphUrl({
    chainid: params.chainid,
    graphKey: process.env.NEXT_PUBLIC_GRAPH_KEY || "",
    subgraphKey: "YEETER",
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_URL || "https://fundraiser.farcastle.net";
  let imgSrc = `${baseUrl}/fallback.svg`;

  try {
    const graphQLClientYeeter = new GraphQLClient(dhUrl);
    const { yeeter } = (await graphQLClientYeeter.request(FIND_YEETER, {
      yeeter: params.yeeterid,
    })) as { yeeter: YeeterItem };

    const graphQLClientDh = new GraphQLClient(yeeterUrl);
    const { records } = (await graphQLClientDh.request(FIND_YEETER_PROFILE, {
      dao: yeeter.dao.id,
    })) as { records: RecordItem[] };

    const profileMatch =
      records.find((record) => {
        let recordYeeterId;
        if (record.content.indexOf(`"yeeterId":"`) > -1) {
          recordYeeterId = record.content
            .split(`"yeeterId":"`)[1]
            ?.split(`"`)[0];
        }

        return recordYeeterId === yeeter.id;
      }) || records[0];

    if (profileMatch?.content) {
      const profile = JSON.parse(profileMatch.content);
      if (profile.icon) {
        imgSrc = profile.icon;
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }

  return new ImageResponse(
    (
      <div tw="flex items-center justify-center h-full w-full bg-[#17151F]">
        <p>FUNDRAISER</p>
        <img
          src={imgSrc}
          width="500"
          height="500"
          tw="rounded-full"
          alt="DAO Avatar"
        />
      </div>
    ),
    size
  );
}
