import { Client } from "@upstash/workflow";

const token = process.env.QSTASH_TOKEN || process.env.NEXT_PUBLIC_QSTASH_TOKEN;
const client = new Client({ token });

// const appUrl = process.env.NEXT_PUBLIC_URL;
// const appUrl = process.env.UPSTASH_WORKFLOW_URL;

const appUrl = "https://fundraiser.farcastle.net";

// const appUrl = "https://reviewed-buffalo-subscriber-caught.trycloudflare.com";

export const triggerLaunchWorkflow = async ({
  yeeterid,
  chainid,
  campaignname,
  username,
}: {
  yeeterid: string;
  chainid: string;
  campaignname?: string;
  username?: string;
}) => {
  console.log("triggerLaunchWorkflow yeeterid", yeeterid);
  const { workflowRunId } = await client.trigger({
    url: `${appUrl}/api/workflow/launch`,
    body: {
      yeeterid,
      chainid,
      campaignname,
      username,
    },
    headers: { Authorization: `Bearer ${token}` }, // Optional headers
    // workflowRunId: "my-workflow", // Optional workflow run ID
    retries: 3, // Optional retries for the initial request
  });

  return workflowRunId;
};

export const triggerYeetWorkflow = async ({
  yeeterid,
  chainid,
  campaignname,
  username,
  fid,
}: {
  yeeterid: string;
  chainid: string;
  campaignname?: string;
  username?: string;
  fid: number;
}) => {
  console.log("triggerYeetWorkflow yeeterid", yeeterid);
  const { workflowRunId } = await client.trigger({
    url: `${appUrl}/api/workflow/yeet`,
    body: {
      yeeterid,
      chainid,
      campaignname,
      username,
      fid,
    },
    headers: { Authorization: `Bearer ${token}` }, // Optional headers
    // workflowRunId: "my-workflow", // Optional workflow run ID
    retries: 3, // Optional retries for the initial request
  });

  return workflowRunId;
};
