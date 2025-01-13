"use client";

import frameSDK, { type FrameContext } from "@farcaster/frame-sdk";
import { createContext, useContext, useEffect, useState } from "react";
import { Connector } from "wagmi";
import { config } from "./Providers";

interface FrameContextValue {
  context: FrameContext | undefined;
  isLoaded: boolean;
  connector: Connector;
}

const FrameSDKContext = createContext<FrameContextValue | undefined>(undefined);

export function FrameSDKProvider({ children }: { children: React.ReactNode }) {
  const [isFrameSDKLoaded, setIsFrameSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [localConnector, setLocalConnector] = useState<Connector>(
    config.connectors[1]
  );

  useEffect(() => {
    const load = async () => {
      const frameContext = await frameSDK.context;
      setContext(frameContext);
      if (frameContext) {
        setLocalConnector(config.connectors[0]);
      }
      frameSDK.actions.ready({});
    };
    if (frameSDK && !isFrameSDKLoaded) {
      setIsFrameSDKLoaded(true);
      load();
    }
  }, [isFrameSDKLoaded]);

  return (
    <FrameSDKContext.Provider
      value={{ context, isLoaded: isFrameSDKLoaded, connector: localConnector }}
    >
      {children}
    </FrameSDKContext.Provider>
  );
}

export const useFrameSDK = () => {
  const frameContext = useContext(FrameSDKContext);

  return {
    context: frameContext?.context,
    isLoaded: frameContext?.isLoaded,
    connector: frameContext?.connector || config.connectors[1],
  };
};
