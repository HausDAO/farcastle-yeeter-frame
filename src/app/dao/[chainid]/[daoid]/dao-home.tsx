"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFrameSDK } from "@/providers/FramesSDKProvider";
import { useDao } from "@/hooks/useDao";

export default function DaoHome() {
  const { isLoaded } = useFrameSDK();

  const params = useParams<{ chainid: string; daoid: string }>();
  const { dao } = useDao({ chainid: params.chainid, daoid: params.daoid });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      {dao && (
        <p className="my-3 text-primary font-semibold text-lg">
          Create a proposal in {dao?.name}
        </p>
      )}
      <div className="mb-4">
        <Link href={`/dao/${params.chainid}/${params.daoid}/POST_SIGNAL`}>
          <Button>Propose Signal</Button>
        </Link>
      </div>

      <div className="mb-4">
        <Link
          href={`/dao/${params.chainid}/${params.daoid}/REQUEST_MEMBERSHIP`}
        >
          <Button>Request Membership</Button>
        </Link>
      </div>

      <div className="mb-4">
        <Link href={`/dao/${params.chainid}/${params.daoid}/REQUEST_FUNDING`}>
          <Button>Request Funding</Button>
        </Link>
      </div>

      <div className="mb-4">
        <Link href={`/dao/${params.chainid}/${params.daoid}/SAMPLE`}>
          <Button>SAMPLER</Button>
        </Link>
      </div>
    </div>
  );
}
