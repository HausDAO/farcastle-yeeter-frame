import type { FrameNotificationDetails } from "@farcaster/frame-sdk";
import { redis } from "./redis";

function getUserKey(fid: number): string {
  return `fundraiser:user:${fid}`;
}

function getUserNotificationDetailsKey(fid: number): string {
  return `fundraiser:user:${fid}:notification-details`;
}

export type User = {
  fid: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  custodyWalletAddress: string;
  // todo might be how we track preferences
  // preferences?: SOMETYPE
};

export async function getUser(fid: number): Promise<User | null> {
  if (!redis) {
    return null;
  }
  return await redis.get<User>(getUserKey(fid));
}

export async function setUser(fid: number, user: User): Promise<void> {
  if (!redis) {
    return;
  }
  await redis.set(getUserKey(fid), user);
}

export async function deleteUser(fid: number): Promise<void> {
  if (!redis) {
    return;
  }
  await redis.del(getUserKey(fid));
}

export async function getUserNotificationDetails(
  fid: number
): Promise<FrameNotificationDetails | null> {
  if (!redis) {
    return null;
  }
  return await redis.get<FrameNotificationDetails>(
    getUserNotificationDetailsKey(fid)
  );
}

export async function getMultipleUserNotificationDetails(
  fids: number[]
): Promise<FrameNotificationDetails[] | null> {
  if (!redis) {
    return null;
  }
  const keys = fids.map((fid) => getUserNotificationDetailsKey(fid));
  const details = await redis.mget<FrameNotificationDetails[]>(keys);

  return details.filter((d) => d);
}

export async function getAllUserNotificationDetails(): Promise<
  FrameNotificationDetails[] | null
> {
  if (!redis) {
    return null;
  }
  const allKeys: string[] = [];
  let cursor = "0";

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: "fundraiser:user:*",
      count: 100,
    });

    cursor = nextCursor;
    allKeys.push(...keys);
  } while (cursor !== "0");

  return await redis.mget<FrameNotificationDetails[]>(allKeys);
}

export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: FrameNotificationDetails
): Promise<void> {
  if (!redis) {
    return;
  }
  await redis.set(getUserNotificationDetailsKey(fid), notificationDetails);
}

export async function deleteUserNotificationDetails(
  fid: number
): Promise<void> {
  if (!redis) {
    return;
  }
  await redis.del(getUserNotificationDetailsKey(fid));
}
