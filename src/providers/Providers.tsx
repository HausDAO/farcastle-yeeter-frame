"use client";

import farcasterFrame from "@farcaster/frame-wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import {
  arbitrum,
  base,
  gnosis,
  // mainnet,
  optimism,
  // polygon,
  sepolia,
} from "wagmi/chains";

import { injected } from "wagmi/connectors";
import { DaoHooksProvider } from "./DaoHooksProvider";
import { DaoRecordProvider } from "./DaoRecordProvider";
import { FrameSDKProvider } from "./FramesSDKProvider";
import { HAUS_RPC_DEFAULTS } from "@/lib/constants";
import { CurrentNetworkProvider } from "./CurrentNetworkProvider";
import { PostHogProvider } from "./PostHogProvider";

const connectors =
  process.env.NEXT_PUBLIC_ENV === "local"
    ? [farcasterFrame(), injected()]
    : [farcasterFrame(), injected()];

// const connectors = [farcasterFrame(), injected()];

export const config = createConfig({
  chains: [base, optimism, arbitrum, gnosis, sepolia],
  transports: {
    [base.id]: http(HAUS_RPC_DEFAULTS["0x2105"]),
    [optimism.id]: http(HAUS_RPC_DEFAULTS["0xa"]),
    [arbitrum.id]: http(HAUS_RPC_DEFAULTS["0xa4b1"]),
    [sepolia.id]: http(),
    [gnosis.id]: http(HAUS_RPC_DEFAULTS["0x64"]),
  },
  connectors: connectors,
});

const queryClient = new QueryClient();

function Providers({ children }: React.PropsWithChildren) {
  const daoHooksConfig = {
    graphKey: process.env.NEXT_PUBLIC_GRAPH_KEY || "",
  };

  return (
    <PostHogProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <FrameSDKProvider>
            <CurrentNetworkProvider>
              <DaoHooksProvider keyConfig={daoHooksConfig}>
                <DaoRecordProvider>{children}</DaoRecordProvider>
              </DaoHooksProvider>
            </CurrentNetworkProvider>
          </FrameSDKProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </PostHogProvider>
  );
}

export { Providers };
