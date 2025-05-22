import { sendFrameNotificationToAllUsers } from "@/lib/notifications/notification-client";
import { serve } from "@upstash/workflow/nextjs";

type LaunchWorkflowPaylod = {
  yeeterid: string;
  chainid: string;
  campaignName?: string;
};

export const { POST } = serve(async (context) => {
  console.log("context.re", context.requestPayload);
  const { yeeterid, chainid, campaignName } =
    context.requestPayload as LaunchWorkflowPaylod;
  if (!yeeterid || !chainid) {
    return;
  }

  await context.run("notify", () => {
    console.log("notify step ran");
    // const notification;
    const campaign = campaignName || "the campaign";

    sendFrameNotificationToAllUsers({
      title: "A New Raid Begins",
      body: `Some brave soul summoned a call to arms. Explore ${campaign} and see if the cause stirs your spirit.`,
      targetUrl: `${process.env.NEXT_PUBLIC_URL}/yeeter/${chainid}/${yeeterid}`,
    });
  });
});
