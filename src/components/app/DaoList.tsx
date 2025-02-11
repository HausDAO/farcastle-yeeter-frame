"use client";

import { useDaosForAddress } from "@/hooks/useDaosForAddress";
import { useFrameSDK } from "@/providers/FramesSDKProvider";
import { useAccount, useConnect } from "wagmi";
import { Button } from "../ui/button";

import Link from "next/link";
import { toHex } from "viem";

export const DaoList = () => {
  const { connector } = useFrameSDK();
  const { connect } = useConnect();
  const { address, isConnected, chain } = useAccount();

  const { daos, isLoading, isFetched } = useDaosForAddress({
    chainid: toHex(chain?.id || "0"),
    address,
  });

  return (
    <>
      {!isConnected && (
        <>
          <Button onClick={() => connect({ connector: connector })}>
            Connect
          </Button>
        </>
      )}

      {isConnected && (
        <>
          <div className="font-semibold text-xl text-center">
            Your {chain?.name} DAOs
          </div>
          {isLoading && <p>loading...</p>}

          <div className="flex flex-row flex-wrap items-center justify-center gap-2 w-96">
            {isFetched &&
              daos?.map(dao => {
                return (
                  <Link
                    key={dao.id}
                    href={`/dao/${toHex(chain?.id || "0")}/${dao.id}`}
                  >
                    <Button size="sm" variant="secondary">
                      {dao.name}
                    </Button>
                  </Link>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};
