import { sendFrameNotificationToAllUsers } from "@/lib/notifications/notification-client";
import { serve } from "@upstash/workflow/nextjs";

type LaunchWorkflowPayload = {
  yeeterid: string;
  chainid: string;
  campaignname?: string;
  username?: string;
};

export const { POST } = serve(async (context) => {
  console.log("context.re", context.requestPayload);
  const { yeeterid, chainid, campaignname, username } =
    context.requestPayload as LaunchWorkflowPayload;
  if (!yeeterid || !chainid) {
    return;
  }

  await context.run("notify", () => {
    console.log("notify step ran");
    // const notification;
    const campaign = campaignname || "the campaign";
    const user = username || "Some brave soul";

    sendFrameNotificationToAllUsers({
      title: "A New Raid Begins",
      body: `${user} summoned a call to arms. Explore ${campaign} and see if the cause stirs your spirit.`,
      targetUrl: `https://fundraiser.farcastle.net/yeeter/${chainid}/${yeeterid}`,
    });
  });
});
