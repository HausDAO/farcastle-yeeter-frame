import {
  FrameNotificationDetails,
  type SendNotificationRequest,
  sendNotificationResponseSchema,
} from "@farcaster/frame-sdk";
import {
  getAllUserNotificationDetails,
  getMultipleUserNotificationDetails,
  getUserNotificationDetails,
} from "./db";

const appUrl = process.env.NEXT_PUBLIC_URL || "";

type SendFrameNotificationResult =
  | {
      state: "error";
      error: unknown;
    }
  | { state: "no_token" }
  | { state: "rate_limit" }
  | { state: "success" };

async function sendNotificationBatch(
  batch: FrameNotificationDetails[],
  title: string,
  body: string,
  targetUrl?: string
): Promise<SendFrameNotificationResult> {
  const response = await fetch(batch[0].url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      notificationId: crypto.randomUUID(),
      title,
      body,
      targetUrl: targetUrl || appUrl,
      tokens: batch.map((d) => d.token),
    } satisfies SendNotificationRequest),
  });

  const responseJson = await response.json();

  if (response.status === 200) {
    const responseBody = sendNotificationResponseSchema.safeParse(responseJson);
    if (responseBody.success === false) {
      return { state: "error", error: responseBody.error.errors };
    }

    if (responseBody.data.result.rateLimitedTokens.length) {
      return { state: "rate_limit" };
    }

    console.log(`notification batch sent to ${batch.length} users`);
    return { state: "success" };
  }

  return { state: "error", error: responseJson };
}

export async function sendFrameNotification({
  fid,
  title,
  body,
  notificationDetails,
  targetUrl,
}: {
  fid: number;
  title: string;
  body: string;
  notificationDetails?: FrameNotificationDetails | null;
  targetUrl?: string;
}): Promise<SendFrameNotificationResult> {
  if (!notificationDetails) {
    notificationDetails = await getUserNotificationDetails(fid);
  }
  if (!notificationDetails) {
    return { state: "no_token" };
  }

  return sendNotificationBatch([notificationDetails], title, body, targetUrl);
}

export async function sendFrameNotificationToMultipleUsers({
  fids,
  title,
  body,
  targetUrl,
  notificationDetails,
}: {
  fids: number[];
  title: string;
  body: string;
  targetUrl?: string;
  notificationDetails?: FrameNotificationDetails[] | null;
}): Promise<SendFrameNotificationResult> {
  if (!notificationDetails) {
    notificationDetails = await getMultipleUserNotificationDetails(fids);
  }
  if (!notificationDetails) {
    return { state: "no_token" };
  }

  // Process in batches of 100
  const batchSize = 100;
  const batches = [];
  for (let i = 0; i < notificationDetails.length; i += batchSize) {
    batches.push(notificationDetails.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    const result = await sendNotificationBatch(batch, title, body, targetUrl);
    if (result.state !== "success") {
      return result;
    }
  }

  return { state: "success" };
}

export async function sendFrameNotificationToAllUsers({
  title,
  body,
  targetUrl,
  notificationDetails,
}: {
  title: string;
  body: string;
  targetUrl?: string;
  notificationDetails?: FrameNotificationDetails[] | null;
}): Promise<SendFrameNotificationResult> {
  if (!notificationDetails) {
    notificationDetails = await getAllUserNotificationDetails();
  }
  if (!notificationDetails) {
    return { state: "no_token" };
  }

  console.log(`notfiying ${notificationDetails.length} users`);

  // Process in batches of 100
  const batchSize = 100;
  const batches = [];
  for (let i = 0; i < notificationDetails.length; i += batchSize) {
    batches.push(notificationDetails.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    const result = await sendNotificationBatch(batch, title, body, targetUrl);
    if (result.state !== "success") {
      return result;
    }
  }

  return { state: "success" };
}
