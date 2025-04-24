"use client";

import { getWagmiChainObj, WAGMI_CHAIN_OBJS_BY_ID } from "@/lib/constants";
import Image from "next/image";
import React from "react";
import { useConfig } from "wagmi";
import * as Drawer from "../ui/drawer";
import { useCurrentNetwork } from "@/providers/CurrentNetworkProvider";

export function UnconnectedNetworkSwitcher() {
  const config = useConfig();
  const { chain, setChain } = useCurrentNetwork();
  const closeRef = React.useRef<HTMLButtonElement>(null);

  // Add mounted state to handle hydration
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleNetworkSwitch = React.useCallback(
    (chainId: number) => {
      console.log("setting chainId", chainId);
      if (WAGMI_CHAIN_OBJS_BY_ID[chainId]) {
        setChain(WAGMI_CHAIN_OBJS_BY_ID[chainId]);
      }
      closeRef.current?.click();
    },
    [setChain]
  );

  // Return placeholder during SSR and initial render
  if (!mounted) {
    return <div className="opacity-0 h-[30px] w-[30px]" />;
  }

  return (
    <Drawer.Drawer>
      <Drawer.DrawerTrigger className="outline-none">
        <div className="h-[30px] w-[30px] rounded-full overflow-hidden hover:cursor-pointer">
          <Image
            src={`/images/networks/${chain.id.toString()}.svg`}
            width={30}
            height={30}
            alt={`Network ${getWagmiChainObj("0x" + chain.id.toString(16)).name}`}
          />
        </div>
      </Drawer.DrawerTrigger>
      <Drawer.DrawerClose ref={closeRef} className="hidden" />
      <Drawer.DrawerContent className="bg-card">
        <div className="w-full">
          <Drawer.DrawerHeader className="mx-4">
            <Drawer.DrawerTitle className="font-display text-3xl uppercase text-muted">
              Switch Network
            </Drawer.DrawerTitle>
          </Drawer.DrawerHeader>
          <div className="flex flex-col gap-2 mx-4">
            {config.chains?.map((ch) => (
              <div
                key={ch.id}
                onClick={() => handleNetworkSwitch(ch.id)}
                className="flex items-center gap-2 hover:bg-muted p-2 rounded cursor-pointer"
              >
                <Image
                  src={`/images/networks/${ch.id}.svg`}
                  width={20}
                  height={20}
                  alt={ch.name}
                />
                <span className="text-foreground font-medium">{ch.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Drawer.DrawerContent>
    </Drawer.Drawer>
  );
}
