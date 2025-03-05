import { getGraphUrl } from "@/lib/endpoints";
import { FIND_DAO_LITE } from "@/lib/graph-queries";
import { DaoItem } from "@/lib/types";
import { GraphQLClient } from "graphql-request";
import { ImageResponse } from "next/og";

export const alt = "Farcastle Proposals";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { chainid: string; daoid: string };
}) {
  const { chainid, daoid } = await params;

  const dhUrl = getGraphUrl({
    chainid,
    graphKey: process.env.NEXT_PUBLIC_GRAPH_KEY || "",
    subgraphKey: "DAOHAUS",
  });
  const graphQLClient = new GraphQLClient(dhUrl);
  const daores = (await graphQLClient.request(FIND_DAO_LITE, { daoid })) as {
    dao: DaoItem;
  };

  const frameText = daores?.dao?.name
    ? `Make ${daores.dao.name} Proposal`
    : `Make Proposal`;

  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative text-[#00B1CC] bg-[#341A34]">
        <h1 tw="text-4xl">{frameText}</h1>
      </div>
    ),
    {
      ...size,
    }
  );
}
