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
      <Card className="flex flex-col items-center px-4 pt-2 pb-4 rounded-none">
        <div className="text-muted font-display text-3xl uppercase mb-4">
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
            <div className="mt-4 w-full px-4 mb-4">
              <Button
                onClick={() => connect({ connector: connector })}
                className="w-full"
              >
                Reveal Raises
              </Button>
            </div>
          </>
        )}

        {isConnected && (
          <>
            <p className="text-muted-foreground text-base px-4">Brave builders forge new tools while supporters join their quest.</p>
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
