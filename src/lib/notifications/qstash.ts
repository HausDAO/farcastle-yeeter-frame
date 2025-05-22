import { Client } from "@upstash/workflow";

const client = new Client({ token: process.env.QSTASH_TOKEN });

const appUrl = process.env.NEXT_PUBLIC_URL;

// https://memory-kate-hr-no.trycloudflare.com

export const triggerLaunchWorkflow = async ({
  yeeterid,
  chainid,
  campaignName,
}: {
  yeeterid: string;
  chainid: string;
  campaignName?: string;
}) => {
  const { workflowRunId } = await client.trigger({
    url: `https://qstash.upstash.io/v2/publish/${appUrl}/api/workflow/launch`,
    body: {
      yeeterid,
      chainid,
      campaignName,
    },
    headers: { Authorization: `Bearer ${process.env.QSTASH_TOKEN}` }, // Optional headers
    // workflowRunId: "my-workflow", // Optional workflow run ID
    retries: 3, // Optional retries for the initial request
  });

  return workflowRunId;
};
