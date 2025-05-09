/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { getGraphUrl } from "@/lib/endpoints";
import { GraphQLClient } from "graphql-request";
import { RecordItem, YeeterItem, YeetsItem } from "@/lib/types";
import {
  FIND_YEETER,
  FIND_YEETER_PROFILE,
  LIST_YEETS,
} from "@/lib/graph-queries";
import { toWholeUnits } from "@/lib/helpers";
import { formatLootForAmount } from "@/lib/yeet-helpers";
import { toBaseUnits } from "@/lib/units";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({
  params,
}: {
  params: { chainid: string; yeeterid: string; amount: string };
}) {
  console.log("params", params);
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
  let raisedAmount = "0.00000";
  let goal = "0.0088";
  let title = "UNTITLED CAMPAIGN";
  let contribution, loot, farcasterPfps;

  // Fetch font data
  const vt323FontUrl = `${baseUrl}/fonts/VT323-Regular.woff`;
  const vt323FontData = await fetch(vt323FontUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error(
          `Failed to fetch font: ${res.status} ${res.statusText}`
        );
      }
      return res.arrayBuffer();
    })
    .catch((error) => {
      console.error("VT323 Font fetch error:", error);
      return null;
    });

  const mulishFontUrl = `${baseUrl}/fonts/Mulish-Regular.woff`;
  const mulishFontData = await fetch(mulishFontUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error(
          `Failed to fetch font: ${res.status} ${res.statusText}`
        );
      }
      return res.arrayBuffer();
    })
    .catch((error) => {
      console.error("Mulish Font fetch error:", error);
      return null;
    });

  try {
    const graphQLClientYeeter = new GraphQLClient(yeeterUrl);
    const { yeeter } = (await graphQLClientYeeter.request(FIND_YEETER, {
      shamanAddress: params.yeeterid,
    })) as { yeeter: YeeterItem };

    const graphQLClientDh = new GraphQLClient(dhUrl);
    const { records } = (await graphQLClientDh.request(FIND_YEETER_PROFILE, {
      daoid: yeeter.dao.id,
    })) as { records: RecordItem[] };

    const { yeets } = (await graphQLClientYeeter.request(LIST_YEETS, {
      shamanAddress: params.yeeterid,
    })) as { yeets: YeetsItem[] };

    // const frameContext = await frameSDK.context;

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
      if (profile.name) {
        title = profile.name.toUpperCase();
      }
    }

    const yeeterAddresses = yeets.map((yeet) => yeet.contributor);

    const options = {
      method: "GET",
      headers: { "x-api-key": process.env.NEYNAR_API_KEY || "" },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let farcasterUsers = {} as Record<string, any[]>;

    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${yeeterAddresses.join(",")}`,
      options
    );

    if (res.ok) {
      farcasterUsers = await res.json();
    }

    // console.log("farcasterUsers", farcasterUsers);
    /* tslint:ignore */
    farcasterPfps = Object.keys(farcasterUsers).map((address) => {
      /* tslint:ignore */
      return farcasterUsers[address][0].pfp_url;
    });

    raisedAmount = Number(toWholeUnits(yeeter?.balance)).toFixed(5);
    goal = toWholeUnits(yeeter?.goal);

    contribution = params.amount;
    loot = `${formatLootForAmount(yeeter, toBaseUnits(params.amount))} ${yeeter.dao.lootTokenSymbol}`;
  } catch (error) {
    console.error("Error:", error);
  }

  // Calculate progress percentage
  const progress = Math.min((Number(raisedAmount) / Number(goal)) * 100, 100);

  // Build fonts array conditionally
  const fonts = [];
  if (vt323FontData) {
    fonts.push({
      name: "VT323",
      data: vt323FontData,
    });
  }
  if (mulishFontData) {
    fonts.push({
      name: "Mulish",
      data: mulishFontData,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "#341A34",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "40px",
          paddingBottom: "40px",
          color: "#00B1CC", // Changed default text color
        }}
      >
        {/* Card-like container */}
        <div
          style={{
            background: "#17151F",
            height: "100%",
            width: "70%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "40px",
            border: "2px solid #39393C",
            borderRadius: "0px",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        >
          {/* Top section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "48px",
                fontFamily: "'VT323'",
                color: "#00B1CC",
                textTransform: "uppercase",
                justifyContent: "center",
              }}
            >
              {title}
            </div>
            <div style={{ display: "flex" }}>
              <img
                src={imgSrc}
                alt="Campaign Icon"
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "100%",
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "36px",
              justifyContent: "center",
              fontFamily: "'Mulish'",
            }}
          >
            I contributed {contribution} ETH!
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              justifyContent: "center",
              fontFamily: "'Mulish'",
            }}
          >
            For {loot}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {farcasterPfps?.map((url) => {
              return (
                <img
                  src={url}
                  key={url}
                  alt="farcasterPfp"
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "100%",
                  }}
                />
              );
            })}
          </div>

          {/* Bottom section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxWidth: "600px",
              gap: "24px",
            }}
          >
            {/* Progress bar */}
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "24px",
                background: "hsla(189, 100%, 40%, 0.2)",
                borderRadius: "9999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: `${progress}%`,
                  height: "100%",
                  background: "#00B1CC",
                }}
              />
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    fontSize: "20px",
                    textTransform: "uppercase",
                    fontFamily: "'Mulish'",
                    color: "#9FA3AF",
                  }}
                >
                  Raised
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "36px",
                    fontFamily: "'Mulish'",
                    color: "#FAFAFA",
                  }}
                >
                  {raisedAmount} ETH
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: "20px",
                    textTransform: "uppercase",
                    fontFamily: "'Mulish'",
                    color: "#9FA3AF",
                  }}
                >
                  Goal
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "36px",
                    fontFamily: "'Mulish'",
                    color: "#FAFAFA",
                  }}
                >
                  {goal} ETH
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts, // Pass the conditionally built fonts array
    }
  );
}
