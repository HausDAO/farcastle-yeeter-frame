"use client";

import { ExploreMiniNetworkSwitcher } from "@/components/app/ExploreMiniNetworkSwitcher";
import { YeeterList } from "@/components/app/YeeterList";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useAccount } from "wagmi";
import { getWagmiChainObj } from "@/lib/constants";

const UNNCONNECTED_CHAIN_ID = 8453;

export default function Explore() {
  const { isConnected, chain } = useAccount();
  const [localChain, setLocalChain] = useState<number>(UNNCONNECTED_CHAIN_ID);

  const chainNames = {
    // Ethereum: "Ethereal",
    "OP Mainnet": "Optimistic",
    Base: "Based",
    Gnosis: "Gnostic",
    "Arbitrum One": "Arbitral",
    // Polygon: "Polymorphic",
    Sepolia: "Sepolic",
  };

  const defaultChainId = isConnected && chain ? chain.id : localChain;
  const chainListTitle =
    isConnected && chain
      ? chainNames[chain?.name as keyof typeof chainNames] || chain?.name
      : chainNames[getWagmiChainObj("0x" + localChain.toString(16)).name as keyof typeof chainNames] || "Based";

  return (
    <div className="w-full h-full pb-4 px-4">
      <Card className="flex flex-col items-center px-4 pt-4 pb-8 rounded-none">
        <>
          {!isConnected && (
            <div className="flex flex-row items-center w-full mb-4">
              <div className="flex-1 pt-2">
                <ExploreMiniNetworkSwitcher
                  localChain={localChain}
                  setLocalChain={setLocalChain}
                />
              </div>
              <div className="text-primary font-display text-3xl uppercase">
                {chainListTitle} Fundraisers
              </div>
              <div className="flex-1"></div>
            </div>
          )}

          {isConnected && (
            <div className="text-primary font-display text-3xl pb-2 uppercase">
              {chainListTitle} Fundraisers
            </div>
          )}
        </>
        <YeeterList defaultChainId={defaultChainId} />
      </Card>
    </div>
  );
}
