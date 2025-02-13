"use client";

import farcasterFrame from "@farcaster/frame-wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import {
  arbitrum,
  base,
  gnosis,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

import { injected } from "wagmi/connectors";
import { DaoHooksProvider } from "./DaoHooksProvider";
import { DaoRecordProvider } from "./DaoRecordProvider";
import { FrameSDKProvider } from "./FramesSDKProvider";

export const config = createConfig({
  chains: [base, sepolia, mainnet, polygon, gnosis, optimism, arbitrum],
  transports: {
    // Configure dedicated RPC providers when using in production
    [base.id]: http(),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [gnosis.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
  connectors: [farcasterFrame(), injected()],
});

const queryClient = new QueryClient();

function Providers({ children }: React.PropsWithChildren) {
  const daoHooksConfig = {
    graphKey: process.env.NEXT_PUBLIC_GRAPH_KEY || "",
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FrameSDKProvider>
          <DaoHooksProvider keyConfig={daoHooksConfig}>
            <DaoRecordProvider>{children}</DaoRecordProvider>
          </DaoHooksProvider>
        </FrameSDKProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export { Providers };
