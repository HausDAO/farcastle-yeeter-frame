import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY || "", // Replace with your Neynar API Key.
});

const neynarClient = new NeynarAPIClient(config);

// Function to fetch user by Ethereum address
export async function getBulkUsersByEthereumAddress(addresses: string[]) {
  try {
    const response = await neynarClient.fetchBulkUsersByEthOrSolAddress({
      addresses,
    });
    return response;
  } catch (error) {
    console.error("Error fetching user by Ethereum address:", error);
    throw error;
  }
}

export async function getUserByEthereumAddress(address: string) {
  try {
    const response = await neynarClient.fetchBulkUsersByEthOrSolAddress({
      addresses: [address],
    });
    return response[0];
  } catch (error) {
    console.error("Error fetching user by Ethereum address:", error);
    throw error;
  }
}

// Additional helper functions as needed
export async function getUserProfile(fid: number) {
  try {
    const response = await neynarClient.fetchBulkUsers({ fids: [fid] });
    return response;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function getUserProfiles(fids: number[]) {
  try {
    const response = await neynarClient.fetchBulkUsers({ fids });
    return response;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function getUserFollowers(fid: number) {
  try {
    let allFollowers: Array<{
      object: string;
      user: {
        fid: number;
        username: string;
        display_name?: string;
        pfp_url?: string;
        profile: {
          bio: {
            text: string;
          };
        };
        follower_count: number;
        following_count: number;
      };
    }> = [];
    let cursor: string | null = null;
    const limit = 100; // Maximum allowed by the API

    do {
      const response = await neynarClient.fetchUserFollowers({
        fid,
        limit,
        cursor: cursor || undefined,
      });

      allFollowers = [...allFollowers, ...response.users];
      cursor = response.next?.cursor;
    } while (cursor);

    return allFollowers;
  } catch (error) {
    console.error("Error fetching user followers:", error);
    throw error;
  }
}
