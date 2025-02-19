"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <div className="text-muted font-display text-3xl uppercase text-center">
        Make Proposal
      </div>
      <div className="flex justify-center my-2">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={dao?.profile?.avatarImg || "/gate-purple.svg"}
            alt={dao?.name}
          />
          <AvatarFallback>{dao?.name?.[0]}</AvatarFallback>
        </Avatar>
      </div>
      {dao && (
        <div className="flex flex-col items-center">
          <span className="text-foreground text-xl font-medium truncate">
            {dao.name.length > 20 ? `${dao.name.slice(0, 20)}...` : dao.name}
          </span>
          <p className="text-muted-foreground text-base mt-2 px-4">
            Carve thy will into the stone of fate. Stir the realm, fill the
            coffers, or beckon new souls into the realm.
          </p>
        </div>
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
