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
    <div className="w-full">
      <div className="text-muted font-display text-3xl uppercase mb-4 text-center">
        Make Proposal
      </div>
      {dao && (
        <p className="my-3 text-primary font-semibold text-lg text-center">
          {dao?.name}
        </p>
      )}
      <div className="mt-4 w-full px-4">
        <Link
          href={`/dao/${params.chainid}/${params.daoid}/POST_SIGNAL`}
          className="w-full"
        >
          <Button className="w-full">Signal</Button>
        </Link>
      </div>

      <div className="mt-4 w-full px-4">
        <Link
          href={`/dao/${params.chainid}/${params.daoid}/REQUEST_FUNDING`}
          className="w-full"
        >
          <Button className="w-full">Funding</Button>
        </Link>
      </div>

      <div className="mt-4 w-full px-4">
        <Link
          href={`/dao/${params.chainid}/${params.daoid}/REQUEST_MEMBERSHIP`}
          className="w-full"
        >
          <Button className="w-full">Membership</Button>
        </Link>
      </div>
    </div>
  );
}
