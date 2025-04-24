"use client";

import { YeeterList } from "@/components/app/YeeterList";
import { Card } from "@/components/ui/card";
import { useCurrentNetwork } from "@/providers/CurrentNetworkProvider";

export default function Explore() {
  const { chain } = useCurrentNetwork();

  const chainNames = {
    // Ethereum: "Ethereal",
    "OP Mainnet": "Optimistic",
    Base: "Based",
    Gnosis: "Gnostic",
    "Arbitrum One": "Arbitral",
    // Polygon: "Polymorphic",
    Sepolia: "Sepolic",
  };

  const chainListTitle =
    chainNames[chain?.name as keyof typeof chainNames] || chain?.name;

  return (
    <div className="w-full h-full pb-4 px-4">
      <Card className="flex flex-col items-center px-4 pt-4 pb-8 rounded-none">
        <div className="text-primary font-display text-3xl pb-2 uppercase">
          {chainListTitle} Fundraisers
        </div>
        <YeeterList defaultChainId={chain.id} />
      </Card>
    </div>
  );
}
