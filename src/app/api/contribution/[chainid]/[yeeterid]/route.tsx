/* eslint-disable @next/next/no-img-element */
import { getGraphUrl } from "@/lib/endpoints";
import {
  FIND_YEETER_EMBED,
  FIND_YEETER_PROFILE_DAO_EMBED,
} from "@/lib/graph-queries";
import { toWholeUnits } from "@/lib/helpers";
import { DaoItem, MemberItem, RecordItem, YeeterItem } from "@/lib/types";
import { GraphQLClient } from "graphql-request";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

type DaoWithMembers = DaoItem & { members: MemberItem[] };

// Force dynamic rendering to ensure fresh image generation on each request
export const dynamic = "force-dynamic";

// Define the dimensions for the generated OpenGraph image
const size = {
  // width: 600,
  // height: 400,
  width: 1200,
  height: 630,
};

/**
 * GET handler for generating dynamic OpenGraph images
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the ID
 * @returns ImageResponse - A dynamically generated image for OpenGraph
 */
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      chainid: string;
      yeeterid: string;
    }>;
  }
) {
  const { chainid, yeeterid } = await params;
  const searchParams = request.nextUrl.searchParams;
  const amount = searchParams.get("amount");

  try {
    const dhUrl = getGraphUrl({
      chainid: chainid,
      graphKey: process.env.NEXT_PUBLIC_GRAPH_KEY || "",
      subgraphKey: "DAOHAUS",
    });

    const yeeterUrl = getGraphUrl({
      chainid: chainid,
      graphKey: process.env.NEXT_PUBLIC_GRAPH_KEY || "",
      subgraphKey: "YEETER",
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_URL || "https://fundraiser.farcastle.net";
    let imgSrc = `${baseUrl}/fallback.svg`;
    let raisedAmount = "0.00000";
    let goal = "0.0088";
    let title = "UNTITLED CAMPAIGN";
    let contribution;
    let farcasterUsers = {} as Record<string, { pfp_url: string }[]>;
    let contributorPfps, memberPfps;

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
      const { yeeter } = (await graphQLClientYeeter.request(FIND_YEETER_EMBED, {
        shamanAddress: yeeterid,
      })) as { yeeter: YeeterItem };

      const graphQLClientDh = new GraphQLClient(dhUrl);
      const { records, dao } = (await graphQLClientDh.request(
        FIND_YEETER_PROFILE_DAO_EMBED,
        {
          daoid: yeeter.dao.id,
        }
      )) as { records: RecordItem[]; dao: DaoWithMembers };

      console.log("dao", dao);

      title = dao.name;

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

      const yeeterAddresses =
        yeeter.yeets?.map((yeet) => yeet.contributor) || [];
      const memberAddresses = dao?.members?.map((m) => m.memberAddress) || [];

      const uniqueAddresses = [
        ...new Set([...yeeterAddresses, ...memberAddresses]),
      ];
      const options = {
        method: "GET",
        headers: { "x-api-key": process.env.NEYNAR_API_KEY || "" },
      };

      const res = await fetch(
        `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${uniqueAddresses.join(",")}`,
        options
      );

      if (res.ok) {
        farcasterUsers = await res.json();
      }

      const uniqueYeeterAddresses = [...new Set(yeeterAddresses)];
      contributorPfps = uniqueYeeterAddresses
        .map((addy) => {
          if (farcasterUsers[addy]) {
            return farcasterUsers[addy][0].pfp_url;
          }
        })
        .filter((el) => el !== undefined);

      memberPfps = memberAddresses
        .map((addy) => {
          if (farcasterUsers[addy]) {
            return farcasterUsers[addy][0].pfp_url;
          }
        })
        .filter((el) => el !== undefined);

      raisedAmount = Number(toWholeUnits(yeeter?.balance)).toFixed(5);
      goal = toWholeUnits(yeeter?.goal);

      contribution = amount;
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
                gap: "8px",
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
                I contributed {contribution} ETH to
              </div>
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

            {/* Contributors and Members headings row */}
            {/* Contributors and Members headings and avatars row */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "600px",
                marginTop: "24px",
                marginBottom: "12px",
                gap: "32px",
              }}
            >
              {/* Contributors column */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  maxWidth: "50%",
                }}
              >
                {contributorPfps && contributorPfps.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "20px",
                        textTransform: "uppercase",
                        fontFamily: "'Mulish'",
                        color: "#9FA3AF",
                        marginBottom: "8px",
                      }}
                    >
                      Contributors
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      {(contributorPfps?.slice(0, 9) || []).map((pfp, idx) => (
                        <img
                          src={pfp}
                          key={pfp}
                          alt="farcasterPfp"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "100%",
                            border: "2px solid #17151F",
                            marginLeft: idx === 0 ? 0 : -20,
                            zIndex: 10 - idx,
                          }}
                        />
                      ))}
                      {contributorPfps && contributorPfps.length > 9 && (
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "100%",
                            background: "#9FA3AF",
                            color: "#17151F",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "'Mulish'",
                            fontSize: "18px",
                            fontWeight: 700,
                            marginLeft: contributorPfps.length > 0 ? -20 : 0,
                            zIndex: 0,
                          }}
                        >
                          +{contributorPfps.length - 9}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Members column */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  maxWidth: "50%",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    textTransform: "uppercase",
                    fontFamily: "'Mulish'",
                    color: "#9FA3AF",
                    marginBottom: "8px",
                  }}
                >
                  Members
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: "8px",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  {(memberPfps?.slice(0, 9) || []).map((pfp, idx) => (
                    <img
                      src={pfp}
                      key={pfp}
                      alt="farcasterPfp"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "100%",
                        border: "2px solid #17151F",
                        marginLeft: idx === 0 ? 0 : -20,
                        zIndex: 10 - idx,
                      }}
                    />
                  ))}
                  {memberPfps && memberPfps.length > 9 && (
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "100%",
                        background: "#9FA3AF",
                        color: "#17151F",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Mulish'",
                        fontSize: "18px",
                        fontWeight: 700,
                        marginLeft: memberPfps.length > 0 ? -20 : 0,
                        zIndex: 0,
                      }}
                    >
                      +{memberPfps.length - 9}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Bottom section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: "600px",
                gap: "12px",
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
  } catch (e) {
    // Log and handle any errors during image generation
    console.log(`Failed to generate yeet image`, e);
    return new Response(`Failed to generate yeet image`, {
      status: 500,
    });
  }
}
