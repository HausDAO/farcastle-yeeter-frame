"use client";

import { Button } from "@/components/ui/button";
import { useFrameSDK } from "@/providers/FramesSDKProvider";
import Image from "next/image";
import { useAccount, useConnect } from "wagmi";
import { UserAvatar } from "./UserAvatar";

export function ConnectWallet() {
  const { connector } = useFrameSDK();
  const { connect } = useConnect();
  const { isConnected, address } = useAccount();

  const handleConnect = () => {
    connect({ connector: connector });
  };

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
          src="/images/skull.png"
          alt="Connect wallet"
          fill
          className="rounded-full object-cover"
        />
      )}
    </Button>
  );
}
