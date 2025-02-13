"use client";

import { useDaosForAddress } from "@/hooks/useDaosForAddress";
import { DaoItem } from "@/lib/types";
import { useFrameSDK } from "@/providers/FramesSDKProvider";
import { useEffect, useState } from "react";
import { toHex } from "viem";
import { useAccount, useConnect } from "wagmi";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../ui/loading";
import { DaoListCard } from "./DaoListCard";

export const DaoList = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { connector } = useFrameSDK();
  const { connect } = useConnect();
  const { address, isConnected, chain } = useAccount();

  const { daos, isLoading, isFetched } = useDaosForAddress({
    chainid: toHex(chain?.id || "0"),
    address,
  });

  if (!mounted) return null;

  return (
    <>
      {!isConnected && (
        <>
          <Button onClick={() => connect({ connector: connector })}>
            Reveal Realms
          </Button>
        </>
      )}

      {isConnected && (
        <>
          <div className="font-semibold text-xl text-center mb-4">
            Your {chain?.name} DAOs
          </div>
          {isLoading && <LoadingSpinner />}

          <div className="flex flex-col flex-wrap items-center justify-center gap-2 w-96">
            {isFetched &&
              daos?.map((dao: DaoItem) => {
                return (
                  <DaoListCard
                    key={dao.id}
                    daoid={dao.id}
                    chainid={`${toHex(chain?.id || "0")}`}
                  />
                );
              })}
          </div>
        </>
      )}
    </>
  );
};
