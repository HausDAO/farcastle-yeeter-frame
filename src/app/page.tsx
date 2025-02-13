"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFrameSDK } from "@/providers/FramesSDKProvider";
import { default as dynamicImport } from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";

const DaoList = dynamicImport(
  () => import("@/components/app/DaoList").then(mod => mod.DaoList),
  {
    ssr: false,
  }
);

export const dynamic = "force-dynamic";

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { connector } = useFrameSDK();
  const { connect } = useConnect();
  const { isConnected, chain } = useAccount();

  const chainNames = {
    Ethereum: "Ethereal",
    "OP Mainnet": "Optimistic",
    Base: "Based",
    Gnosis: "Gnostic",
    "Arbitrum One": "Arbitral",
    Polygon: "Polymorphic",
    Sepolia: "Sepolic",
  };

  if (!mounted) return null;

  return (
    <div className="w-full h-full pb-4 px-4">
      <Card className="flex flex-col items-center px-4 pt-4 pb-8 rounded-none">
        {!isConnected && (
          <>
            <div className="text-muted font-display text-3xl uppercase mb-4">
              Enter the Gates
            </div>

            <div className="relative w-3/4 aspect-square mx-auto">
              <Image
                src="/gate.svg"
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
                Reveal Realms
              </Button>
            </div>
          </>
        )}

        {isConnected && (
          <>
            <div className="text-muted font-display text-3xl uppercase mb-4">
              {chainNames[chain?.name as keyof typeof chainNames] ||
                chain?.name}{" "}
              Castles
            </div>
            <DaoList />
          </>
        )}
      </Card>
    </div>
  );
}
