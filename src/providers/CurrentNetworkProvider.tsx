"use client";

import { WAGMI_CHAIN_OBJS_BY_ID } from "@/lib/constants";
import { createContext, useContext, useEffect, useState } from "react";
import { base, Chain } from "viem/chains";
import { useAccount, useChainId } from "wagmi";

const DEFAULT_NETWORK = base;

interface INetworkProviderConfig {
  chain: Chain;
  setChain: React.Dispatch<React.SetStateAction<Chain>>;
}

export const CurrentNetworkContext =
  createContext<INetworkProviderConfig | null>(null);

export const CurrentNetworkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [chain, setChain] = useState<Chain>(DEFAULT_NETWORK);

  const { isConnected } = useAccount();
  const chainId = useChainId();

  useEffect(() => {
    if (isConnected) {
      setChain(WAGMI_CHAIN_OBJS_BY_ID[chainId]);
    }
  }, [isConnected, chainId]);

  return (
    <CurrentNetworkContext.Provider value={{ chain, setChain }}>
      {children}
    </CurrentNetworkContext.Provider>
  );
};

export const useCurrentNetwork = () => {
  const context = useContext(CurrentNetworkContext);

  if (!context) {
    throw new Error(
      "useCurrentNetwork must be used within a CurrentNetworkProvider"
    );
  }

  return {
    chain: context.chain,
    setChain: context.setChain,
  };
};
