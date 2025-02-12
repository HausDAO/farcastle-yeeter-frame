"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { useDao } from "@/hooks/useDao";
import { useFrameSDK } from "@/providers/FramesSDKProvider";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DaoHome() {
  const { isLoaded } = useFrameSDK();

  const params = useParams<{ chainid: string; daoid: string }>();
  const { dao, isLoading: isDaoLoading } = useDao({
    chainid: params.chainid,
    daoid: params.daoid,
  });

  if (!isLoaded || isDaoLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
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
