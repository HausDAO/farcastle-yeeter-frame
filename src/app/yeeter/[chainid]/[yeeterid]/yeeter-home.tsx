"use client";

import { ActiveYeeter } from "@/components/app/ActiveYeeter";
import { ClosedYeeter } from "@/components/app/ClosedYeeter";
import { UpcomingYeeter } from "@/components/app/UpcomingYeeter";
import { YeeterAbout } from "@/components/app/YeeterAbout";
import { YeetMessages } from "@/components/app/YeetMessages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading";
import { useYeeter } from "@/hooks/useYeeter";
import { useFrameSDK } from "@/providers/FramesSDKProvider";
import { useParams } from "next/navigation";

export default function YeeterHome() {
  const { isLoaded } = useFrameSDK();

  const params = useParams<{ chainid: string; yeeterid: string }>();
  const {
    yeeter,
    metadata,
    isLoading: isDaoLoading,
  } = useYeeter({
    chainid: params.chainid,
    yeeterid: params.yeeterid,
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
      <div className="text-primary font-display text-3xl uppercase text-center">
        {metadata?.name || "--"}
      </div>
      <div className="flex justify-center my-2">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={metadata?.icon || "/gate-dark-purple.svg"}
            alt={metadata?.name}
          />
          <AvatarFallback>{metadata?.name}</AvatarFallback>
        </Avatar>
      </div>
      {yeeter && (
        <>
          <div className="flex flex-col items-center">
          {yeeter?.isComingSoon && (
              <UpcomingYeeter
                yeeterid={params.yeeterid}
                chainid={params.chainid}
              />
            )}

            {yeeter?.isActive && (
              <ActiveYeeter
                yeeterid={params.yeeterid}
                chainid={params.chainid}
              />
            )}
            {yeeter?.isEnded && (
              <ClosedYeeter
                yeeterid={params.yeeterid}
                chainid={params.chainid}
              />
            )}
          </div>
          <div>
            <YeeterAbout
              yeeterid={params.yeeterid}
              chainid={params.chainid}
              daoid={yeeter.dao.id}
            />
          </div>
          <div className="mt-4">
            <YeetMessages yeeterid={params.yeeterid} chainid={params.chainid} />
          </div>
        </>
      )}
    </div>
  );
}
