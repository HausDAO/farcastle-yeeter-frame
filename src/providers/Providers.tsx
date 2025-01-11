"use client";

import { createConfig, http, WagmiProvider } from "wagmi";
import {
  base,
  sepolia,
  mainnet,
  polygon,
  gnosis,
  optimism,
  arbitrum,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import farcasterFrame from "@farcaster/frame-wagmi-connector";

import { injected } from "wagmi/connectors";
import { FrameSDKProvider } from "./FramesSDKProvider";
import { DaoRecordProvider } from "./DaoRecordProvider";
import { DaoHooksProvider } from "./DaoHooksProvider";

// import { AuthedPrefetchesProvider } from "./AuthedPrefetchesProvider";

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

const daoHooksConfig = {
  graphKey: process.env.NEXT_PUBLIC_GRAPH_KEY || "",
};

function Providers({ children }: React.PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FrameSDKProvider>
          <DaoHooksProvider keyConfig={daoHooksConfig}>
            {/* <AuthedPrefetchesProvider> */}
            <DaoRecordProvider>{children}</DaoRecordProvider>
            {/* </AuthedPrefetchesProvider> */}
          </DaoHooksProvider>
        </FrameSDKProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export { Providers };
