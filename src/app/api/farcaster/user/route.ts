import { NextResponse } from "next/server";
import { getBulkUsersByEthereumAddress } from "@/lib/neynar";

export async function GET(request: Request) {
  console.log("Route handler called");
  const { searchParams } = new URL(request.url);
  const ethereumAddress = searchParams.get("ethereumAddress");
  console.log("ethereumAddress:", ethereumAddress);

  if (!ethereumAddress) {
    console.log("No ethereum address provided");
    return NextResponse.json(
      { error: "Ethereum address is required" },
      { status: 400 }
    );
  }

  try {
    console.log("Fetching user from Neynar");
    const users = await getBulkUsersByEthereumAddress([ethereumAddress]);
    console.log("Neynar response:", users);

    if (!users) {
      console.log("No user found");
      return NextResponse.json(
        { error: "Farcaster user not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ user: users[ethereumAddress][0] });
  } catch (error) {
    console.error("Error fetching Farcaster user:", error);
    return NextResponse.json(
      { error: "Failed to fetch Farcaster user data" },
      { status: 500 }
    );
  }
}
