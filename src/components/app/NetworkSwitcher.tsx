"use client";

import { getWagmiChainObj } from "@/lib/constants";
import Image from "next/image";
import React from "react";
import { useAccount, useChainId, useConfig, useSwitchChain } from "wagmi";
import * as Drawer from "../ui/drawer";

export function NetworkSwitcher() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const config = useConfig();
  const { switchChain } = useSwitchChain();
  const closeRef = React.useRef<HTMLButtonElement>(null);

  // Add mounted state to handle hydration
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleNetworkSwitch = React.useCallback(
    (chainId: number) => {
      switchChain({ chainId });
      closeRef.current?.click();
    },
    [switchChain]
  );

  // Return placeholder during SSR and initial render
  if (!mounted) {
    return <div className="opacity-0 h-[30px] w-[30px]" />;
  }

  // Only check connection status after component is mounted
  if (!isConnected) {
    return <div className="opacity-0 h-[30px] w-[30px]" />;
  }

  return (
    <Drawer.Drawer>
      <Drawer.DrawerTrigger className="outline-none">
        <div className="h-[30px] w-[30px] rounded-full overflow-hidden hover:cursor-pointer">
          <Image
            src={`/images/networks/${chainId.toString()}.svg`}
            width={30}
            height={30}
            alt={`Network ${getWagmiChainObj("0x" + chainId.toString(16)).name}`}
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
            {config.chains?.map(chain => (
              <div
                key={chain.id}
                onClick={() => handleNetworkSwitch(chain.id)}
                className="flex items-center gap-2 hover:bg-muted p-2 rounded cursor-pointer"
              >
                <Image
                  src={`/images/networks/${chain.id}.svg`}
                  width={20}
                  height={20}
                  alt={chain.name}
                />
                <span className="text-foreground font-medium">
                  {chain.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Drawer.DrawerContent>
    </Drawer.Drawer>
  );
}
