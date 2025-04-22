"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFrameSDK } from "@/providers/FramesSDKProvider";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";

export const dynamic = "force-dynamic";

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { connector } = useFrameSDK();
  const { connect } = useConnect();
  const { isConnected } = useAccount();

  if (!mounted) return null;

  return (
    <div className="w-full h-full pb-4 px-4">
      <Card className="flex flex-col items-center px-4 pt-4 pb-4 rounded-none">
        <div className="text-primary font-display text-3xl uppercase mb-4">
              Crypto Crowdfunding
        </div>
        {!isConnected && (
          <>
            <p className="text-muted-foreground text-base px-4">Your next adventure starts here.</p>
            <div className="relative w-full aspect-square mx-auto -my-4">
              <Image
                src="/images/chest.png"
                alt="Chest"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="mt-4 w-full px-4 mb-0">
              <Button
                onClick={() => connect({ connector: connector })}
                className="w-full"
              >
                Connect Wallet
              </Button>
            </div>
            <div className="mt-4 w-full px-4">
              <Link href={`/explore`} className="w-full">
                <Button className="w-full">Explore Campaigns</Button>
              </Link>
            </div>
          </>
        )}

        {isConnected && (
          <>
            <p className="text-muted-foreground text-base px-4 mb-4 italic">Ignite the flames of collective action in the realm of Web3.</p>
            <div className="text-primary font-display text-2xl uppercase mb-2">
          For Builders of the New Order
        </div>
            <p className="text-muted-foreground text-base px-4 mb-4">Fundraiser lets creators raise funds with trust and transparency. Contributors pledge coins and retain the right to exit.</p>
            <div className="text-primary font-display text-2xl uppercase mb-2">
            Your Path Awaits
        </div>
            <p className="text-muted-foreground text-base px-4 mb-4">Explore campaigns and identify opportunities to contribute. Or launch a campaign and raise funds for your quest.</p>
            <div className="flex flex-col w-full gap-2">
              <div className="mt-4 w-full px-4">
                <Link href={`/explore`} className="w-full">
                  <Button className="w-full">Explore Campaigns</Button>
                </Link>
              </div>

              <div className="mt-2 w-full px-4">
                <Link href={`/launch`} className="w-full">
                  <Button className="w-full">Launch Campaign</Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
