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
  const { connector } = useFrameSDK();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = () => {
    connect({ connector: connector });
  };

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
          src="/images/skull.png"
          alt="Connect wallet"
          fill
          className="rounded-full object-cover"
        />
      )}
    </Button>
  );
}
