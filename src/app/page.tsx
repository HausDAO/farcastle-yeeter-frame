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
      <Card className="flex flex-col items-center px-4 pt-4 pb-8 rounded-none">
        <div className="text-center mb-3">
          <p className="mb-3">
            Crowdfunding reimagined with web3 transparency and community
            protection.
          </p>
          <p>On-chain and In-frame.</p>
        </div>
        {!isConnected && (
          <>
            <div className="text-muted font-display text-3xl uppercase mb-4">
              Enter the Gates
            </div>

            <div className="relative w-3/4 aspect-square mx-auto">
              <Image
                src="/gate-dark-purple.svg"
                alt="Gate"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="mt-4 w-full px-4">
              <Button
                onClick={() => connect({ connector: connector })}
                className="w-full"
              >
                Connect
              </Button>
            </div>
            <div className="mt-4 w-full px-4">
              <Link href={`/explore`} className="w-full">
                <Button className="w-full">Explore Raises</Button>
              </Link>
            </div>
          </>
        )}

        {isConnected && (
          <>
            <div className="flex flex-col w-full gap-3">
              <div className="mt-4 w-full px-4">
                <Link href={`/explore`} className="w-full">
                  <Button className="w-full">Explore</Button>
                </Link>
              </div>

              <div className="mt-2 w-full px-4">
                <Link href={`/launch`} className="w-full">
                  <Button className="w-full">Launch</Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
