import {
  NeynarAPIClient,
  Configuration,
  // isApiErrorResponse,
} from "@neynar/nodejs-sdk";

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
