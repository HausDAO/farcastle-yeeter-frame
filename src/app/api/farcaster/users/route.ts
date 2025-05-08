import { NextResponse } from "next/server";
import { getBulkUsersByEthereumAddress } from "@/lib/neynar";

export async function POST(request: Request) {
  try {
    const { ethereumAddresses } = await request.json();

    if (!ethereumAddresses || !Array.isArray(ethereumAddresses)) {
      return NextResponse.json(
        { error: "Ethereum addresses array is required" },
        { status: 400 }
      );
    }

    const users = await getBulkUsersByEthereumAddress(ethereumAddresses);

    if (!users) {
      return NextResponse.json(
        { error: "No Farcaster users found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching Farcaster users:", error);
    return NextResponse.json(
      { error: "Failed to fetch Farcaster user data" },
      { status: 500 }
    );
  }
}
