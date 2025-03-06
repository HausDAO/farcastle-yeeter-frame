import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({ params }: { params: { chainid: string; daoid: string } }) {
  const graphUrl = "https://gateway-arbitrum.network.thegraph.com/api/88c2a93b547a89caea1d25a496ba6631/subgraphs/id/CgH5vtz9CJPdcSmD3XEh8fCVDjQjnRwrSawg71T1ySXW";
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://proposals.farcastle.net/';
  let imgSrc = `${baseUrl}/fallback.svg`;

  try {
    const response = await fetch(graphUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query findDao($id: String!) {
            dao(id: $id) {
              id
              name
              records(where: {table: "daoProfile"}) {
                content
              }
            }
          }
        `,
        variables: { id: params.daoid }
      }),
    });

    const data = await response.json();
    if (data?.data?.dao?.records?.[0]?.content) {
      const profile = JSON.parse(data.data.dao.records[0].content);
      if (profile.avatarImg) {
        imgSrc = profile.avatarImg;
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }

  return new ImageResponse(
    (
      <div tw="flex items-center justify-center h-full w-full bg-[#17151F]">
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
