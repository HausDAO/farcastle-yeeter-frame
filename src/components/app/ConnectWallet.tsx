"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAccount, useConnect } from "wagmi";
import { UserAvatar } from "./UserAvatar";
import { useEffect, useState } from "react";
import { useFrameSDK } from "@/providers/FramesSDKProvider";

export function ConnectWallet() {
  const { connect } = useConnect();
  const { isConnected, address } = useAccount();
  const [mounted, setMounted] = useState(false);
  const { connector, context } = useFrameSDK();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = () => {
    connect({ connector: connector });
  };

  const pfpImg = context?.user?.pfpUrl || "/images/skull.png";

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative h-8 w-8 rounded-full"
      >
        <Image
          src="/images/skull.png"
          alt="Connect wallet"
          fill
          className="rounded-full object-cover"
        />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-8 w-8 rounded-full"
      onClick={!isConnected ? handleConnect : undefined}
    >
      {isConnected ? (
        <UserAvatar address={address} />
      ) : (
        <Image
          src={pfpImg}
          alt="Connect wallet"
          fill
          className="rounded-full object-cover"
          style={
            !isConnected && {
              filter: "opacity(0.5)",
            }
          }
        />
      )}
    </Button>
  );
}
