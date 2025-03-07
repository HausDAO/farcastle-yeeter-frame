"use client";

import { useDaosForAddress } from "@/hooks/useDaosForAddress";
import { DaoItem } from "@/lib/types";
import { toHex } from "viem";
import { useAccount } from "wagmi";
import { Card } from "../ui/card";
import { LoadingSpinner } from "../ui/loading";
import { DaoListCard } from "./DaoListCard";

export const DaoList = () => {
  const { address, chain } = useAccount();

  const { daos, isLoading, isFetched } = useDaosForAddress({
    chainid: toHex(chain?.id || "0"),
    address,
  });

  if (isLoading) return <LoadingSpinner />;

  if (isFetched && (!daos || daos.length === 0)) {
    return (
      <div className="flex flex-col flex-wrap items-center justify-center gap-2 w-full">
        <Card className="w-full bg-background border rounded-none">
          <div className="flex justify-center p-4">
            <span className="text-primary font-display text-xl uppercase">
              You serve no castle in this realm
            </span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-wrap items-center justify-center gap-2 w-full">
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
  );
};
