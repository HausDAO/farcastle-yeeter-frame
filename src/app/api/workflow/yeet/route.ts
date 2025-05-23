import { getUserFollowers } from "@/lib/neynar";
import { sendFrameNotificationToMultipleUsers } from "@/lib/notifications/notification-client";
import { serve } from "@upstash/workflow/nextjs";

type YeetWorkflowPayload = {
  yeeterid: string;
  chainid: string;
  campaignname?: string;
  username?: string;
  fid: number;
};

// body has yeeter,chain,amout,user/userfid
// some initial validation
// get all followers for userfid https://docs.neynar.com/reference/fetch-user-followers

export const { POST } = serve(async (context) => {
  console.log("context.re", context.requestPayload);
  const { yeeterid, chainid, campaignname, username, fid } =
    context.requestPayload as YeetWorkflowPayload;
  if (!yeeterid || !chainid || !fid) {
    return;
  }

  await context.run("notifyYeet", async () => {
    console.log("notifyYeet step ran");

    const followers = await getUserFollowers(fid);
    console.log("followers count", followers.length);
    const fids = followers.map((f) => f.user.fid);

    const campaign = campaignname ? `the ${campaignname} raid` : "a raid";
    const user = username || "An Ally";
    const bodyUser = username || "Someone you follow";

    sendFrameNotificationToMultipleUsers({
      fids,
      title: `An Ally Contributed`,
      body: `${bodyUser} pledged coin to ${campaign}. See where their loyalty lies and consider joining their cause.`,
      targetUrl: `https://fundraiser.farcastle.net/yeeter/${chainid}/${yeeterid}`,
    });
  });
});
